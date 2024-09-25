import { nanoid } from "nanoid"

import Notification from "../models/notification.js"
import User from "../models/user.js"

const createTestNotification = async (req, res) => {
  const tempNote = {
    title: "Test notification",
    product: "hoodie",
    orderId: nanoid(5),
    text: "Welcome to notification"
  }
  try {
    const newNotification = new Notification({
      userId: req.id,
      ...tempNote
    })
    await newNotification.save()
    res.status(200).json(newNotification)
  } catch (e) {
    res.status(500).json(e)
  }
}

const sendNotification = async (req, res) => {
  const { email, message } = req.body
  console.log(email)
  try {
    const user = await User.findOne({ email: email }, { userId: 1 }).lean()
    if (user) {
      const newNotification = new Notification({ title: 'New Notification', message, text: message, userId: user._id, })
      await newNotification.save()
      res.status(200).json(newNotification)
    } else {
      res.status(404).json({ message: "User not found" })
    }
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: "Error getting" })
  }
}

const getListNotification = async (req, res) => {
  try {
    const listNotification = await Notification.find({ userId: req.id }).lean()
    if (listNotification) {
      res.status(200).json(listNotification.map(item => ({ ...item, id: item._id })))
    } else {
      res.status(404).json({
        message: "Notifications not found"
      })
    }
  } catch (e) {
    res.status(500).json(e)
  }
}

const deleteNotification = async (req, res) => {
  const { notificationId } = req.query
  try {
    const candidate = await Notification.findById(notificationId, { userId: 1 }).lean()
    if (candidate) {
      if (candidate.userId === req.id) {
        await Notification.findByIdAndDelete(notificationId)
        res.status(200).json(notificationId)
      } else {
        res.status(403).json({ message: "Error" })
      }
    } else {
      res.status(404).json({ message: "Notification not found" })
    }
  } catch (e) {
    res.status(500).json(e)
  }
}

export {
  createTestNotification,
  getListNotification,
  deleteNotification,
  sendNotification
}