import { Schema, model } from "mongoose";

const QuantitySchema = {
  name: { type: String, required: true },
  value: { type: Number, required: true, default: 0 },
};

const MaterialSchema = {
  name: { type: String, default: null },
  value: { type: String, default: null },
};

const PrintingSchema = {
  type: String,
  default: "",
  enum: [
    "Direct to Film",
    "Dye Sublimation",
    "Embroidery",
    "Plastisol Transfers",
    "Screen Printing",
    ""
  ]
}

const StitchingSchema = {
  type: { type: String, default: 'Standard' },
  description: { type: String, default: '' },
};

const FadingSchema = {
  type: { type: String, default: 'All-over fade' },
};

const NeckAdditionalSchema = {
  color: { type: String, default: '#272626' },
  material: { type: String, default: 'Woven' },
};

const NeckSchema = {
  noLabels: { type: Boolean, default: false },
  type: { type: String, default: '45x45' },
  additional: NeckAdditionalSchema,
};

const PackageSchema = {
  isPackage: { type: Boolean, default: false },
  description: { type: String, default: '' },
};


const DeliverySchema = {
  companyName: { type: String, default: "" },
  addressLine: { type: String, default: "" },
  zipCode: { type: String, default: "" },
  taxNumber: { type: String, default: "" },
  bolNumber: { type: String, default: "" },
  city: { type: String, default: "" },
  state: { type: String, default: "" },
  country: {
    code: { type: String, default: "" },
    name: { type: String, default: "" },
  },
  sameAsBilling: { type: Boolean, default: false },
  name: { type: String, default: "" },
  phoneNumber: { type: String, default: "" },
  email: { type: String, default: "" },
};

const TableSizeItemSchema = {
  param: { type: String, required: true },
  value: { type: Number, required: true },
};

const TableSizeRowSchema = {
  name: { type: String, required: true },
  char: { type: String, required: true },
  list: { type: [TableSizeItemSchema], required: true },
};

export const DraftSchema = new Schema({
  userId: { type: String },
  name: { type: String, default: null },
  orderStep: { type: String, default: null },
  productType: { type: String, default: null },
  dyeStyle: { type: String, default: null },
  color: {
    hex: { type: String, default: null },
    path: { type: String, default: null },
    description: { type: String, default: "" }
  },
  material: MaterialSchema,
  printing: PrintingSchema,
  stitching: StitchingSchema,
  fading: FadingSchema,
  neck: NeckSchema,
  package: PackageSchema,
  quantity: {
    type: {
      type: String, default: 'Sample Selection'
    },
    list: {
      type: Array,
      default: [
        { name: 'XXS', value: 0 },
        { name: 'XS', value: 0 },
        { name: 'S', value: 0 },
        { name: 'M', value: 0 },
        { name: 'L', value: 0 },
        { name: 'XL', value: 0 },
        { name: 'XXL', value: 0 },
      ]
    }
  },
  delivery: DeliverySchema,
  designUploads: {
    type: [String],
    default: []
  },
  labelUploads: {
    type: [String],
    default: []
  },
  neckUploads: {
    type: [String],
    default: []
  },
  neckDescription: {
    type: String,
    default: ""
  },
  packageUploads: {
    type: [String],
    default: []
  },
  createAt: {
    type: Date,
    default: new Date()
  },
  cost: {
    type: Number,
    default: 0
  },
  moq: {
    type: Number,
    default: 0,
  },
  manufacturer: {
    type: String,
    default: "Not assigned"
  },
  subtotal: { type: Number, default: 0 },
  shipping: {
    type: Number,
    default: 0,
  },
  tableSize: {
    type: [TableSizeRowSchema],
    default: [],
  },
  tableType: {
    type: String || null,
    default: null,
  },
  status: {
    type: String,
    enum: [
      "Draft",
      "Requires action",
      "Submitted",
      "Priced",
      "Accepted",
      "Processing",
      "Shipping",
      "Completed"
    ],
    default: "Draft",
  },
  invoice: {
    status: {
      type: String,
      default: "not created"
    },
    unitCost: { type: String },
    colourCost: { type: String },
    packagingCost: { type: String },
    shippingCost: { type: String },
    totalPrice: { type: String }
  }

});

export default model('Draft', DraftSchema);