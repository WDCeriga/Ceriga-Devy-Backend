import {
  getStatusValidate,
  changeUserRoleValidate
} from "../validator/validate/admin.js";
import { Router } from "express";

import { changeUserRole, checkStatus, sendAdminInviteByEmail } from "../controllers/admin.js";
import checkAdminRole from "../middleware/checkAdminRole.js";
import checkToken from "../middleware/checkToken.js";

const router = Router()

const authMiddleware = [checkToken, checkAdminRole];

router.post("/check-status", authMiddleware, getStatusValidate, checkStatus);
router.put("/change-role-user", authMiddleware, changeUserRoleValidate, changeUserRole);

router.post("/invite-by-email", authMiddleware, sendAdminInviteByEmail);

export default router