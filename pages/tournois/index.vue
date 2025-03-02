<script setup lang="ts">
const tournamentStore = useTournamentStore();
onMounted(async () => {
  await tournamentStore.fetchTournaments();
});
</script>

<template>
  <!-- <div class="card"> -->
  <ul v-if="tournamentStore.tournaments.length"
    class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4">
    <TournamentCard v-if="tournamentStore.tournaments.length" v-for="tournament in tournamentStore.tournaments"
      :key="tournament.id" :id="tournament.id" :title="tournament.title" :organizer="tournament.organizer"
      :game="tournament.games" :reward_amount="tournament.reward_amount" :reward_type="tournament.reward_type"
      :entry_fee="tournament.entry_fee" :participants="tournament.participants" :date="tournament.date"
      :isIndexPage="true" />
  </ul>
  <div v-else>
    <p>Aucun tournoi organisé.</p>
  </div>

  <!-- <Paginator v-model:first="first" :rows="3" :totalRecords="tournamentStore.tournaments.length"
      :rowsPerPageOptions="[3, 6, 9]">
    </Paginator> -->
  <!-- </div> -->

</template>