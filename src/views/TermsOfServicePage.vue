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
					{{ t("Terms of Service", "服务条款") }}
				</h1>
				<p class="text-lg text-white/80">
					{{
						t(
							"Please read our terms carefully.",
							"请仔细阅读我们的条款。",
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
		<div class="container mx-auto max-w-4xl px-4 py-6 space-y-12">
			<div
				v-for="(section, idx) in [
					{
						icon: lucideIcons.Globe,
						title: t('1. Use of the Website', '1. 网站使用'),
						body: t(
							`You may access this website strictly for personal, non-commercial purposes. Misuse, unauthorized access, or interference is prohibited.`,
							`您仅可为个人、非商业目的访问本网站。禁止滥用、未经授权访问或干扰网站运行。`,
						),
					},
					{
						icon: lucideIcons.Home,
						title: t(
							'2. Property Listings and Accuracy',
							'2. 房源与准确性',
						),
						body: t(
							`Listings are for informational purposes. We do not guarantee availability or accuracy and may modify listings without notice.`,
							`房源信息仅供参考。我们不保证其可用性或准确性，并可随时修改房源而无需通知。`,
						),
					},
					{
						icon: lucideIcons.Copyright,
						title: t('3. Intellectual Property', '3. 知识产权'),
						body: t(
							`All content is property of Million Homes or licensors. Unauthorized reproduction or use is prohibited.`,
							`网站所有内容均属 Million Homes 或许可方所有。禁止未经授权复制或使用。`,
						),
					},
					{
						icon: lucideIcons.UserCheck,
						title: t(
							'4. User-Submitted Information',
							'4. 用户提交信息',
						),
						body: t(
							`By submitting info, you confirm accuracy. We use your info per our Privacy Policy. Do not impersonate or submit false data.`,
							`提交信息即表示您确认其准确性。我们根据隐私政策使用您的信息。请勿冒充他人或提交虚假信息。`,
						),
					},
					{
						icon: lucideIcons.Link,
						title: t('5. Third-Party Links', '5. 第三方链接'),
						body: t(
							`Links to third-party sites are for convenience. We are not responsible for their content or practices.`,
							`网站中的第三方链接仅供方便使用。我们不对这些网站的内容或操作负责。`,
						),
					},
					{
						icon: lucideIcons.AlertTriangle,
						title: t('6. Disclaimer of Liability', '6. 免责声明'),
						body: t(
							`We provide no warranties. Million Homes is not liable for damages arising from use of the site or services.`,
							`我们不提供任何保证。Million Homes 对因使用本网站或服务导致的任何损害概不负责。`,
						),
					},
					{
						icon: lucideIcons.ShieldCheck,
						title: t('7. Indemnity', '7. 赔偿责任'),
						body: t(
							`You agree to indemnify Million Homes from claims or damages from your breach of these terms.`,
							`您同意因违反本条款而产生的索赔或损害对 Million Homes 进行赔偿。`,
						),
					},
					{
						icon: lucideIcons.Scale,
						title: t(
							'8. Governing Law and Jurisdiction',
							'8. 适用法律与管辖权',
						),
						body: t(
							`These terms are governed by UAE law. Disputes fall under Dubai courts' exclusive jurisdiction.`,
							`本条款受阿联酋法律管辖。争议由迪拜法院专属管辖。`,
						),
					},
					{
						icon: lucideIcons.XCircle,
						title: t('9. Termination', '9. 终止'),
						body: t(
							`We may suspend or terminate your access at our sole discretion for violations.`,
							`如有违反条款行为，我们有权自行决定暂停或终止您的访问。`,
						),
					},
					{
						icon: lucideIcons.Mail,
						title: t('10. Contact Us', '10. 联系我们'),
						body: t(
							`Million Homes Real Estate Broker LLC\n612, The Baywaters by Omniyat, Business Bay, Dubai\ninfo@millionhomes.ae\n+971 58 566 8827`,
							`Million Homes Real Estate Broker LLC\n612, The Baywaters by Omniyat, Business Bay, Dubai\ninfo@millionhomes.ae\n+971 58 566 8827`,
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
				<p class="text-gray-700 whitespace-pre-line leading-relaxed">
					{{ section.body }}
				</p>
			</div>
		</div>
	</section>
</template>
