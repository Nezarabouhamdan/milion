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
	authorRole: {
		type: String,
		default: "",
	},
	category: {
		type: String,
		default: "",
	},
});
</script>

<template>
	<article class="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
		<div class="md:flex">
			<div class="md:w-1/2 relative overflow-hidden h-64 md:h-auto">
				<img :src="image" :alt="title" loading="lazy"
					class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 md:h-full" />
				<div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80"></div>
				<div class="absolute bottom-4 left-4 z-10">
					<span v-if="category" class="bg-primary text-white text-xs font-medium px-3 py-1 rounded-full">
						{{ category }}
					</span>
					<span class="bg-secondary text-white text-xs font-medium px-3 py-1 rounded-full ml-2">
						Featured
					</span>
				</div>
			</div>

			<div class="md:w-1/2 p-6 md:p-8 flex flex-col">
				<div class="flex items-center text-gray-500 text-sm mb-3">
					<span>{{ date }}</span>
					<span v-if="readTime" class="mx-2">•</span>
					<span v-if="readTime">{{ readTime }}</span>
				</div>

				<h2
					class="text-2xl md:text-3xl font-bold text-gray-800 mb-4 group-hover:text-primary transition-colors">
					<router-link :to="`/blog/${slug}`" class="hover:text-primary">
						{{ title }}
					</router-link>
				</h2>

				<p class="text-gray-600 mb-6 flex-grow">{{ excerpt }}</p>

				<div class="flex items-center justify-between mt-auto pt-4 border-t border-gray-200">
					<div v-if="author" class="flex items-center">
						<div
							class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-3">
							{{ author.charAt(0) }}
						</div>
						<div>
							<div class="font-medium text-gray-800">
								{{ author }}
							</div>
							<div v-if="authorRole" class="text-sm text-gray-500">
								{{ authorRole }}
							</div>
						</div>
					</div>

					<router-link :to="`/blog/${slug}`"
						class="text-primary font-medium flex items-center hover:text-primary-dark">
						Read Article
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24"
							stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M14 5l7 7m0 0l-7 7m7-7H3" />
						</svg>
					</router-link>
				</div>
			</div>
		</div>
	</article>
</template>
