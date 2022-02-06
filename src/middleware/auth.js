const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers.authorization;
  
  const accessToken = token.split(' ')[1]
  console.log("access  token ", accessToken)

  if (!accessToken) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(accessToken, config.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;