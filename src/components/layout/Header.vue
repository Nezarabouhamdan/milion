<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useMenuQuery } from "../../composables/useMenuQuery";
import { imagePath } from "../../utils/helpers";
import { ScrollArea } from "../ui/scroll-area";
import { Menu as MenuIcon, ChevronDown, X, Globe as GlobeIcon } from "lucide-vue-next";
import { Button } from "../ui/button";
import logoWhite1 from "../../assets/logo-main.png";

// ── Language state ────────────────────────────────────────────────
const VALID_LANGS = ['en', 'ja', 'zh-CN', 'ar'];
const stored = localStorage.getItem('lang') ?? 'en';
const lang = ref(VALID_LANGS.includes(stored) ? stored : 'en');

const languages = [
	{ code: 'en',    label: 'English',  short: 'EN' },
	{ code: 'ja',    label: '日本語',    short: 'JA' },
	{ code: 'zh-CN', label: '中文',      short: 'ZH' },
	{ code: 'ar',    label: 'العربية',   short: 'AR' },
];

const currentLangLabel = computed(() => languages.find(l => l.code === lang.value)?.label ?? 'English');

const isRtl = (code: string) => code === 'ar';

const applyDirection = (code: string) => {
	document.documentElement.dir = isRtl(code) ? 'rtl' : 'ltr';
};

const setGTCookie = (code: string) => {
	const value = code === 'en' ? '' : `/en/${code}`;
	const expire = code === 'en' ? 'expires=Thu, 01 Jan 1970 00:00:00 UTC;' : '';
	document.cookie = `googtrans=${value}; ${expire} path=/;`;
	document.cookie = `googtrans=${value}; ${expire} path=/; domain=.${location.hostname};`;
};

const switchLang = (code: string) => {
	if (code === lang.value) return;
	localStorage.setItem('lang', code);
	setGTCookie(code);
	// Small delay ensures cookies are committed before the browser navigates
	setTimeout(() => window.location.reload(), 50);
};

onMounted(() => {
	applyDirection(lang.value);
	document.addEventListener('click', handleClickOutside);
});
onUnmounted(() => {
	document.removeEventListener('click', handleClickOutside);
});

// ── Language dropdown ─────────────────────────────────────────────
const langDropdownOpen = ref(false);
const langDropdownRef = ref<HTMLElement | null>(null);

const handleClickOutside = (e: MouseEvent) => {
	if (langDropdownRef.value && !langDropdownRef.value.contains(e.target as Node)) {
		langDropdownOpen.value = false;
	}
};

const selectLanguage = (code: string) => {
	switchLang(code);
	langDropdownOpen.value = false;
};

// ── Menu translations ─────────────────────────────────────────────
const navMap: Record<string, Record<string, string>> = {
	ja: { Home: 'ホーム', Buy: '購入', Sell: '売却', Rent: '賃貸', About: '会社について',
	      Contact: 'お問い合わせ', 'Holiday Homes': '民泊運営', Offplan: '新築物件', Areas: 'エリア' },
	'zh-CN': { Home: '首页', Buy: '购买', Sell: '出售', Rent: '租房', About: '关于我们',
	            Contact: '联系我们', 'Holiday Homes': '假日住宅', Offplan: '期房', Areas: '区域' },
	ar: { Home: 'الرئيسية', Buy: 'شراء', Sell: 'بيع', Rent: 'إيجار', About: 'عن الشركة',
	      Contact: 'اتصل بنا', 'Holiday Homes': 'منازل العطلات', Offplan: 'قيد الانشاء', Areas: 'المناطق' },
};

const getMenuName = (name: string) => navMap[lang.value]?.[name] ?? name;

// ── Menu logic ────────────────────────────────────────────────────
const { data: menusRaw } = useMenuQuery(true);
const menus = computed(() => (menusRaw.value as unknown) as any[]);
const mobileMenuOpen = ref(false);
const activeDropdown = ref<number | null>(null);
const mobileActiveDropdown = ref<number | null>(null);

const toggleMobileMenu = () => { mobileMenuOpen.value = !mobileMenuOpen.value; };
const toggleDropdown = (id: number) => { activeDropdown.value = activeDropdown.value === id ? null : id; };
const closeDropdowns = () => { activeDropdown.value = null; };
const toggleMobileDropdown = (id: number) => { mobileActiveDropdown.value = mobileActiveDropdown.value === id ? null : id; };
const hasSubMenus = (menu: any) => Array.isArray(menu.menus) && menu.menus.length > 0;
const menuImageUrl = (menu: any) => {
	const raw = typeof menu.image === 'object' ? menu.image?.url : menu.image;
	return raw ? imagePath(raw) : null;
};
</script>

<template>
	<header class="bg-black-100 text-white shadow-md sticky top-0 z-50">
		<div class="container mx-auto flex justify-between items-center py-3 px-4">

			<!-- Mobile Toggle -->
			<div class="flex items-center gap-4 w-1/3 lg:w-auto">
				<Button variant="ghost" size="icon" class="lg:hidden text-white hover:bg-black-200" @click="toggleMobileMenu">
					<MenuIcon v-if="!mobileMenuOpen" class="h-6 w-6" />
					<X v-else class="h-6 w-6" />
				</Button>
			</div>

			<!-- Logo -->
			<div class="flex justify-center w-1/3 lg:w-full xl:w-auto lg:justify-start">
				<router-link to="/" class="block">
					<img :src="logoWhite1" alt="MillionHomes" class="w-auto lg:w-full xl:w-auto object-contain max-w-full h-24 xl:h-32" />
				</router-link>
			</div>

			<!-- Desktop Nav -->
			<nav class="hidden lg:block flex-grow px-4 xl:px-8">
				<ul class="flex space-x-2 justify-center">
					<li v-for="menu in menus" :key="menu.id" class="relative group">
						<template v-if="hasSubMenus(menu)">
							<button translate="no"
								class="px-1 xl:px-2 2xl:px-4 py-2 text-xs xl:text-sm text-nowrap tracking-wider uppercase hover:text-secondary transition-colors font-medium flex items-center"
								:class="{ 'text-secondary': activeDropdown === menu.id }"
								@click="toggleDropdown(menu.id)">
								{{ getMenuName(menu.name) }}
								<ChevronDown class="h-4 w-4 ml-1" :class="{ 'rotate-180': activeDropdown === menu.id }" />
							</button>
							<div v-show="activeDropdown === menu.id"
								class="nav-dropdown-panel absolute left-0 top-full mt-1 w-[400px] rounded overflow-hidden z-50" style="background:#242424; border:1px solid rgba(212,175,55,0.2);">
								<div v-if="menuImageUrl(menu)" class="relative h-[150px] w-full overflow-hidden">
									<img :src="menuImageUrl(menu)" :alt="menu.name" class="w-full h-full object-cover" />
									<div class="absolute inset-0 flex items-center justify-center" style="background-color:rgba(0,0,0,0.5)">
										<span class="text-white text-2xl font-bold capitalize tracking-wide">{{ menu.name }}</span>
									</div>
								</div>
								<ul class="p-4">
									<li v-for="submenu in menu.menus" :key="submenu.id" class="py-1">
										<router-link :to="'/' + submenu.link || '#'"
											class="block px-4 py-2 rounded transition-colors"
											style="color:#cccccc;"
											@mouseover="($event.target as HTMLElement).style.color='#D4AF37'"
											@mouseleave="($event.target as HTMLElement).style.color='#cccccc'"
											@click="closeDropdowns">
											{{ submenu.name }}
										</router-link>
									</li>
								</ul>
							</div>
						</template>
						<router-link v-else :to="menu.link ? '/' + menu.link.replace(/^\//, '') : '#'" translate="no"
							class="px-1 xl:px-2 2xl:px-4 py-2 text-xs xl:text-sm text-nowrap tracking-wider uppercase hover:text-secondary transition-colors flex items-center font-medium">
							{{ getMenuName(menu.name) }}
						</router-link>
					</li>
					<li v-if="lang === 'ja'">
						<a href="https://jp.millionhomes.ae" target="_blank"
							class="px-1 xl:px-2 2xl:px-4 py-2 text-sm xl:text-base text-nowrap hover:text-secondary transition-colors flex items-center font-medium">
							highlights
						</a>
					</li>
				</ul>
			</nav>

			<!-- Language Dropdown (Desktop) -->
			<div class="flex items-center gap-2 xl:gap-3 w-1/3 lg:w-auto justify-end notranslate" ref="langDropdownRef">
				<router-link to="/contact-us"
					class="hidden lg:inline-flex items-center border border-secondary text-secondary hover:bg-secondary hover:text-black-100 px-4 py-2 text-xs tracking-widest uppercase font-semibold transition-all duration-300">
					Contact Us
				</router-link>
				<div class="relative">
					<button
						class="px-2 2xl:px-4 py-2 text-sm xl:text-base text-nowrap bg-white text-gray-700 border border-gray-300 rounded-lg shadow-lg hover:bg-black-100 hover:text-white transition-all duration-300 flex items-center gap-2 font-bold"
						@click.stop="langDropdownOpen = !langDropdownOpen">
						<GlobeIcon class="w-4 h-4" />
						{{ currentLangLabel }}
						<ChevronDown class="w-3 h-3" :class="{ 'rotate-180': langDropdownOpen }" />
					</button>
					<div v-show="langDropdownOpen"
						class="absolute right-0 top-full mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
						<button
							v-for="l in languages" :key="l.code"
							class="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-between"
							:class="{ 'font-bold text-black-100 bg-gray-50': lang === l.code }"
							@click="selectLanguage(l.code)">
							{{ l.label }}
							<span v-if="lang === l.code" class="text-secondary text-xs">✓</span>
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- Mobile Sidebar -->
		<div v-show="mobileMenuOpen" class="lg:hidden fixed inset-0 z-40">
			<div class="absolute inset-0 bg-black bg-opacity-50" @click="toggleMobileMenu"></div>
			<div class="absolute top-0 w-[280px] h-full bg-white z-50 p-5" :class="isRtl(lang) ? 'right-0' : 'left-0'">
				<div class="flex items-center justify-between">
					<img :src="logoWhite1" class="h-16 w-auto" />
					<Button variant="ghost" size="icon" class="text-black-100" @click="toggleMobileMenu">
						<X class="h-5 w-5" />
					</Button>
				</div>
				<nav>
					<ScrollArea class="h-[calc(100vh-200px)] scrollbar-hidden text-black-100">
						<ul class="space-y-1">
							<li v-for="menu in menus" :key="menu.id" class="py-1">
								<template v-if="hasSubMenus(menu)">
									<button translate="no"
										class="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded text-black-100 font-medium"
										@click="toggleMobileDropdown(menu.id)">
										<span>{{ getMenuName(menu.name) }}</span>
										<ChevronDown class="h-4 w-4" :class="{ 'rotate-180': mobileActiveDropdown === menu.id }" />
									</button>
									<div v-show="mobileActiveDropdown === menu.id" class="pl-4 mt-1 border-l-2 border-gray-100 ml-3">
										<ul>
											<li v-for="submenu in menu.menus" :key="submenu.id" class="mb-1">
												<router-link :to="'/' + submenu.link || '#'"
													class="block px-3 py-2 hover:bg-gray-50 rounded text-sm text-black-100"
													@click="toggleMobileMenu">
													{{ submenu.name }}
												</router-link>
											</li>
										</ul>
									</div>
								</template>
								<router-link v-else :to="menu.link ? '/' + menu.link.replace(/^\//, '') : '#'" translate="no"
									class="block px-3 py-2 hover:bg-gray-50 rounded text-black-100 font-medium"
									@click="toggleMobileMenu">
									{{ getMenuName(menu.name) }}
								</router-link>
							</li>
							<li v-if="lang === 'ja'">
								<a href="https://jp.millionhomes.ae" target="_blank" class="block px-3 py-2 font-medium">
									highlights
								</a>
							</li>
						</ul>
					</ScrollArea>

					<!-- Mobile Language Selector -->
					<div class="mt-4 notranslate">
						<p class="text-xs text-gray-400 px-3 mb-2 uppercase tracking-wide">Language</p>
						<div class="flex gap-2 px-3">
							<button
								v-for="l in languages" :key="l.code"
								class="flex-1 py-2 text-sm rounded-lg border transition-colors font-medium"
								:class="lang === l.code ? 'bg-black-100 text-white border-black-100' : 'bg-white text-gray-700 border-gray-300 hover:border-black-100'"
								@click="selectLanguage(l.code)">
								{{ l.short }}
							</button>
						</div>
					</div>

					<a href="/sell"
						class="px-3 py-3 mt-4 bg-secondary text-black-100 rounded-lg flex items-center justify-center gap-2 shadow-md">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
							stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
							class="h-5 w-5">
							<rect width="18" height="18" x="3" y="3" rx="2"></rect>
							<path d="M8 12h8"></path><path d="M12 8v8"></path>
						</svg>
						<span class="font-medium">List Property</span>
					</a>
				</nav>
			</div>
		</div>
	</header>
</template>

<style scoped>
.scrollbar-hidden::-webkit-scrollbar { display: none !important; }
.scrollbar-hidden { scrollbar-width: none !important; -ms-overflow-style: none !important; }
.notranslate { unicode-bidi: isolate; }
</style>
