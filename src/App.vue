<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import Layout from "./Layout.vue";
import Toaster from "./components/toaster/Toaster.vue";

const route = useRoute();

onMounted(() => {
	// When Google Translate widget ignores `class="notranslate"` on dynamically
	// loaded content, it wraps translated text with <font> elements.
	// This observer detects those injections and restores the original text
	// stored in the element's data-original attribute.
	const skip = new WeakSet<Element>();

	const gtFix = new MutationObserver((mutations) => {
		for (const mut of mutations) {
			for (const node of mut.addedNodes) {
				if ((node as Element).nodeName !== "FONT") continue;
				const anchor = (node as Element).parentElement?.closest<HTMLElement>("[data-original]");
				if (!anchor || skip.has(anchor)) continue;
				const orig = anchor.dataset.original;
				if (!orig) continue;
				skip.add(anchor);
				anchor.textContent = orig;
				setTimeout(() => skip.delete(anchor), 150);
			}
		}
	});

	gtFix.observe(document.body, { childList: true, subtree: true });
});
</script>
<template>
	<RouterView v-if="route.meta?.noLayout" />
	<Layout v-else>
		<RouterView />
		<Toaster />
	</Layout>
</template>
