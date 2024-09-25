import {
  changeManufacturer,
  changeOrdersStatus,
  confirmCheckoutSession,
  confirmInvoice,
  createCheckoutSession,
  createOrder,
  deleteOrder,
  deleteOrderByAdmin,
  editOrder,
  getAllOrderList,
  getInvoiceOrder,
  getListForAdmin,
  getOrder,
  getOrderList,
  getShipping,
  getTotalCountInOrder,
  invoiceOrder,
  setDuplicateOrder,
  updateShipping
} from '../controllers/order.js';
import express from 'express';

import checkAdminOrdSuperAdminRole from '../middleware/checkAdminOrSuperRole.js';
import checkSuperAdminRole from '../middleware/checkSuperAdmin.js';
import checkToken from '../middleware/checkToken.js';

const adminMiddleware = [checkToken, checkAdminOrdSuperAdminRole];
const superAdminMiddleware = [checkToken, checkSuperAdminRole];
const orderRouter = express.Router();

// Define routes
orderRouter.get("/item", checkToken, getOrder);
orderRouter.get('/list', checkToken, getOrderList);
orderRouter.get("/all-list", adminMiddleware, getAllOrderList);
orderRouter.get("/list-for-admin", adminMiddleware, getListForAdmin)
orderRouter.get('/duplicate', checkToken, setDuplicateOrder);
orderRouter.get("/edit", checkToken, editOrder);
orderRouter.post("/create", checkToken, createOrder);

orderRouter.get("/total-count", adminMiddleware, getTotalCountInOrder);

orderRouter.put("/change-status", adminMiddleware, changeOrdersStatus);
orderRouter.put("/change-manufacturer", adminMiddleware, changeManufacturer);
//delete
orderRouter.delete("/delete", checkToken, deleteOrder);
orderRouter.delete("/delete-by-admin", adminMiddleware, deleteOrderByAdmin);
//invoice
orderRouter.post("/invoice-order", adminMiddleware, invoiceOrder);
orderRouter.get("/invoice-order", adminMiddleware, getInvoiceOrder)
orderRouter.put("/invoice-confirm", superAdminMiddleware, confirmInvoice)
// Payment routes
orderRouter.post('/create-checkout-session', checkToken, createCheckoutSession);
orderRouter.get('/confirm-checkout-session', confirmCheckoutSession);
//Edit Shipping
orderRouter.get("/get-shipping", adminMiddleware, getShipping)
orderRouter.put("/edit-shipping", adminMiddleware, updateShipping)



export default orderRouter;