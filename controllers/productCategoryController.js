const fs = require('fs');
const cloudinary = require('../config/cloudinary');
const ProductCategory = require('../models/ProductCategory');

// Create new product category
const createProductCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Upload image to Cloudinary
    const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
      folder: 'photo',
    });

    // Clean up uploaded file
    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Error deleting temporary file:', err);
    });

    const category = await ProductCategory.create({
      name,
      description,
      imageUrl: cloudinaryResult.secure_url,
    });

    res.status(201).json({
      success: true,
      category,
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

// Get all product categories
const getProductCategories = async (req, res) => {
  try {
    const categories = await ProductCategory.find({ isActive: true });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single product category by ID
const getProductCategoryById = async (req, res) => {
  try {
    const category = await ProductCategory.findById(req.params.id);
    if (!category || !category.isActive) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProductCategory,
  getProductCategories,
  getProductCategoryById
};