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
</script>

<template>
    <!-- Formulaire d'inscription -->
    <div class="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
        <h2 class="text-2xl font-semibold text-center mb-4">Créer un compte</h2>

        <!-- Formulaire -->
        <form @submit.prevent="signUpNewUser">
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
                    placeholder="Créez un mot de passe" required />
            </div>

            <!-- Messages de succès et d'erreur -->
            <div v-if="errorMessage" class="mb-4 text-red-600">{{ errorMessage }}</div>
            <div v-if="successMessage" class="mb-4 text-green-600">{{ successMessage }}</div>

            <!-- Bouton d'inscription -->
            <div class="mb-4">
                <button type="submit"
                    class="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400">
                    S'inscrire
                </button>
            </div>
        </form>

        <!-- Bouton de connexion si l'utilisateur a déjà un compte -->
        <div class="mt-4 text-center">
            <p class="text-sm text-gray-600">Vous avez déjà un compte ?
                <router-link to="/login" class="text-blue-600 hover:underline">Connectez-vous ici</router-link>
            </p>
        </div>
    </div>
</template>