<template>
	<div class="bg-primary/5 py-24">
		<div class="container">
			<div
				class="bg-black-100 rounded-2xl overflow-hidden shadow-property"
			>
				<div class="grid grid-cols-1 lg:grid-cols-2">
					<!-- Text Content -->
					<div
						class="p-8 md:p-12 lg:p-16 flex flex-col justify-center space-y-6"
					>
						<h2
							class="text-4xl lg:text-5xl font-semibold text-white leading-tight"
						>
							Ready to Find Your
							<span class="text-secondary">Dream Property?</span>
						</h2>
						<p class="text-white/80 text-lg leading-relaxed">
							Schedule a consultation with one of our expert
							agents to discover the perfect property tailored to
							your needs and preferences.
						</p>
						<div class="flex flex-wrap gap-4">
							<a href="/contact" class="btn-primary"
								>Schedule Consultation</a
							>
							<a
								href="/properties"
								class="btn-outline border-white text-white hover:bg-white/10"
								>Browse Properties</a
							>
						</div>
					</div>

					<!-- Image Section -->
					<div class="relative h-72 lg:h-auto overflow-hidden">
						<img
							src=""
							alt="Luxury Property"
							class="absolute inset-0 w-full h-full object-cover"
						/>
						<div
							class="absolute inset-0 bg-gradient-to-r from-black-100/80 to-transparent lg:from-transparent"
						></div>

						<!-- Contact Card -->
						<div
							class="absolute bottom-8 right-8 bg-white p-6 rounded-xl shadow-property hidden lg:flex items-center gap-4"
						>
							<div class="bg-primary/10 p-4 rounded-full">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-6 w-6 text-primary"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
									/>
								</svg>
							</div>
							<div>
								<div class="text-caption text-sm">
									Call us now
								</div>
								<div class="text-heading font-semibold text-lg">
									+977 9812345678
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
