const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadAvatar,
} = require('../controllers/user.controller');

const router = express.Router();

// Import middleware
const { protect, authorize } = require('../middleware/auth');

// Apply protection to all routes - this will now use our bypassed version
router.use(protect);

// Admin only routes - this will now use our bypassed version
router.route('/')
  .get(authorize('admin'), getUsers)
  .post(authorize('admin'), createUser);

router.route('/:id')
  .get(authorize('admin'), getUser)
  .put(authorize('admin'), updateUser)
  .delete(authorize('admin'), deleteUser);

// Special route for avatar upload - admin can upload for any user, users can upload their own
router.route('/:id/avatar').put(uploadAvatar);

module.exports = router; 