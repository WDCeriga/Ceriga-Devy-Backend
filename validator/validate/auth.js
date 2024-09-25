import { changePasswordSchema, checkForgotLinkSchema, forgotPasswordSchema, getTokenSchema, refreshTokenSchema, signInSchema, signUpSchema } from "../schema/auth.js"

const signInValidate = (req, res, next) => {
  const { error } = signInSchema.validate(req.body)
  if (error) {
    return res.status(400).json(error.details[0].message)
  } else {
    next()
  }
}

const signUpValidate = (req, res, next) => {
  const { error } = signUpSchema.validate(req.body)
  if (error) {
    console.log(error.details[0].message)
    return res.status(400).json(error.details[0].message)
  } else {
    next()
  }
}

const refreshTokenValidate = (req, res, next) => {
  const { error } = refreshTokenSchema.validate(req.body)
  if (error) {
    return res.status(400).json(error.details[0].message)
  } else {
    next()
  }
}

const forgotPasswordValidate = (req, res, next) => {
  const { error } = forgotPasswordSchema(req.body)
  if (error) {
    return res.status(400).json(error.details[0].message)
  } else {
    next()
  }
}

const checkForgotLinkValidate = (req, res, next) => {
  const { error } = checkForgotLinkSchema(req.body)
  if (error) {
    return res.status(200).json(error.details[0].message)
  } else {
    next()
  }
}

const changePasswordValidate = (req, res, next) => {
  const { error } = changePasswordSchema.validate(req.body)
  if (error) {
    return res.status(400).json(error.details[0].message)
  } else {
    next()
  }
}

const getTokenValidate = (req, res, next) => {
  const {error} = getTokenSchema.validate(req.query)
  if (error) { 
    return res.status(400).json(error.details[0].message)
  } else {
    next()
  }
}

export {
  signInValidate,
  signUpValidate,
  refreshTokenValidate,
  forgotPasswordValidate,
  checkForgotLinkValidate,
  changePasswordValidate,
  getTokenValidate
}