<script setup lang="ts">
import { ref } from "vue";
import * as lucideIcons from "lucide-vue-next";
import { Pie } from "vue-chartjs";
import {
	Chart as ChartJS,
	Title,
	Tooltip,
	Legend,
	ArcElement,
	CategoryScale,
} from "chart.js";

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

const totalAmount = ref<number | null>(null);
const downPaymentPercent = ref<number | null>(null);
const interestRate = ref<number | null>(null);
const loanTermYears = ref<number | null>(null);

const downPaymentAmount = ref<number | null>(null);
const loanAmount = ref<number | null>(null);
const monthlyPayment = ref<number | null>(null);
const totalPayment = ref<number | null>(null);
const totalInterestPaid = ref<number | null>(null);

const hasCalculated = ref(false);

const calculateMortgage = () => {
	if (
		totalAmount.value == null ||
		downPaymentPercent.value == null ||
		interestRate.value == null ||
		loanTermYears.value == null
	) {
		hasCalculated.value = false;
		return;
	}

	const down = (totalAmount.value * downPaymentPercent.value) / 100;
	const loan = totalAmount.value - down;
	const monthlyRate = interestRate.value / 12 / 100;
	const n = loanTermYears.value * 12;

	let monthly = 0;
	if (monthlyRate === 0) {
		monthly = loan / n;
	} else {
		monthly = (loan * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n));
	}
	const total = monthly * n;
	const interest = total - loan;

	downPaymentAmount.value = down;
	loanAmount.value = loan;
	monthlyPayment.value = monthly;
	totalPayment.value = total;
	totalInterestPaid.value = interest;
	hasCalculated.value = true;
};
</script>

<template>
	<section class="min-h-screen bg-neutral text-gray-800 font-sans">
		<!-- Hero Header -->
		<div
			class="relative bg-black-100 text-white py-28 text-center overflow-hidden"
		>
			<div
				class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"
			></div>
			<div class="relative z-10 container max-w-5xl space-y-6">
				<h1
					class="text-4xl sm:text-6xl font-heading font-bold leading-tight drop-shadow-xl animate-fade-in text-white"
				>
					Mortgage Calculator
				</h1>
				<p
					class="text-lg sm:text-xl animate-slide-up max-w-2xl mx-auto text-white"
				>
					Plan your home purchase with confidence. Calculate your
					monthly payments and total costs effortlessly.
				</p>
			</div>
			<div
				class="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-neutral to-transparent"
			></div>
		</div>

		<!-- Calculator -->
		<div
			class="container max-w-7xl px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-8"
		>
			<!-- Input Panel -->
			<div
				class="bg-white rounded-xl shadow-card p-8 space-y-6 border border-gray-200 hover:shadow-card-hover transition-all duration-300"
			>
				<h2 class="text-3xl font-heading font-bold text-primary mb-6">
					Enter Your Details
				</h2>
				<div class="space-y-6">
					<div class="space-y-2">
						<label
							class="text-sm text-gray-700 flex items-center gap-2 font-medium"
						>
							<lucideIcons.Wallet
								class="w-5 h-5 text-secondary"
							/>
							Total Amount (AED)
						</label>
						<input
							v-model.number="totalAmount"
							type="number"
							min="0"
							placeholder="e.g. 500,000"
							class="w-full p-3.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary/50 focus:border-secondary bg-gray-50 text-gray-800 placeholder-gray-400 transition-all duration-200"
						/>
					</div>
					<div class="space-y-2">
						<label
							class="text-sm text-gray-700 flex items-center gap-2 font-medium"
						>
							<lucideIcons.Percent
								class="w-5 h-5 text-secondary"
							/>
							Down Payment (%)
						</label>
						<input
							v-model.number="downPaymentPercent"
							type="number"
							min="0"
							max="100"
							placeholder="e.g. 20"
							class="w-full p-3.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary/50 focus:border-secondary bg-gray-50 text-gray-800 placeholder-gray-400 transition-all duration-200"
						/>
					</div>
					<div class="space-y-2">
						<label
							class="text-sm text-gray-700 flex items-center gap-2 font-medium"
						>
							<lucideIcons.TrendingUp
								class="w-5 h-5 text-secondary"
							/>
							Interest Rate (%)
						</label>
						<input
							v-model.number="interestRate"
							type="number"
							min="0"
							step="0.01"
							placeholder="e.g. 3.5"
							class="w-full p-3.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary/50 focus:border-secondary bg-gray-50 text-gray-800 placeholder-gray-400 transition-all duration-200"
						/>
					</div>
					<div class="space-y-2">
						<label
							class="text-sm text-gray-700 flex items-center gap-2 font-medium"
						>
							<lucideIcons.Calendar
								class="w-5 h-5 text-secondary"
							/>
							Loan Term (Years)
						</label>
						<input
							v-model.number="loanTermYears"
							type="number"
							min="1"
							placeholder="e.g. 30"
							class="w-full p-3.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary/50 focus:border-secondary bg-gray-50 text-gray-800 placeholder-gray-400 transition-all duration-200"
						/>
					</div>
					<button
						@click="calculateMortgage"
						class="w-full bg-black-100 text-white font-semibold py-3.5 rounded-lg hover:bg-black-100/90 focus:ring-4 focus:ring-secondary/30 transition-all duration-200 flex items-center justify-center gap-2"
					>
						<lucideIcons.Calculator class="w-5 h-5" />
						Calculate Now
					</button>
				</div>
			</div>

			<!-- Results Panel -->
			<div
				class="bg-white rounded-xl shadow-card p-8 space-y-6 border border-gray-200 hover:shadow-card-hover transition-all duration-300"
			>
				<h2 class="text-3xl font-heading font-bold text-primary mb-6">
					Your Results
				</h2>
				<div v-if="hasCalculated" class="space-y-8">
					<div class="text-center">
						<p class="text-lg text-gray-600">Monthly Payment</p>
						<p
							class="text-4xl font-bold text-secondary break-words overflow-wrap-anywhere"
						>
							AED
							{{
								monthlyPayment?.toLocaleString(undefined, {
									maximumFractionDigits: 2,
								})
							}}
						</p>
					</div>

					<div
						class="bg-gray-50 rounded-lg border border-gray-200 p-6 space-y-6"
					>
						<!-- Down Payment in a single row -->
						<div
							class="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4"
						>
							<span class="text-gray-600 font-medium"
								>Down Payment</span
							>
							<span
								class="font-semibold text-gray-800 break-words overflow-wrap-anywhere max-w-full"
							>
								AED
								{{
									downPaymentAmount?.toLocaleString(
										undefined,
										{
											maximumFractionDigits: 2,
										},
									)
								}}
							</span>
						</div>

						<!-- Visual Gap -->
						<div class="border-t border-gray-200 my-4">
							<!-- Grouped Loan Amount, Total Payment, Total Interest in three rows -->
							<div class="flex flex-col gap-4">
								<div
									class="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2"
								>
									<span class="text-gray-600 font-medium"
										>Loan Amount</span
									>
									<span
										class="font-semibold text-gray-800 break-words overflow-wrap-anywhere max-w-full"
									>
										AED
										{{
											loanAmount?.toLocaleString(
												undefined,
												{
													maximumFractionDigits: 2,
												},
											)
										}}
									</span>
								</div>
								<div
									class="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2"
								>
									<span class="text-gray-600 font-medium"
										>Total Payment</span
									>
									<span
										class="font-semibold text-gray-800 break-words overflow-wrap-anywhere max-w-full"
									>
										AED
										{{
											totalPayment?.toLocaleString(
												undefined,
												{
													maximumFractionDigits: 2,
												},
											)
										}}
									</span>
								</div>
								<div
									class="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2"
								>
									<span class="text-gray-600 font-medium"
										>Total Interest</span
									>
									<span
										class="font-semibold text-gray-800 break-words overflow-wrap-anywhere max-w-full"
									>
										AED
										{{
											totalInterestPaid?.toLocaleString(
												undefined,
												{
													maximumFractionDigits: 2,
												},
											)
										}}
									</span>
								</div>
							</div>
						</div>

						<!-- Pie Chart for Payment Breakdown -->
						<div
							class="bg-gray-50 rounded-lg border border-gray-200 p-6"
						>
							<h3
								class="text-xl font-heading font-semibold text-primary mb-4"
							>
								Payment Breakdown
							</h3>
							<Pie
								:data="{
									labels: ['Loan Amount', 'Total Interest'],
									datasets: [
										{
											data: [
												loanAmount,
												totalInterestPaid,
											],
											backgroundColor: [
												'#4C78A8',
												'#F28E2B',
											],
											borderColor: ['#FFFFFF', '#FFFFFF'],
											borderWidth: 2,
										},
									],
								}"
								:options="{
									responsive: true,
									plugins: {
										legend: {
											position: 'top',
											labels: {
												font: {
													size: 14,
												},
											},
										},
										tooltip: {
											callbacks: {
												label: function (context) {
													const value =
														context.parsed || 0;
													return `${context.label}: AED ${value.toLocaleString(
														undefined,
														{
															maximumFractionDigits: 2,
														},
													)}`;
												},
											},
										},
									},
								}"
								class="max-h-80"
							/>
						</div>

						<p class="text-sm text-gray-500 italic pt-2">
							Note: This is an estimate and does not include
							taxes, insurance, or additional fees.
						</p>
					</div>
				</div>

				<div
					v-else
					class="text-gray-600 text-lg bg-gray-50 p-4 rounded-lg border border-gray-100 animate-fade-in"
				>
					Enter the details above to see your mortgage calculations.
				</div>
			</div>
		</div>
	</section>
</template>
