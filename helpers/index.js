const jwt = require("jsonwebtoken"),
  bcrypt = require("bcrypt");

const encodeToken = (payload) => {
  const token = jwt.sign(payload, process.env.SECRET, {
    expiresIn: "1h",
  });
  return token;
};
const decodeToken = (payload) => {
  const decoded = jwt.verify(payload, process.env.SECRET);
  return decoded;
};

const hashCredential = (payload) => {
  return bcrypt.hash(payload, Number(process.env.HASH_DIGIT));
};

const compareCredential = (payload) => {
  return bcrypt.compare(payload.newPassword, payload.oldPassword);
};

module.exports = {
  encodeToken,
  decodeToken,
  hashCredential,
  compareCredential,
};
