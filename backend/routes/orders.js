const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { validateOrderRequest, validateOrderUpdate, validateRating, validateObjectId } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/orders
// @desc    Get user's orders (both as buyer and seller)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { type = 'all', status, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let filter = {};
    
    if (type === 'buying') {
      filter.buyer = req.user._id;
    } else if (type === 'selling') {
      filter.seller = req.user._id;
    } else {
      filter.$or = [
        { buyer: req.user._id },
        { seller: req.user._id }
      ];
    }

    if (status) {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .populate('buyer', 'fullName username avatar')
      .populate('seller', 'fullName username avatar')
      .populate('product', 'name images price category')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Order.countDocuments(filter);
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
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders'
    });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order by ID
// @access  Private
router.get('/:id', protect, validateObjectId(), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyer', 'fullName username avatar contactNumber')
      .populate('seller', 'fullName username avatar contactNumber')
      .populate('product', 'name images price category condition yearsUsed co2Saved');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user is involved in this order
    if (order.buyer._id.toString() !== req.user._id.toString() && 
        order.seller._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own orders.'
      });
    }

    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching order'
    });
  }
});

// @route   POST /api/orders
// @desc    Create a new order from product request
// @access  Private
router.post('/', protect, validateOrderRequest, async (req, res) => {
  try {
    const { productId, requestId, message } = req.body;

    if (!productId || !requestId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and request ID are required'
      });
    }

    // Find the product and request
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const request = product.requests.id(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Check if user is the seller
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only create orders for your own products.'
      });
    }

    // Check if request is still pending
    if (request.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: 'This request has already been processed'
      });
    }

    // Create order
    const order = new Order({
      buyer: request.user,
      seller: req.user._id,
      product: product._id,
      request: request._id,
      price: product.price,
      co2Saved: product.co2Saved,
      buyerMessage: request.message,
      sellerMessage: message
    });

    await order.save();

    // Update request status
    request.status = 'Accepted';
    product.status = 'Sold';
    await product.save();

    // Populate order data
    await order.populate([
      { path: 'buyer', select: 'fullName username avatar contactNumber' },
      { path: 'seller', select: 'fullName username avatar contactNumber' },
      { path: 'product', select: 'name images price category condition yearsUsed co2Saved' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating order'
    });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private
router.put('/:id/status', protect, validateObjectId(), validateOrderUpdate, async (req, res) => {
  try {
    const { status, message, meetingDetails } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user is the seller
    if (order.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only the seller can update order status.'
      });
    }

    // Update order based on status
    switch (status) {
      case 'Accepted':
        await order.acceptOrder(message, meetingDetails);
        break;
      case 'Rejected':
        await order.rejectOrder(message);
        break;
      case 'Completed':
        await order.completeOrder();
        break;
      case 'Cancelled':
        await order.cancelOrder(message, 'seller');
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid status'
        });
    }

    // Populate updated order
    await order.populate([
      { path: 'buyer', select: 'fullName username avatar contactNumber' },
      { path: 'seller', select: 'fullName username avatar contactNumber' },
      { path: 'product', select: 'name images price category condition yearsUsed co2Saved' }
    ]);

    res.json({
      success: true,
      message: `Order ${status.toLowerCase()} successfully`,
      data: { order }
    });
  } catch (error) {
    console.error('Update order status error:', error);
    if (error.message.includes('cannot be')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while updating order status'
    });
  }
});

// @route   POST /api/orders/:id/rate
// @desc    Rate an order (buyer rates seller or vice versa)
// @access  Private
router.post('/:id/rate', protect, validateObjectId(), validateRating, async (req, res) => {
  try {
    const { rating, comment, rateType } = req.body; // rateType: 'buyer' or 'seller'

    if (!rateType || !['buyer', 'seller'].includes(rateType)) {
      return res.status(400).json({
        success: false,
        message: 'Rate type must be either "buyer" or "seller"'
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user is involved in this order
    if (order.buyer._id.toString() !== req.user._id.toString() && 
        order.seller._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only rate orders you are involved in.'
      });
    }

    // Check if order is completed
    if (order.status !== 'Completed') {
      return res.status(400).json({
        success: false,
        message: 'You can only rate completed orders'
      });
    }

    // Add rating based on type
    if (rateType === 'buyer') {
      await order.addBuyerRating(rating, comment);
    } else {
      await order.addSellerRating(rating, comment);
    }

    // Update user ratings
    const targetUser = rateType === 'buyer' ? order.seller : order.buyer;
    await updateUserRating(targetUser);

    // Populate updated order
    await order.populate([
      { path: 'buyer', select: 'fullName username avatar contactNumber' },
      { path: 'seller', select: 'fullName username avatar contactNumber' },
      { path: 'product', select: 'name images price category condition yearsUsed co2Saved' }
    ]);

    res.json({
      success: true,
      message: 'Rating added successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Rate order error:', error);
    if (error.message.includes('already rated') || error.message.includes('only rate completed')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while adding rating'
    });
  }
});

// @route   POST /api/orders/:id/cancel
// @desc    Cancel an order
// @access  Private
router.post('/:id/cancel', protect, validateObjectId(), async (req, res) => {
  try {
    const { reason } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user is involved in this order
    if (order.buyer._id.toString() !== req.user._id.toString() && 
        order.seller._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only cancel your own orders.'
      });
    }

    // Cancel order
    const cancelledBy = order.buyer._id.toString() === req.user._id.toString() ? 'buyer' : 'seller';
    await order.cancelOrder(reason, cancelledBy);

    // If order was accepted, make product available again
    if (order.status === 'Cancelled') {
      const product = await Product.findById(order.product);
      if (product) {
        product.status = 'Available';
        await product.save();
      }
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    if (error.message.includes('cannot be cancelled')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling order'
    });
  }
});

// Helper function to update user rating
const updateUserRating = async (userId) => {
  try {
    const orders = await Order.find({
      $or: [
        { buyer: userId, 'buyerRating.rating': { $exists: true } },
        { seller: userId, 'sellerRating.rating': { $exists: true } }
      ]
    });

    let totalRating = 0;
    let ratingCount = 0;

    orders.forEach(order => {
      if (order.buyer.toString() === userId.toString() && order.buyerRating.rating) {
        totalRating += order.buyerRating.rating;
        ratingCount++;
      }
      if (order.seller.toString() === userId.toString() && order.sellerRating.rating) {
        totalRating += order.sellerRating.rating;
        ratingCount++;
      }
    });

    const averageRating = ratingCount > 0 ? totalRating / ratingCount : 0;

    await User.findByIdAndUpdate(userId, {
      sellerRating: Math.round(averageRating * 10) / 10
    });
  } catch (error) {
    console.error('Update user rating error:', error);
  }
};

module.exports = router;

