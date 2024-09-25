import Joi from "@hapi/joi";

const editUserSchema = Joi.object({
  company: Joi.string().required(),
  email: Joi.string().email().required(),
  address: Joi.string().required()
})

const changePasswordSchema = Joi.object({
  password: Joi.string().required(),
  newPassword: Joi.string().required()
})

export {
  editUserSchema,
  changePasswordSchema
}