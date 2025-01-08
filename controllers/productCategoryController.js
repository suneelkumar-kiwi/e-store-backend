const ProductCategory = require('../models/ProductCategory');

// Create new product category
const createProductCategory = async (req, res) => {
  try {
    const category = new ProductCategory(req.body);
    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
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