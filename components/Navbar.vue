<script setup lang="ts">
import { Swords, Trophy, Crown, Store, ChevronDown, User, Power, Dices, Menu } from 'lucide-vue-next';

const authStore = useAuthStore();
const route = useRoute();
const user = useSupabaseUser();
const isDropdownOpen = ref(false);
const userStore = useUserStore();
const isMenuOpen = ref(false);
const sidebarItems = [
    { label: 'Tournois', icon: Swords, link: '/tournois' },
    { label: 'Classement', icon: Trophy, link: '/classement' },
    { label: 'Clan', icon: Crown, link: '/clan', disabled: true },
    // { label: 'Boutique', icon: Store, link: '/boutique', disabled: true },
    // { label: 'Roulette', icon: Dices, link: '/roulette', disabled: true },
];

async function handleLogout() {
    await authStore.logout();
}

onMounted(async () => {
    await userStore.getProfile();
});
</script>

<template>
    <div
        class="flex justify-between items-center w-full px-6 py-2 bg-white dark:bg-dcardbg border-b border-lborder dark:border-dborder">
        <!-- Section gauche -->
        <div class="flex items-center">
            <NuxtLink to='/'>
                <p class="ml-8 text-2xl font-bold whitespace-nowrap">RagnaröK Arena</p>
            </NuxtLink>
        </div>

        <!-- Menu hamburger pour les petits écrans -->
        <div class="lg:hidden flex items-center">
            <button @click="isMenuOpen = !isMenuOpen" class="text-2xl">
                <Menu />
            </button>
        </div>

        <!-- Section milieu -->
        <div class="hidden lg:flex items-center">
            <div v-for="(item, index) in sidebarItems" :key="index">
                <NuxtLink :to="item.disabled ? '' : item.link"
                    class="text-sm font-medium flex items-center py-3 px-4 rounded hover:bg-lgray dark:hover:bg-dgray"
                    :class="{
                        'bg-lgray dark:bg-dgray transition-all scale-105': route.path === item.link,
                        'opacity-50 pointer-events-none': item.disabled
                    }">
                    <component :is="item.icon" class="h-6 w-6 mr-3" />
                    {{ item.label }}
                </NuxtLink>
            </div>
        </div>

        <!-- Section droite -->
        <div class="flex items-center">
            <ToggleTheme />
            <button v-if="!user" class="btn">
                <NuxtLink to='/auth/connexion'>Connexion</NuxtLink>
            </button>

            <!-- Menu déroulant pour le profil et la déconnexion -->
            <div v-if="user" class="relative">
                <button @click="isDropdownOpen = !isDropdownOpen" class="btn-profil">
                    <img :src="userStore.profile?.avatar_url" alt="Avatar" class="w-7 h-7 rounded-full object-cover" />
                    <span>
                        {{ userStore.profile?.username }}
                    </span>
                    <ChevronDown />
                </button>

                <!-- Menu déroulant -->
                <div v-if="isDropdownOpen"
                    class="absolute right-0 mt-2-2 w-48 bg-white dark:bg-dcardbg border border-lborder dark:border-dborder rounded shadow-lg">
                    <ul>
                        <li>
                            <NuxtLink to="/compte/profil"
                                class="flex items-center gap-2 px-4 py-2 text-ltext dark:text-dtext hover:bg-lgray dark:hover:bg-dgray transition-all">
                                <User /> Profil
                            </NuxtLink>
                        </li>
                        <li>
                            <button @click="handleLogout"
                                class="flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-500 dark:hover:bg-red-700 hover:text-white dark:hover:text-lightBg focus:outline-none dark:focus:ring-red-700 w-full">
                                <Power /> Déconnexion
                            </button>
                        </li>
                    </ul>
                </div>

            </div>
        </div>
    </div>

    <!-- Menu latéral sur mobile -->
    <div v-if="isMenuOpen" class="lg:hidden absolute top-0 left-0 w-full bg-white dark:bg-dcardbg shadow-md">
        <div v-for="(item, index) in sidebarItems" :key="index">
            <NuxtLink :to="item.disabled ? '' : item.link"
                class="text-sm font-medium flex items-center py-3 px-4 rounded hover:bg-lgray dark:hover:bg-dgray transition-all"
                :class="{
                    'bg-lgray dark:bg-dgray': route.path === item.link,
                    'opacity-50 pointer-events-none': item.disabled
                }">
                <component :is="item.icon" class="h-6 w-6 mr-3" />
                {{ item.label }}
            </NuxtLink>
        </div>
    </div>
</template>
