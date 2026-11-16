const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, requireAdmin } = require('../middleware/auth');

/**
 * @route   GET /api/users/:id
 * @desc    Get public profile of a user / host
 * @access  Public
 */
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('name avatar bio isHost createdAt');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @route   GET /api/users
 * @desc    List all registered users (Admin only)
 * @access  Private/Admin
 */
router.get('/', protect, requireAdmin, async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
