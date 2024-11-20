import { model, Schema } from "mongoose";

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/.+@.+\..+/, "Please enter a valid email address"]
  },
  phone: {
    type: String,
  },
  password: {
    type: String,
  },
  refresh_token: {
    type: String
  },
  dateCreated: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  company: {
    type: String
  },
  address: {
    type: String
  },
  photo: {
    type: String
  },
  googleAuth: {
    type: String
  },
  facebookAuth: {
    type: String
  },
  role: {
    type: String,
    default: "user"
  },
  manufacturer: {
    type: String,
    default: "None"
  },
  delivery: {
    sameAsBilling: {
      type: Boolean,
      default: false
    },
    companyName: {
      type: String
    },
    addressLine: {
      type: String
    },
    zipCode: {
      type: String
    },
    taxNumber: {
      type: String
    },
    bolNumber: {
      type: String
    },
    city: {
      type: String
    },
    state: {
      type: String
    },
    country: {
      code: {
        type: String,
      },
      name: {
        type: String,
      }
    },
    name: {
      type: String
    },
    phoneNumber: {
      type: String
    },
    email: {
      type: String
    }
  }
});

export default model("User", UserSchema);