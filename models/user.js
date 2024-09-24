import { model, Schema } from "mongoose"
const UserSchema = new Schema({
  name: {
    type: String
  },
  last_name: {
    type: String
  },
  email: {
    type: String
  },
  phone: {
    type: String
  },
  password: {
    type: String
  },
  refresh_token: {
    type: String
  },
  dateCreated: {
    type: Date,
    default: Date.now()
  },
  company: {
    type: String
  },
  photo: {
    type: String
  },
  googleAuth: {
    type:String
  }
})


export default model("users", UserSchema)
