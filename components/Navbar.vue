<script setup lang="ts">
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const isDropdownOpen = ref(false);

import { Swords, Trophy, Crown, Store, ChevronDown, User } from 'lucide-vue-next'; // Importer les icônes Lucide


// Déclaration de la liste des éléments de la sidebar
const sidebarItems = [
    { label: 'Tournois', icon: Swords, link: '/tournois' },
    { label: 'Classement', icon: Trophy, link: '/classement' },
    { label: 'Clans', icon: Crown, link: '/clans' },
    { label: 'Boutique', icon: Store, link: '/boutique' }
];

async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) console.error('Error signing out:', error);
    isDropdownOpen.value = false;  // Ferme le menu après déconnexion
}
</script>

<template>
    <div class="flex justify-between items-center w-full px-6 py-4">
        <!-- Section gauche -->
        <div class="flex items-center">
            <router-link to='/'>
                <p class="ml-8 text-2xl font-bold">RagnaröK Arena</p>
            </router-link>
        </div>

        <!-- Section milieu -->
        <div class="flex items-center">
            <div v-for="(item, index) in sidebarItems" :key="index"
                class="flex items-center py-3 px-4 rounded hover:bg-lightPrimary hover:text-lightBg dark:hover:bg-darkPrimary dark:hover:text-darkBg transition-all">
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
            <button v-if="!user"
                class="ml-4 p-2 rounded w-28 flex justify-center font-medium text-white dark:text-darkText bg-lightPrimary hover:bg-lightPrimaryHover dark:bg-darkPrimary dark:hover:bg-darkPrimaryHover">
                <router-link to='/login'>Connexion</router-link>
            </button>

            <!-- Menu déroulant pour le profil et la déconnexion -->
            <div v-if="user" class="relative">
                <button @click="isDropdownOpen = !isDropdownOpen"
                    class="flex items-center space-x-2 px-4 py-2 text-lightText dark:text-darkText rounded hover:bg-lightPrimary hover:text-darkText dark:hover:bg-darkPrimary">
                    <span>{{ user.email }}</span>
                    <ChevronDown />
                </button>

                <!-- Menu déroulant -->
                <div v-if="isDropdownOpen"
                    class="absolute right-0 mt-2 w-48 bg-white dark:bg-darkBg border border-lightPrimary dark:border-darkPrimary rounded shadow-lg">
                    <ul>
                        <li>
                            <User />
                            <router-link to="/profil"
                                class="block px-4 py-2 text-sm text-lightText dark:text-darkText hover:bg-lightPrimary dark:hover:bg-darkPrimary hover:text-darkText">
                                Profil
                            </router-link>
                        </li>
                        <li>
                            <button @click="signOut"
                                class="block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-500 dark:hover:bg-red-700 hover:text-white dark:hover:text-lightBg focus:outline-none dark:focus:ring-red-700 w-full">
                                Déconnexion
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
