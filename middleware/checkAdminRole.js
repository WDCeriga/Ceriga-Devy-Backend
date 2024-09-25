import User from "../models/user.js"

const checkAdminRole = async (req, res, next) => {
  try{ 
    const candidate = await User.findById(req.id, {role: 1}).lean()
    if (candidate && candidate.role === "admin"){ 
      next()
    } else { 
      return res.status(401).json({
        message: "You don't have permission"
      })
    }
  } catch (e){ 
   res.status(500).json(e)
  }
 }

 

 export default checkAdminRole