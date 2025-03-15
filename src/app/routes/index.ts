import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { MedicineRoutes } from "../modules/medicine/medicine.route";
import { OrderRoutes } from "../modules/order/order.routes";
import { CategoryRoutes } from "../modules/category/category.routes";
import { TypeRoutes } from "../modules/type/type.routes";
import { ReviewRoutes } from "../modules/review/review.routes";
import { WishlistRoutes } from "../modules/wishlist/wishlist.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/users",
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
    path: "/types",
    route: TypeRoutes,
  },
  {
    path: "/reviews",
    route: ReviewRoutes
  }
  {
    path: "/wishlist",
    route: WishlistRoutes
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
