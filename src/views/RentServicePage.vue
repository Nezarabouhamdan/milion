<script setup lang="ts">
import img1 from "../assets/rent_1.jpg";
import img2 from "../assets/rent_2.jpg";
</script>

<template>
	<div class="font-sans text-gray-900">
		<!-- HERO -->
		<section class="relative py-32 bg-white text-center">
			<div class="container">
				<h1 class="text-6xl md:text-7xl font-bold leading-tight mb-6">
					Elegant Homes. Effortless Rentals.
				</h1>
				<p class="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
					At Million Homes, we believe that renting a property should never feel like a compromise — it
					should feel like coming home. Whether you're searching for a sophisticated city apartment, a
					tranquil villa, or a stylish short-term residence in Dubai, our handpicked portfolio and tailored
					service ensure you experience luxury living from the very beginning.
				</p>
			</div>
		</section>

		<!-- FOR TENANTS -->
		<section class="py-24 bg-gray-50">
			<div class="container grid md:grid-cols-2 gap-16 items-center">
				<div>
					<h2 class="text-4xl font-semibold text-black-100 mb-6">
						For Tenants: Discover a Higher Standard of Living
					</h2>
					<p class="text-gray-700 text-lg leading-relaxed mb-4">
						Relocating to Dubai? Searching for a lifestyle upgrade? Our exclusive rental collection is
						designed for individuals and families who value convenience, design, and exceptional service.
					</p>
					<ul class="space-y-2 pl-4 border-l-2 border-black-100">
						<li class="pl-3 text-gray-700">
							Access to the most sought-after residences across Downtown
							Dubai, Dubai Marina, Palm Jumeirah, Dubai Hills, Arabian Ranches, and more
						</li>
						<li class="pl-3 text-gray-700">
							Fully-furnished and unfurnished options tailored to your lifestyle
						</li>
						<li class="pl-3 text-gray-700">
							Short-term, long-term, and serviced apartment rentals
						</li>
						<li class="pl-3 text-gray-700">
							Properties with world-class amenities: pools, gyms,
							concierge, security, and private parking
						</li>
						<li class="pl-3 text-gray-700">
							Community-specific guidance to help you choose the perfect
							location for your needs
						</li>
					</ul>
					<p class="text-gray-700 text-lg leading-relaxed mt-6">
						From your initial inquiry to move-in day, our expert agents provide personalized care,
						curated property selections, and full support throughout the leasing process.
					</p>
					<ul class="space-y-2 pl-4 border-l-2 border-black-100 mt-4">
						<li class="pl-3 text-gray-700">Customized home matching</li>
						<li class="pl-3 text-gray-700">Private property tours</li>
						<li class="pl-3 text-gray-700">Rental market insights and guidance</li>
						<li class="pl-3 text-gray-700">Lease negotiation and document support</li>
						<li class="pl-3 text-gray-700">DEWA and Ejari registration</li>
						<li class="pl-3 text-gray-700">Handover and move-in coordination</li>
					</ul>
				</div>
				<div class="rounded-2xl overflow-hidden shadow-lg">
					<img
						:src="img1"
						alt="Tenant Rentals"
						class="w-full h-full object-cover"
					/>
				</div>
			</div>
		</section>

		<!-- FOR LANDLORDS -->
		<section class="py-24 bg-white border-t border-gray-200">
			<div class="container grid md:grid-cols-2 gap-16 items-center">
				<div
					class="rounded-2xl overflow-hidden shadow-lg order-2 md:order-1"
				>
					<img
						:src="img2"
						alt="Landlord Services"
						class="w-full h-full object-cover"
					/>
				</div>
				<div class="order-1 md:order-2">
					<h2 class="text-4xl font-semibold text-black-100 mb-6">
						For Landlords: Lease with Peace of Mind
					</h2>
					<p class="text-gray-700 text-lg leading-relaxed mb-4">
						If you're a property owner looking to rent out your home, we offer a complete leasing
						solution that maximizes your rental income while minimizing your effort.
					</p>
					<ul class="space-y-2 pl-4 border-l-2 border-black-100">
						<li class="pl-3 text-gray-700">
							Premium marketing exposure across leading portals and social media
						</li>
						<li class="pl-3 text-gray-700">
							Professional photography and property presentation
						</li>
						<li class="pl-3 text-gray-700">
							Access to a high-quality tenant database — including
							expats, professionals, and executive renters
						</li>
						<li class="pl-3 text-gray-700">
							Transparent communication and reporting
						</li>
						<li class="pl-3 text-gray-700">
							Full management of the leasing cycle: from viewings and
							tenant vetting to legal formalities and handover
						</li>
					</ul>
					<p class="text-gray-700 text-lg leading-relaxed mt-4">
						Whether you own a single apartment or a portfolio of luxury villas, we treat your
						investment with care and strategy.
					</p>
				</div>
			</div>
		</section>

		<!-- WHY RENT WITH US -->
		<section class="py-24 bg-gray-50 border-t border-gray-200">
			<div class="container text-center max-w-4xl">
				<h2 class="text-4xl font-semibold text-black-100 mb-8">
					Why Rent with Million Homes?
				</h2>
				<div class="grid md:grid-cols-2 gap-6 text-lg text-gray-700 text-left">
					<div class="flex gap-2">
						<div class="w-2 h-2 bg-black-100 rounded-full mt-2"></div>
						<p>Curated luxury rental portfolio</p>
					</div>
					<div class="flex gap-2">
						<div class="w-2 h-2 bg-black-100 rounded-full mt-2"></div>
						<p>Dedicated property consultants with deep market knowledge</p>
					</div>
					<div class="flex gap-2">
						<div class="w-2 h-2 bg-black-100 rounded-full mt-2"></div>
						<p>End-to-end support for both tenants and landlords</p>
					</div>
					<div class="flex gap-2">
						<div class="w-2 h-2 bg-black-100 rounded-full mt-2"></div>
						<p>Access to Dubai’s best communities and residences</p>
					</div>
					<div class="flex gap-2">
						<div class="w-2 h-2 bg-black-100 rounded-full mt-2"></div>
						<p>Trusted by global clients, expats, and high-level executives</p>
					</div>
				</div>
			</div>
		</section>

		<!-- CTA -->
		<section class="py-24 bg-black-100 text-white text-center">
			<div class="container max-w-2xl mx-auto">
				<h2 class="text-4xl font-semibold mb-4 text-white">
					Begin Your Journey Today
				</h2>
				<p class="text-lg mb-8">
					Looking to rent a luxury property in Dubai? Let us show you what refined living truly feels
					like. Are you a landlord with a property to lease? Let us manage it with professionalism and
					results.
				</p>
				<div class="flex justify-center gap-4 flex-wrap">
					<router-link
						to="/properties?purpose=rent"
						class="bg-white text-black-100 px-8 py-4 rounded-full font-semibold shadow hover:bg-black-100 hover:text-white transition hover:border hover:border-white"
					>
						Browse Available Rentals
					</router-link>
					<router-link
						to="/contact-us"
						class="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-black-100 transition"
					>
						List Your Property
					</router-link>
				</div>
			</div>
		</section>
	</div>
</template>