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

    if (password.value !== confirmPassword.value) {
        errorMessage.value = `Les mots de passe ne correspondent pas.`;
        return;
    }

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

</script>

<template>
    <!-- Formulaire de connexion par e-mail et mot de passe -->
    <div class="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
        <!-- Formulaire -->
        <form @submit.prevent="signInWithEmail">
            <!-- Email -->
            <div class="mb-4">
                <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                <input v-model="email" type="email" id="email"
                    class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Entrez votre e-mail" required />
            </div>

            <!-- Mot de passe -->
            <div class="mb-6">
                <label for="password" class="block text-sm font-medium text-gray-700">Mot de passe</label>
                <input v-model="password" type="password" id="password"
                    class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Entrez votre mot de passe" required />
            </div>

            <!-- Confirmation du mot de passe -->
            <div class="mb-6">
                <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Répétez votre mot de
                    passe</label>
                <input v-model="confirmPassword" type="password" id="confirmPassword"
                    class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Répétez votre mot de passe" required />
            </div>

            <!-- Messages de succès et d'erreur -->
            <div v-if="errorMessage" class="text-red-500 text-sm mt-1">{{ errorMessage }}</div>

            <!-- Bouton de connexion -->
            <div class="mb-4">
                <button type="submit"
                    class="w-full py-2 px-4 bg-vblue text-darkBg rounded-md shadow-sm hover:bg-vbluehover hover:text-lightBg focus:outline-none focus:ring-2 focus:ring-blue-400">
                    Se connecter
                </button>
            </div>
        </form>
        
        <!-- Bouton de connexion si l'utilisateur a déjà un compte -->
        <div class="mt-4 text-center">
            <p class="text-sm text-gray-600">Vous avez déjà un compte ?
                <router-link to="/register" class="text-blue-600 hover:underline">Créer un compte ici</router-link>
            </p>
        </div>
        <!-- Bouton de connexion Twitch -->
        <div class="mt-4 text-center">
            <button @click="signInWithTwitch"
                class="w-full py-2 px-4 bg-purple-600 text-white font-semibold rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400">
                Se connecter avec Twitch
            </button>
        </div>
    </div>
</template>