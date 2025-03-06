<script setup lang="ts">
import type { Tournament } from '~/types/tournaments';
const favoritesStore = useFavoriteStore();
const user = useSupabaseUser();
const tournaments = ref<Tournament[]>([])
const loading = ref(true);

const fetchFavorites = async () => {
    const userId = user.value?.id;
    if (userId) {
        tournaments.value = await favoritesStore.fetchFavorites(userId);
    }
    loading.value = false;
};

onMounted(() => {
    loading.value = true; // Commencer à charger les données
    fetchFavorites();     // Appeler la fonction fetchFavorites
});
</script>

<template>
    <div class="relative min-h-[300px]">
        <div v-if="loading"
            class="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
            <ProgressSpinner />
        </div>
        <ul v-if="!loading && tournaments.length"
            class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4">
            <TournamentCard v-for="tournament in tournaments" :key="tournament.id" :id="tournament.id"
                :title="tournament.title" :organizer="tournament.organizer" :game="tournament.games"
                :reward_amount="tournament.reward_amount" :reward_type="tournament.reward_type"
                :entry_fee="tournament.entry_fee" :participants="tournament.participants" :date="tournament.date"
                :isIndexPage="true" @update-favorites="fetchFavorites" />
        </ul>
        <div v-else-if="!loading">
            <p class="text-ltext dark:text-dtext">Aucun tournoi favori.</p>
        </div>
    </div>
</template>
