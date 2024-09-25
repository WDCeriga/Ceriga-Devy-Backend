import { Router } from "express";

import { createTestNotification, deleteNotification, getListNotification, sendNotification } from "../controllers/notification.js";
import checkSuperAdminRole from "../middleware/checkSuperAdmin.js";
import checkToken from "../middleware/checkToken.js";

const notificationRouter = Router()

notificationRouter.post("/create-item-test", checkToken, createTestNotification)

notificationRouter.post("/send", checkToken, checkSuperAdminRole, sendNotification)

notificationRouter.get("/list", checkToken, getListNotification)

notificationRouter.delete("/delete-item", checkToken, deleteNotification)

export default notificationRouter