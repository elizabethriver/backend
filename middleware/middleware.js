require("dotenv").config();
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_PASSWORD;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token === null) return res.sendStatus(401);

  jwt.verify(token, secret, (err) => {
    if (err) return res.status(403).send({err}).end();
    req.user = token;
    next();
  });
};
module.exports = authenticateToken;
