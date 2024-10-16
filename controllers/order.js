import {
  sendConfirmInvoiceForAdmin,
  sendInvoiceNotificationForSuperAdmin,
  sendNewOrderForSuperAdmin,
  sendNewOrderForUser,
  sendPaymentSuccessForAdmin,
  sendPaymentSuccessForUser
} from "../services/emails/sendEmails.js";
import { customAlphabet } from "nanoid"
import Stripe from "stripe";

import Draft from "../models/draft.js"
import Notification from "../models/notification.js";
import Order from "../models/order.js"
import Payment from "../models/payment.js";
import User from "../models/user.js"
import config from "../config.js";

const stripe = new Stripe(config.strapiKey);

export const createOrder = async (req, res) => {
  const { draftId } = req.body
  try {
    const draft = await Draft.findById(draftId).lean()
    const generateOrderId = customAlphabet('123456789', 10);
    if (draft) {
      const orderId = generateOrderId()
      const newOrder = new Order({ ...draft, orderId, status: "Requires action" })
      await newOrder.save()
      await sendNewOrderForSuperAdmin(newOrder)
      await sendNewOrderForUser(req.id, newOrder)
      await Draft.findByIdAndDelete(draftId)
      res.status(200).json({ message: "Order created" })
    } else {
      return res.status(404).json({ message: "Draft not found" })
    }
  } catch (e) {
    console.log(e)
    res.status(500).json(e)
  }
}

export const getOrderList = async (req, res) => {
  const id = req.id
  try {
    const ordersList = await Order.find({ userId: id },
      { orderId: 1, name: 1, tracking: 1, createAt: 1, status: 1, subtotal: 1 }).lean()
    if (ordersList) {
      const ordersDTO = ordersList.map((order) => ({
        id: order.orderId,
        productType: order.name,
        tracking: order.tracking,
        orderData: order.createAt,
        orderStatus: order.status,
        subtotal: order.subtotal
      }))
      res.status(200).json(ordersDTO)
    } else {
      res.status(404).json({ message: "No orders found" })
    }
  } catch (e) {

  }
}

export const getOrder = async (req, res) => {
  const { orderId } = req.query
  try {
    const order = await Order.findOne({ orderId }).lean()
    if (order) {
      res.status(200).json(order)
    } else {
      return res.status(404).json({ message: "Order not found" })
    }
  } catch (e) {
    res.status(500).json(e)
  }
}

export const getAllOrderList = async (req, res) => {
  try {
    const ordersList = await Order.find({}, {
      productType: 1,
      orderId: 1,
      createAt: 1,
      status: 1,
      userId: 1,
      manufacturer: 1,
      subtotal: 1,
      totalPrice: 1,
      invoice: 1
    }).lean();
    if (ordersList && ordersList.length > 0) {
      const ordersDTO = await Promise.all(ordersList.map(async (order) => {
        const user = await User.findById(order.userId, { email: 1 }).lean();
        return {
          id: order.orderId,
          userEmail: user ? user.email : "Unknown",
          manufacturer: order.manufacturer || "Portugal  manufacturer",
          productType: order.productType,
          orderData: order.createAt,
          orderStatus: order.status,
          subtotal: order.subtotal,
          totalPrice: order.subtotal + (order.shipping || 0),
          invoice: order.invoice
        };
      }));
      res.status(200).json(ordersDTO);
    } else {
      res.status(404).json({ message: "No orders found" });
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getListForAdmin = async (req, res) => {
  const { manufacturer } = req.query
  try {
    const ordersList = await Order.find({ manufacturer }, {
      productType: 1,
      orderId: 1,
      createAt: 1,
      status: 1,
      userId: 1,
      manufacturer: 1,
      subtotal: 1,
      totalPrice: 1,
      invoice: 1
    }).lean();
    if (ordersList && ordersList.length > 0) {
      const ordersDTO = await Promise.all(ordersList.map(async (order) => {
        const user = await User.findById(order.userId, { email: 1 }).lean();
        return {
          id: order.orderId,
          userEmail: user ? user.email : "Unknown",
          manufacturer: order.manufacturer || "Portugal  manufacturer",
          productType: order.productType,
          orderData: order.createAt,
          orderStatus: order.status,
          subtotal: order.subtotal,
          totalPrice: order.subtotal + (order.shipping || 0),
          invoice: order.invoice
        };
      }));
      res.status(200).json(ordersDTO);
    } else {
      res.status(404).json({ message: "No orders found" });
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

export const setDuplicateOrder = async (req, res) => {
  const { orderId } = req.query
  try {
    console.log(orderId)
    const order = await Order.findOne({ orderId: `${orderId}` }).lean()
    if (order) {
      const newOrderId = customAlphabet('123456789', 10);
      const { _id, ...orderData } = order;
      const newOrder = new Order({
        ...orderData,
        orderId: newOrderId(),
        status: "Requires action",
        invoice: {
          status: "not created"
        }
      })
      await newOrder.save()
      res.status(200).json({
        id: newOrder.orderId,
        productType: newOrder.name,
        tracking: newOrder.tracking,
        orderData: newOrder.createAt,
        orderStatus: newOrder.status
      })
    } else {
      return res.status(404).json({ message: "Order not found" })
    }
  } catch (e) {
    res.status(500).json(e)
  }
}

export const deleteOrder = async (req, res) => {
  const { orderId } = req.query
  try {
    const order = await Order.findOne({ orderId }, { orderId: 1 }).lean()
    if (order) {
      await Order.findOneAndDelete({ orderId })
      res.status(200).json(orderId)
    } else {
      return res.status(404).json({ message: "Order not found" })
    }
  } catch (e) {
    res.status(500).json(e)
  }
}


export const editOrder = async (req, res) => {
  const { orderId } = req.query;

  try {
    const order = await Order.findOne({ orderId }).lean();
    if (order) {
      const { _id, ...orderData } = order;
      const newDraft = new Draft({ ...orderData });
      await newDraft.save();
      await Order.findOneAndDelete({ orderId });
      const sendDraft = await Draft.findById(newDraft._id).lean();
      res.status(200).json({ ...sendDraft, draftId: sendDraft._id, orderStep: "size" });
    } else {
      return res.status(404).json({ message: "Order not found" });
    }
  } catch (e) {
    res.status(500).json(e);
  }
}

export const changeManufacturer = async (req, res) => {
  const { orderId, newManufacturer } = req.query
  try {
    const candidate = await Order.findOne({ orderId }, { _id: 1 }).lean();
    if (candidate) {
      await Order.findOneAndUpdate({ orderId }, { manufacturer: newManufacturer })
      res.status(200).json(newManufacturer)
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (e) {
    res.status(500).json(e);
  }
}

export const deleteOrderByAdmin = async (req, res) => {
  const { orderId } = req.query
  try {
    const candidate = await Order.findOne({ orderId }, { _id: 1 }).lean();
    if (candidate) {
      await Order.findByIdAndDelete(candidate._id)
      res.status(200).json(orderId)
    } else {
      res.status(404).json({ message: "Order not found" })
    }
  } catch (e) {
    res.status(500).json(e)
  }
}

export const createCheckoutSession = async (req, res) => {
  const { orderId } = req.query;
  try {
    const order = await Order.findOne({ orderId },
      { userId: 1, name: 1, subtotal: 1, productType: 1, color: 1 }).lean();
    if (order) {
      const cost = Math.ceil(order.subtotal * 100);

      let image = `${config.backendUrl}${order.color.path}`
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: order.name,
                images: [image || ""],
              },
              unit_amount: cost,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${config.backendUrl}/orders/confirm-checkout-session?id=${orderId}`,
        // success_url: `${config.frontEndUrl}/orders`,
        //success_url: `${config.frontEndUrl}/payment/success/${orderId}`,
        cancel_url: `${config.frontEndUrl}/payment/cancel/${orderId}`,
        metadata: {
          orderId: orderId,
          userId: order.userId,
          price: cost,
        },
      });
      const newPayment = new Payment({
        transactionCode: session.id,
        userId: order.userId,
        orderId,
        price: cost
      });
      await newPayment.save();

      res.json({ id: session.id, url: session.url });
    } else {
      res.status(404).json({ message: "Order not found" });
    }

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
};

export const handleWebhook = async (request, response) => {
  const endpointSecret = "whsec_a21a53849bdc06e971a24c2a8fc675c9b17ce8de124d5f2b2f215a58ab58131d";
  const sig = request.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    console.error('Error while verifying webhook signature:', err);
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const { metadata } = session;

      console.log('Checkout session completed:', metadata);
      const { orderId } = metadata
      handleChangePaymentStatus(orderId)


      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  response.status(200).send('Received');
};

const handleChangePaymentStatus = async (orderId) => {
  console.log("orderId", orderId)
  try {
    const payment = await Payment.findOneAndUpdate({ orderId }, { status: "success" })
    await Order.findOneAndUpdate({ orderId }, { status: "Priced", paymentId: payment._id })
    sendPaymentSuccessForUser(payment)
    sendPaymentSuccessForAdmin(payment)
  } catch (e) {
    console.error(e)
  }

}

export const confirmCheckoutSession = async (req, res) => {
  const { id } = req.query;
  try {
    const payment = await Payment.findOne({ orderId: id })
    const session = await stripe.checkout.sessions.retrieve(payment.transactionCode);
    console.log('Session retrieved:', session);
    const { metadata } = session;
    console.log('Checkout session completed:', metadata);
    const { orderId } = metadata
    handleChangePaymentStatus(orderId)
  } catch (error) {
    console.error('Error while retrieving checkout session:', error);
  }
  res.redirect(`${config.frontEndUrl}/orders`)
}

export const changeOrdersStatus = async (req, res) => {
  const { orderId, newStatus } = req.query;
  try {
    const order = await Order.findOne({ orderId }, { _id: 1, userId: 1 }).lean()
    if (order) {

      await Order.updateOne({ orderId }, { status: newStatus, updateStatusDate: new Date() })
      const newMessage = {
        userId: order.userId,
        orderId,
        title: "Order status changed",
        text: `Your order with ID ${orderId} has been updated to ${newStatus}.`
      }
      const notification = new Notification(newMessage)

      await notification.save()
      res.status(200).json({ orderId, orderStatus: newStatus });
    } else {
      res.status(404).json("Order not found")
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message });
  }

}

export const invoiceOrder = async (req, res) => {
  const {
    orderId,
    unitCost,
    colourCost,
    packagingCost,
    shippingCost,
    totalPrice
  } = req.body
  try {
    const order = await Order.findOne({ orderId }).lean()
    if (order) {
      const costForOneItem = unitCost + colourCost + packagingCost + shippingCost
      // let quantityOrder = 0
      // order.quantity.list.forEach(item => quantityOrder += item.quantity)
      // const allSum = quantityOrder * costForOneItem
      await Order.findOneAndUpdate({ orderId }, {
        cost: costForOneItem,
        shipping: shippingCost,
        subtotal: totalPrice,
        invoice: {
          status: "in confirm",
          unitCost,
          colourCost,
          packagingCost,
          shippingCost,
          totalPrice
        }
      })
      sendInvoiceNotificationForSuperAdmin(orderId, req.id)
      res.status(200).json({ total: totalPrice })
    } else {
      res.status(404).json("Order not found")
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}


export const getInvoiceOrder = async (req, res) => {
  const { orderId } = req.query
  try {
    const order = await Order.findOne({ orderId }, { invoice: 1 }).lean()
    if (order) {
      res.status(200).json(order.invoice)
    } else {
      res.status(404).json("Order not found")
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

export const confirmInvoice = async (req, res) => {
  const { orderId } = req.query
  try {
    const order = await Order.findOneAndUpdate({ orderId }, { invoice: { status: "confirmed" }, status: "Submitted" })
    if (order) {
      await sendConfirmInvoiceForAdmin(orderId, order.manufacturer)
      res.status(200).json(order)
    } else {
      res.status(404).json("Order not found")
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

export const getTotalCountInOrder = async (req, res) => {
  const { orderId } = req.query
  try {
    const order = await Order.findOne({ orderId }, { quantity: 1 }).lean()
    if (order) {
      let totalCount = 0
      order.quantity.list.forEach(item => totalCount += item.value)
      res.status(200).json(totalCount)
    } else {
      res.status(404).json("Order not found")
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export const getShipping = async (req, res) => {
  const { orderId } = req.query
  try {
    const candidate = await Order.findOne({ orderId },
      { tracking: 1, trackingUrl: 1, carriers: 1 }).lean()
    if (candidate) {
      const responseDTO = {
        tracking: candidate.tracking || "",
        trackingUrl: candidate.trackingUrl || "",
        carriers: candidate.carriers || "",
      }
      res.status(200).json(responseDTO)
    } else {
      res.status(404).json("Order not found")
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export const updateShipping = async (req, res) => {
  const { orderId, tracking, trackingUrl, carriers } = req.query
  try {
    const candidate = await Order.findOne({ orderId }, { _id: 1 }).lean()
    if (candidate) {
      await Order.findOneAndUpdate({ orderId }, { tracking, trackingUrl, carriers }).lean()
      res.status(200).json("Shipping updated successfully")
    } else {
      res.status(404).json("Order not found")
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }

}