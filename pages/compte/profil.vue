<script setup lang="ts">
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from 'vue-toastification';
import { CircleX, ExternalLink } from 'lucide-vue-next';

const authStore = useAuthStore();
const user = useSupabaseUser();
const toast = useToast();
const userStore = useUserStore();

const handleAvatarUpload = async (event: Event) => {
    const userId = user.value?.id;
    if (userId) {
        await userStore.uploadAvatar(event, userId);
    } else {
        toast.error("Utilisateur non défini", { icon: CircleX });
    }
};

onMounted(async () => {
    await userStore.getProfile();
});

const updateProfile = async () => {
    if (!userStore.profile) {
        toast.error("Le profil n'est pas encore chargé", { icon: CircleX });
        return;
    }
    await userStore.updateProfile(userStore.profile);
};

definePageMeta({
    layout: 'profile'
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
                            <input type="file" @change="handleAvatarUpload" class="hidden" />
                            <img :src="userStore.profile?.avatar_url" alt="Avatar" class="w-full h-full object-cover" />

                            <!-- Texte "Changer l'avatar" au survol -->
                            <div
                                class="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <span class="text-white">Changer l'avatar</span>
                            </div>
                        </label>
                    </div>

                    <!-- Infos utilisateurs -->
                    <div v-if="userStore.profile" class="ml-6">
                        <h3 class="text-xl font-bold text-lightText dark:text-darkText">{{ userStore.profile?.username
                            }}</h3>
                        <p class="text-sm text-lightText dark:text-darkText">
                            Utilisateur depuis {{ format(new Date(userStore.profile.created_at), 'd MMMM yyyy', {
                                locale: fr
                            }) }}
                        </p>
                        <p v-if="userStore.profile" class="text-sm text-lightText dark:text-darkText">
                            Dernière mise à jour le {{ format(new Date(userStore.profile.updated_at), 'd MMMM yyyy', {
                                locale: fr
                            }) }}
                        </p>
                    </div>
                </div>

                <!-- Détails du profil -->
                <div class="flex justify-center">
                    <div class="flex flex-col gap-6">
                        <div>
                            <div v-if="userStore.profile">
                                <p>Email : {{ userStore.profile?.email }}</p>
                                <p>Username : {{ userStore.profile?.username }}</p>
                                <p>Nom complet : {{ userStore.profile?.full_name }}</p>
                                <p class="flex items-center">
                                    Site Web :
                                    <a :href="userStore.profile?.website" target="_blank"
                                        class="hover:text-laccent dark:hover:text-daccent text-blue-500 ml-2 flex items-center">
                                        {{ userStore.profile?.website }}
                                        <ExternalLink class="ml-1 text-dbg h-4 w-4 dark:text-lbg" />
                                    </a>
                                </p>
                                <p>Montant d'éxpérience : {{ userStore.profile.xp }}</p>
                                <p>Rang : {{ userStore.profile.rank }}</p>

                            </div>
                            <div v-else>
                                <p>Chargement du profil...</p>
                            </div>
                        </div>

                        <div v-if="userStore.profile">
                            <label for="username"
                                class="block text-sm font-medium text-lightText dark:text-darkText">Pseudo</label>
                            <input v-model="userStore.profile.username" type="text" placeholder="Entrez un pseudo"
                                class="input" />
                            <label for="fullname"
                                class="block text-sm font-medium text-lightText dark:text-darkText">Nom
                                et Prénom</label>
                            <input v-model="userStore.profile.full_name" type="text"
                                placeholder="Entre votre nom et prénom" class="input" />
                            <label for="website"
                                class="block text-sm font-medium text-lightText dark:text-darkText">Lien
                                vers le site web
                                (ex: Twitch)</label>
                            <input v-model="userStore.profile.website" type="text" placeholder="https://exemple.com"
                                class="input" />
                            <div class="flex gap-4 mt-4">
                                <button @click="updateProfile" class="btn">
                                    Sauvegarder les modifications
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>