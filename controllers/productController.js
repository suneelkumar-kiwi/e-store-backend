const Product = require('../models/Product');
const { uploadToCloudinary } = require('../utils/cloudinary');

// Create new product
const createProduct = async (req, res) => {
  try {
    // Check if file exists in request
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image"
      });
    }

    // Upload image to Cloudinary
    const imageResult = await uploadToCloudinary(req.file);

    // Create product with image URL
    const product = await Product.create({
      ...req.body,
      image: imageResult.url,
      imagePublicId: imageResult.public_id
    });

    res.status(201).json({
      success: true,
      product
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
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