<script setup lang="ts">
import { ref, watch, onMounted, computed, nextTick } from "vue";
import { useIntersectionObserver } from "../composables/useIntersectionObserver";
import { useAboutUsQuery } from "../composables/useAboutUsPageQuery";
import { useTeamsQuery } from "../composables/useTeam";
import { imagePath } from "../utils/helpers";
import { useRoute } from "vue-router";
import TeamCards from "../components/TeamCards.vue";
import AboutUsPageSkeleton from "../components/common/AboutUsPageSkeleton.vue";
import chairman from "../assets/ceo-img.jpeg";

const aboutUsSectionRef = ref<HTMLElement | null>(null);
const { isVisible } = useIntersectionObserver(aboutUsSectionRef);

const {
	data: aboutUsResponse,
	isLoading: isAboutLoading,
	isError: isAboutError,
	refetch: refetchAbout,
} = useAboutUsQuery(isVisible.value);
const {
	data: teamsResponse,
	isLoading: isTeamsLoading,
	isError: isTeamsError,
	refetch: refetchTeams,
} = useTeamsQuery(isVisible.value);

watch(isVisible, (visible) => {
	if (visible) {
		refetchAbout();
		refetchTeams();
	}
});

const aboutUs = computed(() => aboutUsResponse.value?.about_us);
const clients = computed(() => aboutUsResponse.value?.clienteles || []);
const awards = computed(
	() => aboutUsResponse.value?.award_certifications || [],
);

const teamCategories = computed(() =>
	(teamsResponse.value || []).map((category) => ({
		category: category.name,
		slug: category.slug,
		members: (category.team || []).map((member) => ({
			name: member.name,
			slug: member.slug,
			position: member.position,
			bio: member.bio,
			contact_number: member.contact_number,
			whatsapp_number: member.whatsapp_number,
			imageUrl:
				typeof member.image === "object" && member.image?.url
					? imagePath(member.image.url)
					: member.image || "",
		})),
	})),
);

const route = useRoute();

function scrollToHashWithOffset() {
	if (route.hash) {
		const elementId = route.hash.slice(1);
		const element = document.getElementById(elementId);
		if (element) {
			const topPos =
				element.getBoundingClientRect().top + window.pageYOffset;
			window.scrollTo({
				top: topPos - 180, 
				behavior: "smooth",
			});
		} else {
			setTimeout(() => {
				const retryElement = document.getElementById(elementId);
				if (retryElement) {
					const topPos =
						retryElement.getBoundingClientRect().top +
						window.pageYOffset;
					window.scrollTo({
						top: topPos - 180,
						behavior: "smooth",
					});
				}
			}, 500);
		}
	}
}

watch(
	() => [route.hash, isAboutLoading, isTeamsLoading],
	async ([newHash, aboutLoading, teamsLoading]) => {
		if (newHash && !aboutLoading && !teamsLoading) {
			await nextTick();
			scrollToHashWithOffset();
		}
	},
	{ immediate: true },
);

onMounted(async () => {
	if (!isAboutLoading.value && !isTeamsLoading.value && route.hash) {
		await nextTick();
		scrollToHashWithOffset();
	}
});
</script>

<template>
	<div ref="aboutUsSectionRef">
		<AboutUsPageSkeleton v-if="isAboutLoading || isTeamsLoading" />
		<Error
			v-else-if="isAboutError || isTeamsError"
			message="Failed to load About Us content."
			:retry="refetchAbout"
		/>

		<template v-else-if="aboutUs">
			<!-- HERO -->
			<section class="relative py-24 bg-gradient-to-b from-primary/5 to-white text-center border-b border-gray-200">
				<div class="container">
					<h1 class="text-5xl md:text-7xl font-bold mb-6 text-gray-900 tracking-tight">
						About Million Homes Real Estate Broker
					</h1>
					<p class="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed" v-html="aboutUs.slogan"></p>
				</div>
			</section>

			<!-- MISSION & VISION -->
			<section class="py-24 bg-gradient-to-r from-primary/5 to-primary/10">
				<div class="container grid md:grid-cols-2 gap-12">
					<div class="bg-white rounded-2xl shadow-lg p-10 hover:shadow-xl transition duration-300">
						<div class="flex items-center gap-4 mb-4 text-primary">
							<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
								<path d="M20.172 6.75h-1.861l-4.566 4.564a1.874 1.874 0 1 1-1.06-1.06l4.565-4.565V3.828a.94.94 0 0 1 .275-.664l1.73-1.73a.25.25 0 0 1 .25-.063c.089.026.155.1.173.191l.46 2.301l2.3.46c.09.018.164.084.19.173a.25.25 0 0 1-.062.249l-1.731 1.73a.94.94 0 0 1-.663.275" />
							</svg>
							<h2 class="text-2xl font-bold">Our Mission</h2>
						</div>
						<p class="text-gray-700 leading-relaxed text-lg">{{ aboutUs.mission }}</p>
					</div>
					<div class="bg-white rounded-2xl shadow-lg p-10 hover:shadow-xl transition duration-300">
						<div class="flex items-center gap-4 mb-4 text-primary">
							<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" d="M2.062 12.348a1 1 0 0 1 0-.696a10.75 10.75 0 0 1 19.876 0a1 1 0 0 1 0 .696a10.75 10.75 0 0 1-19.876 0" />
								<circle cx="12" cy="12" r="3" />
							</svg>
							<h2 class="text-2xl font-bold">Our Vision</h2>
						</div>
						<p class="text-gray-700 leading-relaxed text-lg">{{ aboutUs.vision }}</p>
					</div>
				</div>
			</section>

			<!-- OUR STORY -->
			<section id="ceo-message" class="py-20 sm:py-24 px-4 sm:px-6 bg-white">
				<div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
					<img :src="chairman" alt="Chairman" class="rounded-2xl shadow-lg w-full object-cover max-h-[400px]" loading="lazy" />
					<div>
						<h2 class="text-3xl sm:text-4xl font-bold mb-6 text-black-100 leading-snug">CEO’s Message</h2>
						<p class="text-slate-600 leading-relaxed text-base sm:text-lg mb-4">
							At Million Homes Real Estate Broker LLC, we believe that excellence is not just a
							standard—it’s a culture. Our journey has been shaped by bold vision, relentless dedication,
							and a team that thrives on ambition, trust, and innovation. As we continue to elevate the
							standards of real estate advisory in Dubai and beyond, we recognize that our people are our
							greatest asset. Whether you are an experienced professional or just starting your career,
							this is a place where your potential is not only seen—but nurtured. We offer more than just
							a job—we offer a platform to grow, lead, and make an impact in one of the world’s most
							dynamic property markets. Here, your ideas matter, your efforts are celebrated, and your
							career has no boundaries. Join us in redefining excellence. Let’s build a future
							together—one milestone, one home, one dream at a time.
						</p>
						<p class="text-[20px] text-black-100 font-medium font-semibold text-base">— Takuhiko Ito</p>
					</div>
				</div>
			</section>

			<!-- TEAM -->
			<section id="meet-our-team" class="py-24 bg-white border-t border-b border-gray-200">
				<div class="container text-center">
					<h2 class="text-4xl font-semibold mb-4">Meet Our Team</h2>
					<p class="text-gray-600 max-w-2xl mx-auto text-lg mb-10">
						Our dedicated professionals bring years of experience and passion for excellence.
					</p>
					<TeamCards
						lang="en"
						v-if="teamCategories.length"
						:teamCategories="teamCategories"
					/>
				</div>
			</section>

			<!-- AWARDS -->
			<section v-if="awards.length" class="py-24 bg-white border-t border-gray-200">
				<div class="container text-center">
					<h2 class="text-4xl font-semibold mb-10">Awards & Certifications</h2>
					<div class="flex flex-wrap justify-center gap-8">
						<div v-for="(award, index) in awards" :key="index" class="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg hover:shadow-xl p-6 transition group">
							<a :href="award?.link" target="_blank" class="flex flex-col items-center">
								<img v-if="award.image?.url" :src="imagePath(award.image.url)" alt="Award Image" class="w-20 h-20 object-contain mb-4 group-hover:scale-110 transition" />
								<h4 class="font-bold text-lg mb-2">{{ award.title || "Award Title" }}</h4>
								<p class="text-gray-600 text-sm">{{ award.description || "Award Description" }}</p>
							</a>
						</div>
					</div>
				</div>
			</section>

			<!-- CLIENTS -->
			<section class="py-24 bg-gray-50 border-t border-gray-200">
				<div class="container text-center">
					<h2 class="text-4xl font-semibold mb-10">Our Clients</h2>
					<div class="flex flex-wrap justify-center gap-8">
						<div v-for="(client, index) in clients" :key="index" class="w-36 h-20 flex items-center justify-center bg-white rounded-xl shadow-sm transition">
							<img :src="imagePath(client.image?.url)" :alt="client.client_name" class="max-h-12 object-contain" />
						</div>
					</div>
				</div>
			</section>
		</template>
	</div>
</template>