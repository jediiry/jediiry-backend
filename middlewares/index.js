const { decodeToken } = require("../helpers/index");

const auth = (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer", "").trim();
    const decoded = decodeToken(token);
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp < now) throw new Error("Token expired");
    req.currentUser = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

module.exports = auth;
