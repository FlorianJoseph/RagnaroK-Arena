<script setup lang="ts">
import { Swords, Trophy, Crown, Store, ChevronDown, User, Power } from 'lucide-vue-next'; // Importer les icônes Lucide
import { logout } from '~/services/auth';

const user = useSupabaseUser();

const isDropdownOpen = ref(false);
const sidebarItems = [
    { label: 'Tournois', icon: Swords, link: '/tournois' },
    { label: 'Classement', icon: Trophy, link: '/classement' },
    { label: 'Clan', icon: Crown, link: '/clan' },
    { label: 'Boutique', icon: Store, link: '/boutique' }
];

async function handleLogout() {
    await logout();
}

const userStore = useUserStore();

onMounted(async () => {
    await userStore.fetchProfile();
});

</script>

<template>
    <div
        class="flex justify-between items-center w-full px-6 py-3.5 bg-white dark:bg-dcardbg border-b border-lborder dark:border-dborder">
        <!-- Section gauche -->
        <div class="flex items-center">
            <router-link to='/'>
                <p class="ml-8 text-2xl font-bold">RagnaröK Arena</p>
            </router-link>
        </div>

        <!-- Section milieu -->
        <div class="flex items-center">
            <div v-for="(item, index) in sidebarItems" :key="index"
                class="flex items-center py-3 px-4 rounded hover:bg-lgray dark:hover:bg-dgray">
                <!-- Utilisation de l'icône Lucide -->
                <component :is="item.icon" class="h-6 w-6 mr-3" />
                <router-link :to="item.link" class="text-sm font-medium">
                    {{ item.label }}
                </router-link>
            </div>
        </div>

        <!-- Section droite -->
        <div class="flex items-center">
            <ToggleTheme />
            <button v-if="!user" class="btn">
                <router-link to='/login'>Connexion</router-link>
            </button>

            <!-- Menu déroulant pour le profil et la déconnexion -->
            <div v-if="user" class="relative">
                <button @click="isDropdownOpen = !isDropdownOpen" class="btn-profil">
                    <img :src="user.user_metadata.avatar || user.user_metadata.avatar_url || 'https://rikzkugzznvcygapwgol.supabase.co/storage/v1/object/public/avatar/default/default.jpg?t=2025-01-16T13%3A42%3A28.357Z'"
                        alt="Avatar" class="w-7 h-7 rounded-full object-cover" />
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
                            <router-link to="/profil"
                                class="flex items-center gap-2 px-4 py-2 text-ltext dark:text-dtext hover:bg-lgray dark:hover:bg-dgray">
                                <User /> Profil
                            </router-link>
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
