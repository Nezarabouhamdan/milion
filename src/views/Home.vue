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
.animate-fade-in {
    animation: fadeIn 0.5s ease-in-out;
}
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>