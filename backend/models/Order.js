const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  request: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  price: {
    type: Number,
    required: true
  },
  co2Saved: {
    type: Number,
    required: true
  },
  buyerMessage: {
    type: String,
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  sellerMessage: {
    type: String,
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  meetingDetails: {
    location: String,
    date: Date,
    time: String,
    contactInfo: String
  },
  buyerRating: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: [500, 'Comment cannot exceed 500 characters']
    },
    ratedAt: Date
  },
  sellerRating: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: [500, 'Comment cannot exceed 500 characters']
    },
    ratedAt: Date
  },
  completedAt: Date,
  cancelledAt: Date,
  cancellationReason: String
}, {
  timestamps: true
});

// Indexes for better query performance
orderSchema.index({ buyer: 1 });
orderSchema.index({ seller: 1 });
orderSchema.index({ product: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

// Virtual for order total
orderSchema.virtual('total').get(function() {
  return this.price;
});

// Method to accept order
orderSchema.methods.acceptOrder = function(sellerMessage, meetingDetails) {
  if (this.status !== 'Pending') {
    throw new Error('Order cannot be accepted in current status');
  }
  
  this.status = 'Accepted';
  this.sellerMessage = sellerMessage;
  this.meetingDetails = meetingDetails;
  
  return this.save();
};

// Method to reject order
orderSchema.methods.rejectOrder = function(reason) {
  if (this.status !== 'Pending') {
    throw new Error('Order cannot be rejected in current status');
  }
  
  this.status = 'Rejected';
  this.sellerMessage = reason;
  
  return this.save();
};

// Method to complete order
orderSchema.methods.completeOrder = function() {
  if (this.status !== 'Accepted') {
    throw new Error('Order can only be completed if it was accepted');
  }
  
  this.status = 'Completed';
  this.completedAt = new Date();
  
  return this.save();
};

// Method to cancel order
orderSchema.methods.cancelOrder = function(reason, cancelledBy) {
  if (this.status === 'Completed') {
    throw new Error('Completed orders cannot be cancelled');
  }
  
  this.status = 'Cancelled';
  this.cancelledAt = new Date();
  this.cancellationReason = reason;
  
  return this.save();
};

// Method to add buyer rating
orderSchema.methods.addBuyerRating = function(rating, comment) {
  if (this.status !== 'Completed') {
    throw new Error('Can only rate completed orders');
  }
  
  if (this.buyerRating.rating) {
    throw new Error('Order already rated by buyer');
  }
  
  this.buyerRating = {
    rating,
    comment,
    ratedAt: new Date()
  };
  
  return this.save();
};

// Method to add seller rating
orderSchema.methods.addSellerRating = function(rating, comment) {
  if (this.status !== 'Completed') {
    throw new Error('Can only rate completed orders');
  }
  
  if (this.sellerRating.rating) {
    throw new Error('Order already rated by seller');
  }
  
  this.sellerRating = {
    rating,
    comment,
    ratedAt: new Date()
  };
  
  return this.save();
};

module.exports = mongoose.model('Order', orderSchema);

