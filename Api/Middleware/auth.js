const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  // Check if token is present
  if (!authHeader) {
    return res.status(400).send("Token not present");
  }
  // Extract token from the header (remove "Bearer " prefix if present)
  const token = authHeader
    ? authHeader.slice(7)
    : authHeader;
  jwt.verify(token, process.env.jwtSecret, (err, user) => {
    if (err) {
      // If token is invalid, send a 403 response
      return res.status(403).send("Token invalid");
    }

    // If token is valid, attach user to request object and proceed to the next middleware
    req.user = user;
    next();
  });
};

module.exports = verifyToken;
