const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /api/orders
router.post('/', auth, async (req, res, next) => {
  const successfullyDeducted = [];
  try {
    const { items, shippingAddress } = req.body;

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    // Validate shipping address
    if (!shippingAddress || typeof shippingAddress !== 'object') {
      return res.status(400).json({ error: 'Shipping address is required' });
    }

    const { fullName, phone, address, city, pincode } = shippingAddress;
    if (!fullName || !phone || !address || !city || !pincode) {
      return res.status(400).json({
        error: 'All shipping address fields (Full Name, Phone, Address, City, Pincode) are required'
      });
    }

    const cleanPhone = String(phone).trim();
    const cleanPincode = String(pincode).trim();

    if (!/^\d{10}$/.test(cleanPhone)) {
      return res.status(400).json({ error: 'Phone number must be a valid 10-digit number' });
    }

    if (!/^\d{6}$/.test(cleanPincode)) {
      return res.status(400).json({ error: 'Pincode must be a valid 6-digit number' });
    }

    // Prepare items list and verify product IDs
    const preparedOrderItems = [];
    let calculatedTotal = 0;

    for (const item of items) {
      const productId = item.productId || item._id || item.product;
      const qty = parseInt(item.qty, 10);

      if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ error: `Invalid product ID: ${productId}` });
      }

      if (!qty || isNaN(qty) || qty <= 0) {
        return res.status(400).json({ error: 'Item quantity must be at least 1' });
      }

      const dbProduct = await Product.findById(productId);
      if (!dbProduct) {
        return res.status(404).json({ error: `Product not found: ${productId}` });
      }

      // Pre-check stock
      if (dbProduct.stock < qty) {
        return res.status(400).json({
          error: `Insufficient stock for "${dbProduct.name}". Only ${dbProduct.stock} unit(s) left in stock.`
        });
      }

      const itemTotal = dbProduct.price * qty;
      calculatedTotal += itemTotal;

      preparedOrderItems.push({
        product: dbProduct._id,
        name: dbProduct.name,
        price: dbProduct.price,
        image: dbProduct.image,
        qty
      });
    }

    // Atomically reduce stock item by item. If any fails, rollback all previous deductions.
    for (const orderItem of preparedOrderItems) {
      const result = await Product.updateOne(
        {
          _id: orderItem.product,
          stock: { $gte: orderItem.qty }
        },
        {
          $inc: { stock: -orderItem.qty }
        }
      );

      if (result.modifiedCount === 0) {
        // Rollback all already deducted products
        for (const deducted of successfullyDeducted) {
          await Product.updateOne(
            { _id: deducted.product },
            { $inc: { stock: deducted.qty } }
          );
        }

        return res.status(400).json({
          error: `Insufficient stock for "${orderItem.name}". The item may have just sold out.`
        });
      }

      successfullyDeducted.push(orderItem);
    }

    // Create and save the order
    const newOrder = new Order({
      user: req.user.id,
      items: preparedOrderItems,
      total: calculatedTotal,
      shippingAddress: {
        fullName: fullName.trim(),
        phone: cleanPhone,
        address: address.trim(),
        city: city.trim(),
        pincode: cleanPincode
      },
      status: 'Placed'
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({
      message: 'Order placed successfully',
      order: savedOrder
    });
  } catch (error) {
    // In case of unexpected server error during save, rollback any deducted stock
    if (successfullyDeducted.length > 0) {
      for (const deducted of successfullyDeducted) {
        try {
          await Product.updateOne(
            { _id: deducted.product },
            { $inc: { stock: deducted.qty } }
          );
        } catch (rollbackErr) {
          console.error('[Rollback Error]:', rollbackErr);
        }
      }
    }
    next(error);
  }
});

// GET /api/orders/my
router.get('/my', auth, async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product', 'image category')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
