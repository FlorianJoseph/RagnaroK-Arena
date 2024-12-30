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
            <div v-if="!user" class="ml-4">
                <router-link to='/login' class="text-blue-600 hover:underline">Connexion</router-link>
            </div>
            <div v-if="user" class="ml-4">
                <button
                    class="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:ring-2 focus:ring-blue-500">
                    <span>{{ user.email }}</span>
                </button>
            </div>
        </div>
    </div>
</template>