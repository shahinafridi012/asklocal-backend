// src/app/routes/index.ts
import { Router } from "express";
import { AsklocalMcSoapUserRoutes } from "../modules/Api/asklocal-mc-soap-api/asklocal-mc.route";
import { AccessYourConcisergeFlow } from "../modules/Api/AccessYourConcisergeFlow/UserFlow.route";
import { PartnerFlowRoutes } from "../modules/Api/BecomeAnAsklocalPartnerFlow/asklocalPartner.route";
import { ListingsRoutes } from "../modules/Api/ZeppierStoreFrontAgent/GetListingsByZeppier.route";

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
  {
    path: "/becomeanasklocal",
    route: PartnerFlowRoutes,
  },
 {
    path: "/listings",   // ✅ FIXED
    route: ListingsRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
