import User from "../models/user.js"
import { getMatchPassword, hashPassword } from "../services/password.js"

const getInfoSetting = async (req, res) => {
  try {
    const candidate = await User.findById(req.id, { company: 1, email: 1, address: 1 }).lean()
    res.status(200).json({
      company: candidate.company || "",
      email: candidate.email,
      address: candidate.address || ""
    })
  } catch (e) {
    res.status(500).json(e)
  }
}

const editUser = async (req, res) => {
  const { company, email, address } = req.body
  try {
    const candidate = await User.findOne({ email }, { email: 1 }).lean()
    if (candidate) {
      return res.status(500).json({ message: "User already register" })
    } else {
      await User.findByIdAndUpdate(req.id, {
        company: company,
        email: email,
        address: address
      })
      res.status(200).json({
        message: "User has been change"
      })
    }
  } catch (e) {
    res.status(500).json(e)
  }
}

const changeUserPassword = async (req, res) => {
  const { password, newPassword } = req.body
  try {
    const candidate = await User.findById(req.id, { password: 1 }).lean()
    if (candidate) {
      const confirmPassword = await getMatchPassword(password, candidate.password)
      if (confirmPassword) {
        const hashedPassword = await hashPassword(newPassword)
        await User.findByIdAndUpdate(req.id, { password: hashedPassword })
        res.status(200).json({ message: "Password updated" })
      } else {
        res.status(400).json({ message: "Password incorrect" })
      }
    } else {
      res.status(404).json({ message: "User not found" })
    }
  } catch (e) {
    res.status(500).json(e)
  }
}

const uploadProfilePhoto = async (req, res) => {
  const usersId = req.id
  try {
    const candidate = await User.findById(usersId, { _id: 1 }).lean()
    if (candidate) {
      await User.findByIdAndUpdate(usersId, { photo: req.file.filename })
      res.status(200).json(req.file.filename)
    } else {
      res.status(404).json({ message: "User not found" })
    }
  } catch (e) {
    res.status(500).json(e)
  }
}

const saveDeliveryInfo = async (req, res) => {
  const { delivery } = req.body
  const id = req.id
  try {
    const user = await User.findById(id, { _id: 1 }).lean()
    if (user) {
      await User.findByIdAndUpdate(id, { delivery })
      res.status(200).json({ message: "Delivery information updated" })
    } else {
      res.status(404).json({ message: "User not found" })
    }
  } catch (e) {
    res.status(500).json(e)
  }
}

const getDeliveryInfo = async (req, res) => {
  const id = req.id
  try {
    const user = await User.findById(id, { delivery: 1 }).lean()
    if (user) {
      res.status(200).json(user.delivery || null)
    } else {
      res.status(404).json({ message: "User not found" })
    }
  } catch (e) {
    res.status(500).json(e)
  }
}

export {
  getInfoSetting,
  editUser,
  changeUserPassword,
  uploadProfilePhoto,
  saveDeliveryInfo,
  getDeliveryInfo
}