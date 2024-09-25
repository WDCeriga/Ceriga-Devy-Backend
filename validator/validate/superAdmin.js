import { deleteUserSchema, inviteSuperAdminSchema } from "../schema/superAdmin.js"

const inviteSuperAdminValidate = (req, res, next) => {
  const { error } = inviteSuperAdminSchema.validate(req.body)
  if (error) {
    return res.status(400).json(error.details[0].message)
  } else {
    next()
  }
}

const deleteUserValidate = (req, res, next) => {
  const {error} = deleteUserSchema.validate(req.params)
  if (error) { 
    return res.status(400).json(error.details[0].message)
  } else { 
    next()
  }
}

export {
  inviteSuperAdminValidate,
  deleteUserValidate
}