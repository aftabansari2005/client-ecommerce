import { User } from '../model/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sanitizeUser, sendMail } from '../services/common.js';
import crypto from 'crypto';

export const createUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      name,
      role: 'user'
    });

    const doc = await user.save();

    // Generate JWT token
    const token = jwt.sign(
      sanitizeUser(doc),
      process.env.JWT_SECRET_KEY,
      { expiresIn: '24h' }
    );

    // Set cookie
    res.cookie('jwt', token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    res.status(201).json({ id: doc.id, role: doc.role });
  } catch (err) {
    console.error('Create user error:', err);
    res.status(400).json({ message: 'Failed to create user' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      sanitizeUser(user),
      process.env.JWT_SECRET_KEY,
      { expiresIn: '24h' }
    );

    // Set cookie
    res.cookie('jwt', token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    res.status(200).json({ id: user.id, role: user.role });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed' });
  }
};

export const logout = async (req, res) => {
  res.cookie('jwt', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.sendStatus(200);
};

export const checkAuth = async (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.sendStatus(401);
  }
};

export const resetPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (user) {
      const token = crypto.randomBytes(48).toString('hex');
      user.resetPasswordToken = token;
      await user.save();

      // Send reset email
      const resetPageLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}&email=${email}`;
      const subject = 'Reset password for e-commerce';
      const html = `<p>Click <a href='${resetPageLink}'>here</a> to Reset Password</p>`;

      if (email) {
        const response = await sendMail({ to: email, subject, html });
        res.json(response);
      } else {
        res.status(400).json({ message: 'Email is required' });
      }
    } else {
      res.status(400).json({ message: 'User not found' });
    }
  } catch (err) {
    console.error('Reset password request error:', err);
    res.status(500).json({ message: 'Failed to send reset email' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, password, token } = req.body;

    const user = await User.findOne({ email, resetPasswordToken: token });
    if (user) {
      // Hash new password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      user.password = hashedPassword;
      user.resetPasswordToken = '';
      await user.save();

      // Send confirmation email
      const subject = 'Password successfully reset for e-commerce';
      const html = `<p>Successfully able to Reset Password</p>`;
      
      if (email) {
        const response = await sendMail({ to: email, subject, html });
        res.json(response);
      } else {
        res.status(400).json({ message: 'Email is required' });
      }
    } else {
      res.status(400).json({ message: 'Invalid token or email' });
    }
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Failed to reset password' });
  }
};
