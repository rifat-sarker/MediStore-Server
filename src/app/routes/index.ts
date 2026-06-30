import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { MedicineRoutes } from "../modules/medicine/medicine.route";
import { OrderRoutes } from "../modules/order/order.routes";
import { CategoryRoutes } from "../modules/category/category.routes";
import { ReviewRoutes } from "../modules/review/review.routes";
import { RiderRoutes } from "../modules/rider/rider.routes";
import { PaymentRoutes } from "../modules/payment/payment.controller";

const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/medicines",
    route: MedicineRoutes,
  },
  {
    path: "/orders",
    route: OrderRoutes,
  },
  {
    path: "/categories",
    route: CategoryRoutes,
  },
  {
    path: "/reviews",
    route: ReviewRoutes,
  },
  {
    path: "/riders",
    route: RiderRoutes,
  },
  {
    path: "/payment",
    route: PaymentRoutes,
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
