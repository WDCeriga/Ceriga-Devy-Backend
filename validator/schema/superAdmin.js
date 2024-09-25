
import Joi from '@hapi/joi';

const inviteSuperAdminSchema = Joi.object({
  email: Joi.string().email().required()
})

const deleteUserSchema = Joi.object({
  email: Joi.string().required()
})

export {
  inviteSuperAdminSchema,
  deleteUserSchema
}