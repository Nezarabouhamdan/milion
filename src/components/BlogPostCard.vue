<script setup lang="ts">
defineProps({
	title: { type: String, required: true },
	date: { type: String, required: true },
	readTime: { type: String, required: true },
	excerpt: { type: String, required: true },
	category: { type: String, required: true },
	slug: { type: String, required: true },
	image: { type: String, required: true },
});
</script>

<template>
	<div
		class="bg-white rounded-xl shadow hover:shadow-lg overflow-hidden flex flex-col transition hover:scale-[1.02]"
	>
		<div class="relative">
			<img :src="image" :alt="title" class="w-full h-48 object-cover" />
			<span
				class="absolute top-4 left-4 bg-secondary text-white py-1 px-3 rounded-full text-xs font-medium uppercase"
			>
				{{ category }}
			</span>
		</div>

		<div class="p-6 flex flex-col flex-grow">
			<div class="flex items-center text-sm text-gray-500 mb-2">
				<span>{{ new Date(date).toLocaleDateString() }}</span>
				<span class="mx-2">•</span>
				<span>{{ readTime }}</span>
			</div>

			<h3 class="text-lg font-semibold text-heading mb-3 leading-tight">
				{{ title }}
			</h3>

			<p class="text-body text-sm mb-4 flex-grow line-clamp-3">
				{{ excerpt }}
			</p>

			<router-link
				:to="`/blog/${slug}`"
				class="inline-flex items-center text-primary hover:underline font-medium mt-auto text-sm"
			>
				Read Article
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="ml-1 w-4 h-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M14 5l7 7m0 0l-7 7m7-7H3"
					/>
				</svg>
			</router-link>
		</div>
	</div>
</template>
