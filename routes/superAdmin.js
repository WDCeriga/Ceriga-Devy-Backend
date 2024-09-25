import {
  deleteUserValidate,
  inviteSuperAdminValidate
} from "../validator/validate/superAdmin.js";
import {
  changeManufacturerInAdmin,
  deleteUser,
  getAnalyticsForOrderAmounts,
  getAnalyticsForOrders,
  getAnalyticsForUsers,
  getCountUsers,
  getUsers,
  getUsersEmails,
  promoteToAdmin,
} from "../controllers/superAdmin.js";
import { Router } from "express";

import checkSuperAdminRole from "../middleware/checkSuperAdmin.js";
import checkToken from "../middleware/checkToken.js";

const router = Router()

const authMiddleware = [checkToken, checkSuperAdminRole]

router.get("/users/count", authMiddleware, getCountUsers)
router.get("/users", authMiddleware, getUsers)

router.get("/users-emails", authMiddleware, getUsersEmails)

router.put('/change-manufacturer', authMiddleware, changeManufacturerInAdmin)

router.post("/invite", authMiddleware, inviteSuperAdminValidate, promoteToAdmin)

router.delete("/user/:email", authMiddleware, deleteUserValidate, deleteUser)



//analytics

router.get("/analytics-for-user", authMiddleware, getAnalyticsForUsers)
router.get("/analytics-for-orders", authMiddleware, getAnalyticsForOrders)
router.get("/analytics-for-amounts", authMiddleware, getAnalyticsForOrderAmounts)

export default router