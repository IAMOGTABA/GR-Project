const express = require('express');
const {
  getMessages,
  getMessage,
  createMessage,
  deleteMessage,
  uploadMessageAttachment,
} = require('../controllers/message.controller');

const router = express.Router();

// Import middleware
const { protect } = require('../middleware/auth');

// Apply protection to all routes
router.use(protect);

// Message routes
router.route('/')
  .get(getMessages)
  .post(createMessage);

router.route('/:id')
  .get(getMessage)
  .delete(deleteMessage);

// Message attachments
router.route('/:id/attachments').post(uploadMessageAttachment);

module.exports = router; 