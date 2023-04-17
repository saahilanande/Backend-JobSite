const jwt = require("jsonwebtoken");

const jwtAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.auth_key_secret, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = decoded.email;
    next();
  });
};

module.exports = jwtAuth;
