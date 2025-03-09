<script setup lang="ts">
import { CircleX, Check, User, UserCheck, Pencil } from 'lucide-vue-next';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
const userStore = useUserStore();
const loading = ref(true);

const fields = {
    username: 'Pseudo',
    full_name: 'Nom Complet',
    website: 'Site Web'
};

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
    loading.value = false;
});

const saveField = async (field: keyof typeof editedProfile.value, closeCallback: () => void) => {
    if (userStore.profile) {
        userStore.profile[field] = editedProfile.value[field];
        await userStore.updateProfile(userStore.profile);
        await userStore.getProfile();
    }
    closeCallback();
};

const toast = useToast();
const fileupload = ref();

const upload = () => {
    fileupload.value.upload();
};

const onUpload = () => {
    toast.add({ severity: 'success', summary: 'Success', detail: 'File Uploaded', life: 3000 });
};
</script>

<template>
    <div class="size-full">
        <Card class="p-6 h-full w-2/3 mx-auto flex gap-4">
            <template #header>
                <Card v-if="userStore.profile">
                    <template #title>
                        <div class="flex flex-row justify-center gap-2 items-center">
                            <Avatar :image="userStore.profile.avatar_url || 'path/to/default-avatar.png'" size="xlarge"
                                shape="circle" />
                            <span>{{ userStore.profile.username }}</span>
                        </div>
                    </template>
                    <template #content>
                        <div class="text-center">
                            <p
                                class="text-sm text-lightText dark:text-darkText flex items-center justify-center space-x-2">
                                <User />
                                <span>Utilisateur depuis
                                    {{ format(new Date(userStore.profile.created_at), 'd MMMM yyyy', { locale: fr })
                                    }}</span>
                            </p>
                            <p
                                class="text-sm text-lightText dark:text-darkText flex items-center justify-center space-x-2">
                                <UserCheck />
                                <span>Dernière mise à jour le
                                    {{ format(new Date(userStore.profile.updated_at), 'd MMMM yyyy', { locale: fr })
                                    }}</span>
                            </p>
                        </div>
                    </template>
                </Card>
            </template>
            <template #content>
                <div v-if="loading" class="flex justify-center items-center py-6">
                    <ProgressSpinner />
                </div>
                <div v-else>
                    <!-- Champs éditables -->
                    <Fieldset legend="Informations du profil">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div v-for="(label, field) in fields" :key="field"
                                class="flex items-center justify-between">
                                <div>
                                    <label class="text-gray-700 dark:text-gray-300 font-medium text-xl">{{ label
                                        }}</label>
                                    <p class="text-gray-900 dark:text-gray-100">
                                        {{ userStore.profile ? userStore.profile[field] : "Aucune donnée" }}
                                    </p>
                                </div>

                                <Inplace v-if="editedProfile[field]" class="block mt-1">
                                    <template #display>
                                        <Pencil />
                                    </template>
                                    <template #content="{ closeCallback }">
                                        <div class="flex items-center gap-2">
                                            <InputText v-model="editedProfile[field]" class="w-full" autofocus />
                                            <Button text severity="danger" @click="closeCallback">
                                                <CircleX />
                                            </Button>
                                            <Button icon="pi pi-check" text severity="success"
                                                @click="saveField(field, closeCallback)">
                                                <Check />
                                            </Button>
                                        </div>
                                    </template>
                                </Inplace>
                            </div>
                        </div>
                    </Fieldset>

                    <!-- Upload d'image -->
                    <Fieldset legend="Changer l'avatar">
                        <div class="flex justify-center flex-col gap-4">
                            <FileUpload mode="basic" name="avatar" url="/api/upload" accept="image/*"
                                :maxFileSize="1000000" @upload="onUpload" chooseLabel="Choisir une image">
                                <template #empty>
                                    <span>Drag and drop files to here to upload.</span>
                                </template>
                            </FileUpload>
                            <Button label="Valider" @click="upload" severity="secondary" />
                        </div>
                    </Fieldset>
                </div>
                <Button label="Supprimer le compte" severity="danger" outlined />
            </template>
        </Card>
    </div>
</template>
