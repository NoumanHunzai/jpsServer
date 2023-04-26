const jwt = require("jsonwebtoken");

module.exports = function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (!bearerHeader) return next({ code: 403, message: "Header Missing" });

  const bearer = bearerHeader.split(" ");
  const bearerToken = bearer[1];

  req.token = bearerToken;
  jwt.verify(
    req.token,
    "wake-eat-work-sleep-wake-eat-work-sleep",
    (err, data) => {
      if (err) {
        return next({ code: 403, message: err || "Access denied" });
      }
      req.data = data;
      next();
    }
  );
};
