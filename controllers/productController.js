const fs = require('fs');
const cloudinary = require('../config/cloudinary');
const Product = require('../models/Product');

const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;

    // Validate input fields
    if (!name || !description || !price) {
      return res.status(400).json({ error: 'All fields are required, including an image.' });
    }

    // Validate price and stock
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ error: 'Price must be a positive number' });
    }

    if (isNaN(stock) || stock < 0) {
      return res.status(400).json({ error: 'Stock must be a non-negative number' });
    }

    // Validate that an image was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'An image file is required.' });
    }

    // Upload image to Cloudinary
    const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
      folder: 'photo',
    });

    // Clean up uploaded file
    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Error deleting temporary file:', err);
    });

    // Create product in database
    const product = await Product.create({
      category,
      price: Number(price),
      description,
      name,
      stock: Number(stock),
      imageUrl: cloudinaryResult.secure_url,
    });

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    // Clean up uploaded file in case of error
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting temporary file:', err);
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProducts, getProductById, createProduct };