const Message = require('../models/Message');
const User = require('../models/User');
const path = require('path');
const fs = require('fs');

// @desc    Get all messages for a user
// @route   GET /api/messages
// @access  Private
exports.getMessages = async (req, res) => {
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
    if (req.user.role === 'admin' && req.query.all === 'true') {
      // Admin can see all messages if requested
      query = Message.find(JSON.parse(queryStr));
    } else {
      // Otherwise, users only see messages they sent or received
      query = Message.find({
        ...JSON.parse(queryStr),
        $or: [{ sender: req.user.id }, { recipient: req.user.id }],
      });
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
    const total = await Message.countDocuments(query);

    query = query.skip(startIndex).limit(limit);

    // Populate
    query = query.populate([
      { path: 'sender', select: 'name email avatar' },
      { path: 'recipient', select: 'name email avatar' },
      { path: 'relatedTask', select: 'title status' },
    ]);

    // Executing query
    const messages = await query;

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
      count: messages.length,
      pagination,
      data: messages,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

// @desc    Get single message
// @route   GET /api/messages/:id
// @access  Private
exports.getMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id).populate([
      { path: 'sender', select: 'name email avatar' },
      { path: 'recipient', select: 'name email avatar' },
      { path: 'relatedTask', select: 'title status' },
    ]);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: `Message not found with id of ${req.params.id}`,
      });
    }

    // Make sure user is message sender or recipient or admin
    if (
      req.user.role !== 'admin' &&
      message.sender.toString() !== req.user.id &&
      message.recipient.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: `User ${req.user.id} is not authorized to access this message`,
      });
    }

    // Mark message as read if user is recipient and message is unread
    if (
      message.recipient._id.toString() === req.user.id &&
      !message.isRead
    ) {
      message.isRead = true;
      message.readAt = Date.now();
      await message.save();
    }

    res.status(200).json({
      success: true,
      data: message,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

// @desc    Create new message
// @route   POST /api/messages
// @access  Private
exports.createMessage = async (req, res) => {
  try {
    // Add sender to req.body
    req.body.sender = req.user.id;

    // Check if recipient exists
    const recipient = await User.findById(req.body.recipient);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: `User not found with id of ${req.body.recipient}`,
      });
    }

    const message = await Message.create(req.body);

    // Populate the message
    const populatedMessage = await Message.findById(message._id).populate([
      { path: 'sender', select: 'name email avatar' },
      { path: 'recipient', select: 'name email avatar' },
      { path: 'relatedTask', select: 'title status' },
    ]);

    res.status(201).json({
      success: true,
      data: populatedMessage,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: `Message not found with id of ${req.params.id}`,
      });
    }

    // Make sure user is message sender or admin
    if (req.user.role !== 'admin' && message.sender.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: `User ${req.user.id} is not authorized to delete this message`,
      });
    }

    // Delete message attachments
    if (message.attachments && message.attachments.length > 0) {
      for (const attachment of message.attachments) {
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

    await message.remove();

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

// @desc    Upload message attachment
// @route   POST /api/messages/:id/attachments
// @access  Private
exports.uploadMessageAttachment = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: `Message not found with id of ${req.params.id}`,
      });
    }

    // Make sure user is message sender or admin
    if (req.user.role !== 'admin' && message.sender.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: `User ${req.user.id} is not authorized to upload to this message`,
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
    file.name = `message_${message._id}_${Date.now()}${path.parse(file.name).ext}`;

    // Move file to upload directory
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          success: false,
          message: 'Problem with file upload',
        });
      }

      // Add attachment to message
      const attachment = {
        filename: file.name,
        path: `/uploads/${file.name}`,
      };

      message.attachments.push(attachment);
      await message.save();

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