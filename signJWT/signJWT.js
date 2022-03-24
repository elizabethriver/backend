require("dotenv").config();
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_PASSWORD;

const signJWT = (loginData) => {
    return jwt.sign(
        loginData,
        secret,
        { expiresIn: "24h" },
        { algorithm: "RS256" }
      );
}
module.exports = signJWT;

