<script setup lang="ts">
import { computed } from "vue";
import { MessageCircleMore } from "lucide-vue-next";
import { useSettingsStore } from "../stores/settingsStore";

const settingsStore = useSettingsStore();

const whatsappNumber = computed(() =>
	settingsStore.getSetting("whatsapp_number"),
);

const whatsappLink = computed(
	() => `https://wa.me/${(whatsappNumber.value || "").replace(/\D/g, "")}`,
);
</script>

<template>
	<div class="fixed bottom-6 right-6 z-50">
		<a
			:href="whatsappLink"
			target="_blank"
			class="fab-main-button bg-[#4BB543] hover:bg-[#4BB546]"
		>
			<MessageCircleMore size="32" class="text-white" />
		</a>
	</div>
</template>

<style scoped>
.fab-main-button {
	@apply w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all;
}
</style>
