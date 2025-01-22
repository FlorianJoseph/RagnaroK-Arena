<script setup lang="ts">
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const tournamentStore = useTournamentStore();
const userParticipations = ref<Record<number, boolean>>({});

onMounted(async () => {
  await tournamentStore.fetchTournaments();
  await tournamentStore.fetchUserParticipations();

});

function joinTournament(tournamentId: number) {
  tournamentStore.joinTournament(tournamentId);
  userParticipations.value[tournamentId] = true;
}

function leaveTournament(tournamentId: number) {
  tournamentStore.leaveTournament(tournamentId);
  delete userParticipations.value[tournamentId]
}
</script>

<template>
  <div>
    <!-- Affichage des tournois -->
    <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <li v-for="tournament in tournamentStore.tournaments" :key="tournament.id"
        class="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 transform hover:scale-105 transition-transform duration-300">
        <div class="p-4 bg-gray-100">
          <h2 class="text-xl font-semibold text-gray-800">{{ tournament.title }}</h2>
          <p class="text-sm text-gray-600">
            Date : {{ format(new Date(tournament.date), 'd MMMM yyyy à HH:mm', { locale: fr }) }}
          </p>
        </div>
        <div class="p-4">
          <p class="text-lg font-semibold text-blue-600">Prix d'entrée : {{ tournament.prix_entree }} coins</p>
          <p class="text-gray-700">Récompense : {{ tournament.reward_type }}</p>
          <p class="text-gray-500 text-sm">Montant récompense : {{ tournament.reward_amount }}</p>
        </div>

        <div class="p-4 bg-gray-100 text-center flex justify-between flex-row gap-2">

          <!-- <button v-if="userParticipations[tournament.id]" @click="leaveTournament(tournament.id)" class="btn">
            Se désinscrire
          </button>
          <button v-else @click="joinTournament(tournament.id)" class="btn">
            S'inscrire
          </button> -->

          <NuxtLink :to="`/tournois/${tournament.id}`"> <button class="btn">Voir le tournoi</button></NuxtLink>

        </div>

      </li>
    </ul>
  </div>
</template>