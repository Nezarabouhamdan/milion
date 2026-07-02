<template>
	<div class="space-y-24 animate-pulse">
		<!-- Hero Skeleton -->
		<section class="text-center space-y-4">
			<div class="h-10 bg-gray-200 rounded w-1/2 mx-auto"></div>
			<div class="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
		</section>

		<!-- Our Story Skeleton -->
		<section class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
			<div class="space-y-4">
				<div class="h-8 bg-gray-200 rounded w-1/3"></div>
				<div class="h-4 bg-gray-200 rounded w-full"></div>
				<div class="h-4 bg-gray-200 rounded w-5/6"></div>
				<div class="h-4 bg-gray-200 rounded w-3/4"></div>
			</div>
			<div class="h-64 bg-gray-200 rounded-xl"></div>
		</section>

		<!-- Meet Our Team Tabs Skeleton -->
		<section>
			<div class="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-6"></div>
			<!-- Tab Triggers -->
			<div class="flex justify-center flex-wrap gap-2 mb-6">
				<div
					v-for="i in 3"
					:key="i"
					class="h-8 bg-gray-200 rounded w-24"
				></div>
			</div>
			<!-- Team Cards -->
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
				<div
					v-for="i in 4"
					:key="i"
					class="bg-white rounded-xl shadow-property overflow-hidden"
				>
					<div class="h-64 bg-gray-200"></div>
					<div class="p-4 space-y-2 text-center">
						<div
							class="h-4 bg-gray-200 rounded w-1/2 mx-auto"
						></div>
						<div
							class="h-3 bg-gray-200 rounded w-1/4 mx-auto"
						></div>
					</div>
				</div>
			</div>
		</section>

		<!-- Mission & Vision Skeleton -->
		<section
			class="bg-primary/5 rounded-xl p-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
		>
			<div class="space-y-4">
				<div class="h-8 bg-gray-200 rounded w-1/3"></div>
				<div class="h-4 bg-gray-200 rounded w-full"></div>
				<div class="h-4 bg-gray-200 rounded w-5/6"></div>
			</div>
			<div class="space-y-4">
				<div class="h-8 bg-gray-200 rounded w-1/3"></div>
				<div class="h-4 bg-gray-200 rounded w-full"></div>
				<div class="h-4 bg-gray-200 rounded w-5/6"></div>
			</div>
		</section>

		<!-- Awards Skeleton -->
		<section>
			<div class="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-6"></div>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
				<div
					v-for="i in 3"
					:key="i"
					class="flex items-center gap-4 p-4"
				>
					<div class="h-10 w-10 bg-gray-200 rounded-full"></div>
					<div>
						<div class="h-4 bg-gray-200 rounded w-24 mb-2"></div>
						<div class="h-3 bg-gray-200 rounded w-16"></div>
					</div>
				</div>
			</div>
		</section>

		<!-- Clients Skeleton -->
		<section>
			<div class="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-6"></div>
			<div class="flex flex-wrap justify-center gap-8">
				<div
					v-for="i in 4"
					:key="i"
					class="w-32 h-16 bg-gray-200 rounded-lg"
				></div>
			</div>
		</section>
	</div>
</template>
