import { changePasswordSchema, editUserSchema } from "../schema/user.js"

const editUserValidate = (req, res, next) => {
  const {error} = editUserSchema.validate(req.body)
  if (error) { 
    return res.status(400).json(error.details[0].message)
  } else { 
    next()
  }
}

const changePassportValidate = (req,res, next) => { 
  const {error} = changePasswordSchema.validate(req.body)
  if (error) { 
    return res.status(400).json(error.details[0].message)
  } else{ 
    next() 
  }
}

export {
  editUserValidate,
  changePassportValidate
}