import { Schema, model } from "mongoose";

const SocialAuthSchema = new Schema({
  id:{ 
    type: String,
    required: true
  }, 
  token: { 
    type: String, 
    require: true 
  },
  refreshToken: {
    type: String, 
    required: true
  }
})


export default model("social-auth", SocialAuthSchema)