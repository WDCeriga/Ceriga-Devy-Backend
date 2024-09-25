import jwt from "jsonwebtoken"

import config from "../config.js"

const generateToken = (id, time) => (
  jwt.sign({ id }, config.jwtSecret, {
    expiresIn: time
  })
)

export default generateToken