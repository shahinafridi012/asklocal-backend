// src/app/routes/index.ts
import { Router } from "express";
import { AsklocalMcSoapUserRoutes } from "../modules/Api/asklocal-mc-soap-api/asklocal-mc.route";
import { AccessYourConcisergeFlow } from "../modules/Api/AccessYourConcisergeFlow/UserFlow.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/",
    route: AsklocalMcSoapUserRoutes,
  },
  {
    path: "/",
    route: AccessYourConcisergeFlow,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
