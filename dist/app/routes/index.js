"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/app/routes/index.ts
const express_1 = require("express");
const asklocal_mc_route_1 = require("../modules/Api/asklocal-mc-soap-api/asklocal-mc.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/",
        route: asklocal_mc_route_1.AsklocalMcSoapUserRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
