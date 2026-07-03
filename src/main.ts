import { ViteSSG } from "vite-ssg";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import VueTelInput from "vue-tel-input";
import "vue-tel-input/vue-tel-input.css";

import "./style.css";
import "./fonts.css";

import App from "./App.vue";
import PublicRoutes from "./router/publicRoutes";
import { VueQueryPlugin } from "@tanstack/vue-query";
import Loader from "./components/common/Loader.vue";
import ErrorComponent from "./components/common/Error.vue";

export const createApp = ViteSSG(
    App,
    { routes: PublicRoutes, scrollBehavior: () => ({ top: 0 }) },
    ({ app, router, isClient }) => {
        const pinia = createPinia();
        pinia.use(piniaPluginPersistedstate);
        app.use(pinia);

        app.use(VueQueryPlugin);

        // VueTelInput uses browser APIs — client only
        if (isClient) {
            app.use(VueTelInput);
        }

        app.component("Loader", Loader);
        app.component("ErrorComponent", ErrorComponent);

        // Scroll to top on every route change
        router.beforeEach((to, from, next) => {
            if (isClient) window.scrollTo(0, 0);
            next();
        });

        // Settings store — skip on noLayout pages (e.g. /palm-central) to avoid an
        // unnecessary API call in the LCP critical window.
        if (isClient) {
            router.isReady().then(() => {
                if (!router.currentRoute.value.meta?.noLayout) {
                    import("./stores/settingsStore").then(({ useSettingsStore }) => {
                        const settingsStore = useSettingsStore();
                        settingsStore.loadSettings();
                    });
                }
            });
        }
    }
);
