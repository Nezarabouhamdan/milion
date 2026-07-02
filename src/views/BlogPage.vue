<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useAllBlogsQuery } from "../composables/useAllBlogQuery";
import { getBlogCategories } from "../api/blog/api";
import { imagePath } from "../utils/helpers";
import NewsLetter from "./NewsLetter.vue";
import BlogCard from "../components/BlogCard.vue";
import FeaturedBlog from "../components/FeaturedBlog.vue";
import IconSearch from "../components/icons/IconSearch.vue";
import IconFilter from "../components/icons/IconFilter.vue";
import IconClose from "../components/icons/IconClose.vue";
import LoadingSpinner from "../components/LoadingSpinner.vue";
import { useSeoMeta } from "@unhead/vue";

// State management
const searchQuery = ref("");
const selectedCategory = ref("all");
const currentPage = ref(1);
const showMobileFilters = ref(false);
const sortOrder = ref("desc"); // default: newest first
const selectedType = ref("blog");

// Query parameters
const queryParams = computed(() => {
	return {
		page: currentPage.value,
		title: searchQuery.value,
		category:
			selectedCategory.value !== "all"
				? selectedCategory.value
				: undefined,
		sortBy: "created_at",
		type: selectedType.value,
		sortOrder: sortOrder.value,
	};
});

// Fetch categories
const categoryList = ref<any[]>([]);
const isLoadingCategories = ref(true);

getBlogCategories()
	.then((res) => {
		categoryList.value = [{ slug: "all", name: "All Categories" }, ...res];
		isLoadingCategories.value = false;
	})
	.catch((err) => {
		console.log("error fetching categories", err);
		isLoadingCategories.value = false;
	});

// Fetch blogs data
const { data, isLoading, isError, refetch } = useAllBlogsQuery(true, {
	page: currentPage,
	title: searchQuery,
	category: computed(() =>
		selectedCategory.value !== "all" ? selectedCategory.value : undefined,
	),
	type: selectedType,
	sortBy: ref("created_at"),
	sortOrder: sortOrder,
});

// Categories computed property
const categories = computed(() => {
	return categoryList.value;
});

// Filter blogs
const filteredBlogs = computed(() => {
	if (!data.value?.data?.data) return [];
	return data.value.data.data;
});

// Featured blog - pick the first active blog with published status
const featuredBlog = computed(() => {
	if (!data.value?.data) return null;
	return data.value.data.data.find(
		(blog) =>
			blog.status === "active" &&
			blog.publish_status === "published"
	);
});

// Remaining blogs (excluding featured)
const remainingBlogs = computed(() => {
	if (!filteredBlogs.value || !featuredBlog.value) return filteredBlogs.value;
	return filteredBlogs.value.filter(
		(blog) => blog.id !== featuredBlog.value?.id,
	);
});

// Pagination data
const pagination = computed(() => {
	if (!data.value?.data) return null;
	return {
		currentPage: data.value.data.current_page,
		lastPage: data.value.data.last_page,
		from: data.value.data.from,
		to: data.value.data.to,
		total: data.value.data.total,
		links: data.value.data.links,
	};
});

// Methods
const handleSearch = () => {
	currentPage.value = 1;
	refetch();
};

const setCategory = (category: string) => {
	selectedCategory.value = category;
	currentPage.value = 1;
	showMobileFilters.value = false;
	refetch();
};

const setSelectedType = (type: string) => {
	selectedType.value = type;
	currentPage.value = 1;
	refetch();
};

const setSortOrder = (order: string) => {
	sortOrder.value = order;
	currentPage.value = 1;
	refetch();
};

const handlePageChange = (page: number) => {
	currentPage.value = page;
	window.scrollTo({ top: 0, behavior: "smooth" });
	refetch();
};

const clearFilters = () => {
	selectedCategory.value = "all";
	searchQuery.value = "";
	sortOrder.value = "desc";
	currentPage.value = 1;
	refetch();
};

// Watch for search query changes with debounce
let debounceTimeout: NodeJS.Timeout;
watch(searchQuery, () => {
	clearTimeout(debounceTimeout);
	debounceTimeout = setTimeout(() => {
		handleSearch();
	}, 500);
});

// Function to get featured image URL
const getFeaturedImageUrl = (blog: any): string => {
	if (!blog.assets || blog.assets.length === 0) {
		return "/images/placeholder.jpg";
	}

	const primaryImage = blog.assets.find(
		(asset: any) => asset.is_primary === 1,
	);
	const fallbackImage = blog.assets[0];

	return imagePath(primaryImage ? primaryImage.url : fallbackImage.url);
};

// Format date
const formatDate = (dateString: string) => {
	if (!dateString) return "";
	const date = new Date(dateString);
	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(date);
};
</script>

<template>
	<!-- Page Header -->
	<section
		class="bg-gradient-to-r from-primary to-primary-dark bg-black-100 text-white py-16 md:py-24"
	>
		<div class="container mx-auto px-4">
			<div class="max-w-4xl">
				<h1 class="text-4xl text-white md:text-5xl font-bold mb-4">
					Industry Insights
				</h1>
				<p class="text-lg md:text-xl text-gray-100 max-w-2xl">
					Stay updated with the latest trends, news, and expert advice
					from the real estate industry.
				</p>
			</div>
		</div>
	</section>

	<!-- Blog Content -->
	<section class="py-12 md:py-16">
		<div class="container mx-auto px-4">
			<!-- News/Blogs Tabs -->
			<div class="mb-8">
				<div class="flex justify-center md:justify-start gap-4">
					<button
						@click="setSelectedType('blog')"
						:class="[
							'px-6 py-3 rounded-lg text-base font-semibold transition-colors shadow-md',
							selectedType === 'blog'
								? 'bg-black-100 text-white'
								: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100',
						]"
					>
						Blogs
					</button>
					<button
						@click="setSelectedType('news')"
						:class="[
							'px-6 py-3 rounded-lg text-base font-semibold transition-colors shadow-md',
							selectedType === 'news'
								? 'bg-black-100 text-white'
								: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100',
						]"
					>
						News
					</button>
				</div>
			</div>

			<!-- Desktop Layout: Two Columns -->
			<div class="flex flex-col md:flex-row gap-8">
				<!-- Left Sidebar: Categories -->
				<aside class="hidden md:block md:w-1/4">
					<div class="sticky top-4 bg-white rounded-xl shadow-md p-6">
						<h2
							class="text-xl font-semibold text-gray-800 mb-4 flex items-center"
						>
							<svg
								class="w-5 h-5 mr-2 text-primary"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 10h18M3 14h18m-9-4v8"
								></path>
							</svg>
							Categories
						</h2>
						<div
							v-if="isLoadingCategories"
							class="flex justify-center py-4"
						>
							<LoadingSpinner />
						</div>
						<ul
							v-else
							class="space-y-2 max-h-[400px] overflow-y-auto pr-2"
						>
							<li
								v-for="category in categories"
								:key="category.slug"
							>
								<button
									:class="[
										'w-full text-left py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center',
										selectedCategory === category.slug
											? 'bg-black-100 text-white'
											: 'text-gray-700 hover:bg-gray-100',
									]"
									@click="setCategory(category.slug)"
								>
									<span class="flex-1">{{
										category.name
									}}</span>
									<span
										v-if="
											selectedCategory === category.slug
										"
										class="ml-2"
									>
										<svg
											class="w-4 h-4"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M5 13l4 4L19 7"
											/>
										</svg>
									</span>
								</button>
							</li>
						</ul>
					</div>
				</aside>

				<!-- Right Content: Blogs/News -->
				<div class="md:w-3/4">
					<!-- Search and Filter -->
					<div class="mb-10">
						<!-- Desktop View -->
						<div
							class="hidden md:flex justify-between items-center gap-6 mb-6"
						>
							<div class="relative w-full md:w-96">
								<input
									v-model="searchQuery"
									type="text"
									:placeholder="`Search `"
									class="w-full py-3 px-4 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
								/>
								<IconSearch
									class="absolute right-3 top-3 text-gray-400 w-5 h-5"
								/>
							</div>

							<div class="flex items-center gap-3">
								<!-- Sort Order Buttons -->
								<div
									class="flex items-center gap-2 border border-gray-300 rounded-lg p-1"
								>
									<button
										@click="setSortOrder('desc')"
										:class="[
											'px-3 py-1 rounded-md text-sm font-medium transition-colors',
											sortOrder === 'desc'
												? 'bg-black-100 text-white'
												: 'text-gray-700 hover:bg-gray-100',
										]"
									>
										Newest
									</button>
									<button
										@click="setSortOrder('asc')"
										:class="[
											'px-3 py-1 rounded-md text-sm font-medium transition-colors',
											sortOrder === 'asc'
												? 'bg-black-100 text-white'
												: 'text-gray-700 hover:bg-gray-100',
										]"
									>
										Oldest
									</button>
								</div>

								<!-- Clear Filters Button -->
								<button
									v-if="
										selectedCategory !== 'all' ||
										searchQuery ||
										sortOrder !== 'desc'
									"
									@click="clearFilters"
									class="ml-3 py-2 px-4 rounded-lg text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
								>
									Clear Filters
								</button>
							</div>
						</div>

						<!-- Mobile View -->
						<div class="flex md:hidden flex-col gap-4">
							<div class="flex items-center gap-3">
								<div class="relative flex-1">
									<input
										v-model="searchQuery"
										type="text"
										:placeholder="`Search `"
										class="w-full py-3 px-4 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
									/>
									<IconSearch
										class="absolute right-3 top-3 text-gray-400 w-5 h-5"
									/>
								</div>
								<button
									@click="
										showMobileFilters = !showMobileFilters
									"
									class="p-3 bg-gray-100 rounded-lg border border-gray-300 text-gray-700"
								>
									<IconFilter
										v-if="!showMobileFilters"
										class="w-5 h-5"
									/>
									<IconClose v-else class="w-5 h-5" />
								</button>
							</div>

							<div
								v-if="showMobileFilters"
								class="flex flex-col gap-4 mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200"
							>
								<!-- Sort Options -->
								<div>
									<h4
										class="text-sm font-semibold text-gray-700 mb-2"
									>
										Sort By
									</h4>
									<div class="flex gap-2">
										<button
											@click="setSortOrder('desc')"
											:class="[
												'flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors',
												sortOrder === 'desc'
													? 'bg-black-100 text-white'
													: 'bg-white border border-gray-300 text-gray-700',
											]"
										>
											Newest First
										</button>
										<button
											@click="setSortOrder('asc')"
											:class="[
												'flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors',
												sortOrder === 'asc'
													? 'bg-black-100 text-white'
													: 'bg-white border border-gray-300 text-gray-700',
											]"
										>
											Oldest First
										</button>
									</div>
								</div>

								<!-- Categories -->
								<div>
									<h4
										class="text-sm font-semibold text-gray-700 mb-2"
									>
										Categories
									</h4>
									<div class="grid grid-cols-2 gap-2">
										<button
											v-for="category in categories"
											:key="category.slug"
											:class="[
												'py-2 px-3 rounded-full text-sm font-medium text-center transition-colors',
												selectedCategory ===
												category.slug
													? 'bg-black-100 text-white'
													: 'bg-white border border-gray-300 text-gray-700',
											]"
											@click="setCategory(category.slug)"
										>
											{{ category.name }}
										</button>
									</div>
								</div>

								<!-- Clear Filters -->
								<button
									v-if="
										selectedCategory !== 'all' ||
										searchQuery ||
										sortOrder !== 'desc'
									"
									@click="clearFilters"
									class="w-full py-2 px-4 mt-2 rounded-lg text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
								>
									Clear All Filters
								</button>
							</div>
						</div>
					</div>

					<!-- Loading State -->
					<div v-if="isLoading" class="flex justify-center py-20">
						<LoadingSpinner />
					</div>

					<!-- Error State -->
					<div
						v-else-if="isError"
						class="bg-red-50 p-6 rounded-lg text-center"
					>
						<p class="text-lg text-red-600 mb-2">
							Failed to load
							{{ selectedType === "blog" ? "blogs" : "news" }}
						</p>
						<button
							@click="refetch"
							class="px-4 py-2 bg-black-100 text-white rounded-lg hover:bg-black-100-dark transition"
						>
							Try Again
						</button>
					</div>

					<!-- Empty State -->
					<div
						v-else-if="filteredBlogs.length === 0"
						class="py-16 text-center"
					>
						<h3 class="text-2xl font-semibold text-gray-700 mb-2">
							No
							{{ selectedType === "news" ? "news" : "blogs" }}
							found
						</h3>
						<p class="text-gray-500 mb-6">
							Try adjusting your search or filter criteria
						</p>
						<button
							@click="clearFilters"
							class="px-4 py-2 bg-black-100 text-white rounded-lg hover:bg-black-100-dark transition"
						>
							Clear Filters
						</button>
					</div>

					<div v-else>
						<!-- Featured Article -->
						<div v-if="featuredBlog" class="mb-12">
							<FeaturedBlog
								:title="featuredBlog.title"
								:date="formatDate(featuredBlog.created_at)"
								:read-time="
									featuredBlog.read_time || '10 min read'
								"
								:excerpt="featuredBlog.excerpt"
								:slug="featuredBlog.slug"
								:image="getFeaturedImageUrl(featuredBlog)"
								:author="featuredBlog.author_name"
								:author-role="featuredBlog.author_role"
								:category="
									featuredBlog.categories?.[0]?.name || ''
								"
							/>
						</div>

						<!-- Blog/News Grid -->
						<div
							class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
						>
							<BlogCard
								v-for="blog in remainingBlogs"
								:key="blog.id"
								:title="blog.title"
								:date="formatDate(blog.created_at)"
								:read-time="blog.read_time || '5 min read'"
								:excerpt="blog.excerpt"
								:category="blog.categories?.[0]?.name || ''"
								:slug="blog.slug"
								:image="getFeaturedImageUrl(blog)"
								:author="blog.author_name"
							/>
						</div>
					</div>

					<!-- Pagination -->
					<div
						v-if="pagination && pagination.lastPage > 1"
						class="flex justify-center mt-12"
					>
						<div class="flex items-center gap-2">
							<span
								>{{ pagination.currentPage }} of
								{{ pagination.lastPage }}</span
							>
							<button
								@click="
									handlePageChange(pagination.currentPage - 1)
								"
								:disabled="pagination.currentPage === 1"
								:class="[
									'w-10 h-10 flex items-center justify-center rounded-lg',
									pagination.currentPage === 1
										? 'text-gray-400 bg-gray-100 cursor-not-allowed'
										: 'border border-gray-300 text-gray-700 hover:border-primary hover:text-primary',
								]"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15 19l-7-7 7-7"
									/>
								</svg>
							</button>

							<template
								v-for="link in pagination.links.slice(1, -1)"
								:key="link.label"
							>
								<button
									v-if="link.url"
									@click="
										handlePageChange(Number(link.label))
									"
									:class="[
										'w-10 h-10 flex items-center justify-center rounded-lg',
										link.active
											? 'bg-black-100 text-white'
											: 'border border-gray-300 text-gray-700 hover:border-primary hover:text-primary',
									]"
								>
									{{ link.label }}
								</button>
								<span v-else class="px-2 text-gray-500">{{
									link.label
								}}</span>
							</template>

							<button
								@click="
									handlePageChange(pagination.currentPage + 1)
								"
								:disabled="
									pagination.currentPage ===
									pagination.lastPage
								"
								:class="[
									'w-10 h-10 flex items-center justify-center rounded-lg',
									pagination.currentPage ===
									pagination.lastPage
										? 'text-gray-400 bg-gray-100 cursor-not-allowed'
										: 'border border-gray-300 text-gray-700 hover:border-primary hover:text-primary',
								]"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 5l7 7-7 7"
									/>
								</svg>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Newsletter Section -->
	<section>
		<NewsLetter />
	</section>
</template>
