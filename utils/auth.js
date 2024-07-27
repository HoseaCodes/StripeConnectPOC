const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token)
      return res.status(401).json({ msg: "Invalid Authentication - no token" });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err instanceof jwt.TokenExpiredError) {
        return res.status(403).json({ msg: "Token Expired Error", err });
      }
      if (err)
        return res
          .status(409)
          .json({ msg: "Invalid Authentication - invalid token" });

      req.user = user;
      next();
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

function basicAuth(req, res, next) {
  const authheader = req.headers.authorization;
  console.log({ authheader });
  if (!authheader) {
    res.setHeader("WWW-Authenticate", "Basic");
    return res.status(401).json({ msg: "Unauthentication - Auth401 Missing Header" });
  }

  const auth = new Buffer.from(authheader.split(" ")[1], "base64")
    .toString()
    .split(":");

  const user = auth[0];
  const pass = auth[1];

  if (user == "admin" && pass == "password") {
    // If Authorized user

    next();
  } else {
    res.setHeader("WWW-Authenticate", "Basic");
    return res.status(401).json({ msg: "Unauthentication - Auth401" });
  }
}

module.exports = { auth, basicAuth };
