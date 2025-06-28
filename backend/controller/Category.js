import { Category } from '../model/Category.js';

export const fetchCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).exec();
    res.status(200).json(categories);
  } catch (err) {
    console.error('Fetch categories error:', err);
    res.status(400).json({ message: 'Failed to fetch categories' });
  }
};

export const createCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    const doc = await category.save();
    res.status(201).json(doc);
  } catch (err) {
    console.error('Create category error:', err);
    res.status(400).json({ message: 'Failed to create category' });
  }
};



