import { Brand } from '../model/Brand.js';

export const fetchBrands = async (req, res) => {
  try {
    const brands = await Brand.find({}).exec();
    res.status(200).json(brands);
  } catch (err) {
    console.error('Fetch brands error:', err);
    res.status(400).json({ message: 'Failed to fetch brands' });
  }
};

export const createBrand = async (req, res) => {
  try {
    const brand = new Brand(req.body);
    const doc = await brand.save();
    res.status(201).json(doc);
  } catch (err) {
    console.error('Create brand error:', err);
    res.status(400).json({ message: 'Failed to create brand' });
  }
};
