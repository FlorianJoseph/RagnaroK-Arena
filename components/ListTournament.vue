<script setup lang="ts">
const tournamentStore = useTournamentStore();
onMounted(async () => {
  await tournamentStore.fetchTournaments();
});
</script>

<template>
  <ul v-if="tournamentStore.tournaments.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <TournamentCard v-if="tournamentStore.tournaments.length" v-for="tournament in tournamentStore.tournaments"
    :key="tournament.id" :id="tournament.id" :title="tournament.title" :organizer="tournament.organizer"
    :game="tournament.games" :reward_amount="tournament.reward_amount" :reward_type="tournament.reward_type"
    :entry_fee="tournament.entry_fee" :participants="tournament.participants" :date="tournament.date"
    :isIndexPage="true" />
  </ul>
  <div v-else>
    <p>Aucun tournoi organisé.</p>
  </div>

  <Paginator :rows="3" :totalRecords="tournamentStore.tournaments.length" :rowsPerPageOptions="[3, 6, 9]">
    <template #start="tournaments">
        Page: {{ tournaments }}
    </template>
  </Paginator>
  
</template>