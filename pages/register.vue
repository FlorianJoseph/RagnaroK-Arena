<script setup lang="ts">
const email = ref('');
const password = ref('');
const supabase = useSupabaseClient();
const router = useRouter();
const errorMessage = ref('');
const successMessage = ref('');

// Fonction d'inscription
async function signUpNewUser() {
    const { data, error } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
        options: {
            emailRedirectTo: 'http://localhost:3000/',
        },
    });

    if (error) {
        errorMessage.value = `Erreur lors de l'inscription : Pour des raisons de sécurité, vous ne pouvez le demander qu'après 1 minute.`;
    } else {
        successMessage.value = 'Utilisateur inscrit avec succès. Veuillez vérifier votre email pour confirmer votre inscription.';
        // Optionally redirect the user after successful sign-up
        router.push('/');
    }
}

async function signUpWithTwitch() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'twitch',
        options: {
            redirectTo: `https://qgpfftkjoktjzylwtvbx.supabase.co/auth/v1/callback`,
        },
    });
}

definePageMeta({
    layout: 'auth' // Utilise le layout "auth.vue"
})

</script>

<template>
    <!-- Conteneur principal avec Flexbox pour centrer le formulaire -->
    <div
        class="max-w-lg mx-auto mt-12 p-8 bg-lightBg dark:bg-darkBg border border-lightPrimary dark:border-darkPrimary shadow-lg rounded-lg">
        <h2 class="text-3xl font-semibold text-center mb-6 text-lightPrimary dark:text-darkPrimary">
            Créer un compte
        </h2>

        <!-- Formulaire -->
        <form @submit.prevent="signUpNewUser">
            <!-- Email -->
            <div class="mb-6">
                <label for="email" class="block text-sm font-medium text-lightText dark:text-darkText">
                    Adresse e-mail
                </label>
                <input v-model="email" type="email" id="email"
                    class="mt-2 block w-full px-4 py-2 border border-lightText dark:border-darkText rounded-md bg-white dark:bg-stone-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-lightAccent dark:focus:ring-darkAccent focus:border-lightAccent dark:focus:border-darkAccent"
                    placeholder="Entrez votre e-mail" required />
            </div>

            <!-- Mot de passe -->
            <div class="mb-6">
                <label for="password" class="block text-sm font-medium text-lightText dark:text-darkText">
                    Mot de passe
                </label>
                <input v-model="password" type="password" id="password"
                    class="mt-2 block w-full px-4 py-2 border border-lightText dark:border-darkText rounded-md bg-white dark:bg-stone-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-lightAccent dark:focus:ring-darkAccent focus:border-lightAccent dark:focus:border-darkAccent"
                    placeholder="Créez un mot de passe" required />
            </div>

            <!-- Messages de succès et d'erreur -->
            <div v-if="errorMessage" class="text-red-600 text-sm mt-2 mb-4">
                {{ errorMessage }}
            </div>
            <div v-if="successMessage" class="text-green-600 text-sm mt-2 mb-4">
                {{ successMessage }}
            </div>

            <!-- Bouton d'inscription -->
            <div class="mb-6">
                <button type="submit"
                    class="w-full py-3 px-4 bg-lightPrimary hover:bg-lightPrimaryHover dark:bg-darkPrimary dark:hover:bg-darkPrimaryHover text-lightBg dark:text-darkText font-medium rounded-md shadow-lg transition-colors duration-300">
                    S'inscrire
                </button>
            </div>
        </form>

        <!-- Lien vers la page de connexion -->
        <div class="mt-6 text-center">
            <p class="text-sm text-lightText dark:text-darkText">
                Vous avez déjà un compte ?
                <router-link to="/login" class="text-lightAccent dark:text-darkAccent hover:underline">
                    Connectez-vous ici
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
            <button @click="signUpWithTwitch"
                class="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md shadow-lg transition-colors duration-300">
                Se connecter avec Twitch
            </button>
        </div>
    </div>
</template>
