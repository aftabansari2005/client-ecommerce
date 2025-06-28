import { Product } from '../model/Product.js';

export const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    product.discountPrice = Math.round(product.price * (1 - product.discountPercentage / 100));
    const doc = await product.save();
    res.status(201).json(doc);
  } catch (err) {
    console.error('Create product error:', err);
    res.status(400).json({ message: 'Failed to create product' });
  }
};

export const fetchAllProducts = async (req, res) => {
  try {
    let condition = {};
    if (!req.query.admin) {
      condition.deleted = { $ne: true };
    }

    let query = Product.find(condition);
    let totalProductsQuery = Product.find(condition);

    if (req.query.category) {
      query = query.find({ category: { $in: req.query.category.split(',') } });
      totalProductsQuery = totalProductsQuery.find({
        category: { $in: req.query.category.split(',') },
      });
    }
    if (req.query.brand) {
      query = query.find({ brand: { $in: req.query.brand.split(',') } });
      totalProductsQuery = totalProductsQuery.find({ brand: { $in: req.query.brand.split(',') } });
    }
    if (req.query._sort && req.query._order) {
      query = query.sort({ [req.query._sort]: req.query._order });
    }

    const totalDocs = await totalProductsQuery.countDocuments();

    if (req.query._page && req.query._limit) {
      const pageSize = req.query._limit;
      const page = req.query._page;
      query = query.skip(pageSize * (page - 1)).limit(pageSize);
    }

    const docs = await query.exec();
    res.set('X-Total-Count', totalDocs);
    res.status(200).json(docs);
  } catch (err) {
    console.error('Fetch products error:', err);
    res.status(400).json({ message: 'Failed to fetch products' });
  }
};

export const fetchProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (err) {
    console.error('Fetch product by ID error:', err);
    res.status(400).json({ message: 'Failed to fetch product' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    product.discountPrice = Math.round(product.price * (1 - product.discountPercentage / 100));
    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error('Update product error:', err);
    res.status(400).json({ message: 'Failed to update product' });
  }
};


