import { Router } from "express";

import { sendEmail } from "../controllers/mail.js";

const emailRouter = Router()


emailRouter.post("/send-test", sendEmail)

export default emailRouter