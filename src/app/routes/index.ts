import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { MedicineRoutes } from "../modules/medicine/medicine.route";

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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
