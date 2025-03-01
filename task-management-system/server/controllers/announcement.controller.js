const Announcement = require('../models/Announcement');
const User = require('../models/User');
const path = require('path');
const fs = require('fs');

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Private
exports.getAnnouncements = async (req, res) => {
  try {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach((param) => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    // Finding resource
    if (req.user.role === 'admin') {
      // Admin can see all announcements
      query = Announcement.find(JSON.parse(queryStr));
    } else {
      // Regular users can only see announcements visible to them or to all
      query = Announcement.find({
        ...JSON.parse(queryStr),
        $or: [
          { visibleTo: { $in: [req.user.id] } },
          { visibleTo: { $size: 0 } }, // Empty array means visible to all
        ],
      });
    }

    // Filter out expired announcements for non-admins
    if (req.user.role !== 'admin') {
      query = query.or([
        { expiresAt: { $gt: new Date() } },
        { expiresAt: null },
      ]);
    }

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Announcement.countDocuments(query);

    query = query.skip(startIndex).limit(limit);

    // Populate
    query = query.populate([
      { path: 'author', select: 'name email avatar' },
      { path: 'readBy.user', select: 'name email avatar' },
    ]);

    // Executing query
    const announcements = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      success: true,
      count: announcements.length,
      pagination,
      data: announcements,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

// @desc    Get single announcement
// @route   GET /api/announcements/:id
// @access  Private
exports.getAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id).populate([
      { path: 'author', select: 'name email avatar' },
      { path: 'readBy.user', select: 'name email avatar' },
    ]);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: `Announcement not found with id of ${req.params.id}`,
      });
    }

    // Make sure user is authorized to view this announcement
    if (
      req.user.role !== 'admin' &&
      announcement.visibleTo.length > 0 &&
      !announcement.visibleTo.includes(req.user.id)
    ) {
      return res.status(403).json({
        success: false,
        message: `User ${req.user.id} is not authorized to view this announcement`,
      });
    }

    // Check if announcement is expired
    if (
      req.user.role !== 'admin' &&
      announcement.expiresAt &&
      announcement.expiresAt < new Date()
    ) {
      return res.status(403).json({
        success: false,
        message: 'This announcement has expired',
      });
    }

    // Mark announcement as read if not already read by this user
    if (
      !announcement.readBy.some(
        (read) => read.user.toString() === req.user.id
      )
    ) {
      announcement.readBy.push({
        user: req.user.id,
        readAt: Date.now(),
      });
      await announcement.save();
    }

    res.status(200).json({
      success: true,
      data: announcement,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

// @desc    Create new announcement
// @route   POST /api/announcements
// @access  Private/Admin
exports.createAnnouncement = async (req, res) => {
  try {
    // Add author to req.body
    req.body.author = req.user.id;

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can create announcements',
      });
    }

    // Check if visibleTo users exist
    if (req.body.visibleTo && req.body.visibleTo.length > 0) {
      for (const userId of req.body.visibleTo) {
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({
            success: false,
            message: `User not found with id of ${userId}`,
          });
        }
      }
    }

    const announcement = await Announcement.create(req.body);

    // Populate the announcement
    const populatedAnnouncement = await Announcement.findById(
      announcement._id
    ).populate([
      { path: 'author', select: 'name email avatar' },
      { path: 'readBy.user', select: 'name email avatar' },
    ]);

    res.status(201).json({
      success: true,
      data: populatedAnnouncement,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

// @desc    Update announcement
// @route   PUT /api/announcements/:id
// @access  Private/Admin
exports.updateAnnouncement = async (req, res) => {
  try {
    let announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: `Announcement not found with id of ${req.params.id}`,
      });
    }

    // Make sure user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this announcement`,
      });
    }

    // Check if visibleTo users exist
    if (req.body.visibleTo && req.body.visibleTo.length > 0) {
      for (const userId of req.body.visibleTo) {
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({
            success: false,
            message: `User not found with id of ${userId}`,
          });
        }
      }
    }

    announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate([
      { path: 'author', select: 'name email avatar' },
      { path: 'readBy.user', select: 'name email avatar' },
    ]);

    res.status(200).json({
      success: true,
      data: announcement,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Private/Admin
exports.deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: `Announcement not found with id of ${req.params.id}`,
      });
    }

    // Make sure user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: `User ${req.user.id} is not authorized to delete this announcement`,
      });
    }

    // Delete announcement attachments
    if (announcement.attachments && announcement.attachments.length > 0) {
      for (const attachment of announcement.attachments) {
        const filePath = path.join(
          __dirname,
          '../uploads',
          attachment.path.split('/').pop()
        );
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    await announcement.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

// @desc    Upload announcement attachment
// @route   POST /api/announcements/:id/attachments
// @access  Private/Admin
exports.uploadAnnouncementAttachment = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: `Announcement not found with id of ${req.params.id}`,
      });
    }

    // Make sure user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: `User ${req.user.id} is not authorized to upload to this announcement`,
      });
    }

    if (!req.files) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file',
      });
    }

    const file = req.files.file;

    // Check filesize
    if (file.size > process.env.MAX_FILE_UPLOAD) {
      return res.status(400).json({
        success: false,
        message: `Please upload a file less than ${
          process.env.MAX_FILE_UPLOAD / 1000000
        }MB`,
      });
    }

    // Create custom filename
    file.name = `announcement_${announcement._id}_${Date.now()}${
      path.parse(file.name).ext
    }`;

    // Move file to upload directory
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          success: false,
          message: 'Problem with file upload',
        });
      }

      // Add attachment to announcement
      const attachment = {
        filename: file.name,
        path: `/uploads/${file.name}`,
      };

      announcement.attachments.push(attachment);
      await announcement.save();

      res.status(200).json({
        success: true,
        data: attachment,
      });
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
}; 