// middleware/authMiddleware.js
// const jwt = require("jsonwebtoken");

// const authMiddleware = (req, res, next) => {
//   const token = req.header("Authorization");
//   if (!token)
//     return res.status(401).json({ message: "No token, authorization denied" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded.id;
//     next();
//   } catch (err) {
//     res.status(401).json({ message: "Invalid token" });
//   }
// };

const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const actualToken = token.split(" ")[1]; // Handle Bearer prefix
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (err) {
    console.log("Invalid token:", err.message);
    res.status(401).json({ message: "Invalid token" });
  }
};


module.exports = authMiddleware;
