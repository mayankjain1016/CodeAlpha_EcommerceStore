/**
 * Centralized JWT Secret Management
 * Ensures identical normalized secret across signing and verification
 */
const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET || 'super_secret_jwt_key_ecommerce_2025_change_in_production';
  return String(secret).trim().replace(/^["']|["']$/g, '');
};

module.exports = { getJwtSecret };
