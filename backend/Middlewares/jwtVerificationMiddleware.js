const jwt = require('jsonwebtoken');

// Middleware to authenticate JWT token
const authenticateJWT = (req, res, next) => {
  const token = req.headers['authorization']; // Get token from headers
  if (!token) {
    return res.status(403).json({ message: 'Access Denied: No Token Provided!' });
  }

  try {
    const decoded = jwt.verify(token, process.env.secretKey); // Verify token
    console.log('decoded: =========>', decoded);
    req.user = decoded; // Attach decoded user info to the request
  } catch (error) {
    return res.status(401).json({ message: 'Invalid Token!' });
  }
  next();
};

//exporting module
module.exports = {
  authenticateJWT,
};