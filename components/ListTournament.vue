<template>
  <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <TournamentCard v-for="tournament in tournamentStore.tournaments" :key="tournament.id" :id="tournament.id"
      :title="tournament.title" :organizer="tournament.organizer" :game="tournament.games"
      :reward_amount="tournament.reward_amount" :reward_type="tournament.reward_type" :entry_fee="tournament.entry_fee"
      :participants="tournament.participants" :date="tournament.date" :isIndexPage="true"/>
  </ul>
</template>

<script setup lang="ts">
const tournamentStore = useTournamentStore();
onMounted(async () => {
  await tournamentStore.fetchTournaments();
});
</script>