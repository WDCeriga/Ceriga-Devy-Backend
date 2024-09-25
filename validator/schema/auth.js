import Joi from "@hapi/joi";

const signInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
})

const signUpSchema = Joi.object({
  privacyConfirm: Joi.bool().valid(true),
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().length(9).required(),
  password: Joi.string().min(8).required()
})

const refreshTokenSchema = Joi.object({
  refresh: Joi.string().required()
})

const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required()
})

const checkForgotLinkSchema = Joi.object({
  code: Joi.string().required()
})

const changePasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(8).required()
})

const getTokenSchema = Joi.object({
  id: Joi.string().required()
})

export {
  signInSchema,
  signUpSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  checkForgotLinkSchema,
  changePasswordSchema,
  getTokenSchema
}