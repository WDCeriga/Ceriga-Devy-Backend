import Order from "../models/order.js";
import User from "../models/user.js";

const promoteToAdmin = async (req, res) => {
  const { email } = req.body
  try {
    const user = await User.findOne({ email }, { _id: 1 }).lean()
    if (user) {
      await User.findOneAndUpdate({ email }, { role: "admin" })
      res.status(200).json("User role has been change")
    } else {
      res.status(404).json('User not found')
    }
  } catch (e) {
    console.error(e);
    res.status(500).json('Server error');
  }
}

const deleteUser = async (req, res) => {
  const { email } = req.params
  try {
    const user = await User.findOne({ email }, { _id: 1 }).lean()
    if (user) {
      await User.findOneAndDelete({ email })
      res.status(200).json("User deleted")
    } else {
      res.status(400).json("User not found")
    }
  } catch (e) {
    console.error(e)
    res.status(500).json('Server error')
  }
}

const getCountUsers = async (req, res) => {
  try {
    const currentUsers = (await User.find({ role: "user" }, { _id: 1 }).lean()).length
    res.status(200).json({
      countUsers: currentUsers
    })
  } catch (e) {
    console.error(e)
    res.status(500).json('Server error')
  }
}

// const getUsers = async (req, res) => {
//   try {
//     const usersList = await User.find({}, {
//       photo: 1,
//       name: 1,
//       last_name: 1,
//       company: 1,
//       email: 1,
//       role: 1,
//       manufacturer: 1,
//       lastActive: 1

//     }).lean()
//     res.status(200).json([...usersList])
//   } catch (e) {
//     console.error(e)
//     res.status(500).json('Server error')
//   }
// }
const getUsers = async (req, res) => {
  try {
    const usersList = await User.find({}, {
      photo: 1,
      name: 1,
      last_name: 1,
      company: 1,
      email: 1,
      role: 1,
      manufacturer: 1,
      lastActive: 1
    }).lean();

    const usersWithOrders = await Promise.all(usersList.map(async (user) => {
      const completedOrders = await Order.find({
        userId: user._id,
        status: 'Completed'
      }).lean();

     
      const amountOfOrders = completedOrders.reduce((total, order) => total + order.subtotal, 0);

      return {
        ...user,
        amountOfOrders
      };
    }));

    res.status(200).json(usersWithOrders);
  } catch (e) {
    console.error(e);
    res.status(500).json('Server error');
  }
};

const changeManufacturerInAdmin = async (req, res) => {
  const { id, manufacturer } = req.query
  try {
    const candidate = await User.findById(id, { _id: 1 }).lean()
    if (candidate) {
      await User.findByIdAndUpdate(id, { manufacturer })
      res.status(200).json({ id, manufacturer, message: "Manufacturer was updated successfully" })
    } else {
      res.status(404).json('User not found')
    }
  } catch (e) {
    res.status(500).json('Server error')
  }
}

const getAnalyticsForUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).lean();

    const orders = await Order.find().lean();
    const userIdsWithOrders = new Set(orders.map(order => order.userId.toString()));

    const activeUsers = users.filter(user => userIdsWithOrders.has(user._id.toString()));
    const totalActiveUsers = activeUsers.length;

    const now = new Date();
    const currentDayOfWeek = now.getDay();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - currentDayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);

    const usersThisWeek = users.filter(user => {
      const dateCreated = new Date(user.dateCreated);
      return dateCreated >= startOfWeek && dateCreated <= now;
    });

    const totalUsersThisWeek = usersThisWeek.length;

    res.status(200).json({
      totalUsers: users.length,
      totalUsersThisWeek: totalUsersThisWeek,
      totalActiveUsers: totalActiveUsers
    });
  } catch (e) {
    console.error(e); // Log the error for debugging
    res.status(500).json({ error: 'Server error' });
  }
};
const getAnalyticsForOrders = async (req, res) => {
  try {
    const orders = await Order.find().lean();
    const now = new Date();

    const currentDayOfWeek = now.getDay();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - currentDayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const ordersUpdatedThisWeek = orders.filter(order => {
      const updateStatusDate = new Date(order.updateStatusDate);
      return updateStatusDate >= startOfWeek && updateStatusDate <= now;
    });

    const ordersUpdatedThisMonth = orders.filter(order => {
      const updateStatusDate = new Date(order.updateStatusDate);
      return updateStatusDate >= startOfMonth && updateStatusDate <= now;
    });

    const totalCompletedOrders = orders.filter(order => order.status === "Completed");

    const totalOrders = orders.length;

    res.status(200).json({
      totalOrders: totalOrders,
      totalOrdersUpdatedThisWeek: ordersUpdatedThisWeek.length,
      totalOrdersUpdatedThisMonth: ordersUpdatedThisMonth.length,
      totalCompletedOrders: totalCompletedOrders.length
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
};

const getAnalyticsForOrderAmounts = async (req, res) => {
  try {
    const orders = await Order.find().lean();
    const now = new Date();

    const currentDayOfWeek = now.getDay();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - currentDayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const completedOrders = orders.filter(order => order.status === "Completed");

    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.subtotal, 0);

    const revenueThisWeek = completedOrders
      .filter(order => {
        const updateStatusDate = new Date(order.updateStatusDate);
        return updateStatusDate >= startOfWeek && updateStatusDate <= now;
      })
      .reduce((sum, order) => sum + order.subtotal, 0);

    const revenueThisMonth = completedOrders
      .filter(order => {
        const updateStatusDate = new Date(order.updateStatusDate);
        return updateStatusDate >= startOfMonth && updateStatusDate <= now;
      })
      .reduce((sum, order) => sum + order.subtotal, 0);

    res.status(200).json({
      totalRevenue: totalRevenue,
      revenueThisWeek: revenueThisWeek,
      revenueThisMonth: revenueThisMonth
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
};

const getUsersEmails = async (req, res) => {
  try {
    const users = await User.find({}, { email: 1 }).lean();
  
    res.status(200).json(users.map((user) => user.email));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
}



export {
  promoteToAdmin,
  deleteUser,
  getCountUsers,
  getUsers,
  changeManufacturerInAdmin,
  getAnalyticsForUsers,
  getAnalyticsForOrders,
  getAnalyticsForOrderAmounts,
  getUsersEmails
}