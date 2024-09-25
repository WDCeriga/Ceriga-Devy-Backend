import Draft from "../models/draft.js"
import Product from "../models/product.js"
import setBasePrice from "../services/setPrice.js"

const getDraftsList = async (req, res) => {
  try {
    const draftsList = await Draft.find(
      { userId: req.id },
      { name: 1, productType: 1, createAt: 1, color: 1 }
    ).lean()
    if (draftsList) {
      res.status(200).json(draftsList)
    } else {
      res.status(404).json({
        message: "Drafts not found"
      })
    }
  } catch (e) {
    res.status(500).json(e)
  }
}



const createDraft = async (req, res) => {
  const { draft } = req.body

  try {
    const newDraft = new Draft({ ...draft, userId: req.id, createdAt: new Date(), status: "Draft" })
    if (draft.productType !== null) { await newDraft.save() }
    const product = await Product.findOne({ name: draft.productType }, { moq: 1 }).lean()
    res.status(200).json({ id: newDraft._id, moq: product.moq || 50 })
  } catch (e) {
    console.log(e)
    res.status(500).json(e)
  }
}

const updateDraft = async (req, res) => {
  const { draft } = req.body
  try {
    const currentDraft = await Draft.findById(draft.draftId).lean()
    if (currentDraft) {
      const product = await Product.findOne({ name: draft.productType }, { startingPrice: 1 }).lean()
      const subtotal = setBasePrice(currentDraft, product.startingPrice)
      await Draft.findByIdAndUpdate(
        draft.draftId,
        {
          ...draft,
          subtotal,
          createdAt: new Date()
        },
        { new: true }
      )
      res.status(200).json({
        message: "Draft updated",
        subtotal
      })
    } else {
      res.status(404).json({
        message: "Not found"
      })
    }
  } catch (e) {
    console.log(e)
    res.status(500).json(e)
  }
}

const duplicateDraft = async (req, res) => {
  const { draftId } = req.query
  try {
    const draftInfo = await Draft.findById(draftId).lean()
    if (draftInfo) {
      const { _id, ...draftData } = draftInfo;
      const newDraft = new Draft({ ...draftData })
      await newDraft.save()
      res.status(200).json(newDraft)
    } else {
      res.status(404).json({
        message: "Draft not found"
      })
    }
  } catch (e) {
    res.statu(500).json(e)
  }
}

const deleteDraft = async (req, res) => {
  const { draftId } = req.query;
  try {
    const candidate = await Draft.findById(draftId, { _id: 1, designUploads: 1, labelUploads: 1, neckUploads: 1 }).lean();
    if (candidate) {
      await Draft.findByIdAndDelete(draftId);
      const directoryPath = path.join(__dirname, '/public/uploads');
      const deleteFiles = (fileNames) => {
        fileNames.forEach(fileName => {
          const filePath = path.join(directoryPath, fileName);
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error(`Error deleting file ${filePath}:`, err);
            } else {
              console.log(`Successfully deleted ${filePath}`);
            }
          });
        });
      };
      deleteFiles(candidate.designUploads);
      deleteFiles(candidate.labelUploads);
      deleteFiles(candidate.neckUploads);
      res.status(200).json(draftId);
    } else {
      res.status(404).json({ message: "Draft not found" });
    }
  } catch (e) {
    res.status(500).json(e);
  }
};

const continueOrder = async (req, res) => {
  const { draftId } = req.query
  try {
    const candidate = await Draft.findById(draftId).lean()
    res.status(200).json({ ...candidate, draftId })
  } catch (e) {
    res.status(500).json(e)
  }
}

const uploadDesign = async (req, res) => {
  const draftId = req.query.draftId
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    await Draft.findByIdAndUpdate(
      draftId,
      { $push: { designUploads: req.file.filename } },
      { new: true }
    );

    res.status(200).json({ message: 'File uploaded successfully', file: req.file, });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const uploadLabel = async (req, res) => {
  const draftId = req.query.draftId
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    await Draft.findByIdAndUpdate(
      draftId,
      { $push: { labelUploads: req.file.filename } },
      { new: true }
    );

    res.status(200).json({ message: 'File uploaded successfully', file: req.file, });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const uploadNeck = async (req, res) => {
  const draftId = req.query.draftId
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    await Draft.findByIdAndUpdate(
      draftId,
      { $push: { neckUploads: req.file.filename } },
      { new: true }
    );

    res.status(200).json({ message: 'File uploaded successfully', file: req.file, });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const uploadPackage = async (req, res) => {
  const draftId = req.query.draftId
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    await Draft.findByIdAndUpdate(
      draftId,
      { $push: { packageUploads: req.file.filename } },
      { new: true }
    );

    res.status(200).json({ message: 'File uploaded successfully', file: req.file, });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const getImagesDraft = async (req, res) => {
  const { draftId, type } = req.query;
  console.log(req.query);

  try {
    const draftCandidate = await Draft.findById(draftId).lean();
    if (draftCandidate) {
      res.status(200).json(draftCandidate[type])
    } else {
      res.status(404).json({ message: "Draft not found" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "An error occurred while fetching the draft.", error: e.message });
  }
};

const setQuantity = async (req, res) => {
  const { draftId } = req.query
  try {
    const draft = await Draft.findById(draftId).lean()
    if (draft) {
      const product = await Product.findOne({ name: draft.productType }).lean()
      let cost = product.startingPrice

      res.status(200).json({ cost })
    } else {
      res.status(404).json({ message: "Draft not found" });
    }
  } catch (e) {
    res.status(500).json({ message: "An error occurred while", error: e.message });
  }
}

export {
  getDraftsList,
  createDraft,
  updateDraft,
  duplicateDraft,
  deleteDraft,
  continueOrder,
  uploadDesign,
  uploadLabel,
  uploadNeck,
  getImagesDraft,
  setQuantity,
  uploadPackage
}