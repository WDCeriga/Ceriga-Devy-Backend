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
  getProductsForPrice,
  getUsers,
  getUsersEmails,
  promoteToAdmin,
  saveNewPriceForProduct
} from "../controllers/superAdmin.js";
import { Router } from "express";

import checkSuperAdminRole from "../middleware/checkSuperAdmin.js";
import checkToken from "../middleware/checkToken.js";

const router = Router()

const authMiddleware = [checkToken, checkSuperAdminRole]

router.get("/users/count", authMiddleware, getCountUsers)
router.get("/users", authMiddleware, getUsers)

router.get("/products-for-price", authMiddleware, getProductsForPrice)

router.get("/users-emails", authMiddleware, getUsersEmails)

router.put('/change-manufacturer', authMiddleware, changeManufacturerInAdmin)

router.post("/invite", authMiddleware, inviteSuperAdminValidate, promoteToAdmin)
router.post("/save-new-price", authMiddleware, saveNewPriceForProduct)

router.delete("/user/:email", authMiddleware, deleteUserValidate, deleteUser)





//analytics

router.get("/analytics-for-user", authMiddleware, getAnalyticsForUsers)
router.get("/analytics-for-orders", authMiddleware, getAnalyticsForOrders)
router.get("/analytics-for-amounts", authMiddleware, getAnalyticsForOrderAmounts)

export default router