<script setup lang="ts">
import { useToast } from 'vue-toastification';
import { CircleX, User, UserCheck } from 'lucide-vue-next';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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

definePageMeta({
    layout: 'profile'
})
</script>

<template>
    <div class="flex justify-center">
        <div class="w-2/3 bg-white dark:bg-gray-800 shadow-md p-6 rounded-lg">
            <div v-if="userStore.profile" class="flex flex-col items-center space-y-4">
                <label class="relative w-24 h-24 cursor-pointer shadow-md rounded-full overflow-hidden">
                    <input type="file" @change="handleAvatarUpload" class="hidden" />
                    <img :src="userStore.profile.avatar_url || 'path/to/default-avatar.png'" alt="Avatar"
                        class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                </label>

                <div class="text-center">
                    <p class="text-sm text-lightText dark:text-darkText flex items-center justify-center space-x-2">
                        <User />
                        <span>Utilisateur depuis {{ format(new Date(userStore.profile.created_at), 'd MMMM yyyy', { locale: fr }) }}</span>
                    </p>
                    <p class="text-sm text-lightText dark:text-darkText flex items-center justify-center space-x-2">
                        <UserCheck />
                        <span>Dernière mise à jour le {{ format(new Date(userStore.profile.updated_at), 'd MMMM yyyy', { locale: fr }) }}</span>
                    </p>
                </div>

                <div class="flex flex-col items-center">
                    <h3 class="text-lg font-semibold mb-2">Gestion du Compte</h3>
                    <button class="bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-200">
                        Modifier le mot de passe
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
