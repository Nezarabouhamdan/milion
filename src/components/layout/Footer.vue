<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import footerlogo from "../../assets/logo_white_1.png";
import { useSettingsStore } from "../../stores/settingsStore";
import IconFacebook from "../icons/IconFacebook.vue";
import IconInstagram from "../icons/IconInstagram.vue";
import IconLinkedin from "../icons/IconLinkedin.vue";

const settingsStore = useSettingsStore();
const lang = ref(localStorage.getItem("lang") ?? "en");

let observer: MutationObserver;
onMounted(() => {
	const el = document.documentElement;
	observer = new MutationObserver(() => {
		if (localStorage.getItem("lang") !== "ar") lang.value = el.lang;
	});
	observer.observe(el, { attributes: true, attributeFilter: ["lang"] });
});
onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
	<footer class="bg-black-200 text-white">
		<div class="container pt-20 pb-12">
			<div class="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-12">
				<div>
					<h2 class="font-semibold text-white text-lg mb-6">Useful Links</h2>
					<ul class="space-y-3 text-gray-300 text-sm">
						<li><router-link to="/about-us" class="hover:text-secondary">About Us</router-link></li>
						<li><router-link to="/contact-us" class="hover:text-secondary">Contact Us</router-link></li>
						<li><router-link to="/careers" class="hover:text-secondary">Careers</router-link></li>
						<li><router-link to="/faq" class="hover:text-secondary">FAQ</router-link></li>
						<li><router-link to="/privacy-policy" class="hover:text-secondary">Privacy Policy</router-link></li>
						<li><router-link to="/terms-of-service" class="hover:text-secondary">Terms of Service</router-link></li>
					</ul>
				</div>
				<div>
					<h2 class="font-semibold text-white text-lg mb-6">Properties</h2>
					<ul class="space-y-3 text-gray-300 text-sm">
						<li><router-link to="/properties" class="hover:text-secondary">Browse Properties</router-link></li>
						<li><router-link to="/areas" class="hover:text-secondary">Explore Areas</router-link></li>
						<li><router-link to="/service/buy" class="hover:text-secondary">Buy Property</router-link></li>
						<li><router-link to="/service/sell" class="hover:text-secondary">Sell Property</router-link></li>
						<li><router-link to="/service/rent" class="hover:text-secondary">Rent Property</router-link></li>
						<li><router-link to="/service/property-management" class="hover:text-secondary">Property Management</router-link></li>
						<li><router-link to="/service/holiday-homes" class="hover:text-secondary">{{ lang === "ja" ? "民泊運営" : lang === "zh-CN" ? "假日住宅" : lang === "ar" ? "منازل الإجازات" : "Holiday Homes" }}</router-link></li>
					</ul>
				</div>
				<div>
					<h2 class="font-semibold text-white text-lg mb-6">Insights</h2>
					<ul class="space-y-3 text-gray-300 text-sm">
						<li><router-link to="/blogs" class="hover:text-secondary">Our Blog</router-link></li>
						<li><router-link to="/service/mortgage-calculator" class="hover:text-secondary">{{ lang === "ja" ? "住宅ローン" : lang === "zh-CN" ? "房贷计算器" : lang === "ar" ? "حاسبة التمويل العقاري" : "Mortgage Calculator" }}</router-link></li>
						<li><router-link to="/sell" class="hover:text-secondary">Sell Enquiry</router-link></li>
					</ul>
				</div>
				<div>
					<h2 class="font-semibold text-lg text-white mb-6">Visit Office</h2>
					<ul class="space-y-3 text-gray-300 text-sm">
						<li>{{ lang === "ja" ? "年、オパールタワー、ビジネスベイ、ドバイ、アラブ首長国連邦" : settingsStore.getSetting("location") }}</li>
						<li><a :href="'mailto:' + settingsStore.getSetting('contact_email')" class="hover:text-secondary">{{ settingsStore.getSetting("contact_email") }}</a></li>
						<li><a :href="'tel:' + settingsStore.getSetting('contact_number')" class="hover:text-secondary">{{ settingsStore.getSetting("contact_number") }}</a></li>
					</ul>
				</div>
				<div class="w-full h-64 rounded-lg overflow-hidden shadow mt-6">
					<p class="w-full h-full" v-html="settingsStore.getSetting('map_link')" loading="lazy" title="Office Location Map"></p>
				</div>
			</div>
			<div class="border-t border-gray-700 my-8"></div>
			<div class="flex flex-col lg:flex-row justify-between items-center gap-4 text-sm text-gray-400">
				<div class="flex items-center gap-3">
					<router-link to="/" class="flex items-center gap-2 hover:text-secondary">
						<img :src="footerlogo" alt="Logo" class="h-10 w-auto" />
						<span class="text-white font-semibold text-base">MillionHomes</span>
					</router-link>
					<a :href="settingsStore.getSetting('facebook_link')" target="_blank" rel="noopener" class="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"><IconFacebook /></a>
					<a :href="settingsStore.getSetting('instagram_link')" target="_blank" rel="noopener" class="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"><IconInstagram /></a>
					<a :href="settingsStore.getSetting('linkedin_link')" target="_blank" rel="noopener" class="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"><IconLinkedin /></a>
				</div>
				<ul class="flex items-center gap-6">
					<li><router-link to="/contact-us" class="hover:text-secondary transition-colors">Support</router-link></li>
					<li><router-link to="/privacy-policy" class="hover:text-secondary transition-colors">Privacy Policy</router-link></li>
					<li><router-link to="/terms-of-service" class="hover:text-secondary transition-colors">Terms of Use</router-link></li>
				</ul>
				<p class="text-gray-400">&copy; 2025 Million Homes. All rights reserved.</p>
			</div>
		</div>
	</footer>
</template>

<style scoped>
::v-deep .w-full iframe { width: 100% !important; height: 100% !important; display: block; }
</style>