const jwt = require("jsonwebtoken");

require("dotenv").config();

module.exports = function (req, res, next) {
  //Get token from header
  const token = req.header("x-auth-token");

  //check if it exists
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }
  try {
    const decoded = jwt.verify(token, process.env.jwtSecret);

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};
