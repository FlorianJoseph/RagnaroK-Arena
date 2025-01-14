<script setup lang="ts">
import { useToast } from 'vue-toastification';
import { Twitch,Check, CircleX } from 'lucide-vue-next';

const supabase = useSupabaseClient();
const email = ref('');
const password = ref('');
const router = useRouter();
const toast = useToast(); // Initialisation du toast

async function signInWithTwitch() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'twitch',
        options: {
            redirectTo: `https://qgpfftkjoktjzylwtvbx.supabase.co/auth/v1/callback`,
        },
    });
    if (error) {
        toast.error("Erreur lors de la connexion : " + error.message, { icon: CircleX });
    }
}

async function signInWithEmail() {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
    });
    if (error) {
        toast.error("Erreur lors de la connexion : " + error.message, { icon: CircleX });
    } else {
        toast.success("Connexion réussie", { icon: Check });
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
        class="max-w-lg w-96 mx-auto mt-12 p-8 bg-white dark:bg-dcardbg border border-lborder dark:border-dborder shadow-lg rounded-lg">
        <h2 class="text-3xl font-semibold text-center mb-6 text-ltextbold dark:text-dtextbold">
            Connexion
        </h2>
        <!-- Formulaire -->
        <form @submit.prevent="signInWithEmail">
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

            <!-- Bouton de connexion -->
            <div class="mb-6">
                <button type="submit" class="btn-form">
                    Se connecter
                </button>
            </div>
        </form>

        <!-- Lien vers la création de compte -->
        <div class="mt-6 text-center">
            <p class="text-sm text-lightText dark:text-darkText">
                Pas encore de compte ?
                <router-link to="/register" class="text-ltextbold dark:text-dtextbold hover:underline">
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
        <div class="flex justify-center mt-6">
            <button @click="signInWithTwitch"
                class="flex justify-center w-36 py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md shadow-lg">
                <Twitch class="mr-2" />
                Twitch
            </button>
        </div>
    </div>
</template>