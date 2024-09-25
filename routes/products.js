import { Router } from "express";

import { productCreate, productGetItem, productGetList } from "../controllers/products.js";
import checkSuperAdminRole from "../middleware/checkSuperAdmin.js";
import checkToken from "../middleware/checkToken.js";

const authMiddleware = [checkToken, checkSuperAdminRole]
const productsRouter = Router()

productsRouter.get("/list", productGetList)
productsRouter.get("/:id", productGetItem)


productsRouter.post("/create", authMiddleware, productCreate)

export default productsRouter