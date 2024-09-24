import { model, Schema } from "mongoose"

const ForgotPassSchema = new Schema({
  email: {
    type: String,
  },
  code: {
    type: String
  },
  first_name: { 
    type: String
  },
  userId: {
    type: String
  },
})

export default model("forgot-password", ForgotPassSchema)