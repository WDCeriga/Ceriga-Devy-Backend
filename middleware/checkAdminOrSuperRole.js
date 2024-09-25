import User from "../models/user.js"

const checkAdminOrdSuperAdminRole = async (req, res, next) => {
  try {
    const { role } = await User.findById(req.id, { role: 1 }).lean()
    if (role === "superAdmin" || role === "admin") {
      next()
    } else {
      return res.status(401).json({
        message: "You don't have permission"
      })
    }
  } catch (e) {
    res.status(500).json({
      message: e
    })
  }
}

export default checkAdminOrdSuperAdminRole