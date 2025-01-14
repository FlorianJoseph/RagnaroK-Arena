<script lang="ts">
import { useToast } from 'vue-toastification';
import { Check, CircleX } from 'lucide-vue-next';

const supabase = useSupabaseClient();
// const users = ref<any[]>([]); // Déclare une liste vide de type any[] comme ref
const toast = useToast(); // Initialisation du toast

// Récupérer les users disponibles depuis Supabase
async function fetchUsers() {
    const { data: { users }, error } = await supabase.auth.admin.listUsers()
    if (error) {
        toast.error('Erreur lors de la récupération des utilisateurs : ' + error.message, { icon: CircleX });
    }
}

// Appeler fetchUsers lorsque le composant est monté
onMounted(() => {
    fetchUsers();
});
</script>

<template>
    <!-- <div v-if="users && users.length > 0">
        <span v-for="(user, index) in users" :key="user.id" class="block font-medium text-lightText dark:text-darkText">
            {{ index + 1 }}. {{ user.user_metadata.display_name || user.user_metadata.nickname || "Sans pseudo" }}
        </span>
    </div>
    <div v-else>
        <span class="font-medium text-lightText dark:text-darkText">Aucun utilisateur trouvé</span>
    </div> -->
    <ul class="space-y-2">
            <li class="flex justify-between border-b pb-2">
                <span class="font-medium text-lightText dark:text-darkText">1. Ragnar le Rouge</span>
                <span class="text-lightPrimary dark:text-darkPrimary">12,350 pts</span>
            </li>
            <li class="flex justify-between border-b pb-2">
                <span class="font-medium text-lightText dark:text-darkText">2. Lagertha la Fierce</span>
                <span class="text-lightPrimary dark:text-darkPrimary">10,870 pts</span>
            </li>
            <li class="flex justify-between">
                <span class="font-medium text-lightText dark:text-darkText">3. Bjorn l'Implacable</span>
                <span class="text-lightPrimary dark:text-darkPrimary">9,560 pts</span>
            </li>
        </ul>
        <p class="text-sm mt-3 text-lightTextMuted dark:text-darkTextMuted italic">
            Le classement sera mis à jour après le tournoi.
        </p>
</template>
