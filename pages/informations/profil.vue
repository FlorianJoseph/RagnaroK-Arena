<script setup lang="ts">
import { CircleX, Check, Pencil } from 'lucide-vue-next';
const userStore = useUserStore();

const editedProfile = ref({
    username: "",
    full_name: "",
    website: "",
});

onMounted(async () => {
    await userStore.getProfile();
    if (userStore.profile) {
        editedProfile.value.username = userStore.profile.username ?? "";
        editedProfile.value.full_name = userStore.profile.full_name ?? "";
        editedProfile.value.website = userStore.profile.website ?? "";
    }
});

const saveField = async (field: keyof typeof editedProfile.value, closeCallback: () => void) => {
    if (userStore.profile) {
        userStore.profile[field] = editedProfile.value[field];
        await userStore.updateProfile(userStore.profile);
        await userStore.getProfile();
    }
    closeCallback();
};

definePageMeta({
    layout: 'profile'
})
</script>

<template>
    <div class="flex justify-center">
        <div class="w-2/3 p-6">
            <div v-if="userStore.profile" class="space-y-6">
                <h2 class="text-3xl font-semibold text-center text-ltext dark:text-dtext mb-6">Mon Profil</h2>

                <!-- Section d'Informations -->
                <div class="p-4 w-1/2">
                    <h3 class="text-xl font-semibold mb-2">Informations</h3>

                    <!-- Champs éditables -->
                    <div v-for="(label, field) in { username: 'Pseudo', full_name: 'Nom Complet', website: 'Site Web' }"
                        :key="field" class="flex items-center justify-between border-b pb-2">
                        <label class="text-gray-700 dark:text-gray-300 font-medium">
                            {{ label }}
                        </label>
                        <Inplace>
                            <template #display>
                                {{ userStore.profile[field] ?? "Éditer" }}
                            </template>
                            <template #content="{ closeCallback }">
                                <span class="inline-flex items-center gap-2">
                                    <InputText v-model="editedProfile[field]" autofocus />
                                    <Button icon="pi pi-times" text severity="danger" @click="closeCallback">
                                        <CircleX />
                                    </Button>
                                    <Button icon="pi pi-check" text severity="success"
                                        @click="saveField(field, closeCallback)">
                                        <Check />
                                    </Button>
                                </span>
                            </template>
                        </Inplace>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
