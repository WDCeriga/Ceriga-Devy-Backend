import { Router } from "express";
import multer from "multer";

import { changePassportValidate, editUserValidate } from "../validator/validate/user.js";
import { changeUserPassword, editUser, getDeliveryInfo, getInfoSetting, saveDeliveryInfo, uploadProfilePhoto } from "../controllers/user.js";
import checkToken from "../middleware/checkToken.js";

const storage = multer.diskStorage({
  destination: './public/uploads/profile/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
})

const upload = multer({ storage });

const userRouter = Router()

userRouter.get("/info-setting", checkToken, getInfoSetting)
userRouter.get("/get-delivery", checkToken, getDeliveryInfo)

userRouter.put("/edit", checkToken, editUserValidate, editUser)
userRouter.put("/change-password", checkToken, changePassportValidate, changeUserPassword)

userRouter.post("/save-delivery", checkToken, saveDeliveryInfo)

userRouter.post("/upload-profile", checkToken, upload.single("image"), uploadProfilePhoto)

export default userRouter