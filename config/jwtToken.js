const jwt = require("jsonwebtoken");

const key = {
  jwtSecret: 'mykey'
};

const generateToken = (id) => {
  return jwt.sign({ id }, key.jwtSecret, { expiresIn: "3d" }); 
};

module.exports = { generateToken, key };
