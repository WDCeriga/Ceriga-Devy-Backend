import { Schema, model } from "mongoose";

const NotificationSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  product: {
    type: String,
  },
  orderId: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  text: {
    type: String,
    required: true
  }
})

export default model("notification", NotificationSchema)