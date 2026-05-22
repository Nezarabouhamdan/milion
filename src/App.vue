<script setup lang="ts">
import Layout from "./Layout.vue";
import Toaster from "./components/toaster/Toaster.vue";
import FloatingContactFAB from "./components/FloatingContactFAB.vue";
import { VueQueryDevtools } from "@tanstack/vue-query-devtools";
</script>

<template>
	<Layout>
		<RouterView />
		<Toaster />
		<FloatingContactFAB />
	</Layout>
</template>
