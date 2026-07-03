import { createRouter, createWebHistory } from "vue-router";
import PublicRoutes from "./publicRoutes";

export interface CustomRoute {
	path: string;
	component: () => Promise<any>;
	name?: string;
	meta?: Record<string, any>;
}

export const routes = PublicRoutes.map((route: CustomRoute) => ({
	path: route.path,
	component: route.component,
	name: route.name,
	meta: route.meta,
}));

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
});

router.beforeEach((to, from, next) => {
	window.scrollTo(0, 0);
	next();
});

export default router;
