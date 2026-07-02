import { defineStore } from "pinia";
import { fetchSettings } from "../api/settings/api";

export const useSettingsStore = defineStore("settings", {
    state: () => ({
        settings: {} as Record<string, string>,
        whyJoinUs: [] as Array<{ title: string; description: string }>,
        loading: false,
        loaded: false,
    }),

    actions: {
        async loadSettings() {
            if (this.loaded || this.loading) return;
            this.loading = true;
            try {
                const res = await fetchSettings();
                this.settings = res.settings;
                this.whyJoinUs = res.why_join_us;
                this.loaded = true;
            } catch (err) {
                console.error("Failed to fetch settings", err);
            } finally {
                this.loading = false;
            }
        },
    },

    getters: {
        getSetting: (state) => (key: string) => state.settings[key] ?? "",
    },
});
