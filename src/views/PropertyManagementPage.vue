<script setup lang="ts">
import img from "../assets/property-management.jpg";
</script>

<template>
	<div class="font-sans text-gray-900">
		<!-- HERO -->
		<section class="relative py-32 bg-white text-center">
			<div class="container">
				<h1 class="text-6xl md:text-7xl font-bold leading-tight mb-6">
					Your Investment, Our Expertise.
				</h1>
				<p class="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
					At Million Homes Real Estate Broker, we understand that owning a property in Dubai is more than a
					transaction — it's a valuable asset. Our comprehensive Property Management services are designed to
					protect your investment, maximize your returns, and provide complete peace of mind, whether you're
					based in the UAE or abroad.
				</p>
				<div class="mt-8 flex justify-center gap-4">
					<router-link
						to="/properties"
						class="inline-block px-8 py-4 bg-black-100 text-white rounded-lg font-semibold shadow hover:bg-black-100/80 transition"
					>
						Get Started
					</router-link>
				</div>
			</div>
		</section>

		<!-- FEATURES -->
		<section class="py-24 bg-gray-50">
			<div class="container grid grid-cols-1 md:grid-cols-2 gap-16">
				<div>
					<h2 class="text-4xl font-semibold text-black-100 mb-8">
						What We Offer:
					</h2>
					<div class="space-y-10">
						<div
							v-for="(feature, idx) in [
								{
									title: 'End-to-End Tenant Management',
									items: [
										'Property marketing & tenant sourcing',
										'Background checks and screening',
										'Lease drafting, renewals, and Ejari registration',
										'Move-in/move-out coordination',
									],
								},
								{
									title: 'Maintenance & Inspections',
									items: [
										'Regular property inspections',
										'24/7 maintenance coordination',
										'Trusted contractor network',
										'Emergency response handling',
									],
								},
								{
									title: 'Financial Reporting & ROI Optimization',
									items: [
										'Rent collection and deposits',
										'Monthly income/expense statements',
										'Annual financial summaries',
										'Advice on increasing rental yields',
									],
								},
								{
									title: 'Legal & Compliance Handling',
									items: [
										'RERA and DLD regulation management',
										'Contract enforcement & dispute resolution',
										'Insurance coordination',
										'DEWA, chiller, and service charge management',
									],
								},
							]"
							:key="idx"
						>
							<h3 class="text-xl font-medium mb-3">
								{{ feature.title }}
							</h3>
							<ul class="space-y-1 pl-4 border-l-2 border-black-100">
								<li
									v-for="item in feature.items"
									:key="item"
									class="text-gray-700 pl-3"
								>
									{{ item }}
								</li>
							</ul>
						</div>
					</div>
				</div>
				<div class="rounded-2xl overflow-hidden shadow-lg">
					<img
						:src="img"
						alt="Property Management"
						class="w-full h-full object-cover"
					/>
				</div>
			</div>
		</section>

		<!-- WHY CHOOSE US -->
		<section class="py-24 bg-white border-t border-gray-200">
			<div class="container text-center max-w-4xl">
				<h2 class="text-4xl font-semibold text-black-100 mb-8">
					Why Choose Million Homes?
				</h2>
				<div class="grid md:grid-cols-2 gap-6 text-gray-700 text-lg text-left">
					<div
						v-for="(why, idx) in [
							'Dedicated property manager assigned to your asset',
							'Transparent communication with detailed monthly reports',
							'Trusted by overseas landlords and institutional investors',
							'Tech-enabled systems for real-time updates',
							'Higher occupancy rates through strategic pricing and leasing',
						]"
						:key="idx"
						class="flex gap-2"
					>
						<div class="w-2 h-2 bg-black-100 rounded-full mt-2"></div>
						<p>{{ why }}</p>
					</div>
				</div>
			</div>
		</section>

		<!-- CALL TO ACTION -->
		<section class="py-24 bg-black-100 text-white text-center">
			<div class="container max-w-2xl mx-auto">
				<h2 class="text-4xl text-white font-semibold mb-4">
					Ready for Worry-Free Ownership?
				</h2>
				<p class="text-lg mb-8">
					Let Million Homes maximize your property's potential while you enjoy hassle-free returns.
				</p>
				<div class="flex justify-center gap-4">
					<router-link
						to="/team"
						class="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-black-100 transition"
					>
						Speak to Our Management Team
					</router-link>
				</div>
			</div>
		</section>
	</div>
</template>