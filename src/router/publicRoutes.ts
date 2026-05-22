export interface CustomRoute {
    path: string;
    component: () => Promise<any>;
    name?: string;
    meta?: Record<string, any>;
}

const PublicRoutes: CustomRoute[] = [
    {
        path: "/",
        component: () => import("../views/Home.vue"),
        name: "Home",
    },
    {
        path: "/properties",
        component: () => import("../views/PropertyPage.vue"),
        name: "Property",
    },
    {
        path: "/property/:slug",
        component: () => import("../views/PropertyDetailPage.vue"),
        name: "PropertyDetail",
    },
    {
        path: "/blogs",
        component: () => import("../views/BlogPage.vue"),
        name: "Blogs",
    },
    {
        path: "/blog/:slug",
        component: () => import("../views/BlogDetailPage.vue"),
        name: "BlogDetail",
    },
    {
        path: "/faq",
        component: () => import("../views/FaqPage.vue"),
        name: "Faq",
    },
    {
        path: "/about-us",
        component: () => import("../views/AboutUsPage.vue"),
        name: "AboutUs",
    },
    {
        path: "/contact-us",
        component: () => import("../views/ContactUsPage.vue"),
        name: "ContactUs",
    },
    {
        path: "/careers",
        component: () => import("../views/CareerPage.vue"),
        name: "Careers",
    },
    {
        path: "/team",
        component: () => import("../views/TeamPage.vue"),
        name: "Team",
    },
    {
        path: "/sell",
        component: () => import("../views/SellEnquiryPage.vue"),
        name: "Sell",
    },
    {
        path: "/areas",
        component: () => import("../views/AreaPage.vue"),
        name: "Areas",
    },
    {
        path: "/service/holiday-homes",
        component: () => import("../views/HolidayHomePage.vue"),
        name: "HolidayHomes",
    },
    {
        path: "/service/property-management",
        component: () => import("../views/PropertyManagementPage.vue"),
        name: "PropertyManagement",
    },
    {
        path: "/service/buy",
        component: () => import("../views/BuyServicePage.vue"),
        name: "BuyService",
    },
    {
        path: "/service/sell",
        component: () => import("../views/SellServicePage.vue"),
        name: "SellService",
    },
    {
        path: "/service/rent",
        component: () => import("../views/RentServicePage.vue"),
        name: "RentService",
    },
    {
        path: "/service/mortgage-calculator",
        component: () => import("../views/MortageCalculator.vue"),
        name: "MortageCalculator",
    },
    {
        path: "/privacy-policy",
        component: () => import("../views/PrivacyPolicyPage.vue"),
        name: "PrivacyPolicy",
    },
    {
        path: "/terms-of-service",
        component: () => import("../views/TermsOfServicePage.vue"),
        name: "TOS",
    },
    {
        path: "/area/:id",
        component: () => import("../views/AreaSpecificPage.vue"),
        name: "AreaSpecificPage",
    },
];

export default PublicRoutes;
