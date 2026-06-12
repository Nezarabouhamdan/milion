<script setup lang="ts">
import Layout from "./Layout.vue";
import Toaster from "./components/toaster/Toaster.vue";

</script>

<template>
	<Layout>
		<RouterView />
		<Toaster />
	</Layout>
</template>
