<script setup lang="ts">
defineProps({
	title: {
		type: String,
		required: true,
	},
	date: {
		type: String,
		default: "",
	},
	readTime: {
		type: String,
		default: "",
	},
	excerpt: {
		type: String,
		default: "",
	},
	category: {
		type: String,
		default: "",
	},
	slug: {
		type: String,
		required: true,
	},
	image: {
		type: String,
		default: "/images/placeholder.jpg",
	},
	author: {
		type: String,
		default: "",
	},
});
</script>

<template>
	<article
		class="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-100">
		<div class="relative overflow-hidden h-52">
			<img :src="image" :alt="title"
				class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
			<div v-if="category" class="absolute top-4 left-4">
				<span class="bg-primary text-white text-xs font-medium px-3 py-1 rounded-full">
					{{ category }}
				</span>
			</div>
		</div>

		<div class="flex flex-col flex-grow p-5">
			<div class="flex items-center text-gray-500 text-sm mb-3">
				<span>{{ date }}</span>
				<span v-if="readTime" class="mx-2">•</span>
				<span v-if="readTime">{{ readTime }}</span>
			</div>

			<h3
				class="text-xl font-semibold text-gray-800 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
				<router-link :to="`/blog/${slug}`" class="hover:text-primary">
					{{ title }}
				</router-link>
			</h3>

			<p class="text-gray-600 mb-4 line-clamp-3 flex-grow">
				{{ excerpt }}
			</p>

			<div class="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
				<div v-if="author" class="text-sm font-medium text-gray-700">
					{{ author }}
				</div>

				<router-link :to="`/blog/${slug}`"
					class="text-primary font-medium text-sm hover:text-primary-dark flex items-center">
					Read More
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24"
						stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
					</svg>
				</router-link>
			</div>
		</div>
	</article>
</template>
