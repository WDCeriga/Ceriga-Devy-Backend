import { Schema, model } from "mongoose";

const ProductSchema = new Schema({
  name: { type: String, required: true },
  variations: [{
    type: { type: String, required: true },
    startingPrice: { type: Number, required: true },
    moq: { type: Number, required: true, default: 50 },
    fabricOptions: [{
      fabric: { type: String, required: true },
      additionalCost: { type: Number, default: 0 },
    }],
    colorOptions: {
      maxColors: { type: Number, default: 3 },
      extraColorCost: { type: Number, default: 1 },
    },
    dyeStyles: [{
      style: { type: String, required: true },
      additionalCost: { type: Number, required: true }
    }],
    fitOptions: [{ type: String, required: true }],
    origin: { type: String, required: true, default: "made in Portugal" },
    leadTime: { type: String, required: true },
    labelOptions: {
      noLabel: { type: Number, default: 0 },
      customLabel: { type: Number, default: 1 },
      labelMaterials: [{
        material: { type: String, required: true },
        additionalCost: { type: Number, default: 0 }
      }]
    },
    stitchingOptions: [{
      stitching: { type: String, required: true },
      additionalCost: { type: Number, required: true }
    }],
    fadingOptions: [{
      fading: { type: String, required: true },
      additionalCost: { type: Number, required: true }
    }]
  }]
});


export default model("Products", ProductSchema)