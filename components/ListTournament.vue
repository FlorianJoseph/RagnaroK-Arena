<script setup lang="ts">
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Tournament } from '~/models/types';

const isVisible = ref(false);
const form = ref<Tournament | null>(null);

const tournamentStore = useTournamentStore();

onMounted(async () => {
  await tournamentStore.fetchTournaments();
});

// Fonction pour ouvrir la modale et pré-remplir le formulaire
function openModal(tournament: Tournament) {
  form.value = { ...tournament }; // Pré-remplir le formulaire avec les données du tournoi
  isVisible.value = true;
}

// Fonction pour fermer la modale
function closeModal() {
  isVisible.value = false;
}

// Fonction pour modifier le tournoi
async function updateTournament() {
  if (form.value) {
    await tournamentStore.updateTournament(form.value);
    closeModal();
  }
}

// Fonction pour ouvrir la modale
function editTournament(tournament: Tournament) {
  openModal(tournament);
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
        <div class="p-4 bg-gray-100 text-center">
          <button @click="editTournament(tournament)" class="px-6 py-2 btn">
            Modifier
          </button>
        </div>
      </li>
    </ul>

    <!-- Modale d'édition -->
    <EditTournamentModal :isVisible="isVisible" :form="form" @close="closeModal" @update="updateTournament" />
  </div>
</template>