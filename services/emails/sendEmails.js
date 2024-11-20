import Order from "../../models/order.js";
import User from "../../models/user.js";
import config from "../../config.js";
import transporter from "../emailTransporter.js";
import { addOrderToAdmin, completeOrderEmail, deliveryOrderEmail, generateEmailCreateOrder, generateEmailForgotPassword, generateEmailInvoiceToSuperAdmin, generateEmailNewNotification, generateEmailOrderCreate, generateEmailPaymentForAdmins, generateEmailPaymentForUser, generateEmailWithConfirmInvoice } from "./htmlGenerarte.js";

export const sendInvoiceNotificationForSuperAdmin = async (orderId, adminId) => {
  const adminInfo = await User.findById(adminId, { name: 1, last_name: 1 }).lean()
  const order = await Order.findOne({ orderId }, { invoice: 1 }).lean()
  if (adminInfo && order) {
    const emailHtml = generateEmailInvoiceToSuperAdmin(adminInfo, orderId, order.invoice)
    const admins = await User.find({ role: "superAdmin" }).lean()
    const mailOptions = {
      from: config.email.user,
      to: admins.map(item => item.email),
      subject: "Invoice order",
      html: emailHtml,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  }
}

export const sendConfirmInvoiceForAdmin = async (orderId, manufacturer) => {
  const admins = await User.find({ role: "admin", manufacturer }, { name: 1, last_name: 1, email: 1 }).lean();
  const mailOptions = {
    from: config.email.user,
    to: admins.map(admin => admin.email),
    subject: "Invoice order",
    html: generateEmailWithConfirmInvoice(orderId)
  };
  const info = await transporter.sendMail(mailOptions);
  console.log(info)
};

export const sendCompeteOrder = async (order) => {
  const user = await User.findById(order.userId).lean();
  if (user) {
    const mailOptions = {
      from: config.email.user,
      to: user.email,
      subject: "Order Completed",
      html: completeOrderEmail(order, user.name)
    };
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  }
}

export const sendPaymentAvailability = async (order) => { 
  const user = await User.findById(order.userId).lean();
  if (user) {
    const mailOptions = {
      from: config.email.user,
      to: user.email,
      subject: "Payment Availability",
      html: completeOrderEmail(order.orderId, user.name)
    };
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  }
}

export const sendDeliveryOrder = async (order) => {
  const orderInfo = await Order.findById(order._id, { orderId: 1, tracking: 1 }).lean()
  const user = await User.findById(order.userId).lean();
  if (user) {
    const mailOptions = {
      from: config.email.user,
      to: user.email,
      subject: "Order Delivered",
      html: deliveryOrderEmail(orderInfo.orderId, orderInfo.tracking, user.name)
    };
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  }
}

export const sendNewOrderForSuperAdmin = async (order) => {
  const admins = await User.find({ role: "superAdmin" }).lean();
  const mailOptions = {
    from: config.email.user,
    to: admins.map(item => item.email),
    subject: "New Order",
    html: generateEmailCreateOrder(order),
  };
  const info = await transporter.sendMail(mailOptions);
  console.log('Email sent: ' + info.response);
}

export const sendNewOrderForUser = async (userId, order) => {
  const user = await User.findById(userId, { email: 1, name: 1 }).lean();
  if (user) {
    const mailOptions = {
      from: config.email.user,
      to: user.email,
      subject: "New Order",
      html: generateEmailOrderCreate(user.name, order)
    };
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  }
}

export const sendPaymentSuccessForUser = async (payment) => {
  const user = await User.findById(payment.userId, { name: 1, email: 1 }).lean()
  if (user) {
    const mailOptions = {
      from: config.email.user,
      to: user.email,
      subject: "Payment Success",
      html: generateEmailPaymentForUser(user.name, payment.orderId, payment)
    };
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  }
}

export const sendPaymentSuccessForAdmin = async (payment) => {
  const order = await Order.findOne({ orderId: payment.orderId }, { manufacturer: 1 }).lean();
  const admins = await User.find({ role: "admin", manufacturer: order.manufacturer }, { email: 1 }).lean()
  if (order && admins) {
    const mailOptions = {
      from: config.email.user,
      to: admins.map(admin => admin.email),
      subject: "Payment Success",
      html: generateEmailPaymentForAdmins(payment, payment.orderId),
    };
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent to admins: ' + info.response);
    admins.map(admin => console.log(admin.email))
  }
}

export const sendAddOrderToAdmin = async (manufacturer, orderId) => {
  const admins = await User.find({ manufacturer }, { email: 1 }).lean()
  if (admins) {
    const mailOptions = {
      from: config.email.user,
      to: admins.map(admin => admin.email),
      subject: "New Order",
      html: addOrderToAdmin(orderId)
    };
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent to admins: ' + info.response);
    admins.map(admin => console.log(admin.email))
  }
}

export const sendForgotPassword = async (forgotData) => {
  const mailOptions = {
    from: config.email.user,
    to: forgotData.email,
    subject: "Forgot Password",
    html: generateEmailForgotPassword(forgotData.code, forgotData.userId)
  };
  const info = await transporter.sendMail(mailOptions);
  console.log('Email sent to admins: ' + info.response);
}


export const sendNewNotification = async (email, name) => {
  const mailOptions = {
    from: config.email.user,
    to: email,
    subject: "New Notification",
    html: generateEmailNewNotification(name)
  };
  const info = await transporter.sendMail(mailOptions);
  console.log('Email sent: ' + info.response);
}

