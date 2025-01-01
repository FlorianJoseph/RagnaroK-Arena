<script setup lang="ts">
const user = useSupabaseUser();
</script>

<template>
    <div class="flex justify-between items-center w-full px-6 py-4">
        <!-- Section gauche -->
        <div class="flex items-center">
            <span>Logo</span>
            <p class="ml-8 text-2xl font-bold">RagnaröK Arena</p>
        </div>
        <!-- Section droite -->
        <div class="flex items-center">
            <ToggleTheme />
            <div v-if="!user" class="ml-4 text-darkText bg-lightPrimary dark:text-lightText dark:bg-darkPrimary p-2 rounded w-24 flex justify-center hover:shadow-lg dark:hover:shadow-xl hover:scale-105 dark:hover:scale-105 transition-all duration-300 ease-[cubic-bezier(0.19,1,0.56,1)]">
                <router-link to='/login'>Connexion</router-link>
            </div>
            <div v-if="user" class="ml-4">
                <button
                    class="px-4 py-2 rounded-md hover:bg-lightBg dark:hover:darkBg focus:ring-2 focus:ring-blue-500">
                    <span>{{ user.email }}</span>
                </button>
            </div>
        </div>
    </div>
</template>