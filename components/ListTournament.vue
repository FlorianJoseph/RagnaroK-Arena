<script setup lang="ts">
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const tournamentStore = useTournamentStore();

onMounted(async () => {
  await tournamentStore.fetchTournaments();
});
</script>

<template>
  <div>
    <!-- Affichage des tournois -->
    <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <li v-for="tournament in tournamentStore.tournaments" :key="tournament.id"
        class="bg-white shadow-lg rounded-lg overflow-hidden border border-lborder dark:border-dborder">
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
          <NuxtLink :to="`/tournois/${tournament.id}`" class="btn">Voir le tournoi</NuxtLink>
          <!-- Organisateur -->
          <div class="flex items-center">
            <img v-if="tournament.organizer.avatar_url" :src="tournament.organizer.avatar_url"
              alt="Avatar de l'organisateur" class="w-8 h-8 rounded-full border-4 border-[#b68e5d] object-cover mr-3" />
            <p class="text-ltext font-semibold">{{ tournament.organizer.username }}</p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>