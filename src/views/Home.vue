<script setup lang="ts">
import { ref, onMounted } from "vue";
import HeroSlider from "./HeroSlider.vue";
import PropertySearch from "./PropertySearch.vue";
import FeaturedProperties from "./FeaturedProperties.vue";
import Testimonials from "./Testimonials.vue";
import CallToAction from "./CallToAction.vue";
import AboutSection from "./AboutSection.vue";
import WhyChooseUs from "./WhyChooseUse.vue";
import NewsletterSignup from "./NewsLetter.vue";
import BlogsPreview from "./BlogsPreview.vue";
import Popup from "./Popup.vue"; 
import * as lucideIcons from "lucide-vue-next";
import axios from "../services/axios";

const popups = ref();

onMounted(async () => {

	try {
		const res = await axios.get("/front/popup");
		if (res.data.status === "success" && res.data.data.length > 0) {
			popups.value = res.data.data;
		}
	} catch (error) {
		console.error("Failed to fetch popup:", error);
	}
});
</script>

<template>
	<Popup v-if="popups" :popups="popups" />
	<HeroSlider class="hero-slider" />

	<!-- Google Reviews Bar -->
	<div class="gr-bar">
		<div class="gr-card">
			<!-- Rating -->
			<div class="gr-rating">
				<!-- Laurel SVG -->
				<svg class="gr-laurel" viewBox="0 0 80 60" fill="none" aria-hidden="true">
					<g opacity="0.85">
						<path d="M8 30 C4 22, 5 12, 12 8 C10 16, 12 22, 18 26" fill="#2a2a2a"/>
						<path d="M5 36 C1 28, 2 16, 10 10 C8 20, 10 28, 16 34" fill="#1a1a1a"/>
						<path d="M10 42 C5 34, 6 22, 14 16 C12 26, 14 34, 20 40" fill="#2a2a2a"/>
						<path d="M15 48 C10 38, 12 26, 20 20 C18 32, 20 40, 26 46" fill="#1a1a1a"/>
						<path d="M72 30 C76 22, 75 12, 68 8 C70 16, 68 22, 62 26" fill="#2a2a2a"/>
						<path d="M75 36 C79 28, 78 16, 70 10 C72 20, 70 28, 64 34" fill="#1a1a1a"/>
						<path d="M70 42 C75 34, 74 22, 66 16 C68 26, 66 34, 60 40" fill="#2a2a2a"/>
						<path d="M65 48 C70 38, 68 26, 60 20 C62 32, 60 40, 54 46" fill="#1a1a1a"/>
					</g>
				</svg>
				<div class="gr-rating__body">
					<div class="gr-rating__num">4.6</div>
					<div class="gr-rating__stars" aria-label="4.6 out of 5 stars">★★★★★</div>
				</div>
			</div>

			<!-- Divider -->
			<div class="gr-divider" aria-hidden="true"></div>

			<!-- Tagline -->
			<p class="gr-tagline">
				Every real estate <span class="gr-accent">decision.</span>
				One <span class="gr-accent">trusted</span> partner.
			</p>

			<!-- Divider -->
			<div class="gr-divider" aria-hidden="true"></div>

			<!-- Google badge -->
			<div class="gr-google">
				<svg class="gr-google__logo" viewBox="0 0 24 24" aria-label="Google">
					<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
					<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
					<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
					<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
				</svg>
				<div>
					<div class="gr-google__count">18</div>
					<div class="gr-google__label">Reviews</div>
				</div>
			</div>
		</div>
	</div>

	<PropertySearch />
	<AboutSection />
	<FeaturedProperties />
	<WhyChooseUs />
	<Testimonials />
	<NewsletterSignup />
	<BlogsPreview />
</template>

<style scoped>
.hero-slider {
	min-height: 200px;
}

/* ── Google Reviews Bar ─────────────────────────────────────────── */
.gr-bar {
	background: #f5f5f5;
	padding: 1rem 1.5rem;
	display: flex;
	justify-content: center;
}
.gr-card {
	display: inline-flex;
	align-items: center;
	gap: 1.6rem;
	background: #ffffff;
	border-radius: 50px;
	padding: 0.7rem 1.8rem;
	box-shadow: 0 2px 16px rgba(0,0,0,0.10);
	flex-wrap: wrap;
	justify-content: center;
}
.gr-rating {
	display: flex;
	align-items: center;
	gap: 0.55rem;
}
.gr-laurel {
	width: 42px;
	height: 32px;
}
.gr-rating__body {
	display: flex;
	flex-direction: column;
	gap: 1px;
}
.gr-rating__num {
	font-size: 1.55rem;
	font-weight: 800;
	color: #1a1a1a;
	line-height: 1;
}
.gr-rating__stars {
	font-size: 0.82rem;
	color: #f5a623;
	letter-spacing: 2px;
	line-height: 1;
}
.gr-divider {
	width: 1px;
	height: 38px;
	background: #e0e0e0;
	flex-shrink: 0;
}
.gr-tagline {
	font-size: 0.95rem;
	font-weight: 500;
	color: #1a1a1a;
	white-space: nowrap;
}
.gr-accent {
	color: #C9A028;
	font-weight: 600;
}
.gr-google {
	display: flex;
	align-items: center;
	gap: 0.55rem;
}
.gr-google__logo {
	width: 30px;
	height: 30px;
	flex-shrink: 0;
}
.gr-google__count {
	font-size: 1.15rem;
	font-weight: 800;
	color: #1a1a1a;
	line-height: 1.1;
}
.gr-google__label {
	font-size: 0.62rem;
	color: #555;
	text-decoration: underline;
	letter-spacing: 0.03em;
}
@media (max-width: 640px) {
	.gr-divider { display: none; }
	.gr-tagline { white-space: normal; text-align: center; }
	.gr-card { gap: 1rem; padding: 0.7rem 1.2rem; border-radius: 16px; }
}
.animate-fade-in {
    animation: fadeIn 0.5s ease-in-out;
}
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>