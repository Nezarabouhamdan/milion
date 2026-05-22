<script setup lang="ts">
import img1 from "../assets/buy_1.jpg";
import img2 from "../assets/buy_2.jpg";
import img3 from "../assets/buy_3.jpg";
// Note: lucideIcons and ref are removed if they were only used for the local toggle
</script>

<template>
	<div class="font-sans text-gray-900">
		<!-- HERO -->
		<section class="relative py-32 bg-white text-center">
			<div class="container">
				<h1 class="text-6xl md:text-7xl font-bold leading-tight mb-6">
					Your Gateway to Exceptional Living.
				</h1>
				<p class="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
					Buying a home in Dubai’s luxury market is one of life’s most significant investments. At
					Million Homes Real Estate Broker LLC, we elevate the home-buying journey into a refined, seamless
					experience. Our elite team of advisors is dedicated to guiding you through every step with
					meticulous expertise and personalized attention.
				</p>
			</div>
		</section>

		<!-- EXPERTISE SECTION -->
		<section class="py-24 bg-gray-50">
			<div class="container grid md:grid-cols-2 gap-16 items-center">
				<div>
					<h2 class="text-4xl font-semibold text-black-100 mb-6">
						Unmatched Expertise in Dubai’s Premier Communities
					</h2>
					<p class="text-gray-700 text-lg leading-relaxed">
						Dubai’s skyline is defined by its world-famous waterfronts and prestigious developments.
						Million Homes offers insider knowledge of every coveted address – from the Palm Jumeirah and
						Dubai Marina to Downtown’s iconic towers and emerging luxury districts. Our decades of
						experience give us a wealth of knowledge and insights into Dubai’s evolving real estate
						landscape.
					</p>
				</div>
				<div class="rounded-2xl overflow-hidden shadow-lg">
					<img
						:src="img1"
						alt="Dubai Luxury Property"
						class="w-full h-full object-cover"
					/>
				</div>
			</div>
		</section>

		<!-- PERSONALIZED SERVICE -->
		<section class="py-24 bg-white border-t border-gray-200">
			<div class="container grid md:grid-cols-2 gap-16 items-center">
				<div class="rounded-2xl overflow-hidden shadow-lg order-2 md:order-1">
					<img
						:src="img2"
						alt="Personalized Service"
						class="w-full h-full object-cover"
					/>
				</div>
				<div class="order-1 md:order-2">
					<h2 class="text-4xl font-semibold text-black-100 mb-6">
						White-Glove Personalized Service
					</h2>
					<p class="text-gray-700 text-lg leading-relaxed">
						Your home purchase is as unique as you are. Million Homes provides a truly bespoke service
						– we prioritize learning your individual needs, preferences, and aspirations. Our advisors offer
						discreet, one-on-one guidance and go above and beyond to anticipate your needs.
					</p>
				</div>
			</div>
		</section>

		<!-- EXCLUSIVE ACCESS -->
		<section class="py-24 bg-gray-50">
			<div class="container text-center max-w-4xl">
				<h2 class="text-4xl font-semibold text-black-100 mb-8">
					Exclusive Access to Premium Listings
				</h2>
				<p class="text-gray-700 text-lg leading-relaxed">
					As a Million Homes client, you gain access to our vast portfolio of luxury properties –
					including exclusive off-market and first-look listings. We maintain privileged relationships with
					top developers, owners, and influencers in Dubai, giving you first access to opportunities that
					never appear on public portals.
				</p>
			</div>
		</section>

		<!-- END-TO-END GUIDANCE -->
		<section class="py-24 bg-white border-t border-gray-200">
			<div class="container grid md:grid-cols-2 gap-16 items-center">
				<div>
					<h2 class="text-4xl font-semibold text-black-100 mb-6">
						Seamless, End-to-End Guidance
					</h2>
					<p class="text-gray-700 text-lg leading-relaxed">
						Million Homes ensures your purchase process is effortless and well-supported from start to
						finish. We coordinate all the details – from financial planning and mortgage services to legal
						due diligence and conveyancing – so you don’t have to worry about paperwork or delays.
					</p>
				</div>
				<div class="rounded-2xl overflow-hidden shadow-lg">
					<img
						:src="img3"
						alt="Guidance"
						class="w-full h-full object-cover"
					/>
				</div>
			</div>
		</section>

		<!-- CTA -->
		<section class="py-24 bg-black-100 text-white text-center">
			<div class="container max-w-2xl mx-auto">
				<h2 class="text-4xl font-semibold mb-4">
					Invest with Confidence and Elevate Your Lifestyle
				</h2>
				<p class="text-lg mb-8">
					Choosing Million Homes means placing your trust in a proven team that puts your returns and
					lifestyle first. Dubai’s luxury real estate market has delivered consistent growth and lifestyle
					prestige, and our advisors help you capitalize on these trends wisely.
				</p>
				<div class="flex justify-center gap-4">
					<router-link
						to="/contact-us"
						class="bg-white text-black-100 px-8 py-4 rounded-full font-semibold shadow hover:bg-black-100 hover:text-white transition hover:border border-white"
					>
						Contact Our Advisors
					</router-link>
				</div>
			</div>
		</section>
	</div>
</template>