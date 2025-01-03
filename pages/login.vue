<script setup lang="ts">
const supabase = useSupabaseClient();
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const router = useRouter();
const errorMessage = ref('');
const successMessage = ref('');

async function signInWithTwitch() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'twitch',
        options: {
            redirectTo: `https://qgpfftkjoktjzylwtvbx.supabase.co/auth/v1/callback`,
        },
    });
}

async function signInWithEmail() {

    // if (password.value !== confirmPassword.value) {
    //     errorMessage.value = `Les mots de passe ne correspondent pas.`;
    //     return;
    // }

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
    });

    if (error) {
        errorMessage.value = `Erreur lors de la connexion`;
    } else {
        router.push('/');
    }
}

definePageMeta({
    layout: 'auth' // Utilise le layout "auth.vue"
})

</script>

<template>
    <!-- Formulaire de connexion par e-mail et mot de passe -->
    <div
        class="max-w-lg mx-auto mt-12 p-8 bg-lightBg dark:bg-darkBg border border-lightPrimary dark:border-darkPrimary shadow-lg rounded-lg">
        <h2 class="text-3xl font-semibold text-center mb-6 text-lightPrimary dark:text-darkPrimary">
            Connexion
        </h2>
        <!-- Formulaire -->
        <form @submit.prevent="signInWithEmail">
            <!-- Email -->
            <div class="mb-6">
                <label for="email" class="block text-sm font-medium text-lightText dark:text-darkText">
                    Adresse e-mail
                </label>
                <input v-model="email" type="email" id="email"
                    class="mt-2 block w-full px-4 py-2 border border-lightText dark:border-darkText rounded-md bg-white dark:bg-stone-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-lightAccent dark:focus:ring-darkAccent focus:border-lightAccent dark:focus:border-darkAccent"
                    placeholder="exemple@mail.com" required />
            </div>

            <!-- Mot de passe -->
            <div class="mb-6">
                <label for="password" class="block text-sm font-medium text-lightText dark:text-darkText">
                    Mot de passe
                </label>
                <input v-model="password" type="password" id="password"
                    class="mt-2 block w-full px-4 py-2 border border-lightText dark:border-darkText rounded-md bg-white dark:bg-stone-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-lightAccent dark:focus:ring-darkAccent focus:border-lightAccent dark:focus:border-darkAccent"
                    placeholder="••••••••" required />
            </div>

            <!-- Messages d'erreur -->
            <div v-if="errorMessage" class="text-red-500 text-sm mt-1 mb-4">
                {{ errorMessage }}
            </div>

            <!-- Bouton de connexion -->
            <div class="mb-6">
                <button type="submit"
                    class="w-full py-3 px-4 bg-lightPrimary hover:bg-lightPrimaryHover dark:bg-darkPrimary dark:hover:bg-darkPrimaryHover text-lightBg dark:text-darkBg font-medium rounded-md shadow-lg transition-colors duration-300">
                    Se connecter
                </button>
            </div>
        </form>

        <!-- Lien vers la création de compte -->
        <div class="mt-6 text-center">
            <p class="text-sm text-lightText dark:text-darkText">
                Pas encore de compte ?
                <router-link to="/register" class="text-lightAccent dark:text-darkAccent hover:underline">
                    Créer un compte
                </router-link>
            </p>
        </div>

        <!-- Ligne de séparation -->
        <div class="flex items-center my-6">
            <div class="flex-grow border-t border-lightText dark:border-darkText"></div>
            <span class="mx-4 text-sm text-lightText dark:text-darkText">OU</span>
            <div class="flex-grow border-t border-lightText dark:border-darkText"></div>
        </div>

        <!-- Bouton de connexion avec Twitch -->
        <div class="mt-6">
            <button @click="signInWithTwitch"
                class="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md shadow-lg transition-colors duration-300">
                Se connecter avec Twitch
            </button>
        </div>
    </div>
</template>