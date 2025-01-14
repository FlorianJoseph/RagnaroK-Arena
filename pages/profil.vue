<script setup lang="ts">
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from 'vue-toastification';
import { Check, CircleX } from 'lucide-vue-next';

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const fileInput = ref(null);
const imageUrl = ref<string | null>(null);
const showOverlay = ref(false);
const toast = useToast();

async function uploadAvatar(event: Event) {
    const target = event.target as HTMLInputElement;
    if (!target || !target.files || target.files.length === 0) {
        toast.error('Aucun fichier sélectionné.', { icon: CircleX });
        return;
    }
    const avatarFile = target.files[0];
    if (!avatarFile) {
        toast.error('Aucun fichier sélectionné.', { icon: CircleX });
        return;
    }

    showOverlay.value = true;
    const filePath = `private/${avatarFile.name}`;

    const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('avatars')
        .upload(filePath, avatarFile, {
            cacheControl: '3600',
            upsert: false
        });
    showOverlay.value = false;
    if (uploadError) {
        toast.error('Erreur lors du téléchargement de l\'avatar : ' + uploadError.message, { icon: CircleX });
        return;
    }

    const { data: publicUrlData } = supabase
        .storage
        .from('avatars')
        .getPublicUrl(filePath);

    const avatarUrl = publicUrlData.publicUrl;

    const { data, error: updateError } = await supabase.auth.updateUser({
        data: { avatar: avatarUrl }
    })

    if (updateError) {
        toast.error('Erreur lors de la mise à jour des métadonnées de l\'utilisateur ' + updateError.message, { icon: CircleX });
        return;
    }

    imageUrl.value = avatarUrl;
    toast.success('Avatar téléchargé et mis à jour avec succès !', { icon: Check });
}

const handleSignOut = async () => {
    await signOut();
};

definePageMeta({
    layout: 'profile'
})

const profile = ref({
    id: '',
    email: '',
    username: '',
    full_name: '',
    website: '',
    created_at: '',
    updated_at: ''
});

const save = async () => {
    await saveProfile(profile);
};

onMounted(() => {
    getProfile(profile);
});

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
                            profile.username || user.user_metadata.nickname || "Choisissez un pseudo" }}
                        </h3>
                        <p class="text-sm text-lightText dark:text-darkText">
                            Utilisateur depuis le
                            {{ profile.created_at ? format(new Date(profile.updated_at), 'd MMMM yyyy', { locale: fr })
                                : 'Non renseignée' }}
                        </p>
                        <p class="text-sm text-lightText dark:text-darkText">
                            Dernière mise à jour le
                            {{ profile.updated_at ? format(new Date(profile.updated_at), 'd MMMM yyyy', { locale: fr })
                                : 'Non renseignée' }}
                        </p>
                    </div>
                </div>

                <!-- Détails du profil -->
                <div class="flex justify-center">
                    <div class="flex flex-col gap-6">
                        <div>
                            <div v-if="profile.email">
                                <p>Email : {{ profile.email }}</p>
                                <p>Username : {{ profile.username }}</p>
                                <p>Nom complet : {{ profile.full_name }}</p>
                                <p>Site Web : {{ profile.website }}</p>
                            </div>
                            <div v-else>
                                <p>Chargement du profil...</p>
                            </div>
                        </div>

                        <div>
                            <label for="username"
                                class="block text-sm font-medium text-lightText dark:text-darkText">Pseudo</label>
                            <input v-model="profile.username" type="text" placeholder="Entrez un pseudo"
                                class="input" />
                            <label for="fullname"
                                class="block text-sm font-medium text-lightText dark:text-darkText">Nom
                                et Prénom</label>
                            <input v-model="profile.full_name" type="text" placeholder="Entre votre nom et prénom"
                                class="input" />
                            <label for="website"
                                class="block text-sm font-medium text-lightText dark:text-darkText">Lien
                                vers le site web
                                (ex: Twitch)</label>
                            <input v-model="profile.website" type="text" placeholder="https://exemple.com"
                                class="input" />
                            <div class="flex gap-4 mt-4">
                                <button @click="save" class="btn">
                                    Sauvegarder les modifications
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Déconnexion -->
                <div class="mt-8 text-center">
                    <button @click="handleSignOut"
                        class="px-6 py-2 bg-red-600 text-white rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
                        Déconnexion
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>