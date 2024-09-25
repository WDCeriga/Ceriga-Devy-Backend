import Product from "../models/product.js"

export const productCreate = async (req, res) => {
  const newProduct = new Product({
    name: req.body.name,
    description: req.body.description,
    categories: req.body.categories,
    moq: req.body.moq,
    startingPrice: req.body.startingPrice,
    fabric: req.body.fabric,
    colorOptions: req.body.colorOptions,
    additionalColorCost: req.body.additionalColorCost,
    dyeStyles: req.body.dyeStyles,
    fits: req.body.fits,
    origin: req.body.origin,
    leadTime: req.body.leadTime,
    labelOptions: req.body.labelOptions,
    labelMaterials: req.body.labelMaterials,
    stitchingOptions: req.body.stitchingOptions,
    fadingOptions: req.body.fadingOptions,
  })
  try {
    await newProduct.save()
    res.status(200).json({
      message: `New product saved ${newProduct._id}`
    })
  } catch (e) {
    res.status(500).json(e)
  }
  res.status(200).json()
}

export const productGetList = async (req, res) => {
  try {
    const productList = await Product.find({}, { name: 1, images: 1, categories: 1, fits: 1 }).lean()
    if (productList) {
      res.status(200).json(productList)
    } else {
      res.status(404).json({
        message: "Error"
      })
    }
  } catch (e) {
    res.status(500).json(e)
  }
}

export const productGetItem = async (req, res) => {
  const { id } = req.params
  try {
    const candidate = await Product.findById(id).lean()
    if (candidate) {
      res.status(200).json(candidate)
    } else {
      res.status(404).json({
        message: "Product not found"
      })
    }
  } catch (e) {
    res.status(500).json(e)
  }
}