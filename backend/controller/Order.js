import { Order } from "../model/Order.js";
import { Product } from "../model/Product.js";
import { User } from "../model/User.js";
import { sendMail, invoiceTemplate } from "../services/common.js";

export const fetchOrdersByUser = async (req, res) => {
  try {
    const { id } = req.user;
    const orders = await Order.find({ user: id });
    res.status(200).json(orders);
  } catch (err) {
    console.error('Fetch orders error:', err);
    res.status(400).json({ message: 'Failed to fetch orders' });
  }
};

export const createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    
    // Update stock for each item
    for (let item of order.items) {
      const product = await Product.findById(item.product.id);
      if (product) {
        product.stock -= item.quantity;
        await product.save();
      }
    }

    const doc = await order.save();
    const user = await User.findById(order.user);
    
    // Send confirmation email
    if (user && user.email) {
      try {
        await sendMail({
          to: user.email,
          html: invoiceTemplate(order),
          subject: 'Order Received'
        });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
      }
    }
    
    res.status(201).json(doc);
  } catch (err) {
    console.error('Create order error:', err);
    res.status(400).json({ message: 'Failed to create order' });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (err) {
    console.error('Delete order error:', err);
    res.status(400).json({ message: 'Failed to delete order' });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (err) {
    console.error('Update order error:', err);
    res.status(400).json({ message: 'Failed to update order' });
  }
};

export const fetchAllOrders = async (req, res) => {
  try {
    let query = Order.find({ deleted: { $ne: true } });
    let totalOrdersQuery = Order.find({ deleted: { $ne: true } });

    if (req.query._sort && req.query._order) {
      query = query.sort({ [req.query._sort]: req.query._order });
    }

    const totalDocs = await totalOrdersQuery.countDocuments();

    if (req.query._page && req.query._limit) {
      const pageSize = req.query._limit;
      const page = req.query._page;
      query = query.skip(pageSize * (page - 1)).limit(pageSize);
    }

    const docs = await query.exec();
    res.set('X-Total-Count', totalDocs);
    res.status(200).json(docs);
  } catch (err) {
    console.error('Fetch all orders error:', err);
    res.status(400).json({ message: 'Failed to fetch orders' });
  }
};
  