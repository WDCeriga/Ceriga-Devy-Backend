import { Schema, model } from "mongoose";

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  categories: [{ type: String }], 
  moq: { type: Number, required: true }, 
  startingPrice: { type: Number, required: true },
  fabric: [
    {
      type: { type: String, required: true },
      cost: { type: Number, required: true },
      availableColors: [{ type: String }],
    }
  ],
  colorOptions: { type: Number, default: 3 },
  additionalColorCost: { type: Number, default: 1 }, 
  dyeStyles: [
    {
      type: { type: String, required: true },
      cost: { type: Number, required: true }
    }
  ],
  fits: [{ type: String }],
  origin: { type: String, default: "Made in Portugal" },
  leadTime: { type: String, required: true }, 
  labelOptions: [
    {
      type: { type: String, required: true },
      cost: { type: Number, default: 0 }
    }
  ],
  labelMaterials: [
    {
      type: { type: String, required: true },
      cost: { type: Number, required: true }
    }
  ],
  stitchingOptions: [
    {
      type: { type: String, required: true },
      cost: { type: Number, required: true }
    }
  ],
  fadingOptions: [
    {
      type: { type: String, required: true },
      cost: { type: Number, required: true }
    }
  ],
  images: [{ type: String }], 
  createdAt: { type: Date, default: Date.now },
});


export default model("Products", ProductSchema)