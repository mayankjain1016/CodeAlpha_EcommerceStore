const jwt = require('jsonwebtoken');
const { getJwtSecret } = require('../config/jwt');

const auth = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Access denied. No authentication token provided.',
        code: 'NO_TOKEN'
      });
    }

    let token = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (!token) {
      return res.status(401).json({
        error: 'Access denied. Invalid token format.',
        code: 'INVALID_FORMAT'
      });
    }

    // Strip surrounding quotes if present (e.g. from JSON serialization in client storage)
    if ((token.startsWith('"') && token.endsWith('"')) || (token.startsWith("'") && token.endsWith("'"))) {
      token = token.slice(1, -1).trim();
    }

    const secret = getJwtSecret();
    const decoded = jwt.verify(token, secret);

    // Normalize user ID to both id and _id
    req.user = {
      ...decoded,
      id: decoded.id || decoded._id,
      _id: decoded._id || decoded.id
    };

    next();
  } catch (error) {
    console.warn('[Auth Middleware]:', error.name, error.message);
    const isExpired = error.name === 'TokenExpiredError';
    return res.status(401).json({
      error: isExpired
        ? 'Your session has expired. Please log in again.'
        : 'Invalid or expired token. Please log in again.',
      code: isExpired ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN'
    });
  }
};

module.exports = auth;
