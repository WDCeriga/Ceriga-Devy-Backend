import { Router } from "express";

import { addColorToProduct, addColorVariantToProduct, addProductToColors, getColorsByProduct } from "../controllers/colors.js";

const colorsRouter = Router()

colorsRouter.get("/by-product", getColorsByProduct)
colorsRouter.post("/add-product", addProductToColors)
colorsRouter.put("/add-color", addColorToProduct)
colorsRouter.put("/add-color-variant", addColorVariantToProduct)


export default colorsRouter
