<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useBlogQuery } from "../composables/useBlogQuery";
import { imagePath } from "../utils/helpers";
import { useSeoMeta } from "@unhead/vue";
import * as lucideIcons from "lucide-vue-next";
import BlogPostCard from "../components/BlogPostCard.vue";
import NewsLetter from "./NewsLetter.vue";

const route = useRoute();
const slug = computed(() => route.params.slug as string);

const { data: post, isLoading, isError, refetch } = useBlogQuery(slug);

// Get the featured image URL for a blog post, prioritizing primary image
const getFeaturedImageUrl = (blog: any): string => {
	if (!blog?.assets || blog.assets.length === 0) {
		return "/images/placeholder.jpg";
	}
	const primaryImage = blog.assets.find(
		(asset: any) => asset.is_primary === 1,
	);
	const fallbackImage = blog.assets[0];
	return imagePath(primaryImage ? primaryImage.url : fallbackImage.url);
};

// Primary image: Use primary asset or first asset if no primary exists
const primaryImage = computed(() => {
	if (!post.value?.assets || post.value.assets.length === 0) {
		return "/images/placeholder.jpg";
	}
	const primaryAsset = post.value.assets.find((a: any) => a.is_primary);
	const fallbackAsset = post.value.assets[0];
	return imagePath(primaryAsset ? primaryAsset.url : fallbackAsset.url);
});

// Other images: Exclude primary image and map URLs
const otherImages = computed(() => {
	if (!post.value?.assets) return [];
	return post.value.assets
		.filter((a: any) => !a.is_primary)
		.map((a: any) => ({ url: imagePath(a.url) }));
});

// All images for popup navigation
const allImages = computed(() => {
	const images = [];
	if (primaryImage.value !== "/images/placeholder.jpg") {
		images.push({ url: primaryImage.value, is_primary: true });
	}
	return images.concat(
		otherImages.value.map((img: any) => ({
			url: img.url,
			is_primary: false,
		})),
	);
});

const mainImage = ref<string | null>(null);
const showImagePopup = ref(false);
const selectedImage = ref<string | null>(null);
const currentImageIndex = ref<number>(0);

const setMainImage = (url: string) => {
	mainImage.value = url;
};

const openImagePopup = (url: string, index: number) => {
	selectedImage.value = url;
	currentImageIndex.value = index;
	showImagePopup.value = true;
};

const closeImagePopup = () => {
	showImagePopup.value = false;
	selectedImage.value = null;
	currentImageIndex.value = 0;
};

const nextImage = () => {
	if (currentImageIndex.value < allImages.value.length - 1) {
		currentImageIndex.value++;
		selectedImage.value = allImages.value[currentImageIndex.value].url;
	}
};

const prevImage = () => {
	if (currentImageIndex.value > 0) {
		currentImageIndex.value--;
		selectedImage.value = allImages.value[currentImageIndex.value].url;
	}
};

onMounted(() => {
	if (primaryImage.value) {
		mainImage.value = primaryImage.value;
	}
});

// Share functionality
const showShareDropdown = ref(false);

const copyLink = () => {
	navigator.clipboard.writeText(window.location.href);
	alert("Link copied to clipboard!");
};

const toggleShareDropdown = () => {
	showShareDropdown.value = !showShareDropdown.value;
};

const shareViaWhatsApp = () => {
	window.open(
		`https://wa.me/?text=${encodeURIComponent(window.location.href)}`,
		"_blank",
	);
	showShareDropdown.value = false;
};

const shareViaTelegram = () => {
	const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}`;
	window.open(url, "_blank");
	showShareDropdown.value = false;
};

// Tab navigation
const activeTab = ref("content");

useSeoMeta({
	title: computed(() => `${post.value?.title || "Blog Post"} - Your Blog`),
	description: computed(() => post.value?.excerpt || ""),
	ogImage: computed(() => primaryImage.value),
	ogTitle: computed(() => post.value?.title || ""),
	ogDescription: computed(() => post.value?.excerpt || ""),
	ogType: "article",
	twitterCard: "summary_large_image",
	ogUrl: computed(() =>
		typeof window !== "undefined" ? window.location.href : "",
	),
});
</script>

<template>
	<section class="bg-gray-50 py-12 min-h-screen">
		<!-- Loading State -->
		<div v-if="isLoading" class="container mx-auto px-4 flex items-center justify-center py-32">
			<div class="text-center">
				<div class="animate-spin h-14 w-14 rounded-full border-4 border-t-primary border-gray-200 mx-auto">
				</div>
				<p class="text-gray-500 mt-4 font-medium">
					Loading blog post...
				</p>
			</div>
		</div>

		<!-- Error State -->
		<div v-else-if="isError" class="container mx-auto px-4 flex items-center justify-center py-32">
			<div class="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
				<lucideIcons.AlertCircle class="h-16 w-16 text-red-500 mx-auto mb-4" />
				<h3 class="text-xl font-bold text-gray-800 mb-2">
					Couldn't Load Blog Post
				</h3>
				<p class="text-gray-600 mb-6">
					We encountered an issue while loading this post. Please try
					again.
				</p>
				<button @click="refetch"
					class="px-6 py-3 bg-black-100 text-white rounded-lg font-medium hover:bg-black-100/90 transition-all">
					Try Again
				</button>
			</div>
		</div>

		<!-- Blog Content -->
		<div v-else class="container mx-auto px-4">
			<!-- Breadcrumbs -->
			<div class="text-sm text-gray-500 mb-6 flex items-center space-x-2">
				<a href="/" class="hover:text-primary transition-colors">Home</a>
				<lucideIcons.ChevronRight class="h-4 w-4" />
				<a href="/blogs" class="hover:text-primary transition-colors">Blog</a>
				<lucideIcons.ChevronRight class="h-4 w-4" />
				<span class="text-gray-700 font-medium">{{ post?.title }}</span>
			</div>

			<!-- Header -->
			<div class="bg-white rounded-xl shadow-sm p-6 mb-8">
				<div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
					<div>
						<span v-if="post?.caption"
							class="bg-secondary text-white py-1 px-3 rounded-full text-sm mb-4 inline-block">
							{{ post.caption || "Market Insights" }}
						</span>
						<h1 class="text-2xl sm:text-4xl font-bold text-gray-900 mb-2">
							{{ post?.title }}
						</h1>
						<div class="flex items-center text-gray-600 text-sm">
							<span>{{ post?.author_role }}</span>
							<span v-if="post?.published_at" class="mx-2">•</span>
							<span v-if="post?.published_at">{{
								new Date(post.published_at).toLocaleDateString()
							}}</span>
							<span v-if="post?.read_time" class="mx-2">•</span>
							<span v-if="post?.read_time">{{
								post.read_time
							}}</span>
						</div>
					</div>
					<div class="relative flex space-x-2">
						<button @click="copyLink"
							class="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors" title="Copy link">
							<lucideIcons.Link class="h-5 w-5 text-gray-600" />
						</button>
						<button @click="toggleShareDropdown"
							class="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors" title="Share">
							<lucideIcons.Share class="h-5 w-5 text-gray-600" />
						</button>
						<div v-if="showShareDropdown"
							class="absolute right-0 top-10 bg-white border rounded-lg shadow-lg z-10">
							<button @click="shareViaWhatsApp"
								class="block w-full text-left px-4 py-2 hover:bg-gray-100">
								WhatsApp
							</button>
							<button @click="shareViaTelegram"
								class="block w-full text-left px-4 py-2 hover:bg-gray-100">
								Telegram
							</button>
						</div>
					</div>
				</div>
			</div>

			<!-- Main Content -->
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<!-- Left Content -->
				<div class="lg:col-span-2 space-y-8">
					<!-- Image Gallery -->
					<div class="bg-white rounded-xl shadow-sm overflow-hidden">
						<div class="relative h-96 overflow-hidden">
							<img :src="primaryImage" :alt="post?.title || 'Blog post image'"
								class="w-full h-full object-cover transition-transform duration-500 cursor-pointer"
								@click="openImagePopup(primaryImage, 0)" />
							<div
								class="absolute inset-0 bg-gradient-to-b from-black/10 to-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
								<button class="p-3 bg-white/90 rounded-full" @click="openImagePopup(primaryImage, 0)">
									<lucideIcons.Maximize2 class="h-6 w-6 text-gray-800" />
								</button>
							</div>
						</div>
						<div v-if="otherImages.length" class="p-4 bg-gray-50 border-t">
							<div class="flex space-x-3 overflow-x-auto pb-2">
								<div v-for="(img, i) in otherImages" :key="i" @click="openImagePopup(img.url, i + 1)"
									class="cursor-pointer flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2"
									:class="mainImage === img.url
											? 'border-primary'
											: 'border-transparent'
										">
									<img :src="img.url" :alt="`Blog image ${i + 1}`"
										class="w-full h-full object-cover" />
								</div>
							</div>
						</div>
					</div>

					<!-- Tabs -->
					<div class="bg-white rounded-xl shadow-sm">
						<div class="border-b flex overflow-x-auto">
							<button @click="activeTab = 'content'"
								class="px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors"
								:class="activeTab === 'content'
										? 'border-primary text-primary'
										: 'border-transparent text-gray-600 hover:text-gray-800'
									">
								Content
							</button>
							<button @click="activeTab = 'author'"
								class="px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors"
								:class="activeTab === 'author'
										? 'border-primary text-primary'
										: 'border-transparent text-gray-600 hover:text-gray-800'
									">
								About the Author
							</button>
							<button @click="activeTab = 'related'"
								class="px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors"
								:class="activeTab === 'related'
										? 'border-primary text-primary'
										: 'border-transparent text-gray-600 hover:text-gray-800'
									" v-if="post?.related_blogs?.length">
								Related Articles
							</button>
						</div>

						<!-- Tab Content -->
						<div class="p-6">
							<div v-if="activeTab === 'content'">
								<div class="prose max-w-none" v-html="post?.content"></div>
							</div>
							<div v-else-if="activeTab === 'author'">
								<h3 class="text-xl font-semibold mb-4">
									About the Author
								</h3>
								<div class="flex items-center mb-4">
									<div>
										<h4 class="font-medium">
											{{ post?.author_name }}
										</h4>
										<p class="text-sm text-gray-500">
											{{ post?.author_role }}
										</p>
									</div>
								</div>
								<p class="text-sm text-gray-600">
									{{
										post?.author_role
											? `Learn more about ${post.author_name}'s expertise in
									${post.author_role.toLowerCase()}.`
											: "Author information not available."
									}}
								</p>
							</div>
							<div v-else-if="activeTab === 'related'" v-if="post?.related_blogs?.length">
								<h2 class="text-xl font-semibold mb-6">
									Related Articles
								</h2>
								<div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
									<BlogPostCard v-for="related in post?.related_blogs" :key="related.slug"
										:title="related.title" :date="related.created_at" :readTime="related.read_time"
										:excerpt="related.excerpt" :category="related.caption" :slug="related.slug"
										:image="getFeaturedImageUrl(related)" />
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Sidebar -->
				<div class="space-y-6">
					<!-- Subscribe Card -->
					<div class="bg-white rounded-xl shadow-sm p-6">
						<h3 class="text-lg font-bold mb-4">Stay Updated</h3>
						<p class="text-sm text-gray-600 mb-4">
							Subscribe to our newsletter for the latest insights
							and updates.
						</p>
						<NewsLetter class="rounded-xl" />
					</div>

					<!-- Categories -->
					<div class="bg-white rounded-xl shadow-sm p-6">
						<h3 class="text-lg font-bold mb-4">Categories</h3>
						<div class="flex flex-wrap gap-2">
							<a v-for="category in post?.categories" :key="category.id"
								class="py-2 px-4 bg-gray-100 text-sm rounded-full hover:bg-black-100 hover:text-white transition">{{
									category.name }}</a>
						</div>
					</div>

					<!-- Recent Posts -->
					<div class="bg-white rounded-xl shadow-sm p-6">
						<h3 class="text-lg font-bold mb-4">Recent Posts</h3>
						<div v-if="post?.recent_blogs?.length" class="space-y-4">
							<router-link v-for="recent in post.recent_blogs.slice(0, 3)" :key="recent.slug"
								:to="`/blog/${recent.slug}`"
								class="flex items-center hover:bg-gray-50 p-2 rounded-lg transition">
								<div class="w-16 h-16 bg-gray-200 rounded-lg mr-3 overflow-hidden">
									<img :src="getFeaturedImageUrl(recent)" :alt="recent.title"
										class="w-full h-full object-cover" />
								</div>
								<div>
									<p class="font-medium text-sm">
										{{ recent.title }}
									</p>
									<p class="text-xs text-gray-500">
										{{
											new Date(
												recent.created_at,
											).toLocaleDateString()
										}}
									</p>
								</div>
							</router-link>
						</div>
						<p v-else class="text-sm text-gray-500">
							No recent posts available.
						</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Image Pop-up Modal -->
		<div v-if="showImagePopup && selectedImage"
			class="fixed inset-0 bg-black-100/80 z-50 flex items-center justify-center" @click="closeImagePopup">
			<div class="relative max-w-5xl w-full mx-4" @click.stop>
				<button class="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
					@click="closeImagePopup">
					<lucideIcons.X class="h-6 w-6 text-gray-800" />
				</button>
				<button v-if="allImages.length > 1 && currentImageIndex > 0"
					class="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
					@click="prevImage">
					<lucideIcons.ChevronLeft class="h-6 w-6 text-gray-800" />
				</button>
				<button v-if="
					allImages.length > 1 &&
					currentImageIndex < allImages.length - 1
				" class="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
					@click="nextImage">
					<lucideIcons.ChevronRight class="h-6 w-6 text-gray-800" />
				</button>
				<img :src="selectedImage" class="w-full h-auto max-h-[80vh] object-contain rounded-lg"
					alt="Full-screen blog image" />
			</div>
		</div>
	</section>
</template>

<style scoped>
.prose :deep(img) {
	@apply w-full h-auto rounded-lg my-4;
}
</style>
