<script setup lang="ts">
import { Twitch } from 'lucide-vue-next';

const authStore = useAuthStore();
const email = ref('');
const password = ref('');

const handleTwitchAuth = async () => {
    await authStore.twitchAuth();
};

async function handleLogin() {
    await authStore.login(email.value, password.value);
}

definePageMeta({
    layout: 'auth'
})

</script>

<template>
    <div
        class="max-w-lg w-96 mx-auto mt-12 p-8 bg-white dark:bg-dcardbg border border-lborder dark:border-dborder shadow-lg rounded-lg">
        <h2 class="text-3xl font-semibold text-center mb-6 text-ltextbold dark:text-dtextbold">
            Connexion
        </h2>

        <form @submit.prevent="handleLogin">
            <div class="mb-6">
                <label for="email" class="block text-sm font-medium text-ltext dark:text-dtext">
                    Adresse email
                </label>
                <input v-model="email" type="email" id="email" class="input" placeholder="Entrez votre email"
                    required />
            </div>

            <div class="mb-6">
                <label for="password" class="block text-sm font-medium text-ltext dark:text-dtext">
                    Mot de passe
                </label>
                <input v-model="password" type="password" id="password" class="input"
                    placeholder="Entrez votre mot de passe" required />
            </div>

            <div class="mb-6">
                <button type="submit" class="btn-form">
                    Se connecter
                </button>
            </div>
        </form>

        <div class="mt-6 text-center">
            <p class="text-sm text-lightText dark:text-darkText">
                Pas encore de compte ?
                <NuxtLink to="/auth/inscription" class="text-ltextbold dark:text-dtextbold hover:underline">
                    Créer un compte
                </NuxtLink>
            </p>
        </div>

        <div class="flex items-center my-6">
            <div class="flex-grow border-t border-lightText dark:border-darkText"></div>
            <span class="mx-4 text-sm text-lightText dark:text-darkText">OU</span>
            <div class="flex-grow border-t border-lightText dark:border-darkText"></div>
        </div>

        <div class="flex justify-center mt-6">
            <button @click="handleTwitchAuth"
                class="flex justify-center w-36 py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md shadow-lg">
                <Twitch class="mr-2" />
                Twitch
            </button>
        </div>
        
    </div>
</template>