const express = require('express');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  addTaskComment,
  uploadTaskAttachment,
} = require('../controllers/task.controller');

const router = express.Router();

// Import middleware
const { protect, authorize } = require('../middleware/auth');

// Apply protection to all routes - this will now use our bypassed version
router.use(protect);

// Task routes
router.route('/')
  .get(getTasks)
  .post(authorize('admin'), createTask);

router.route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(authorize('admin'), deleteTask);

// Task comments
router.route('/:id/comments').post(addTaskComment);

// Task attachments
router.route('/:id/attachments').post(uploadTaskAttachment);

module.exports = router; 