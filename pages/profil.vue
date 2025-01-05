<script setup lang="ts">
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();
const displayName = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const editing = ref(false); // État pour savoir si on est en mode édition

const fileInput = ref(null);
const imageUrl = ref<string | null>(null);
const showOverlay = ref(false);


// Fonction pour gérer le changement de fichier
async function uploadAvatar(event) {
    const avatarFile = event.target.files[0];
    if (!avatarFile) {
        errorMessage.value = 'Aucun fichier sélectionné.';
        return;
    }

    showOverlay.value = true; // Afficher l'overlay de chargement

    const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('avatars')
        .upload(`private/${avatarFile.name}`, avatarFile, {
            cacheControl: '3600',
            upsert: false
        });
    showOverlay.value = false; // Masquer l'overlay de chargement
    if (uploadError) {
        errorMessage.value = 'Erreur lors du téléchargement de l\'avatar : ' + uploadError.message;
        return;
    }

    const { data: publicUrlData } = supabase
        .storage
        .from('avatars')
        .getPublicUrl(`private/${avatarFile.name}`);

    const avatarUrl = publicUrlData.publicUrl;

    // Mettre à jour les métadonnées de l'utilisateur
    const { data, error: updateError } = await supabase.auth.updateUser({
        data: { avatar: avatarUrl } // Mettre à jour l'avatar dans les métadonnées
    })

    if (updateError) {
        errorMessage.value = 'Erreur lors de la mise à jour des métadonnées de l\'utilisateur : ' + updateError.message;
        return;
    }

    imageUrl.value = avatarUrl;
    successMessage.value = 'Avatar téléchargé et mis à jour avec succès !';
}

// Fonction pour basculer entre mode édition et affichage
function toggleEdit() {
    editing.value = !editing.value;
    errorMessage.value = ''; // Réinitialiser les messages en cas de bascule
    successMessage.value = '';
}

// Fonction pour enregistrer les modifications
async function saveChanges() {

    if (!displayName.value) {
        successMessage.value = 'Le nom d\'utilisateur ne peut pas être vide.';
        return;
    }

    const { error } = await supabase.auth.updateUser({
        data: { display_name: displayName.value }
    });

    if (error) {
        errorMessage.value = 'Erreur lors de la mise à jour :', error;
    } else {
        successMessage.value = 'Profil mis à jour avec succès !';
        editing.value = false; // Quitter le mode édition
    }
}

async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Error signing out:', error);
    }
    router.push('/');
}

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
                    Mon Profil
                </h2>

                <!-- Informations Utilisateur -->
                <div class="flex justify-center items-center mb-6">
                    <div class="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-700 mb-4">
                        <!-- Image de profil - ici un espace pour l'avatar -->
                        <img :src="user.user_metadata.avatar || 'https://qgpfftkjoktjzylwtvbx.supabase.co/storage/v1/object/public/avatars/PP_finale.png?t=2025-01-04T22%3A42%3A15.065Z'"
                            class="w-full h-full object-cover rounded-full" />
                    </div>
                    <div class="ml-6">
                        <h3 class="text-xl font-bold text-lightText dark:text-darkText">{{ user.email }}</h3>
                        <p class="text-sm text-lightText dark:text-darkText">Utilisateur depuis : {{ user.created_at ||
                            'Non défini' }}</p>
                    </div>
                </div>

                <!-- Détails du profil -->
                <div class="grid grid-cols-1 gap-6">
                    <div class="flex items-center justify-between p-4 bg-lightBg dark:bg-darkBg rounded-md shadow-sm">
                        <span class="text-sm text-lightText dark:text-darkText">Nom d'utilisateur : {{
                            user.user_metadata.display_name
                        }}</span>

                        <!-- Affichage ou édition -->
                        <div v-if="!editing">
                            <button @click="toggleEdit"
                                class="ml-4 px-4 py-2 bg-lightPrimary dark:bg-darkPrimary text-lightBg dark:text-darkText rounded-md shadow-sm hover:bg-lightPrimaryHover dark:hover:bg-darkPrimaryHover">
                                Modifier
                            </button>
                        </div>

                        <!-- Formulaire d'édition -->
                        <div v-else>
                            <input v-model="displayName" type="text"
                                class="px-2 py-1 border rounded-md dark:bg-stone-700 dark:text-lightText w-full" />
                            <div class="mt-4">
                                <button @click="saveChanges"
                                    class="px-4 py-2 bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700">
                                    Enregistrer
                                </button>
                                <button @click="toggleEdit"
                                    class="ml-2 px-4 py-2 bg-gray-500 text-white rounded-md shadow-sm hover:bg-gray-600">
                                    Annuler
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="relative inline-block w-24 h-24">

                    <!-- Cercle cliquable pour uploader l'avatar -->
                    <label
                        class="w-full h-full rounded-full border-2 border-gray-300 cursor-pointer flex items-center justify-center bg-gray-100 overflow-hidden hover:border-gray-500">
                        <input type="file" ref="fileInput" @change="uploadAvatar" class="hidden" />
                        <img v-if="imageUrl" :src="user.user_metadata.avatar" alt="Avatar"
                            class="w-full h-full object-cover" />
                        <div v-else class="flex items-center justify-center w-full h-full">
                            <span class="text-gray-500 text-2xl font-bold">+</span>
                        </div>
                    </label>

                    <!-- Messages d'erreur et de succès -->
                    <p v-if="errorMessage" class="text-red-500 mt-2 text-sm">{{ errorMessage }}</p>
                    <p v-if="successMessage" class="text-green-500 mt-2 text-sm">{{ successMessage }}</p>

                    <!-- Overlay de chargement -->
                    <div v-if="showOverlay"
                        class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
                        <span class="text-white text-sm">Chargement...</span>
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
