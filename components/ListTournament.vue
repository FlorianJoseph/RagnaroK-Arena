<script setup lang="ts">
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Tournament } from '~/models/types';

const isVisible = ref(false);
const form = ref<Tournament | null>(null);

const tournamentStore = useTournamentStore();
const userParticipations = ref<Record<number, boolean>>({});

onMounted(async () => {
  await tournamentStore.fetchTournaments();
  await tournamentStore.fetchUserParticipations();

});


function openModal(tournament: Tournament) {
  form.value = { ...tournament };
  isVisible.value = true;
}

function closeModal() {
  isVisible.value = false;
}

async function updateTournament() {
  if (form.value) {
    await tournamentStore.updateTournament(form.value);
    closeModal();
  }
}

function editTournament(tournament: Tournament) {
  openModal(tournament);
}

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
          <button @click="editTournament(tournament)" class="px-6 py-2 btnvariant">
            Modifier
          </button>

          <button v-if="userParticipations[tournament.id]" @click="leaveTournament(tournament.id)" class="btn">
            Se désinscrire
          </button>
          <button v-else @click="joinTournament(tournament.id)" class="btn">
            S'inscrire
          </button>
        </div>

      </li>
    </ul>

    <!-- Modale d'édition -->
    <EditTournamentModal :isVisible="isVisible" :form="form" @close="closeModal" @update="updateTournament" />
  </div>
</template>