const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_airbnb_clone_2026_dev';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Generate a signed JWT for a given user ID
 * @param {string} userId - Mongo ObjectId string of user
 * @returns {string} - JWT token
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

/**
 * Verify and decode a JWT token
 * @param {string} token - Bearer JWT token
 * @returns {object} - Decoded payload
 */
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = {
  generateToken,
  verifyToken,
};
