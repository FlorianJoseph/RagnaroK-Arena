<script setup lang="ts">
import { Twitch } from 'lucide-vue-next';

const supabase = useSupabaseClient();
const email = ref('');
const password = ref('');
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
        return;
    } else {
        successMessage.value = 'Utilisateur inscrit avec succès. Veuillez vérifier votre email pour confirmer votre inscription.';
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
        class="max-w-lg w-96 mx-auto mt-12 p-8 bg-lcardbg dark:bg-dcardbg border border-lborder dark:border-dborder shadow-lg rounded-lg">
        <h2 class="text-3xl font-semibold text-center mb-6 text-ltextbold dark:text-dtextbold">
            Créer un compte
        </h2>

        <!-- Formulaire -->
        <form @submit.prevent="signUpNewUser">
            <!-- Email -->
            <div class="mb-6">
                <label for="email" class="block text-sm font-medium text-ltext dark:text-dtext">
                    Adresse email
                </label>
                <input v-model="email" type="email" id="email" class="input" placeholder="Entrez votre email"
                    required />
            </div>

            <!-- Mot de passe -->
            <div class="mb-6">
                <label for="password" class="block text-sm font-medium text-ltext dark:text-dtext">
                    Mot de passe
                </label>
                <input v-model="password" type="password" id="password" class="input"
                    placeholder="Entrez votre mot de passe" required />
            </div>

            <!-- Bouton d'inscription -->
            <div class="mb-6">
                <button type="submit" class="btn-form">
                    S'inscrire
                </button>
            </div>
        </form>

        <!-- Lien vers la page de connexion -->
        <div class="mt-6 text-center">
            <p class="text-sm text-lightText dark:text-darkText">
                Vous avez déjà un compte ?
                <router-link to="/login" class="text-ltextbold dark:text-dtextbold hover:underline">
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
        <div class="flex justify-center mt-6">
            <button @click="signUpWithTwitch"
                class="flex justify-center w-36 py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md shadow-lg">
                <Twitch class="mr-2" />
                Twitch
            </button>
        </div>
    </div>
</template>
