const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access denied. No authentication token provided.' });
    }

    const token = authHeader.replace('Bearer ', '').trim();
    if (!token) {
      return res.status(401).json({ error: 'Access denied. Invalid token format.' });
    }

    const secret = process.env.JWT_SECRET || 'super_secret_jwt_key_ecommerce_2025_change_in_production';
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token. Please log in again.' });
  }
};

module.exports = auth;
