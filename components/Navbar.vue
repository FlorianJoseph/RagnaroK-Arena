<script setup lang="ts">
import { Swords, Trophy, Crown, Store, ChevronDown, User, Power, Dices } from 'lucide-vue-next';

const authStore = useAuthStore();
const route = useRoute();
const user = useSupabaseUser();
const isDropdownOpen = ref(false);
const isSubMenuOpen = ref(false);
const userStore = useUserStore();
const sidebarItems = [
    { label: 'Classement', icon: Trophy, link: '/classement' },
    { label: 'Clan', icon: Crown, link: '/clan' },
    { label: 'Boutique', icon: Store, link: '/boutique' },
    { label: 'Roulette', icon: Dices, link: '/roulette' }
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

        <!-- Section milieu -->
        <div class="flex items-center">
            <!-- Tournois avec sous-menu -->
            <div class="relative">
                <div class="flex items-center py-3 px-4 rounded hover:bg-lgray dark:hover:bg-dgray transition-all"
                    @mouseover="isSubMenuOpen = true" @mouseleave="isSubMenuOpen = false">
                    <component :is="Swords" class="h-6 w-6 mr-3" />
                    <NuxtLink to="/tournois" class="text-sm font-medium">
                        Tournois
                    </NuxtLink>
                </div>

                <!-- Sous-menu qui apparaît au survol -->
                <div v-if="isSubMenuOpen"
                    class="absolute left-0 bg-white dark:bg-dcardbg border border-lborder dark:border-dborder rounded shadow-lg w-48 mt-2">
                    <ul>
                        <li>
                            <NuxtLink to="/tournois"
                                class="flex items-center gap-2 px-4 py-2 text-ltext dark:text-dtext hover:bg-lgray dark:hover:bg-dgray">
                                Voir les Tournois
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="/tournois/nouveau"
                                class="flex items-center gap-2 px-4 py-2 text-ltext dark:text-dtext hover:bg-lgray dark:hover:bg-dgray">
                                Créer un Tournoi
                            </NuxtLink>
                        </li>
                    </ul>
                </div>
            </div>

            <div v-for="(item, index) in sidebarItems" :key="index">
                <NuxtLink :to="item.link"
                    class="text-sm font-medium flex items-center py-3 px-4 rounded hover:bg-lgray dark:hover:bg-dgray transition-all"
                    :class="{ 'bg-lgray dark:bg-dgray': route.path === item.link }">
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
</template>
