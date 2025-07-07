const jwt = require('jsonwebtoken');

// Middleware for any authenticated user
const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // decoded = { id, email, role, ... }
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware to allow specific admins by email
const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ List of allowed admin emails
    const allowedAdmins = [
      'kiptoo.brian@strathmore.edu',
      'amanda.mbatha@strathmore.edu'
    ];

    // ✅ Check role and if email is in allowed list
    if (decoded.role !== 'admin' || !allowedAdmins.includes(decoded.email)) {
      return res.status(403).json({ message: 'Access denied: Authorized admins only' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token', error: error.message });
  }
};
// Middleware to allow only venue owners
const verifyOwner = (req, res, next) => {
  if (!req.user || req.user.role !== 'owner') {
    return res.status(403).json({ message: 'Access denied: Venue owners only' });
  }
  next();
};

module.exports = {
  authenticateUser,
  verifyAdmin,
  verifyOwner,
};
