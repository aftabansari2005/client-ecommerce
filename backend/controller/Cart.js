import { Cart } from '../model/Cart.js';

export const fetchCartByUser = async (req, res) => {
  try {
    const { id } = req.user;
    const cartItems = await Cart.find({ user: id }).populate('product');
    res.status(200).json(cartItems);
  } catch (err) {
    console.error('Fetch cart error:', err);
    res.status(400).json({ message: 'Failed to fetch cart' });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { id } = req.user;
    const cart = new Cart({ ...req.body, user: id });
    const doc = await cart.save();
    const result = await doc.populate('product');
    res.status(201).json(result);
  } catch (err) {
    console.error('Add to cart error:', err);
    res.status(400).json({ message: 'Failed to add to cart' });
  }
};

export const deleteFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Cart.findByIdAndDelete(id);
    if (!doc) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    res.status(200).json(doc);
  } catch (err) {
    console.error('Delete from cart error:', err);
    res.status(400).json({ message: 'Failed to delete from cart' });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { id } = req.params;
    const cart = await Cart.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!cart) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    const result = await cart.populate('product');
    res.status(200).json(result);
  } catch (err) {
    console.error('Update cart error:', err);
    res.status(400).json({ message: 'Failed to update cart' });
  }
};
