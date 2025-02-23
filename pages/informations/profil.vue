<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { CircleX, Check, Pencil } from 'lucide-vue-next';

const userStore = useUserStore();

const editableFields = ref(['username', 'full_name', 'website']);
const editedProfile = ref<{ [key: string]: string }>({});
const isEditing = ref<{ [key: string]: boolean }>({});

const fieldLabels: { [key: string]: string } = {
    username: "Pseudo",
    full_name: "Nom complet",
    website: "Site Web",
};

// Activer l'édition d'un champ
const editField = (key: keyof typeof fieldLabels) => {
    if (userStore.profile) {
        editedProfile.value[key] = (userStore.profile as Record<string, any>)[key]; // Copier la valeur actuelle
    }
    isEditing.value[key] = true;
};

// Annuler l'édition
const cancelEdit = (key: keyof typeof fieldLabels) => {
    isEditing.value[key] = false;
    if (userStore.profile) {
        editedProfile.value[key] = (userStore.profile as Record<string, any>)[key]; // Réinitialiser
    }
};

// Sauvegarder un champ
const saveField = async (key: keyof typeof fieldLabels) => {
    if (userStore.profile && editedProfile.value[key] === (userStore.profile as Record<string, any>)[key]) return; // Rien à changer
    if (!userStore.profile) return;
    const updatedProfile = { ...userStore.profile, [key]: editedProfile.value[key], id: userStore.profile.id };
    await userStore.updateProfile(updatedProfile);
    isEditing.value[key] = false;
    await userStore.getProfile();
};

onMounted(async () => {
    await userStore.getProfile();
});

definePageMeta({
    layout: 'profile'
})


const text = ref();
</script>

<template>
    <div class="flex justify-center">
        <div class="w-2/3 bg-white dark:bg-gray-800 shadow-md p-6 rounded-lg">
            <div v-if="userStore.profile" class="space-y-6">
                <h2 class="text-3xl font-semibold text-center text-ltext dark:text-dtext mb-6">Mon Profil</h2>

                <div class="flex justify-between gap-2">
                    <!-- Section de Progression -->
                    <div class="p-4 w-1/2">
                        <h3 class="text-xl font-semibold mb-2">Progression</h3>
                        <div class="bg-gray-300 rounded">
                            <div :style="{ width: userStore.profile.xp + '%' }" class="bg-green-500 h-4 rounded"></div>
                        </div>
                        <p class="text-sm text-center">{{ userStore.profile.xp }} XP - Rang: {{ userStore.profile.rank
                            }}</p>
                    </div>

                    <!-- Section d'Informations -->
                    <div class="p-4 w-1/2">
                        <h3 class="text-xl font-semibold mb-2">Informations</h3>

                        <!-- Champs éditables -->
                        <div class="flex items-center justify-between border-b pb-2">
                            <label class="text-gray-700 dark:text-gray-300 font-medium">
                                Pseudo
                            </label>
                            <Inplace>
                                <template #display>
                                    {{ 'Éditer' }}
                                </template>
                                <template #content="{ closeCallback }">
                                    <span class="inline-flex items-center gap-2">
                                        <InputText v-model="text" autofocus />
                                        <Button icon="pi pi-times" text severity="danger" @click="closeCallback" />
                                    </span>
                                </template>
                            </Inplace>
                        </div>


                        <div v-for="(key) in editableFields" :key="key"
                            class="flex items-center justify-between border-b pb-2">
                            <label class="text-gray-700 dark:text-gray-300 font-medium">
                                {{ fieldLabels[key] }}
                            </label>

                            <div class="relative flex items-center space-x-2">
                                <input v-if="isEditing[key]" v-model="editedProfile[key]" type="text"
                                    class="border px-3 py-1 rounded w-56 focus:outline-none focus:ring transition duration-200"
                                    :class="{ 'border-red-500': editedProfile[key] !== (userStore.profile as Record<string, any>)[key] }" />

                                <span v-else class="text-gray-600 dark:text-gray-400">
                                    {{ (userStore.profile as Record<string, any>)[key]
                                        }}</span>

                                <!-- Boutons d'action -->
                                <button v-if="isEditing[key]" @click="cancelEdit(key)"
                                    class="text-red-500 hover:text-red-700 transition duration-200">
                                    <CircleX />
                                </button>
                                <button v-if="isEditing[key]" @click="saveField(key)"
                                    :disabled="editedProfile[key] === (userStore.profile as Record<string, any>)[key]"
                                    class="text-green-500 hover:text-green-700 transition duration-200 disabled:opacity-50">
                                    <Check />
                                </button>
                                <button v-else @click="editField(key)"
                                    class="text-gray-500 hover:text-gray-700 transition duration-200">
                                    <Pencil />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
