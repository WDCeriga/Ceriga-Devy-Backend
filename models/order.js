import { model } from "mongoose";

import { DraftSchema } from "./draft.js";

const OrderSchema = DraftSchema.add({
  orderId: {
    type: String,
    default: ""
  },
  tracking: {
    type: String,
    default: "none"
  },
  trackingUrl: {
    type: String,
    default: ""
  },
  carriers: {
    type: String,
    default: ""
  },
  paymentId: {
    type: String,
    default: ""
  },
  updateStatusDate: {
    type: Date
  }

});

export default model("orders", OrderSchema);

