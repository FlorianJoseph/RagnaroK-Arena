<script setup lang="ts">
import type { Tournament } from '~/types/tournaments';
const favoritesStore = useFavoriteStore();
const user = useSupabaseUser();
const tournaments = ref<Tournament[]>([])

onMounted(async () => {
    const userId = user.value?.id
    if (userId) {
        tournaments.value = await favoritesStore.fetchFavorites(userId);
    }
});
</script>

<template>
    <Tab />
    <ul v-if="tournaments.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <TournamentCard v-for="tournament in tournaments" :key="tournament.id" :id="tournament.id"
            :title="tournament.title" :organizer="tournament.organizer" :game="tournament.games"
            :reward_amount="tournament.reward_amount" :reward_type="tournament.reward_type"
            :entry_fee="tournament.entry_fee" :participants="tournament.participants" :date="tournament.date"
            :isIndexPage="true"/>
    </ul>
    <div v-else>
        <p>Aucun tournoi favori.</p>
    </div>
</template>
