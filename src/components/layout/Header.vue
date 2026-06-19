<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useMenuQuery } from "../../composables/useMenuQuery";
import { imagePath } from "../../utils/helpers";
import { ScrollArea } from "../ui/scroll-area";
import {
	Menu as MenuIcon,
	ChevronDown,
	X,
	Globe as GlobeIcon,
} from "lucide-vue-next";
import { Button } from "../ui/button";
import logoWhite1 from "../../assets/logo-main.png";
import { useSettingsStore } from "../../stores/settingsStore";

// â”€â”€ Language state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const VALID_LANGS = ["en", "ja", "zh-CN", "ar", "ru"];
const stored = localStorage.getItem("lang") ?? "en";
const lang = ref(VALID_LANGS.includes(stored) ? stored : "en");

const languages = [
	{ code: "en", label: "English", short: "EN" },
	{ code: "ja", label: "日本語", short: "JA" },
	{ code: "zh-CN", label: "中文", short: "ZH" },
	{ code: "ar", label: "العربية", short: "AR" },
	{ code: "ru", label: "Русский", short: "RU" },
];

const currentLangLabel = computed(
	() => languages.find((l) => l.code === lang.value)?.label ?? "English",
);

const isRtl = (code: string) => code === "ar";

const applyDirection = (code: string) => {
	document.documentElement.dir = isRtl(code) ? "rtl" : "ltr";
};

const setGTCookie = (code: string) => {
	const value = code === "en" ? "" : `/en/${code}`;
	const expire =
		code === "en" ? "expires=Thu, 01 Jan 1970 00:00:00 UTC;" : "";
	document.cookie = `googtrans=${value}; ${expire} path=/;`;
	document.cookie = `googtrans=${value}; ${expire} path=/; domain=.${location.hostname};`;
};

const switchLang = (code: string) => {
	if (code === lang.value) return;
	localStorage.setItem("lang", code);
	setGTCookie(code);
	// Small delay ensures cookies are committed before the browser navigates
	setTimeout(() => window.location.reload(), 50);
};

onMounted(() => {
	applyDirection(lang.value);
	document.addEventListener("click", handleClickOutside);
});
onUnmounted(() => {
	document.removeEventListener("click", handleClickOutside);
});

// â”€â”€ Language dropdown â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const langDropdownOpen = ref(false);
const langDropdownRef = ref<HTMLElement | null>(null);

const handleClickOutside = (e: MouseEvent) => {
	if (
		langDropdownRef.value &&
		!langDropdownRef.value.contains(e.target as Node)
	) {
		langDropdownOpen.value = false;
	}
};

const selectLanguage = (code: string) => {
	switchLang(code);
	langDropdownOpen.value = false;
};

// â”€â”€ Menu translations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const navMap: Record<string, Record<string, string>> = {
	ja: {
		Home: "ホーム",
		Properties: "物件",
		Buy: "購入",
		Sell: "売却",
		Rent: "賃貸",
		About: "会社について",
		Contact: "お問い合わせ",
		"Holiday Homes": "民泊運営",
		Offplan: "新築物件",
		Areas: "エリア",
		"Media Center": "メディアセンター",
	},
	"zh-CN": {
		Home: "首页",
		Properties: "房产",
		Buy: "购买",
		Sell: "出售",
		Rent: "租房",
		About: "关于我们",
		Contact: "联系我们",
		"Holiday Homes": "假日住宅",
		Offplan: "期房",
		Areas: "区域",
		"Media Center": "媒体中心",
	},
	ar: {
		Home: "الرئيسية",
		Properties: "العقارات",
		Buy: "شراء",
		Sell: "بيع",
		Rent: "إيجار",
		About: "عن الشركة",
		Contact: "اتصل بنا",
		"Holiday Homes": "منازل العطلات",
		Offplan: "قيد الانشاء",
		Areas: "المناطق",
		"Media Center": "المركز الإعلامي",
	},
	ru: {
		Home: "Главная",
		Properties: "Недвижимость",
		Buy: "Купить",
		Sell: "Продать",
		Rent: "Аренда",
		About: "О нас",
		Contact: "Контакты",
		"Holiday Homes": "Аренда жилья",
		Offplan: "Строящиеся",
		Areas: "Районы",
		"Media Center": "Медиацентр",
	},
};

const getMenuName = (name: string) => navMap[lang.value]?.[name] ?? name;

// â”€â”€ Menu logic â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const { data: menusRaw } = useMenuQuery(true);

const PROPERTIES_NAMES = new Set(["buy", "sell", "rent", "offplan", "holiday homes"]);

const PROPERTIES_LINK_MAP: Record<string, string> = {
	"buy":          "properties?purpose=buy",
	"sell":         "sell",
	"rent":         "properties?purpose=rent",
	"offplan":      "properties?purpose=buy&completion_status=off_plan",
	"holiday homes":"service/holiday-homes",
};

const PROPERTIES_SUBPAGES_MAP: Record<string, Array<{ name: string; link: string }>> = {
	"buy": [
		{ name: "Why Buy From Us",     link: "service/buy" },
		{ name: "Mortgage Calculator", link: "service/mortgage-calculator" },
	],
	"sell": [
		{ name: "Why Sell With Us", link: "service/sell" },
	],
	"rent": [
		{ name: "Why Rent With Us", link: "service/rent" },
	],
	"offplan": [
		{ name: "Mortgage Calculator", link: "service/mortgage-calculator" },
	],
	"holiday homes":[],
};

const menus = computed(() => {
	const raw = (menusRaw.value as unknown as any[]) || [];
	const result: any[] = [];
	const propertiesItems: any[] = [];
	let propertiesInserted = false;

	for (const menu of raw) {
		const nameLower = (menu.name ?? "").toLowerCase();
		if (PROPERTIES_NAMES.has(nameLower)) {
			propertiesItems.push(menu);
			if (!propertiesInserted) {
				result.push({ id: -999, name: "Properties", link: null, image: null, menus: [] });
				propertiesInserted = true;
			}
		} else {
			result.push(menu);
		}
	}

	const propMenu = result.find((m) => m.id === -999);
	if (propMenu) {
		propMenu.menus = propertiesItems.map((m) => {
			const key = (m.name ?? "").toLowerCase();
			return {
				id: m.id,
				name: m.name,
				link: PROPERTIES_LINK_MAP[key] ?? (m.link || m.slug),
				subPages: PROPERTIES_SUBPAGES_MAP[key] ?? [],
			};
		});
	}

	// Inject Media Center right after Properties
	const alreadyAdded = result.some((m) => m.id === -998);
	if (!alreadyAdded) {
		const propertiesIndex = result.findIndex((m) => m.id === -999);
		const insertAt = propertiesIndex !== -1 ? propertiesIndex + 1 : result.length;
		result.splice(insertAt, 0, { id: -998, name: "Media Center", link: "media-center", menus: [] });
	}

	return result;
});
const mobileMenuOpen = ref(false);
const activeDropdown = ref<number | null>(null);
const mobileActiveDropdown = ref<number | null>(null);

const toggleMobileMenu = () => {
	mobileMenuOpen.value = !mobileMenuOpen.value;
};
const toggleDropdown = (id: number) => {
	activeDropdown.value = activeDropdown.value === id ? null : id;
};
const closeDropdowns = () => {
	activeDropdown.value = null;
};
const toggleMobileDropdown = (id: number) => {
	mobileActiveDropdown.value = mobileActiveDropdown.value === id ? null : id;
};
const settingsStore = useSettingsStore();
const whatsappLink = computed(() => {
	const num = (settingsStore.getSetting("whatsapp_number") || "").replace(/\D/g, "");
	return `https://wa.me/${num}`;
});

const hasSubMenus = (menu: any) =>
	Array.isArray(menu.menus) && menu.menus.length > 0;
const menuImageUrl = (menu: any) => {
	const raw = typeof menu.image === "object" ? menu.image?.url : menu.image;
	return raw ? imagePath(raw) : null;
};
</script>

<template>
	<header class="bg-black-100 text-white sticky top-0 z-50 header-luxury">
		<div
			class="container mx-auto flex items-center py-5 px-4 gap-4"
		>
			<!-- Mobile Toggle -->
			<div class="flex items-center lg:hidden">
				<Button
					variant="ghost"
					size="icon"
					class="text-white hover:bg-black-200"
					@click="toggleMobileMenu"
				>
					<MenuIcon v-if="!mobileMenuOpen" class="h-6 w-6" />
					<X v-else class="h-6 w-6" />
				</Button>
			</div>

			<!-- Logo -->
			<div class="mx-auto lg:mx-0 flex-shrink-0 lg:flex-1">
				<router-link to="/" class="block">
					<img
						:src="logoWhite1"
						alt="MillionHomes"
						class="w-auto object-contain logo-scale"
						style="height:60px; width:auto;"
					/>
				</router-link>
			</div>

			<!-- Desktop Nav -->
			<nav class="hidden lg:flex justify-center px-4 xl:px-8">
				<ul class="flex space-x-2 justify-center">
					<li
						v-for="menu in menus"
						:key="menu.id"
						class="relative group"
					>
						<template v-if="hasSubMenus(menu)">
							<button
								translate="no"
								class="nav-link px-2 xl:px-3 2xl:px-4 py-2 text-xs text-nowrap tracking-widest uppercase font-bold flex items-center gap-1 transition-all duration-300"
								:class="{ 'nav-link-active': activeDropdown === menu.id }"
								@click="toggleDropdown(menu.id)"
							>
								<span class="gold-gradient-text">{{ getMenuName(menu.name) }}</span>
								<ChevronDown
									class="h-3.5 w-3.5 transition-transform duration-300 flex-shrink-0"
									style="color:#C9A028"
									:class="{ 'rotate-180': activeDropdown === menu.id }"
								/>
							</button>
							<div
								v-show="activeDropdown === menu.id"
								class="nav-dropdown-panel absolute left-0 top-full mt-2 rounded-xl overflow-hidden z-50 dropdown-luxury"
								:class="menu.id === -999 ? 'w-[260px]' : 'w-[400px]'"
							>
								<!-- Properties mega-panel -->
								<template v-if="menu.id === -999">
									<div class="py-2">
										<div
											v-for="(cat, index) in menu.menus"
											:key="cat.id"
										>
											<div
												v-if="index > 0"
												class="mx-4 border-t"
												style="border-color: rgba(255,255,255,0.06)"
											></div>
											<div class="px-2 py-0.5">
												<router-link
													:to="'/' + cat.link"
													class="flex items-center justify-between px-4 py-2.5 rounded-lg group transition-colors hover:bg-white/5"
													@click="closeDropdowns"
												>
													<span
														class="text-xs font-bold tracking-widest uppercase"
														style="color: #D4AF37"
													>{{ getMenuName(cat.name) }}</span>
													<svg class="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" style="color:#D4AF37" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
												</router-link>
												<ul v-if="cat.subPages?.length" class="pb-1">
													<li
														v-for="sub in cat.subPages"
														:key="sub.link"
													>
														<router-link
															:to="'/' + sub.link"
															class="flex items-center gap-2.5 px-5 py-1.5 text-xs transition-colors group/sub hover:text-white"
															style="color: #888888"
															@click="closeDropdowns"
														>
															<span
																class="w-1 h-1 rounded-full flex-shrink-0 transition-colors group-hover/sub:bg-[#D4AF37]"
																style="background:#D4AF37; opacity:0.45"
															></span>
															{{ sub.name }}
														</router-link>
													</li>
												</ul>
											</div>
										</div>
									</div>
								</template>

								<!-- Regular dropdown -->
								<template v-else>
									<div
										v-if="menuImageUrl(menu)"
										class="relative h-[150px] w-full overflow-hidden"
									>
										<img
											:src="menuImageUrl(menu) ?? undefined"
											:alt="menu.name"
											class="w-full h-full object-cover"
										/>
										<div
											class="absolute inset-0 flex items-center justify-center"
											style="background-color: rgba(0,0,0,0.5);"
										>
											<span class="text-white text-2xl font-bold capitalize tracking-wide">{{ menu.name }}</span>
										</div>
									</div>
									<ul class="p-3">
										<li
											v-for="submenu in menu.menus"
											:key="submenu.id"
										>
											<router-link
												:to="'/' + submenu.link || '#'"
												class="dropdown-item flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200"
												@click="closeDropdowns"
											>
												<span class="w-1 h-1 rounded-full bg-[#D4AF37]/40 flex-shrink-0"></span>
												{{ submenu.name }}
											</router-link>
										</li>
									</ul>
								</template>
							</div>
						</template>
						<router-link
							v-else
							:to="
								menu.link
									? '/' + menu.link.replace(/^\//, '')
									: '#'
							"
							translate="no"
							class="nav-link px-2 xl:px-3 2xl:px-4 py-2 text-xs text-nowrap tracking-widest uppercase font-bold flex items-center transition-all duration-300"
						>
							<span class="gold-gradient-text">{{ getMenuName(menu.name) }}</span>
						</router-link>
					</li>
					<li v-if="lang === 'ja'">
						<a
							href="https://jp.millionhomes.ae"
							target="_blank"
							class="px-1 xl:px-2 2xl:px-4 py-2 text-sm xl:text-base text-nowrap hover:text-secondary transition-colors flex items-center font-medium"
						>
							highlights
						</a>
					</li>
				</ul>
			</nav>

			<!-- Language Dropdown (Desktop) -->
			<div
				class="flex items-center gap-2 xl:gap-3 flex-shrink-0 ml-auto lg:ml-0 lg:flex-1 lg:justify-end notranslate"
				ref="langDropdownRef"
			>
				<!-- WhatsApp Button -->
				<a
					:href="whatsappLink"
					target="_blank"
					rel="noopener noreferrer"
					class="whatsapp-btn flex items-center gap-1.5 px-3 py-2 rounded-lg text-white text-xs font-bold"
					title="WhatsApp"
				>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 flex-shrink-0">
						<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
					</svg>
					<span class="hidden xl:inline">WhatsApp</span>
				</a>

				<!-- Language Selector -->
				<div class="relative">
					<button
						class="lang-btn flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold tracking-wide transition-all duration-300"
						@click.stop="langDropdownOpen = !langDropdownOpen"
					>
						<GlobeIcon class="w-3.5 h-3.5 flex-shrink-0" style="color:#C9A028" />
						<span class="gold-gradient-text">{{ currentLangLabel }}</span>
						<ChevronDown
							class="w-3 h-3 flex-shrink-0 transition-transform duration-300"
							style="color:#C9A028"
							:class="{ 'rotate-180': langDropdownOpen }"
						/>
					</button>
					<div
						v-show="langDropdownOpen"
						class="absolute right-0 top-full mt-2 w-40 rounded-xl overflow-hidden z-50 dropdown-luxury"
					>
						<div class="py-1.5">
							<button
								v-for="l in languages"
								:key="l.code"
								class="lang-option w-full px-4 py-2.5 text-xs text-left transition-all duration-200 flex items-center justify-between"
								:class="{ 'lang-option-active': lang === l.code }"
								@click="selectLanguage(l.code)"
							>
								<span>{{ l.label }}</span>
								<span v-if="lang === l.code" class="w-1.5 h-1.5 rounded-full" style="background:#D4AF37"></span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Mobile Sidebar -->
		<div v-show="mobileMenuOpen" class="lg:hidden fixed inset-0 z-40">
			<div
				class="absolute inset-0 bg-black bg-opacity-50"
				@click="toggleMobileMenu"
			></div>
			<div
				class="absolute top-0 w-[280px] h-full bg-white z-50 p-5"
				:class="isRtl(lang) ? 'right-0' : 'left-0'"
			>
				<div class="flex items-center justify-between">
					<img :src="logoWhite1" class="h-20 w-auto" />
					<Button
						variant="ghost"
						size="icon"
						class="text-black-100"
						@click="toggleMobileMenu"
					>
						<X class="h-5 w-5" />
					</Button>
				</div>
				<nav>
					<ScrollArea
						class="h-[calc(100vh-200px)] scrollbar-hidden text-black-100"
					>
						<ul class="space-y-1">
							<li
								v-for="menu in menus"
								:key="menu.id"
								class="py-1"
							>
								<template v-if="hasSubMenus(menu)">
									<button
										translate="no"
										class="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded text-black-100 font-medium"
										@click="toggleMobileDropdown(menu.id)"
									>
										<span>{{
											getMenuName(menu.name)
										}}</span>
										<ChevronDown
											class="h-4 w-4"
											:class="{
												'rotate-180':
													mobileActiveDropdown ===
													menu.id,
											}"
										/>
									</button>
									<div
										v-show="
											mobileActiveDropdown === menu.id
										"
										class="pl-4 mt-1 border-l-2 border-gray-100 ml-3"
									>
										<!-- Properties grouped list -->
										<template v-if="menu.id === -999">
											<div v-for="cat in menu.menus" :key="cat.id" class="mb-2">
												<router-link
													:to="'/' + cat.link"
													class="block px-3 py-2 hover:bg-gray-50 rounded text-sm font-semibold text-black-100"
													@click="toggleMobileMenu"
												>
													{{ getMenuName(cat.name) }}
												</router-link>
												<ul v-if="cat.subPages?.length" class="pl-2 border-l border-gray-100 ml-3">
													<li v-for="sub in cat.subPages" :key="sub.link">
														<router-link
															:to="'/' + sub.link"
															class="block px-3 py-1.5 hover:bg-gray-50 rounded text-xs text-gray-500"
															@click="toggleMobileMenu"
														>
															{{ sub.name }}
														</router-link>
													</li>
												</ul>
											</div>
										</template>
										<!-- Regular sub-menus -->
										<ul v-else>
											<li
												v-for="submenu in menu.menus"
												:key="submenu.id"
												class="mb-1"
											>
												<router-link
													:to="
														'/' + submenu.link ||
														'#'
													"
													class="block px-3 py-2 hover:bg-gray-50 rounded text-sm text-black-100"
													@click="toggleMobileMenu"
												>
													{{ submenu.name }}
												</router-link>
											</li>
										</ul>
									</div>
								</template>
								<router-link
									v-else
									:to="
										menu.link
											? '/' + menu.link.replace(/^\//, '')
											: '#'
									"
									translate="no"
									class="block px-3 py-2 hover:bg-gray-50 rounded text-black-100 font-medium"
									@click="toggleMobileMenu"
								>
									{{ getMenuName(menu.name) }}
								</router-link>
							</li>
							<li v-if="lang === 'ja'">
								<a
									href="https://jp.millionhomes.ae"
									target="_blank"
									class="block px-3 py-2 font-medium"
								>
									highlights
								</a>
							</li>
						</ul>
					</ScrollArea>

					<!-- Mobile Language Selector -->
					<div class="mt-4 notranslate">
						<p
							class="text-xs text-gray-400 px-3 mb-2 uppercase tracking-wide"
						>
							Language
						</p>
						<div class="flex gap-2 px-3">
							<button
								v-for="l in languages"
								:key="l.code"
								class="flex-1 py-2 text-sm rounded-lg border transition-colors font-medium"
								:class="
									lang === l.code
										? 'bg-black-100 text-white border-black-100'
										: 'bg-white text-gray-700 border-gray-300 hover:border-black-100'
								"
								@click="selectLanguage(l.code)"
							>
								{{ l.short }}
							</button>
						</div>
					</div>

					<a
						href="/sell"
						class="px-3 py-3 mt-4 bg-secondary text-black-100 rounded-lg flex items-center justify-center gap-2 shadow-md"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="h-5 w-5"
						>
							<rect
								width="18"
								height="18"
								x="3"
								y="3"
								rx="2"
							></rect>
							<path d="M8 12h8"></path>
							<path d="M12 8v8"></path>
						</svg>
						<span class="font-medium">List Property</span>
					</a>
				</nav>
			</div>
		</div>
	</header>
</template>

<style scoped>
/* ── Scrollbar ─────────────────────────────────── */
.scrollbar-hidden::-webkit-scrollbar { display: none !important; }
.scrollbar-hidden { scrollbar-width: none !important; -ms-overflow-style: none !important; }

.notranslate { unicode-bidi: isolate; }

/* ── Logo ──────────────────────────────────────── */
.logo-scale {
	transform: scale(2);
	transform-origin: center center;
}
@media (min-width: 1024px) {
	.logo-scale {
		transform: scale(3);
		transform-origin: left center;
	}
}

/* ── Header luxury ─────────────────────────────── */
.header-luxury {
	border-bottom: 1px solid rgba(212, 175, 55, 0.18);
	box-shadow: 0 1px 0 rgba(212, 175, 55, 0.06), 0 8px 32px rgba(0, 0, 0, 0.6);
}

/* ── Nav links ─────────────────────────────────── */
.nav-link {
	position: relative;
}
.nav-link::after {
	content: '';
	position: absolute;
	bottom: 0;
	left: 50%;
	right: 50%;
	height: 1px;
	background: linear-gradient(90deg, transparent, #D4AF37, #F2DC9E, #D4AF37, transparent);
	opacity: 0;
	transition: left 0.35s ease, right 0.35s ease, opacity 0.35s ease;
}
.nav-link:hover::after,
.nav-link-active::after,
.nav-link.router-link-exact-active::after {
	left: 0;
	right: 0;
	opacity: 1;
}

/* ── Dropdown luxury panel ─────────────────────── */
.dropdown-luxury {
	background: rgba(18, 18, 18, 0.97);
	border: 1px solid rgba(212, 175, 55, 0.22);
	box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(212, 175, 55, 0.06) inset;
	backdrop-filter: blur(12px);
}

/* ── Dropdown items ────────────────────────────── */
.dropdown-item {
	color: #999;
}
.dropdown-item:hover {
	background: rgba(212, 175, 55, 0.06);
	color: #F2DC9E;
}

/* ── WhatsApp button ───────────────────────────── */
.whatsapp-btn {
	background: linear-gradient(135deg, #25D366, #1aad52);
	box-shadow: 0 4px 15px rgba(37, 211, 102, 0.25);
	transition: box-shadow 0.3s ease, transform 0.2s ease;
}
.whatsapp-btn:hover {
	box-shadow: 0 4px 22px rgba(37, 211, 102, 0.45);
	transform: translateY(-1px);
}

/* ── Language button ───────────────────────────── */
.lang-btn {
	background: rgba(212, 175, 55, 0.08);
	border: 1px solid rgba(212, 175, 55, 0.25);
}
.lang-btn:hover {
	background: rgba(212, 175, 55, 0.14);
	border-color: rgba(212, 175, 55, 0.5);
}

/* ── Language options ──────────────────────────── */
.lang-option {
	color: #999;
}
.lang-option:hover {
	background: rgba(212, 175, 55, 0.07);
	color: #F2DC9E;
}
.lang-option-active {
	color: #D4AF37 !important;
	background: rgba(212, 175, 55, 0.1);
}
</style>
