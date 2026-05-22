<script setup lang="ts">
import { ref, watch } from "vue";
import { useIntersectionObserver } from "../composables/useIntersectionObserver";
import { useFAQsQuery } from "../composables/useFaqQuery";
import FAQSkeleton from "../components/common/FaqSkeleton.vue";
import * as lucideIcons from "lucide-vue-next";

const faqRef = ref<HTMLElement | null>(null);
const { isVisible } = useIntersectionObserver(faqRef);
const { data: faqs, isLoading, refetch, isError } = useFAQsQuery(false);

const activeCategory = ref<number | null>(null);
const expandedQuestions = ref(new Set<number>());
const showMobileCategories = ref(false);

// Watch for visibility to trigger load
watch(isVisible, (visible) => {
	if (visible) refetch();
});

// Automatically set first category active
watch(faqs, (newFaqs) => {
	if (newFaqs && newFaqs.length > 0 && activeCategory.value === null) {
		activeCategory.value = newFaqs[0].id;
	}
});

// Change active category
const setActiveCategory = (id: number) => {
	activeCategory.value = id;
	showMobileCategories.value = false;
};

// Toggle accordion
const toggleQuestion = (id: number) => {
	expandedQuestions.value.has(id)
		? expandedQuestions.value.delete(id)
		: expandedQuestions.value.add(id);
};

const isExpanded = (id: number) => expandedQuestions.value.has(id);
</script>

<template>
	<!-- Hero Section -->
	<section
		class="py-16 sm:py-20 bg-gradient-to-b from-gray-50 to-gray-100 text-center"
	>
		<div class="container mx-auto px-4">
			<h1
				class="text-4xl sm:text-5xl md:text-6xl font-bold text-black-100 mb-4"
			>
				Frequently Asked Questions
			</h1>
			<p class="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-6">
				Find answers to common questions about our services, processes,
				and more.
			</p>
			<div class="flex justify-center">
				<button
					class="px-6 py-3 bg-black-100 text-white rounded-lg hover:bg-black-200 transition flex items-center gap-2"
					@click="faqRef?.scrollIntoView({ behavior: 'smooth' })"
				>
					Explore FAQs
					<lucideIcons.ArrowDown class="w-5 h-5" />
				</button>
			</div>
		</div>
	</section>

	<!-- FAQ Section -->
	<section ref="faqRef" class="py-24 bg-gradient-to-b from-gray-50 to-white">
		<div class="container mx-auto px-4">
			<!-- Loader -->
			<FAQSkeleton v-if="isLoading" />

			<!-- Error -->
			<div
				v-else-if="isError"
				class="bg-red-50 p-6 rounded-lg text-center"
			>
				<p class="text-lg text-red-600 mb-2">Failed to load FAQs</p>
				<button
					@click="refetch"
					class="px-4 py-2 bg-black-100 text-white rounded-lg hover:bg-black-200 transition"
				>
					Try Again
				</button>
			</div>

			<!-- Content -->
			<div v-else class="flex flex-col md:flex-row gap-8">
				<!-- Sidebar: Categories (Desktop) -->
				<aside class="hidden md:block md:w-1/4">
					<div
						class="sticky top-4 bg-white rounded-xl shadow-md p-6 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400"
					>
						<h2
							class="text-xl font-semibold text-gray-800 mb-4 flex items-center"
						>
							<lucideIcons.List
								class="w-5 h-5 mr-2 text-primary"
							/>
							Categories
						</h2>
						<ul class="space-y-2">
							<li v-for="category in faqs" :key="category.id">
								<button
									:class="[
										'w-full text-left py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center',
										activeCategory === category.id
											? 'bg-black-100 text-white'
											: 'text-gray-700 hover:bg-gray-100',
									]"
									@click="setActiveCategory(category.id)"
								>
									<span class="flex-1">{{
										category.category
									}}</span>
									<lucideIcons.Check
										v-if="activeCategory === category.id"
										class="w-4 h-4 ml-2"
									/>
								</button>
							</li>
						</ul>
					</div>
				</aside>

				<!-- Main Content: Accordion -->
				<div class="md:w-3/4">
					<!-- Mobile Categories Toggle -->
					<div class="md:hidden mb-6">
						<button
							@click="
								showMobileCategories = !showMobileCategories
							"
							class="flex items-center justify-between w-full p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
						>
							<span class="text-sm font-medium text-gray-700">
								{{
									faqs?.find((c) => c.id === activeCategory)
										?.category || "Select Category"
								}}
							</span>
							<lucideIcons.ChevronDown
								class="w-5 h-5 text-gray-500"
								:class="{ 'rotate-180': showMobileCategories }"
							/>
						</button>
						<div
							v-if="showMobileCategories"
							class="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200"
						>
							<ul class="space-y-2">
								<li v-for="category in faqs" :key="category.id">
									<button
										:class="[
											'w-full text-left py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center',
											activeCategory === category.id
												? 'bg-black-100 text-white'
												: 'text-gray-700 hover:bg-gray-100',
										]"
										@click="setActiveCategory(category.id)"
									>
										<span class="flex-1">{{
											category.category
										}}</span>
										<lucideIcons.Check
											v-if="
												activeCategory === category.id
											"
											class="w-4 h-4 ml-2"
										/>
									</button>
								</li>
							</ul>
						</div>
					</div>

					<!-- Accordion -->
					<div
						v-for="category in faqs"
						:key="category.id"
						v-show="activeCategory === category.id"
						class="space-y-4"
					>
						<h2 class="text-2xl font-semibold text-gray-800 mb-4">
							{{ category.category }}
						</h2>
						<div
							v-for="q in category.questions"
							:key="q.id"
							class="rounded-xl bg-white shadow-sm overflow-hidden transition hover:shadow-md"
						>
							<button
								@click="toggleQuestion(q.id)"
								class="w-full flex justify-between items-center p-6 text-left focus:outline-none focus:ring-2 focus:ring-primary"
							>
								<h3
									class="text-lg font-semibold text-black-100"
								>
									{{ q.question }}
								</h3>
								<lucideIcons.ChevronDown
									class="w-5 h-5 text-primary transition-transform duration-300"
									:class="{ 'rotate-180': isExpanded(q.id) }"
								/>
							</button>
							<transition name="fade-slide">
								<div
									v-show="isExpanded(q.id)"
									class="px-6 pb-6 text-black-100 border-t border-gray-100"
								>
									<p class="leading-relaxed">
										{{ q.answer }}
									</p>
								</div>
							</transition>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
	transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
	opacity: 0;
	transform: translateY(-8px);
}

::-webkit-scrollbar {
	height: 8px;
	width: 3px;
}

::-webkit-scrollbar-thumb {
	background-color: rgba(0, 0, 0, 0.2);
	border-radius: 3px;
	opacity: 0.7;
}
</style>
