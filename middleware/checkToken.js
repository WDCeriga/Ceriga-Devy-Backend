import jwt from "jsonwebtoken";
import config from "../config.js";

const checkToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
  const token = authHeader.split(' ')[1];
  try {
    const { id } = jwt.verify(token, config.jwtSecret);
    req.id = id;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

export default checkToken;