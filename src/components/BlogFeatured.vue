<script setup lang="ts">
defineProps({
	title: {
		type: String,
		required: true,
	},
	date: {
		type: String,
		required: true,
	},
	readTime: {
		type: String,
		required: true,
	},
	excerpt: {
		type: String,
		required: true,
	},
	slug: {
		type: String,
		required: true,
	},
	image: {
		type: String,
		required: true,
	},
});
</script>

<template>
	<div class="bg-white rounded-xl shadow-property overflow-hidden">
		<div class="relative h-80 md:h-96">
			<img :src="image" :alt="title" class="w-full h-full object-cover" />
			<div class="absolute inset-0 bg-gradient-image flex flex-col justify-end p-6 md:p-8">
				<span class="bg-secondary text-white py-1 px-3 rounded-full text-sm mb-3 inline-block">Featured</span>
				<h2 class="text-2xl md:text-3xl font-semibold text-white mb-2">
					{{ title }}
				</h2>
				<div class="flex items-center text-white">
					<span class="text-sm">{{ date }}</span>
					<span class="mx-2">•</span>
					<span class="text-sm">{{ readTime }}</span>
				</div>
			</div>
		</div>
		<div class="p-6 md:p-8">
			<p class="text-body mb-6">{{ excerpt }}</p>
			<router-link :to="`/blog/${slug}`" class="btn-outline inline-flex items-center">
				Read More
				<svg xmlns="http://www.w3.org/2000/svg" class="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24"
					stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
						d="M14 5l7 7m0 0l-7 7m7-7H3" />
				</svg>
			</router-link>
		</div>
	</div>
</template>
