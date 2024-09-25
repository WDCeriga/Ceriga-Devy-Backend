import Joi from '@hapi/joi';

const getStatusSchema = Joi.object({
  userId: Joi.string().required()
})

const changeUserRole = Joi.object({
  email: Joi.string().email().required(),
  newRole: Joi.string().required()
})

export { 
  getStatusSchema,
  changeUserRole
}