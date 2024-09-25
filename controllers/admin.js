import User from "../models/user.js"

const checkStatus = async (req, res) => {
  const { userId } = req.body;
  try {
    const matchCandidate = await User.findById(userId, { role: 1, email: 1 }).lean();

    if (matchCandidate) {
      return res.status(200).json({
        message: `User with email: ${matchCandidate.email} (id: ${userId}) has role ${matchCandidate.role}`
      });
    } else {
      return res.status(404).json({
        message: "User not found"
      });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Internal server error",
      error: e.message
    });
  }
};

const changeUserRole = async (req, res) => {
  const { email, newRole } = req.body
  try {
    await User.findOneAndUpdate({ email }, { role: newRole })
    res.status(200).json({
      message: "User status has been update"
    })
  } catch (e) {
    res.status(500).json(e)
  }
}

const sendAdminInviteByEmail = async (req, res) => {
  const { email } = req.body;
  const { id } = req;

  try {
    const admin = await User.findById(id, { manufacturer: 1 }).lean();
    if (admin) {
      const user = await User.findOne({ email }, { _id: 1, manufacturer: 1, role: 1 }).lean();
      if (user && user.role === "user") {
        const updateFields = { role: "admin" };
        if (!user.manufacturer) {
          updateFields.manufacturer = admin.manufacturer;
        }
        await User.findOneAndUpdate({ email }, updateFields);
        res.status(200).json("User role has been changed and manufacturer added if missing");
      } else {
        res.status(404).json("User not found");
      }
    } else {
      res.status(404).json("Admin not found or invalid admin");
    }
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
};

export {
  checkStatus,
  changeUserRole,
  sendAdminInviteByEmail
}