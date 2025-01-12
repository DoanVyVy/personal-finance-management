const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }
  const token = authHeader.split(" ")[1]; // 'Bearer <token>'
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    // Lưu decoded vào req.user
    req.user = decoded; // { userId, email, iat, exp }
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
