<script setup lang="ts">
const user = useSupabaseUser();

// Déclaration de la liste des éléments de la sidebar
const sidebarItems = [
    { label: 'Menu', icon: 'm2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25', link: '/' },
    { label: 'Tournois', icon: 'M3 3h5v6H3m5-3h7v12H8m7-6h7M3 15h5v6H3', link: '/tournois' },
    { label: 'Classement', icon: 'M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0', link: '/classement' }
];
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
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="h-6 w-6 mr-3">
                    <path :d="item.icon" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
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
            <button v-if="user" class="ml-4 px-4 py-2 rounded hover:bg-lightBg dark:hover:darkBg">
                <span>{{ user.email }}</span>
            </button>
        </div>
    </div>
</template>
