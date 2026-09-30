const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No authorization token provided.'
      });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'codechef_abesec_production_secret_2026';
    const decoded = jwt.verify(token, secret);

    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session. Admin account not found.'
      });
    }

    // Do not leak password hash
    delete admin.password_hash;
    delete admin.passwordHash;

    req.admin = admin;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized. Token expired or invalid.'
    });
  }
};

module.exports = authMiddleware;
