const express = require('express');
const {
  getAnnouncements,
  getAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  uploadAnnouncementAttachment,
} = require('../controllers/announcement.controller');

const router = express.Router();

// Import middleware
const { protect, authorize } = require('../middleware/auth');

// Apply protection to all routes
router.use(protect);

// Announcement routes
router.route('/')
  .get(getAnnouncements)
  .post(authorize('admin'), createAnnouncement);

router.route('/:id')
  .get(getAnnouncement)
  .put(authorize('admin'), updateAnnouncement)
  .delete(authorize('admin'), deleteAnnouncement);

// Announcement attachments
router.route('/:id/attachments').post(authorize('admin'), uploadAnnouncementAttachment);

module.exports = router; 