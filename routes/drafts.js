import {
  continueOrder,
  createDraft,
  deleteDraft,
  duplicateDraft,
  getDraftsList,
  getImagesDraft,
  setQuantity,
  updateDraft,
  uploadDesign,
  uploadLabel,
  uploadNeck,
  uploadPackage
} from "../controllers/drafts.js";
import { Router } from "express";
import multer from "multer";

import checkToken from "../middleware/checkToken.js";

const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
})

const upload = multer({ storage });

const draftsRouter = Router()

draftsRouter.get("/list", checkToken, getDraftsList)
draftsRouter.get("/continue-order", checkToken, continueOrder)

draftsRouter.post("/duplicate", checkToken, duplicateDraft)
draftsRouter.post("/create", checkToken, createDraft)
draftsRouter.post("/update", checkToken, updateDraft)

draftsRouter.delete("/delete", checkToken, deleteDraft)

draftsRouter.post("/upload-design", checkToken, upload.single('image'), uploadDesign);
draftsRouter.post("/upload-label", checkToken, upload.single("image"), uploadLabel)
draftsRouter.post("/upload-neck", checkToken, upload.single("image"), uploadNeck)
draftsRouter.post("/upload-package", checkToken, upload.single("image"), uploadPackage)

draftsRouter.get("/images", checkToken, getImagesDraft)

draftsRouter.get("/set-quantity", checkToken, setQuantity)



export default draftsRouter