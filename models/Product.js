const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: [true, 'Brand name is required'],
      trim: true
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true
    },
    mrp: {
      type: Number,
      required: [true, 'Original MRP is required'],
      min: [0, 'MRP must be positive']
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price must be greater than or equal to 0']
    },
    rating: {
      type: Number,
      default: 4.2,
      min: [0, 'Rating cannot be below 0'],
      max: [5, 'Rating cannot exceed 5']
    },
    reviewCount: {
      type: Number,
      default: 150,
      min: [0, 'Review count cannot be negative']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true
    },
    image: {
      type: String,
      required: [true, 'Primary image is required'],
      trim: true
    },
    images: {
      type: [String],
      default: []
    },
    stock: {
      type: Number,
      required: [true, 'Stock count is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    highlights: {
      type: [String],
      default: []
    },
    specifications: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    freeDelivery: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Product', productSchema);
