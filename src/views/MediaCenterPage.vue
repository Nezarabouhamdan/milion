<script setup lang="ts">
import { onMounted } from "vue";
import { useSeoMeta } from "@unhead/vue";

useSeoMeta({
	title: "Media Center | Million Homes Real Estate",
	description: "Explore the latest property reels and gallery from Million Homes Real Estate Dubai.",
});

onMounted(() => {
	if (!document.querySelector('script[src="https://w.behold.so/widget.js"]')) {
		const script = document.createElement("script");
		script.type = "module";
		script.src = "https://w.behold.so/widget.js";
		document.head.appendChild(script);
	}
});
</script>

<template>
	<div class="bg-black-100 min-h-screen">

		<!-- Hero -->
		<section class="relative py-24 overflow-hidden">
			<div class="absolute inset-0 pointer-events-none"
				style="background: radial-gradient(ellipse 60% 40% at 50% 0%, rgba(212,175,55,0.07) 0%, transparent 70%);"></div>
			<div class="container mx-auto px-4 text-center relative">
				<div class="flex items-center justify-center gap-3 mb-6">
					<span class="h-px w-12" style="background: linear-gradient(90deg, transparent, #D4AF37);"></span>
					<span class="text-xs tracking-widest uppercase font-semibold" style="color:#C9A028;">@millionhomesdubai</span>
					<span class="h-px w-12" style="background: linear-gradient(90deg, #D4AF37, transparent);"></span>
				</div>
				<h1 class="text-5xl md:text-7xl font-bold mb-5 tracking-tight gold-gradient-text">
					Media Center
				</h1>
				<p class="text-gray-400 max-w-xl mx-auto text-base leading-relaxed">
					Explore our latest property reels and the finest real estate in Dubai.
				</p>
				<a
					href="https://www.instagram.com/millionhomesdubai"
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-2.5 mt-8 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105"
					style="background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045); color:#fff; box-shadow: 0 4px 20px rgba(253,29,29,0.2);"
				>
					<svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 flex-shrink-0">
						<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
					</svg>
					Follow us on Instagram
				</a>
			</div>
		</section>

		<!-- Feed -->
		<section class="pb-24">
			<div class="container mx-auto px-4">
				<div class="flex items-center gap-4 mb-12">
					<div class="h-px flex-1" style="background: linear-gradient(90deg, rgba(212,175,55,0.4), transparent);"></div>
					<h2 class="text-2xl font-bold tracking-widest uppercase gold-gradient-text">Latest Posts</h2>
					<div class="h-px flex-1" style="background: linear-gradient(90deg, transparent, rgba(212,175,55,0.4));"></div>
				</div>
				
				<div class="max-w-6xl mx-auto">
				<behold-widget feed-id="Fn9HEaLX9S3K83lTUdS5"></behold-widget>
			</div>
			</div>
		</section>

	</div>
</template>
