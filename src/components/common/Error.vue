<template>
	<div
		class="flex flex-col justify-center items-center h-full w-full text-center text-red-500"
	>
		<p class="mb-4">{{ message }}</p>
		<button
			@click="retry"
			class="bg-primary text-white py-2 px-4 rounded hover:bg-secondary transition"
		>
			Retry
		</button>
	</div>
</template>

<script setup lang="ts">
defineProps<{
	message: string;
	retry: () => void;
}>();
</script>
