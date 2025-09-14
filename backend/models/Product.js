const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
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
    ]
  },
  condition: {
    type: Number,
    required: [true, 'Condition is required'],
    min: [1, 'Condition must be at least 1'],
    max: [5, 'Condition cannot exceed 5']
  },
  yearsUsed: {
    type: Number,
    required: [true, 'Years used is required'],
    min: [0, 'Years used cannot be negative']
  },
  damaged: {
    type: Boolean,
    default: false
  },
  images: [{
    type: String,
    required: true
  }],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['Available', 'Requested', 'Sold', 'Removed'],
    default: 'Available'
  },
  co2Saved: {
    type: Number,
    required: true,
    min: [0, 'CO2 saved cannot be negative']
  },
  location: {
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    }
  },
  tags: [{
    type: String,
    trim: true
  }],
  views: {
    type: Number,
    default: 0
  },
  requests: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: String,
    requestedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected'],
      default: 'Pending'
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ condition: 1 });
productSchema.index({ status: 1 });
productSchema.index({ seller: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ name: 'text', description: 'text' });

// Virtual for condition text
productSchema.virtual('conditionText').get(function() {
  const conditions = {
    5: 'Excellent',
    4: 'Very Good',
    3: 'Good',
    2: 'Fair',
    1: 'Poor'
  };
  return conditions[this.condition] || 'Unknown';
});

// Method to calculate CO2 saved based on category and condition
productSchema.methods.calculateCO2Saved = function() {
  const baseCO2 = {
    'Electronics': 50,
    'Furniture': 30,
    'Clothing': 5,
    'Books': 2,
    'Appliances': 40,
    'Vehicles': 200,
    'Sports': 10,
    'Toys & Games': 8,
    'Home & Garden': 15,
    'Beauty & Health': 3,
    'Other': 10
  };

  const base = baseCO2[this.category] || 10;
  const conditionMultiplier = this.condition / 5;
  const ageMultiplier = Math.max(0.5, 1 - (this.yearsUsed * 0.1));
  
  return Math.round(base * conditionMultiplier * ageMultiplier);
};

// Method to add a request
productSchema.methods.addRequest = function(userId, message) {
  const existingRequest = this.requests.find(req => 
    req.user.toString() === userId.toString() && req.status === 'Pending'
  );
  
  if (existingRequest) {
    throw new Error('You have already requested this item');
  }
  
  this.requests.push({
    user: userId,
    message: message || '',
    requestedAt: new Date(),
    status: 'Pending'
  });
  
  if (this.status === 'Available') {
    this.status = 'Requested';
  }
  
  return this.save();
};

// Method to update request status
productSchema.methods.updateRequestStatus = function(requestId, status) {
  const request = this.requests.id(requestId);
  if (!request) {
    throw new Error('Request not found');
  }
  
  request.status = status;
  
  if (status === 'Accepted') {
    this.status = 'Sold';
  } else if (status === 'Rejected' && this.requests.every(req => req.status !== 'Pending')) {
    this.status = 'Available';
  }
  
  return this.save();
};

// Pre-save middleware to calculate CO2 saved if not provided
productSchema.pre('save', function(next) {
  if (!this.co2Saved) {
    this.co2Saved = this.calculateCO2Saved();
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);

