<script setup lang="ts">
import { CircleX, Check, User, UserCheck, ImageUp } from 'lucide-vue-next';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
const userStore = useUserStore();
const toast = useToast();

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

const onAdvancedUpload = () => {
    toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
};
</script>

<template>
    <Fieldset legend="Compte">
        <div class="flex justify-center">
            <div class="w-2/3">
                <div v-if="userStore.profile" class="flex flex-col items-center space-y-4">
                    <label class="relative w-24 h-24 cursor-pointer shadow-md rounded-full overflow-hidden">
                        <input type="file" class="hidden" />
                        <img :src="userStore.profile.avatar_url || 'path/to/default-avatar.png'" alt="Avatar"
                            class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                    </label>

                    <div class="text-center">
                        <p class="text-sm text-lightText dark:text-darkText flex items-center justify-center space-x-2">
                            <User />
                            <span>Utilisateur depuis
                                {{ format(new Date(userStore.profile.created_at), 'd MMMM yyyy', { locale: fr })
                                }}</span>
                        </p>
                        <p class="text-sm text-lightText dark:text-darkText flex items-center justify-center space-x-2">
                            <UserCheck />
                            <span>Dernière mise à jour le
                                {{ format(new Date(userStore.profile.updated_at), 'd MMMM yyyy', { locale: fr })
                                }}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </Fieldset>

    <Fieldset legend="Modifier le profil">
        <div class="flex justify-center">
            <div class="w-2/3">
                <div v-if="userStore.profile" class="space-y-6">
                    <!-- Section d'Informations -->
                    <div class="p-4 w-1/2">
                        <!-- Champs éditables -->
                        <div v-for="(label, field) in { username: 'Pseudo', full_name: 'Nom Complet', website: 'Site Web' }"
                            :key="field" class="flex items-center justify-between pb-2">
                            <label>
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
        <FileUpload ref="fileupload" mode="basic" name="demo[]" url="/api/upload" accept="image/*"
            :maxFileSize="1000000" @upload="onUpload" />
        <Button label="Upload" @click="upload" severity="secondary" />
    </Fieldset>
    <Button label="Supprimer le compte" severity="danger" outlined />
</template>
