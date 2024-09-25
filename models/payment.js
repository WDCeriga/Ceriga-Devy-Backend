import { model, Schema } from "mongoose";

const PaymentSchema = new Schema({
  transactionCode: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  orderId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["success", "cancel", "pending"],
    required: true,
    default: "pending"
  },
  price: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default model("payment", PaymentSchema)