import { Router } from 'express';
import { OrderController } from './order.controller';
import { UserRole } from '../user/user.interface';
import auth from '../../middlewares/auth';

const router = Router();

// Define routes
router.get(
    '/my-shop-orders',
    OrderController.getMyShopOrders
);

router.get(
    '/my-orders',
    OrderController.getMyOrders
);

router.get(
    '/:orderId',
    OrderController.getOrderDetails
);

router.post(
    '/',
    OrderController.createOrder
)

router.patch(
    '/:orderId/status',
    OrderController.changeOrderStatus
)

export const OrderRoutes = router;
