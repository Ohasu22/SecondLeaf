const express = require('express');
const Product = require('../models/Product');
const User = require('../models/User');
const { protect, optionalAuth } = require('../middleware/auth');
const { validateProductCreation, validateProductUpdate, validateProductQuery, validateObjectId } = require('../middleware/validation');
const { uploadMultiple } = require('../middleware/upload');

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products with filtering and pagination
// @access  Public
router.get('/', optionalAuth, validateProductQuery, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      minPrice,
      maxPrice,
      minCondition,
      maxYearsUsed,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {
      status: 'Available',
      isActive: true
    };

    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    if (minCondition) filter.condition = { $gte: parseInt(minCondition) };
    if (maxYearsUsed) filter.yearsUsed = { $lte: parseInt(maxYearsUsed) };
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const products = await Product.find(filter)
      .populate('seller', 'fullName username avatar sellerRating')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const total = await Product.countDocuments(filter);

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalProducts: total,
          hasNextPage,
          hasPrevPage,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products'
    });
  }
});

// @route   GET /api/products/categories
// @desc    Get all product categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = [
      'Electronics',
      'Furniture',
      'Clothing',
      'Books',
      'Appliances',
      'Vehicles',
      'Sports',
      'Toys & Games',
      'Home & Garden',
      'Beauty & Health',
      'Other'
    ];

    res.json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching categories'
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', optionalAuth, validateObjectId(), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'fullName username avatar sellerRating totalSales')
      .populate('requests.user', 'fullName username avatar');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Increment view count
    product.views += 1;
    await product.save();

    res.json({
      success: true,
      data: { product }
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching product'
    });
  }
});

// @route   POST /api/products
// @desc    Create a new product
// @access  Private
router.post('/', protect, uploadMultiple('images', 5), validateProductCreation, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      condition,
      yearsUsed,
      damaged,
      location,
      tags
    } = req.body;

    // Get image URLs from uploaded files
    const images = req.files ? req.files.map(file => file.path) : [];

    if (images.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one image is required'
      });
    }

    // Create product
    const product = new Product({
      name,
      description,
      price: parseFloat(price),
      category,
      condition: parseInt(condition),
      yearsUsed: parseInt(yearsUsed),
      damaged: damaged === 'true',
      images,
      seller: req.user._id,
      location: JSON.parse(location),
      tags: tags ? JSON.parse(tags) : []
    });

    await product.save();

    // Populate seller info
    await product.populate('seller', 'fullName username avatar sellerRating');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product }
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating product'
    });
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private (Owner only)
router.put('/:id', protect, uploadMultiple('images', 5), validateProductUpdate, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check ownership
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update your own products.'
      });
    }

    // Update fields
    const updateFields = {};
    if (req.body.name) updateFields.name = req.body.name;
    if (req.body.description) updateFields.description = req.body.description;
    if (req.body.price) updateFields.price = parseFloat(req.body.price);
    if (req.body.condition) updateFields.condition = parseInt(req.body.condition);
    if (req.body.damaged !== undefined) updateFields.damaged = req.body.damaged === 'true';

    // Handle new images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.path);
      updateFields.images = [...product.images, ...newImages];
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    ).populate('seller', 'fullName username avatar sellerRating');

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: { product: updatedProduct }
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating product'
    });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private (Owner only)
router.delete('/:id', protect, validateObjectId(), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check ownership
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete your own products.'
      });
    }

    // Soft delete
    product.isActive = false;
    product.status = 'Removed';
    await product.save();

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting product'
    });
  }
});

// @route   POST /api/products/:id/request
// @desc    Request a product
// @access  Private
router.post('/:id/request', protect, validateObjectId(), async (req, res) => {
  try {
    const { message } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.seller.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot request your own product'
      });
    }

    if (product.status !== 'Available') {
      return res.status(400).json({
        success: false,
        message: 'This product is not available for requests'
      });
    }

    // Add request to product
    await product.addRequest(req.user._id, message);

    // Populate the updated product
    await product.populate('requests.user', 'fullName username avatar');

    res.json({
      success: true,
      message: 'Request sent successfully',
      data: { product }
    });
  } catch (error) {
    console.error('Request product error:', error);
    if (error.message === 'You have already requested this item') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while sending request'
    });
  }
});

// @route   GET /api/products/user/:userId
// @desc    Get products by user
// @access  Public
router.get('/user/:userId', optionalAuth, validateObjectId('userId'), async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const products = await Product.find({
      seller: req.params.userId,
      isActive: true
    })
      .populate('seller', 'fullName username avatar sellerRating')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Product.countDocuments({
      seller: req.params.userId,
      isActive: true
    });

    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalProducts: total,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get user products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user products'
    });
  }
});

// @route   GET /api/products/featured
// @desc    Get featured products
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const products = await Product.find({
      status: 'Available',
      isActive: true,
      condition: { $gte: 4 }
    })
      .populate('seller', 'fullName username avatar sellerRating')
      .sort({ views: -1, createdAt: -1 })
      .limit(8)
      .lean();

    res.json({
      success: true,
      data: { products }
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching featured products'
    });
  }
});

module.exports = router;

