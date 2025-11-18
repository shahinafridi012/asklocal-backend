// src/app/routes/index.ts
import { Router } from "express";
import { AsklocalMcSoapUserRoutes } from "../modules/Api/asklocal-mc-soap-api/asklocal-mc.route";
import { AccessYourConcisergeFlow } from "../modules/Api/AccessYourConcisergeFlow/UserFlow.route";
import { PartnerFlowRoutes } from "../modules/Api/BecomeAnAsklocalPartnerFlow/asklocalPartner.route";
import { GetStoreFrontAgent } from "../modules/Api/ZeppierStoreFrontAgent/GetListingsByZeppier.route";

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
    path: "/",
    route: GetStoreFrontAgent,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
