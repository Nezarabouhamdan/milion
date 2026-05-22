<!-- PropertyDetailSkeleton.vue -->
<template>
	<section class="bg-white py-16 animate-pulse">
		<div class="container grid lg:grid-cols-3 gap-10">
			<!-- Gallery Placeholder -->
			<div class="lg:col-span-2 space-y-6">
				<div class="grid grid-cols-2 md:grid-cols-3 gap-4">
					<div
						v-for="n in 3"
						:key="n"
						class="h-60 bg-gray-200 rounded-xl"
					></div>
				</div>

				<!-- Title -->
				<div class="h-8 bg-gray-300 rounded w-3/4"></div>
				<div class="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>

				<!-- Price -->
				<div class="h-6 bg-gray-300 rounded w-1/3 mb-6"></div>

				<!-- Overview Boxes -->
				<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
					<div
						v-for="n in 4"
						:key="n"
						class="h-20 bg-gray-100 border rounded-lg"
					></div>
				</div>

				<!-- Description -->
				<div class="space-y-2">
					<div class="h-4 bg-gray-200 w-full rounded"></div>
					<div class="h-4 bg-gray-200 w-5/6 rounded"></div>
					<div class="h-4 bg-gray-200 w-2/3 rounded"></div>
				</div>
			</div>

			<!-- Sidebar -->
			<aside class="lg:col-span-1 space-y-6">
				<div class="bg-white p-6 rounded-xl shadow space-y-4">
					<div class="h-6 bg-gray-300 rounded w-1/2"></div>
					<div class="h-4 bg-gray-200 rounded w-2/3"></div>
					<div class="h-4 bg-gray-200 rounded w-1/3"></div>
					<div class="h-10 bg-gray-300 rounded w-full mt-4"></div>
					<div class="h-10 bg-gray-200 rounded w-full"></div>
				</div>
			</aside>
		</div>
	</section>
</template>
