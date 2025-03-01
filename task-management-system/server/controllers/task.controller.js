const Task = require('../models/Task');
const User = require('../models/User');
const path = require('path');
const fs = require('fs');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res) => {
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

    // Finding resource - temporarily giving admin access to all tasks for testing
    // Commenting out role-based check
    /*
    if (req.user.role === 'admin') {
      // Admin can see all tasks
      query = Task.find(JSON.parse(queryStr));
    } else {
      // Regular users can only see tasks assigned to them
      query = Task.find({
        ...JSON.parse(queryStr),
        assignedTo: req.user.id,
      });
    }
    */
    
    // For testing - show all tasks without authentication
    query = Task.find(JSON.parse(queryStr));

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
    const total = await Task.countDocuments(query);

    query = query.skip(startIndex).limit(limit);

    // Populate
    query = query.populate([
      { path: 'assignedTo', select: 'name email avatar' },
      { path: 'assignedBy', select: 'name email avatar' },
      { path: 'comments.user', select: 'name email avatar' },
      { path: 'attachments.uploadedBy', select: 'name email avatar' },
    ]);

    // Executing query
    const tasks = await query;

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
      count: tasks.length,
      pagination,
      data: tasks,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate([
      { path: 'assignedTo', select: 'name email avatar' },
      { path: 'assignedBy', select: 'name email avatar' },
      { path: 'comments.user', select: 'name email avatar' },
      { path: 'attachments.uploadedBy', select: 'name email avatar' },
    ]);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found with id of ${req.params.id}`,
      });
    }

    // Make sure user is task assignee or admin - DISABLED FOR TESTING
    /*
    if (
      req.user.role !== 'admin' &&
      !task.assignedTo.some((user) => user._id.toString() === req.user.id)
    ) {
      return res.status(403).json({
        success: false,
        message: `User ${req.user.id} is not authorized to access this task`,
      });
    }
    */

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private/Admin
exports.createTask = async (req, res) => {
  try {
    // Add user to req.body - MODIFIED FOR TESTING
    // req.body.assignedBy = req.user.id;
    req.body.assignedBy = req.body.assignedBy || "64f0e0d348d3e1a1ee9a2e8a"; // Default test ID

    // Check if assigned users exist
    if (req.body.assignedTo && req.body.assignedTo.length > 0) {
      for (const userId of req.body.assignedTo) {
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({
            success: false,
            message: `User not found with id of ${userId}`,
          });
        }
      }
    }

    const task = await Task.create(req.body);

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found with id of ${req.params.id}`,
      });
    }

    // Make sure user is task assignee or admin - DISABLED FOR TESTING
    /*
    if (
      req.user.role !== 'admin' &&
      !task.assignedTo.some((user) => user.toString() === req.user.id)
    ) {
      return res.status(403).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this task`,
      });
    }

    // If user is not admin, they can only update status
    if (req.user.role !== 'admin') {
      // Only allow status update
      const allowedUpdates = ['status', 'progress'];
      const requestedUpdates = Object.keys(req.body);
      const isValidOperation = requestedUpdates.every((update) =>
        allowedUpdates.includes(update)
      );

      if (!isValidOperation) {
        return res.status(400).json({
          success: false,
          message: 'Invalid updates! Only status and progress can be updated',
        });
      }
    }
    */

    // Perform the update
    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate([
      { path: 'assignedTo', select: 'name email avatar' },
      { path: 'assignedBy', select: 'name email avatar' },
    ]);

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found with id of ${req.params.id}`,
      });
    }

    // Make sure user is admin - DISABLED FOR TESTING
    /*
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete tasks',
      });
    }
    */

    // Delete all attachments
    if (task.attachments && task.attachments.length > 0) {
      for (const attachment of task.attachments) {
        const filePath = path.join(
          __dirname,
          '../',
          process.env.FILE_UPLOAD_PATH || 'uploads',
          attachment.file
        );
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    await task.remove();

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

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comments
// @access  Private
exports.addTaskComment = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found with id of ${req.params.id}`,
      });
    }

    // Make sure user is task assignee or admin - DISABLED FOR TESTING
    /*
    if (
      req.user.role !== 'admin' &&
      !task.assignedTo.some((user) => user.toString() === req.user.id)
    ) {
      return res.status(403).json({
        success: false,
        message: `User ${req.user.id} is not authorized to comment on this task`,
      });
    }
    */

    // Create comment object with temp ID for testing
    const comment = {
      text: req.body.text,
      user: req.body.user || "64f0e0d348d3e1a1ee9a2e8a", // Default test ID
      createdAt: Date.now(),
    };

    // Add to comments array
    task.comments.unshift(comment);

    // Save
    await task.save();

    // Populate user info
    await task.populate('comments.user', 'name email avatar');

    res.status(200).json({
      success: true,
      data: task.comments,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

// @desc    Upload task attachment
// @route   POST /api/tasks/:id/attachments
// @access  Private
exports.uploadTaskAttachment = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found with id of ${req.params.id}`,
      });
    }

    // Make sure user is task assignee or admin - DISABLED FOR TESTING
    /*
    if (
      req.user.role !== 'admin' &&
      !task.assignedTo.some((user) => user.toString() === req.user.id)
    ) {
      return res.status(403).json({
        success: false,
        message: `User ${req.user.id} is not authorized to upload attachments to this task`,
      });
    }
    */

    // Check if any files were uploaded
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files were uploaded',
      });
    }

    const file = req.files.file;

    // Make sure the file is valid
    if (!file.mimetype.startsWith('image/') && !file.mimetype.startsWith('application/')) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a valid file',
      });
    }

    // Check file size
    if (file.size > (process.env.MAX_FILE_UPLOAD || 5000000)) {
      return res.status(400).json({
        success: false,
        message: `Please upload a file less than ${process.env.MAX_FILE_UPLOAD || 5000000} bytes`,
      });
    }

    // Create custom filename
    file.name = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;

    // Create uploads directory if it doesn't exist
    const uploadPath = path.join(
      __dirname,
      '../',
      process.env.FILE_UPLOAD_PATH || 'uploads'
    );
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    // Move file to the upload path
    file.mv(`${uploadPath}/${file.name}`, async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          success: false,
          message: 'Problem with file upload',
        });
      }

      // Add attachment to task
      task.attachments.push({
        file: file.name,
        originalName: req.files.file.name,
        fileType: file.mimetype,
        fileSize: file.size,
        uploadedBy: req.body.uploadedBy || "64f0e0d348d3e1a1ee9a2e8a", // Default test ID
        uploadedAt: Date.now(),
      });

      await task.save();

      res.status(200).json({
        success: true,
        data: task.attachments,
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