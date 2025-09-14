const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');
const { validateObjectId } = require('../middleware/validation');
const { uploadSingle } = require('../middleware/upload');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password -otp -otpExpires -emailVerificationToken -emailVerificationExpires -resetPasswordToken -resetPasswordExpires');

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, uploadSingle('avatar'), async (req, res) => {
  try {
    const { fullName, contactNumber, dateOfBirth } = req.body;
    const updateFields = {};

    if (fullName) updateFields.fullName = fullName;
    if (contactNumber) updateFields.contactNumber = contactNumber;
    if (dateOfBirth) {
      const age = (new Date() - new Date(dateOfBirth)) / (1000 * 60 * 60 * 24 * 365);
      if (age < 18) {
        return res.status(400).json({
          success: false,
          message: 'You must be 18 or older'
        });
      }
      updateFields.dateOfBirth = dateOfBirth;
    }

    // Handle avatar upload
    if (req.file) {
      updateFields.avatar = req.file.path;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateFields,
      { new: true, runValidators: true }
    ).select('-password -otp -otpExpires -emailVerificationToken -emailVerificationExpires -resetPasswordToken -resetPasswordExpires');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get user profile by ID
// @access  Public
router.get('/:id', validateObjectId(), async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('fullName username avatar sellerRating totalSales totalPurchases totalCO2Saved joinedAt');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user'
    });
  }
});

// @route   GET /api/users/:id/products
// @desc    Get user's products
// @access  Public
router.get('/:id/products', validateObjectId(), async (req, res) => {
  try {
    const { page = 1, limit = 12, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {
      seller: req.params.id,
      isActive: true
    };

    if (status) {
      filter.status = status;
    }

    const products = await Product.find(filter)
      .populate('seller', 'fullName username avatar sellerRating')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Product.countDocuments(filter);
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

// @route   GET /api/users/:id/reviews
// @desc    Get user's reviews (as seller)
// @access  Public
router.get('/:id/reviews', validateObjectId(), async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find({
      seller: req.params.id,
      status: 'Completed',
      'sellerRating.rating': { $exists: true }
    })
      .populate('buyer', 'fullName username avatar')
      .populate('product', 'name images')
      .sort({ 'sellerRating.ratedAt': -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const reviews = orders.map(order => ({
      id: order._id,
      rating: order.sellerRating.rating,
      comment: order.sellerRating.comment,
      ratedAt: order.sellerRating.ratedAt,
      buyer: order.buyer,
      product: order.product
    }));

    const total = await Order.countDocuments({
      seller: req.params.id,
      status: 'Completed',
      'sellerRating.rating': { $exists: true }
    });

    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalReviews: total,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user reviews'
    });
  }
});

// @route   GET /api/users/:id/stats
// @desc    Get user statistics
// @access  Public
router.get('/:id/stats', validateObjectId(), async (req, res) => {
  try {
    const userId = req.params.id;

    // Get user info
    const user = await User.findById(userId)
      .select('sellerRating totalSales totalPurchases totalCO2Saved joinedAt');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get product statistics
    const productStats = await Product.aggregate([
      { $match: { seller: user._id, isActive: true } },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalViews: { $sum: '$views' },
          avgCondition: { $avg: '$condition' },
          totalCO2Saved: { $sum: '$co2Saved' }
        }
      }
    ]);

    // Get order statistics
    const orderStats = await Order.aggregate([
      {
        $match: {
          $or: [
            { buyer: user._id },
            { seller: user._id }
          ]
        }
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          completedOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
          },
          totalSpent: {
            $sum: { $cond: [{ $eq: ['$buyer', user._id] }, '$price', 0] }
          },
          totalEarned: {
            $sum: { $cond: [{ $eq: ['$seller', user._id] }, '$price', 0] }
          }
        }
      }
    ]);

    // Get rating statistics
    const ratingStats = await Order.aggregate([
      {
        $match: {
          seller: user._id,
          status: 'Completed',
          'sellerRating.rating': { $exists: true }
        }
      },
      {
        $group: {
          _id: null,
          totalRatings: { $sum: 1 },
          avgRating: { $avg: '$sellerRating.rating' },
          ratingDistribution: {
            $push: '$sellerRating.rating'
          }
        }
      }
    ]);

    const stats = {
      user: {
        sellerRating: user.sellerRating,
        totalSales: user.totalSales,
        totalPurchases: user.totalPurchases,
        totalCO2Saved: user.totalCO2Saved,
        joinedAt: user.joinedAt
      },
      products: productStats[0] || {
        totalProducts: 0,
        totalViews: 0,
        avgCondition: 0,
        totalCO2Saved: 0
      },
      orders: orderStats[0] || {
        totalOrders: 0,
        completedOrders: 0,
        totalSpent: 0,
        totalEarned: 0
      },
      ratings: ratingStats[0] || {
        totalRatings: 0,
        avgRating: 0,
        ratingDistribution: []
      }
    };

    res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user statistics'
    });
  }
});

// @route   GET /api/users/:id/purchase-history
// @desc    Get user's purchase history
// @access  Private (only own history)
router.get('/:id/purchase-history', protect, validateObjectId(), async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if user is accessing their own history
    if (userId !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own purchase history.'
      });
    }

    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find({
      buyer: userId
    })
      .populate('seller', 'fullName username avatar sellerRating')
      .populate('product', 'name images price category co2Saved')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Order.countDocuments({ buyer: userId });
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalOrders: total,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get purchase history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching purchase history'
    });
  }
});

// @route   DELETE /api/users/account
// @desc    Deactivate user account
// @access  Private
router.delete('/account', protect, async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required to deactivate account'
      });
    }

    // Verify password
    const user = await User.findById(req.user._id);
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password'
      });
    }

    // Deactivate account
    user.isActive = false;
    await user.save();

    // Clear cookie
    res.clearCookie('token');

    res.json({
      success: true,
      message: 'Account deactivated successfully'
    });
  } catch (error) {
    console.error('Deactivate account error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deactivating account'
    });
  }
});

module.exports = router;

