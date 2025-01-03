<script lang="ts">

definePageMeta({
    layout: 'profile' // Utilise le layout "profile.vue"
})

</script>

<template>
    <div class="min-h-screen bg-lightBg dark:bg-darkBg">

        <div class="container mx-auto py-10 px-6">
            <!-- Section du profil -->
            <div v-if="user" class="bg-white dark:bg-stone-800 p-8 rounded-lg shadow-lg">
                <h2 class="text-3xl font-semibold text-center text-lightText dark:text-darkText mb-6">
                    Mon Profil (en travaux)
                </h2>

                <!-- Informations Utilisateur -->
                <div class="flex justify-center items-center mb-6">
                    <div class="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-700 mb-4">
                        <!-- Image de profil - ici un espace pour l'avatar -->
                    </div>
                    <div class="ml-6">
                        <h3 class="text-xl font-bold text-lightText dark:text-darkText">{{ user.email }}</h3>
                        <p class="text-sm text-lightText dark:text-darkText">Utilisateur depuis : {{ user.created_at ||
                            'Non défini'
                            }}
                        </p>
                    </div>
                </div>

                <!-- Détails du profil -->
                <div class="grid grid-cols-1 gap-6">
                    <div class="flex items-center justify-between p-4 bg-lightBg dark:bg-darkBg rounded-md shadow-sm">
                        <span class="text-sm text-lightText dark:text-darkText">Nom d'utilisateur</span>
                        <!-- <span class="text-sm text-lightText dark:text-darkText">{{ user.username || 'Pseudo' }}</span> -->
                    </div>

                    <div class="flex items-center justify-between p-4 bg-lightBg dark:bg-darkBg rounded-md shadow-sm">
                        <span class="text-sm text-lightText dark:text-darkText">Adresse e-mail</span>
                        <span class="text-sm text-lightText dark:text-darkText">{{ user.email }}</span>
                    </div>

                    <!-- Modifier le profil -->
                    <div class="mt-6 text-center">
                        <button
                            class="px-6 py-2 bg-lightPrimary dark:bg-darkPrimary text-lightBg dark:text-darkText rounded-md shadow-sm hover:bg-lightPrimaryHover dark:hover:bg-darkPrimaryHover">
                            Modifier mon profil
                        </button>
                    </div>
                </div>

                <!-- Déconnexion -->
                <div class="mt-8 text-center">
                    <button @click="signOut"
                        class="px-6 py-2 bg-red-600 text-white rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
                        Déconnexion
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();

async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Error signing out:', error);
    }
    router.push('/');
}
</script>