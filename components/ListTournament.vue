<script setup lang="ts">
const tournamentStore = useTournamentStore();
onMounted(async () => {
  await tournamentStore.fetchTournaments();
});
</script>

<template>
  <TournamentCard v-if="tournamentStore.tournaments.length" v-for="tournament in tournamentStore.tournaments"
    :key="tournament.id" :id="tournament.id" :title="tournament.title" :organizer="tournament.organizer"
    :game="tournament.games" :reward_amount="tournament.reward_amount" :reward_type="tournament.reward_type"
    :entry_fee="tournament.entry_fee" :participants="tournament.participants" :date="tournament.date"
    :isIndexPage="true" />
  <div v-else>
    <p>Aucun tournoi organisé.</p>
  </div>
</template>
