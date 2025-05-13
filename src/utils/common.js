const jwt = require("jsonwebtoken");

const signJwtToken = (data) => {
  const token = jwt.sign(data, process.env.JWT_SECRET);

  return token;
};

module.exports = { signJwtToken };
