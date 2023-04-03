const httpStatus = require("http-status");
const JWT = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.headers?.authorization?.split(" ")[1] || null;
  if (token === null)
    return res
      .status(httpStatus.UNAUTHORIZED)
      .send({ error: "You are not authorized." });

  JWT.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, user) => {
    if (err)
      return res.status(httpStatus.FORBIDDEN).send({ error: "Token expired" });
    req.user = user["0"];
    next();
  });
};

module.exports = authenticateToken;
