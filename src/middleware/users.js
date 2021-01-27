module.exports = {
  validateRegister: (req, res, next) => {
    // username min length 3
    if (!req.body.username || req.body.username.length < 3) {
      return res.status(400).send({
        msg: "Please enter a username with min. 3 chars",
      });
    }
    // password min 6 chars
    if (!req.body.password || req.body.password.length < 6) {
      return res.status(400).send({
        msg: "Please enter a password with min. 6 chars",
      });
    }
    next();
  },
  isLoggedIn: (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      console.log(token);
      const decoded = jwt.verify(token, process.env.SECRET_JWT);
      console.log("decoded ", decoded);
      req.userData = decoded;
      next();
    } catch (error) {
      return res.status(401).send({
        msg: "Invalid token",
      });
    }
  },
};
