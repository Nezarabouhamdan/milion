<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useIntersectionObserver } from "../composables/useIntersectionObserver";
import { useBlogsQuery } from "../composables/useBlogsQuery";
import { imagePath } from "../utils/helpers";
import type { Blog } from "../types/blog";

const blogSectionRef = ref<HTMLElement | null>(null);
const { isVisible } = useIntersectionObserver(blogSectionRef);
const { data: blogList, isLoading, isError, refetch } = useBlogsQuery(true);

const fallbackImage = "/images/fallback-blog.jpg";

watch(isVisible, (visible) => {
	if (visible) refetch();
});

const hasBlogs = computed(() => blogList.value && blogList.value.length > 0);

function getPrimaryImage(blog: Blog) {
	const primaryAsset = blog.assets.find((a) => a.is_primary);
	return primaryAsset ? imagePath(primaryAsset.url) : fallbackImage;
}

function getCategoryColor(categoryName: string) {
	const colors = [
		"bg-blue-100 text-blue-800",
		"bg-green-100 text-green-800",
		"bg-purple-100 text-purple-800",
		"bg-orange-100 text-orange-800",
	];
	const index = categoryName.length % colors.length;
	return colors[index];
}

function formatDate(dateString: string) {
	if (!dateString) return "";
	const date = new Date(dateString);
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	}).format(date);
}
</script>

<template>
	<section
		v-if="hasBlogs"
		ref="blogSectionRef"
		class="container mx-auto px-4 py-16 md:py-24 lg:py-32"
	>
		<!-- Loading Skeleton -->
		<div
			v-if="isLoading"
			class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse"
		>
			<div
				v-for="i in 3"
				:key="i"
				class="bg-white rounded-xl shadow overflow-hidden"
			>
				<div class="h-64 bg-gray-200 w-full"></div>
				<div class="p-6 space-y-4">
					<div class="h-6 w-1/4 bg-gray-200 rounded"></div>
					<div class="h-6 w-3/4 bg-gray-200 rounded"></div>
					<div class="h-4 w-full bg-gray-200 rounded"></div>
					<div class="h-4 w-2/3 bg-gray-200 rounded"></div>
					<div class="h-4 w-1/2 bg-gray-200 rounded"></div>
				</div>
			</div>
		</div>

		<!-- Error Message -->
		<Error
			v-else-if="isError"
			message="Oops! We couldn't load the blogs. Please try again."
			:retry="refetch"
			class="text-center py-12"
		/>

		<!-- Blog Content -->
		<div v-else-if="hasBlogs" class="space-y-16">
			<div class="text-center">
				<h2 class="text-3xl md:text-4xl font-bold text-gray-900">
					Latest Real Estate Insights
				</h2>
				<p
					class="text-gray-600 text-base md:text-lg mt-4 max-w-2xl mx-auto"
				>
					Discover expert tips, market trends, and investment
					opportunities in the real estate world.
				</p>
			</div>

			<!-- Blog Grid -->
			<div
				class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
			>
				<router-link
					v-for="blog in blogList"
					:key="blog.id"
					:to="`/blog/${blog.slug}`"
					class="block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group hover:-translate-y-1"
					role="link"
					:aria-labelledby="`blog-title-${blog.id}`"
				>
					<!-- Image -->
					<div class="relative h-64 overflow-hidden">
						<img
							:src="getPrimaryImage(blog)"
							:alt="blog.title"
							loading="lazy"
							class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
						/>
						<div
							class="absolute inset-0 bg-gradient-to-t from-black-100/50 via-black-100/10 to-transparent"
						></div>

						<!-- Category Badge -->
						<div
							v-if="blog.categories?.length"
							class="absolute top-4 left-4"
						>
							<span
								:class="[
									'text-xs font-medium px-3 py-1 rounded-full shadow-sm bg-black-100 text-white',
								]"
							>
								{{ blog.categories[0].name }}
							</span>
						</div>
					</div>

					<!-- Blog Content -->
					<div class="p-6 space-y-3">
						<div
							class="flex items-center gap-2 text-sm text-gray-500"
						>
							<span>{{ formatDate(blog.created_at) }}</span>
							<span
								class="h-1 w-1 rounded-full bg-black-100"
							></span>
							<span>{{ blog.read_time || "5 min read" }}</span>
						</div>
						<h3
							:id="`blog-title-${blog.id}`"
							class="text-2xl font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors duration-200"
						>
							{{ blog.title }}
						</h3>
						<p
							class="text-gray-500 text-sm leading-relaxed line-clamp-2"
						>
							{{ blog.excerpt || "No excerpt available." }}
						</p>
						<div
							class="flex items-center gap-2 text-sm text-gray-600"
						>
							<span class="font-medium">{{
								blog.author_name
							}}</span>
							<span
								class="h-1 w-1 rounded-full bg-black-100"
							></span>
							<span>{{ blog.author_role }}</span>
						</div>
					</div>
				</router-link>
			</div>

			<!-- View All Blogs Button -->
			<div class="text-center mt-8">
				<router-link
					to="/blogs"
					class="inline-block bg-black-100 text-white font-medium px-6 py-3 rounded-full hover:bg-blue-700 transition-colors duration-200"
				>
					View All Blogs
				</router-link>
			</div>
		</div>
	</section>
</template>

<style scoped>
/* Fade in animation */
.grid {
	animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(10px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}
</style>
