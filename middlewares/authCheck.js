const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

function isValidUser(req, res, next) {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, process.env.jwtPass, (err, decoded) => {
      if (err) {
        return res.status(411).json({
          err: "Not a valid user",
        });
      } else {
        next();
      }
    });
  } else {
    res.status(404).json({
      err: "Not a valid token",
    });
  }
}

module.exports = isValidUser;
