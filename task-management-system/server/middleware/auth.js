const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - BYPASS FOR TESTING
exports.protect = async (req, res, next) => {
  // BYPASSED FOR TESTING: Setting a default admin user in the request
  req.user = {
    _id: '60d0fe4f5311236168a109ca', // Mock ID
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin'
  };
  
  // Just pass through without authentication
  return next();

  /*
  let token;

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token
    token = req.headers.authorization.split(' ')[1];
  }
  // Check for token in cookies
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from the token
    req.user = await User.findById(decoded.id);

    // Check if user still exists
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists',
      });
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }
  */
};

// Grant access to specific roles - BYPASS FOR TESTING
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // BYPASSED FOR TESTING: Always authorize
    return next();
  
    /*
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    next();
    */
  };
}; 