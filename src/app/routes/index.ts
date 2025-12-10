// src/app/routes/index.ts
import { Router } from "express";
import { AsklocalMcSoapUserRoutes } from "../modules/Api/asklocal-mc-soap-api/asklocal-mc.route";
import { AccessYourConcisergeFlow } from "../modules/Api/AccessYourConcisergeFlow/UserFlow.route";
import { PartnerFlowRoutes } from "../modules/Api/BecomeAnAsklocalPartnerFlow/asklocalPartner.route";
import { ListingsRoutes } from "../modules/Api/ZeppierListings/GetListingsByZeppier.route";
import { SentryError } from "../modules/Main-Site/SentryError/SentryError.route";
import { ListingAgentConnectRoutes } from "../modules/Api/AgentListingConnectFlow/agentListingConnect.route";
import { GeneralSettingsRoute } from "../modules/Main-Site/GeneralSettings/generalsettings.route";
import { BlogRoutes } from "../modules/Main-Site/BlogManagement/blogManagement.route";
import { AgentsRoute } from "../modules/Main-Site/AgentManagement/agent.route";
import { PagesRoute } from "../modules/Main-Site/HowToHub/Pages/page.route";
import { MetricsRoutes } from "../modules/Main-Site/metrics/metrics.route";
import { HomepageTestimonialRoutes } from "../modules/Main-Site/Testimonials/homepageTestimonial.route";
import { AdminRoutes } from "../modules/Main-Site/admin/admin.route";
import { AuthRoutes } from "../modules/Main-Site/auth/auth.route";
import { DashboardRoute } from "../modules/Dashboard/dashboard/dashboard.route";
import { LoadfastListingRoutes } from "../modules/Main-Site/LoadfastListing/LoadfastListing.routes";
import { StorefrontAgentConnectRoutes } from "../modules/Api/StoreFrontAgentConcisergeFlow/storefrontAgentConnect.routes";
import { FaqRoutes } from "../modules/Main-Site/faq/faq.route";
import { TermsRoutes } from "../modules/Main-Site/termsOfuse/page.route";
import { PrivacyRoutes } from "../modules/Main-Site/PrivacyPolicy/page.route";

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
    path: "/listings", // FIXED webhook
    route: ListingsRoutes,
  },
  {
    path: "/listing-agent-connect", // FIXED
    route: ListingAgentConnectRoutes,
  },
  {
    path: "/errors", // FIXED
    route: SentryError,
  },
  {
    path: "/general-settings", // FIXED
    route: GeneralSettingsRoute,
  },
  {
    path: "/blog", // FIXED
    route: BlogRoutes,
  },
  {
    path: "/agents", // FIXED
    route: AgentsRoute,
  },
  {
    path: "/howtohub", // FIXED
    route: PagesRoute,
  },
  {
    path: "/metrics", // FIXED
    route: MetricsRoutes,
  },
  {
    path: "/testimonial", // FIXED
    route: HomepageTestimonialRoutes,
  },
  {
    path: "/admin", // FIXED
    route: AdminRoutes,
  },
  {
    path: "/", // FIXED
    route: DashboardRoute,
  },
  {
    path: "/loadfastlistings", // FIXED
    route: LoadfastListingRoutes,
  },
  {
    path: "/storefront-agent-connect", // FIXED
    route: StorefrontAgentConnectRoutes,
  },
  {
    path: "/faq", // FIXED
    route: FaqRoutes,
  },
  {
    path: "/terms", // FIXED
    route: TermsRoutes,
  },
  {
    path: "/privacy", // FIXED
    route: PrivacyRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
