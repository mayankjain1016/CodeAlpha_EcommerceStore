const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/Product');

const router = express.Router();

// Helper to escape regex special characters
const escapeRegex = (text) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

// GET /api/products
// Query params: search, category, sort, minPrice, maxPrice, minRating, inStock, page, limit
router.get('/', async (req, res, next) => {
  try {
    const {
      search,
      category,
      sort,
      minPrice,
      maxPrice,
      minRating,
      inStock,
      page = 1,
      limit = 12
    } = req.query;

    const filter = {};

    // Category filter
    if (category && category.trim() && category.trim().toLowerCase() !== 'all') {
      filter.category = new RegExp(`^${escapeRegex(category.trim())}$`, 'i');
    }

    // Search query filter (matches name, description, or brand)
    if (search && search.trim()) {
      const cleanSearch = escapeRegex(search.trim());
      const searchRegex = new RegExp(cleanSearch, 'i');
      filter.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { brand: searchRegex }
      ];
    }

    // Price range filter
    if (minPrice !== undefined && minPrice !== '' || maxPrice !== undefined && maxPrice !== '') {
      filter.price = {};
      if (minPrice !== undefined && minPrice !== '') {
        const parsedMin = Number(minPrice);
        if (!isNaN(parsedMin)) filter.price.$gte = parsedMin;
      }
      if (maxPrice !== undefined && maxPrice !== '') {
        const parsedMax = Number(maxPrice);
        if (!isNaN(parsedMax)) filter.price.$lte = parsedMax;
      }
      if (Object.keys(filter.price).length === 0) {
        delete filter.price;
      }
    }

    // Minimum rating filter
    if (minRating !== undefined && minRating !== '') {
      const parsedRating = Number(minRating);
      if (!isNaN(parsedRating) && parsedRating > 0) {
        filter.rating = { $gte: parsedRating };
      }
    }

    // In-stock only filter
    if (inStock === 'true' || inStock === '1') {
      filter.stock = { $gt: 0 };
    }

    // Sort order
    let sortOptions = { createdAt: -1 };
    if (sort === 'price-low-high') {
      sortOptions = { price: 1 };
    } else if (sort === 'price-high-low') {
      sortOptions = { price: -1 };
    } else if (sort === 'rating') {
      sortOptions = { rating: -1, reviewCount: -1 };
    } else if (sort === 'newest') {
      sortOptions = { createdAt: -1 };
    } else {
      // 'relevance' or default
      sortOptions = { createdAt: -1 };
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 12));
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const pages = Math.ceil(total / limitNum) || 1;

    res.json({
      products,
      total,
      page: pageNum,
      pages
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Fetch up to 4 related products in the same category
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id }
    })
      .limit(4)
      .select('brand name price mrp rating reviewCount image stock freeDelivery');

    res.json({
      ...product.toObject(),
      relatedProducts
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
