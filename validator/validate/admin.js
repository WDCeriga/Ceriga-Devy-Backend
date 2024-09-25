import { changeUserRole, getStatusSchema } from "../schema/admin.js"

const getStatusValidate = (req, res, next) => {
  const { error } = getStatusSchema.validate(req.body)
  if (error) {
    return res.status(400).json(error.details[0].message);
  }
  next()
}

const changeUserRoleValidate = (req,res,next) => { 
  const {error} = changeUserRole.validate(req.body)
  if (error) { 
    return res.status(400).json(error.details[0].message)
  } 
  next()
}



export {
  getStatusValidate,
  changeUserRoleValidate
}