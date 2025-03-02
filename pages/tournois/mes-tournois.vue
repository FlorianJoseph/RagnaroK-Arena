<script setup lang="ts">
import type { Tournament } from '~/types/tournaments';
const tournaments = ref<Tournament[]>([])
const tournamentStore = useTournamentStore()
const user = useSupabaseUser();

async function fetchTournamentsbyProfile() {
    const userId = user.value?.id
    if (userId) {
        tournaments.value = await tournamentStore.getTournamentsByOrganizer(userId)
    }
}

onMounted(async () => {
    await fetchTournamentsbyProfile()
})
</script>

<template>
    <ul v-if="tournaments.length" class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4">
        <TournamentCard v-for="tournament in tournaments" :key="tournament.id" :id="tournament.id"
            :title="tournament.title" :organizer="tournament.organizer" :game="tournament.games"
            :reward_amount="tournament.reward_amount" :reward_type="tournament.reward_type"
            :entry_fee="tournament.entry_fee" :participants="tournament.participants" :date="tournament.date"
            :isIndexPage="false" />
    </ul>
    <div v-else>
        <p>Aucun tournoi organisé.</p>
    </div>
</template>