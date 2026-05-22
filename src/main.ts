import { createApp } from "vue";
import { createPinia } from "pinia";

import VueTelInput from "vue-tel-input";
import "vue-tel-input/vue-tel-input.css";

import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import "./style.css";
import "./fonts.css";

import App from "./App.vue";
import router from "./router";
import { VueQueryPlugin } from "@tanstack/vue-query";
import Loader from "./components/common/Loader.vue";
import ErrorComponent from "./components/common/Error.vue";

import { createHead } from "@unhead/vue/client";

const app = createApp(App);
const pinia = createPinia();
const head = createHead();

pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.use(router);
app.use(head);
app.use(VueQueryPlugin);
app.use(VueTelInput);

app.component("Loader", Loader);
app.component("Error", ErrorComponent);

import { useSettingsStore } from "./stores/settingsStore";
const settingsStore = useSettingsStore();
settingsStore.loadSettings();

app.mount("#app");
