const jwt = require("jsonwebtoken");
const secretKey = require("../config/db.config.js").secretKey;

module.exports = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(403)
      .json({ message: "Access denied - no token provided" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    res.clearCookie("token");
    res.status(401).json({ message: "Invalid token" });
  }
};
