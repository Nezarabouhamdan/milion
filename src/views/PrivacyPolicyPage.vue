<script setup lang="ts">
import { ref } from "vue";
import * as lucideIcons from "lucide-vue-next";

// Language toggle
const isChinese = ref(false);
const t = (en: string, zh: string) => (isChinese.value ? zh : en);
</script>

<template>
	<section class="bg-gray-50 min-h-screen text-gray-800 font-sans">
		<!-- Hero -->
		<div
			class="relative bg-gradient-to-r from-black-100 via-black-100/80 to-black-100/60 text-white py-10 text-center"
		>
			<div
				class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"
			></div>
			<div class="relative z-10 container mx-auto max-w-3xl space-y-4">
				<h1 class="text-5xl font-extrabold leading-tight drop-shadow">
					{{ t("Privacy Policy", "隐私政策") }}
				</h1>
				<p class="text-lg text-white/80">
					{{
						t(
							"Our commitment to protecting your privacy.",
							"我们致力于保护您的隐私。",
						)
					}}
				</p>
				<button
					@click="isChinese = !isChinese"
					class="mt-4 px-6 py-2 rounded-full bg-white text-black-100 font-semibold shadow hover:bg-black-100 hover:text-white transition"
				>
					{{ isChinese ? "Switch to English" : "切换到中文" }}
				</button>
			</div>
		</div>

		<!-- Content -->
		<div class="container p-6 mx-auto max-w-4xl px-4 space-y-12">
			<div
				v-for="(section, idx) in [
					{
						icon: lucideIcons.Info,
						title: t(
							'1. Information We Collect',
							'1. 我们收集的信息',
						),
						body: t(
							`We may collect: Contact Details (Name, email, phone), ID Info (Emirates ID, passport), Property Preferences, Technical Data (IP, browser, device), Communication Records.`,
							`我们可能收集：联系方式（姓名、电子邮件、电话）、身份证明（身份证、护照）、房产偏好、技术数据（IP、浏览器、设备）、沟通记录。`,
						),
					},
					{
						icon: lucideIcons.ClipboardList,
						title: t(
							'2. How We Use Your Information',
							'2. 我们如何使用您的信息',
						),
						body: t(
							`Used to assist transactions, personalize recommendations, manage customer support, fulfill obligations, improve website, and marketing with consent. We do not sell your data.`,
							`用于协助交易、个性化推荐、客户支持、履行义务、改进网站，仅在同意下营销。我们不会出售您的数据。`,
						),
					},
					{
						icon: lucideIcons.Users,
						title: t('3. Sharing Your Information', '3. 信息共享'),
						body: t(
							`Shared with agents, trusted service providers, regulators, analytics & cloud vendors under confidentiality agreements.`,
							`仅与代理人、可信服务提供商、监管机构、分析及云供应商共享，均有保密协议。`,
						),
					},
					{
						icon: lucideIcons.ShieldCheck,
						title: t('4. Your Rights', '4. 您的权利'),
						body: t(
							`You may access, correct, delete your data; withdraw consent; opt-out of marketing. Contact info@millionhomes.ae.`,
							`您可访问、修改、删除数据；撤销同意；选择退出营销。请联系 info@millionhomes.ae。`,
						),
					},
					{
						icon: lucideIcons.Globe,
						title: t('5. GDPR Compliance', '5. GDPR 合规'),
						body: t(
							`EU users have rights: portability, restrict/ object processing, complaint rights. We obtain explicit consent for sensitive data.`,
							`欧盟用户享有权利：数据可携权、限制/反对处理、投诉权。我们将明确获取敏感数据同意。`,
						),
					},
					{
						icon: lucideIcons.Cookie,
						title: t('6. Cookies & Tracking', '6. Cookie 与追踪'),
						body: t(
							`We use cookies to enhance site, analyze traffic. You can disable cookies in browser settings.`,
							`我们使用 cookie 优化网站、分析流量。您可在浏览器中禁用 cookie。`,
						),
					},
					{
						icon: lucideIcons.Lock,
						title: t('7. Data Security', '7. 数据安全'),
						body: t(
							`We apply industry-standard protections but no system is 100% secure.`,
							`我们采取行业标准保护，但无系统可完全保证安全。`,
						),
					},
					{
						icon: lucideIcons.Clock,
						title: t('8. Data Retention', '8. 数据保留'),
						body: t(
							`We retain data as long as necessary or legally required.`,
							`我们仅在必要或法律要求下保留数据。`,
						),
					},
					{
						icon: lucideIcons.Link,
						title: t('9. Third-Party Links', '9. 第三方链接'),
						body: t(
							`We are not responsible for privacy practices of linked websites. Please review their policies.`,
							`对于链接网站的隐私政策我们不负责，请单独查阅其政策。`,
						),
					},
				]"
				:key="idx"
				class="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-black-100 hover:shadow-2xl transition"
			>
				<div class="flex items-start gap-4 mb-4">
					<component
						:is="section.icon"
						class="w-7 h-7 text-black-100 flex-shrink-0"
					/>
					<h2 class="text-xl font-bold text-black-100">
						{{ section.title }}
					</h2>
				</div>
				<p class="text-gray-700 leading-relaxed">{{ section.body }}</p>
			</div>
		</div>
	</section>
</template>
