<script setup lang="ts">
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from 'vue-toastification';

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();
const displayName = ref('');
const editing = ref(false); // État pour savoir si on est en mode édition
const fileInput = ref(null);
const imageUrl = ref<string | null>(null);
const showOverlay = ref(false);
const toast = useToast(); // Initialisation du toast

// Fonction pour gérer le changement de fichier
async function uploadAvatar(event: Event) {
    const target = event.target as HTMLInputElement;
    if (!target || !target.files || target.files.length === 0) {
        toast.error('Aucun fichier sélectionné.');
        return;
    }
    const avatarFile = target.files[0];
    if (!avatarFile) {
        toast.error('Aucun fichier sélectionné.');
        return;
    }

    showOverlay.value = true; // Afficher l'overlay de chargement
    const filePath = `private/${avatarFile.name}`; // Chemin du fichier dans le bucket

    const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('avatars')
        .upload(filePath, avatarFile, {
            cacheControl: '3600',
            upsert: false
        });
    showOverlay.value = false; // Masquer l'overlay de chargement
    if (uploadError) {
        toast.error('Erreur lors du téléchargement de l\'avatar : ' + uploadError.message);
        return;
    }

    const { data: publicUrlData } = supabase
        .storage
        .from('avatars')
        .getPublicUrl(filePath);

    const avatarUrl = publicUrlData.publicUrl;

    // Mettre à jour les métadonnées de l'utilisateur
    const { data, error: updateError } = await supabase.auth.updateUser({
        data: { avatar: avatarUrl } // Mettre à jour l'avatar dans les métadonnées
    })

    if (updateError) {
        toast.error('Erreur lors de la mise à jour des métadonnées de l\'utilisateur ' + updateError.message);
        return;
    }

    imageUrl.value = avatarUrl;
    toast.success('Avatar téléchargé et mis à jour avec succès !');
}

// Fonction pour basculer entre mode édition et affichage
function toggleEdit() {
    editing.value = !editing.value;
}

// Fonction pour enregistrer les modifications
async function saveChanges() {

    if (!displayName.value) {
        toast.success('Le nom d\'utilisateur ne peut pas être vide.');
        return;
    }

    const { error } = await supabase.auth.updateUser({
        data: { display_name: displayName.value }
    });

    if (error) {
        toast.error('Erreur lors de la mise à jour :' + error.message);
    } else {
        toast.success('Profil mis à jour avec succès !');
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
    <div class="min-h-screen bg-lbg dark:bg-dbg">
        <div class="container mx-auto py-10 px-6">
            <!-- Section du profil -->
            <div v-if="user" class="bg-white dark:bg-dcardbg p-8 rounded-lg shadow-lg">
                <h2 class="text-3xl font-semibold text-center text-ltext dark:text-dtext mb-6">
                    Mon Profil
                </h2>

                <!-- Informations Utilisateur -->
                <div class="flex justify-center items-center mb-10">
                    <div class="relative inline-block w-24 h-24">

                        <!-- Cercle cliquable pour uploader l'avatar -->
                        <label
                            class="w-full h-full rounded-full border-2 border-lgray dark:border-dgray cursor-pointer flex items-center justify-center overflow-hidden hover:border-gray-500 relative">
                            <input type="file" ref="fileInput" @change="uploadAvatar" class="hidden" />
                            <img :src="user.user_metadata.avatar || user.user_metadata.avatar_url || 'https://qgpfftkjoktjzylwtvbx.supabase.co/storage/v1/object/public/avatars/default/avatar.jpg?t=2025-01-07T10%3A35%3A56.796Z'"
                                alt="Avatar" class="w-full h-full object-cover" />

                            <!-- Texte "Changer l'avatar" au survol -->
                            <div
                                class="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <span class="text-white text-lg font-semibold">Changer l'avatar</span>
                            </div>
                        </label>

                        <!-- Overlay de chargement -->
                        <div v-if="showOverlay"
                            class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
                            <span class="text-white text-sm">Chargement...</span>
                        </div>
                    </div>

                    <!-- Infos utilisateurs -->
                    <div class="ml-6">
                        <h3 class="text-xl font-bold text-lightText dark:text-darkText">{{
                            user.user_metadata.display_name || user.user_metadata.nickname || "Choisissez un pseudo" }}
                        </h3>
                        <p class="text-sm text-lightText dark:text-darkText">Utilisateur depuis le {{ format(new
                            Date(user.created_at), 'd MMMM yyyy', { locale: fr }) }}
                        </p>
                    </div>
                </div>

                <!-- Détails du profil -->
                <div class="flex justify-center">

                    <!-- Affichage ou édition -->
                    <div v-if="!editing">
                        <button @click="toggleEdit"
                            class="btn">
                            Modifier le profil
                        </button>
                    </div>

                    <!-- Formulaire d'édition -->
                    <div v-else>
                        <label for="displayName" class="block text-sm font-medium text-lightText dark:text-darkText">Nom
                            d'utilisateur</label>
                        <input v-model="displayName" type="text" placeholder="Nom d'utilisateur"
                            class="input" />
                        <div class="flex gap-4 mt-4">
                            <button @click="saveChanges"
                                class="btn">
                                Enregistrer
                            </button>

                            <button @click="toggleEdit"
                                class="btnvariant">
                                Annuler
                            </button>
                        </div>
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
