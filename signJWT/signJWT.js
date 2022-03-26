require("dotenv").config();
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_PASSWORD;

const signJWT = (loginData, time) => {
    return jwt.sign(
        loginData,
        secret,
        { expiresIn: time },
        { algorithm: "RS256" }
      );
}
module.exports = signJWT;

