const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/Product');

const router = express.Router();

// Helper to escape regex special characters
const escapeRegex = (text) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

// GET /api/products/home
// Returns curated sections for the Home page in a single fast, cache-friendly request
router.get('/home', async (req, res, next) => {
  try {
    // 1. Deals of the day: highest discount percentage
    const deals = await Product.aggregate([
      { $match: { mrp: { $gt: 0 }, price: { $gt: 0 } } },
      {
        $addFields: {
          discountPct: {
            $multiply: [
              { $divide: [{ $subtract: ['$mrp', '$price'] }, '$mrp'] },
              100
            ]
          }
        }
      },
      { $match: { discountPct: { $gt: 0 } } },
      { $sort: { discountPct: -1 } },
      { $limit: 10 }
    ]);

    // 2. Budget picks (under Rs 999)
    const budgetPicks = await Product.find({ price: { $lte: 999, $gt: 0 } })
      .sort({ rating: -1, reviewCount: -1 })
      .limit(10);

    // 3. Premium picks (above Rs 4,999)
    const premiumPicks = await Product.find({ price: { $gte: 4999 } })
      .sort({ rating: -1, reviewCount: -1 })
      .limit(10);

    // 4. Top rated products (rating 4.4+)
    const topRated = await Product.find({ rating: { $gte: 4.4 } })
      .sort({ rating: -1, reviewCount: -1 })
      .limit(10);

    // 5. New arrivals
    const newArrivals = await Product.find({})
      .sort({ createdAt: -1 })
      .limit(10);

    // 6. Best sellers (sorted by reviewCount)
    const bestSellers = await Product.find({})
      .sort({ reviewCount: -1, rating: -1 })
      .limit(10);

    // 7. Category 2x2 blocks for 4 main categories
    const categories = ['Electronics', 'Fashion', 'Home', 'Sports'];
    const categoryBlocks = await Promise.all(
      categories.map(async (catName) => {
        const catProducts = await Product.find({
          category: new RegExp(`^${catName}$`, 'i')
        })
          .sort({ rating: -1, reviewCount: -1 })
          .limit(4)
          .select('_id name price mrp image images brand category rating stock');

        let minPrice = 0;
        if (catProducts.length > 0) {
          minPrice = Math.min(...catProducts.map(p => p.price));
        }

        return {
          category: catName,
          title: catName === 'Home' ? 'Home & Kitchen Living' :
                 catName === 'Sports' ? 'Sports & Fitness Gear' :
                 catName === 'Fashion' ? 'Fashion & Apparel Trends' :
                 'Electronics & Daily Gadgets',
          minPrice,
          products: catProducts
        };
      })
    );

    // 8. Real brands with product counts
    const brandAgg = await Product.aggregate([
      { $group: { _id: '$brand', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    const brands = brandAgg.map(b => ({ name: b._id, count: b.count }));

    res.set('Cache-Control', 'public, max-age=60');
    res.json({
      deals,
      budgetPicks,
      premiumPicks,
      topRated,
      newArrivals,
      bestSellers,
      categoryBlocks,
      brands
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/products
// Query params: search, brand, category, sort, minPrice, maxPrice, minRating, inStock, ids, page, limit
router.get('/', async (req, res, next) => {
  try {
    const {
      search,
      brand,
      category,
      sort,
      minPrice,
      maxPrice,
      minRating,
      inStock,
      ids,
      page = 1,
      limit = 12
    } = req.query;

    const filter = {};

    // Specific product IDs filter (e.g. for Recently Viewed)
    if (ids && typeof ids === 'string' && ids.trim()) {
      const idList = ids
        .split(',')
        .map(s => s.trim())
        .filter(s => mongoose.Types.ObjectId.isValid(s));
      if (idList.length > 0) {
        filter._id = { $in: idList };
      }
    }

    // Brand filter
    if (brand && typeof brand === 'string' && brand.trim() && brand.trim().toLowerCase() !== 'all') {
      filter.brand = new RegExp(`^${escapeRegex(brand.trim())}$`, 'i');
    }

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
    if ((minPrice !== undefined && minPrice !== '') || (maxPrice !== undefined && maxPrice !== '')) {
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

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 12));
    const skip = (pageNum - 1) * limitNum;

    // Handle discount sort via aggregation pipeline
    if (sort === 'discount') {
      const total = await Product.countDocuments(filter);
      const products = await Product.aggregate([
        { $match: filter },
        {
          $addFields: {
            discountPct: {
              $cond: [
                { $gt: ['$mrp', '$price'] },
                { $multiply: [{ $divide: [{ $subtract: ['$mrp', '$price'] }, '$mrp'] }, 100] },
                0
              ]
            }
          }
        },
        { $sort: { discountPct: -1, createdAt: -1 } },
        { $skip: skip },
        { $limit: limitNum }
      ]);

      const pages = Math.ceil(total / limitNum) || 1;
      return res.json({
        products,
        total,
        page: pageNum,
        pages
      });
    }

    // Standard sort options
    let sortOptions = { createdAt: -1 };
    if (sort === 'price-low-high' || sort === 'price_asc') {
      sortOptions = { price: 1 };
    } else if (sort === 'price-high-low' || sort === 'price_desc') {
      sortOptions = { price: -1 };
    } else if (sort === 'rating') {
      sortOptions = { rating: -1, reviewCount: -1 };
    } else if (sort === 'reviewCount' || sort === 'bestsellers') {
      sortOptions = { reviewCount: -1, rating: -1 };
    } else if (sort === 'newest') {
      sortOptions = { createdAt: -1 };
    } else {
      // 'relevance' or default
      sortOptions = { createdAt: -1 };
    }

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
