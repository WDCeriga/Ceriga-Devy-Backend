import { model, Schema } from "mongoose";

const ColorsSchema = new Schema({
  product: {
    type: String,
    require: true,
  },
  list: [
    {
      color: {
        type: String,
      },
      types: [
        {
          name: {
            type: String,
          },
          path: {
            type: String,
          },
          hexValue: {
            type: String,
          }
        }
      ]
    }
  ]
})

export default model("colors", ColorsSchema)