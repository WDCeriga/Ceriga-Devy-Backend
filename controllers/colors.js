import Colors from "../models/colors.js"

export const getColorsByProduct = async (req, res) => {
  const { product } = req.query
  try {
    const candidate = await Colors.findOne({ product }).lean()
    if (!candidate) {
      return res.status(404).json({ message: `Product ${product} not found` })
    }
    res.status(200).json(candidate)
  } catch (err) {
    res.status(500).json(err)
  }
}

export const addProductToColors = async (req, res) => {
  const { product } = req.body
  if (!product) {
    return res.status(400).json({ message: "Product not found" })
  }
  try {
    const newProductColor = new Colors({ product })
    await newProductColor.save()
    res.status(200).json({ message: "Product saved successfully" })
  } catch (e) {
    res.status(500).json(e)
  }
}

export const addColorToProduct = async (req, res) => {
  const { product, newColor } = req.body
  if (!product || !newColor) {
    return res.status(400).json({ message: "Product or color not found" })
  }
  try {
    const productCandidate = await Colors.findOne({ product }, { _id: 1 }).lean()
    if (productCandidate) {
      await Colors.findOneAndUpdate({ product }, { $push: { list: { color: newColor } } })
      res.status(200).json({ message: "Color added successfully" })
    } else {
      res.status(404).json({ message: "Product not found" })
    }
  } catch (err) {
    res.status(500).json(err)
  }
}

export const addColorVariantToProduct = async (req, res) => {
  const { product, color, variantName, path, hexValue } = req.body;
  if (!product || !color || !variantName || !path || !hexValue) {
    return res.status(400).json({ message: "Product, color, variant name, path, and hex value not found" });
  }
  try {
    const colorCandidate = await Colors.findOne({ product }).lean();
    if (!colorCandidate) {
      return res.status(404).json({ message: "Product not found" });
    }
    const colorIndex = colorCandidate.list.findIndex(item => item.color === color);
    if (colorIndex !== -1) {
      const variantIndex = colorCandidate.list[colorIndex].types.findIndex(variant => variant.name === variantName);
      if (variantIndex !== -1) {
        colorCandidate.list[colorIndex].types[variantIndex] = { name: variantName, path, hexValue };
      } else {
        colorCandidate.list[colorIndex].types.push({ name: variantName, path, hexValue });
      }
    } else {
      colorCandidate.list.push({
        color,
        types: [{ name: variantName, path, hexValue }]
      });
    }
    await Colors.updateOne({ product }, { list: colorCandidate.list });
    return res.status(200).json({ message: "Color variant added/updated successfully", ...req.body });
  } catch (e) {
    console.log(e)
    return res.status(500).json({ message: "Error updating product", error: e });
  }
};