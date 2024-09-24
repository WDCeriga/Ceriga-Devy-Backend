import jwt from "jsonwebtoken"
import config from "../config.js"

const checkToken = (req,res, next) => { 
  const authHeather  = req.header("Authorization")
  if (!authHeather || !authHeather.startsWith("Bearer")){
    res.status(401).json({message: "No token, authorization denied"})
  }
  const token  = authHeather.split(' ')[1]
  try {
    console.log(token)
    const {id} = jwt.verify(token, config.jwtSecret)
    req.id = id
    next()
  } catch (e) {
    res.status(401).json({ message: 'Token is not valid' });
  }
}

export default checkToken