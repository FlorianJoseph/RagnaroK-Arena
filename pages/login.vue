<script lang="ts">
export default defineComponent({
    setup() {
        const supabase = useSupabaseClient();
        const email = ref('');
        const password = ref('');

        const signInWithTwitch = async () => {
            await supabase.auth.signInWithOAuth({
                provider: 'twitch',
                options: {
                    redirectTo: `https://qgpfftkjoktjzylwtvbx.supabase.co/auth/v1/callback`,
                },
            });
        };

        const signInWithEmail = async () => {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email.value,
                password: password.value,
            });

            if (error) {
                console.error('Erreur de connexion:', error.message);
            } else {
                console.log('Connexion réussie:', data);
            }
        };

        return {
            email,
            password,
            signInWithTwitch,
            signInWithEmail
        };
    },
});

</script>

<template>
    <Navbar />

    <!-- Formulaire de connexion par e-mail et mot de passe -->
    <div class="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
        <h2 class="text-2xl font-semibold text-center mb-4">Connexion</h2>

        <!-- Formulaire -->
        <form @submit.prevent="signInWithEmail">
            <!-- Email -->
            <div class="mb-4">
                <label for="email" class="block text-sm font-medium text-gray-700">Adresse e-mail</label>
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

            <!-- Bouton de connexion -->
            <div class="mb-4">
                <button type="submit"
                    class="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
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