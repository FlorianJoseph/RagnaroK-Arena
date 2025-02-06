<script setup lang="ts">
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Heart, Share2, Check } from 'lucide-vue-next';
const tournamentStore = useTournamentStore();
const copied = ref<{ [key: number]: boolean }>({});

onMounted(async () => {
  await tournamentStore.fetchTournaments();
  console.log(tournamentStore.tournaments);
  
});

function copyLinkToClipboard(tournamentId: number) {
  const link = `http://localhost:3000/tournois/${tournamentId}`;
  copied.value[tournamentId] = true;
  navigator.clipboard.writeText(link).then(() => {
    setTimeout(() => {
      copied.value[tournamentId] = false;
    }, 3000);
  });
}
</script>

<template>
  <Tab class="mb-4" />
  <div>
    <!-- Affichage des tournois -->
    <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <li v-for="tournament in tournamentStore.tournaments" :key="tournament.id"
        class="bg-white shadow-lg rounded-lg overflow-hidden border border-lborder dark:border-dborder">

        <!-- Header avec titre et organisateur -->
        <div class="p-4 bg-gray-100 flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-semibold text-gray-800">{{ tournament.title }}</h2>
            <div class="flex items-center gap-2">
              <img :src="tournament.organizer.avatar_url" alt="Avatar" class="w-8 h-8 rounded-full object-cover" />
              <NuxtLink :to="`/@${tournament.organizer.username}`" class="font-medium text-blue-600 hover:underline">{{
                tournament.organizer.username }}</NuxtLink>
            </div>
          </div>

          <!-- Date mise en évidence -->
          <div class="text-center py-2">
            <p class="text-4xl font-semibold text-gray-800">{{ format(new Date(tournament.date), 'd', { locale: fr }) }}
            </p>
            <p class="text-sm text-gray-600">{{ format(new Date(tournament.date), 'MMMM yyyy à HH:mm', { locale: fr })
              }}</p>
          </div>

        </div>

        <!-- Image du jeu -->
        <div class="relative">
          <img :alt="tournament.game_id" class="w-full h-48 object-cover" />
        </div>

        <!-- Détails du tournoi -->
        <div class="p-4">

          <div class="text-sm text-gray-600">
            <p>Récompense : {{ tournament.reward_amount }} {{ tournament.reward_type }}</p>
            <p class="font-semibold text-blue-600">Prix d'entrée : {{ tournament.prix_entree }} coins</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="px-6 py-4 flex justify-between items-center border-t border-lborder dark:border-dborder">
          <div class="flex gap-4">
            <NuxtLink :to="`/tournois/${tournament.id}`" class="hover:text-laccent">Voir le tournoi</NuxtLink>
            <NuxtLink class="hover:text-laccent">Participer</NuxtLink>
          </div>

          <div class="flex items-center mr-2">
            <!-- Icône cœur avec hover rouge -->
            <div class="flex items-center gap-2 hover:text-red-600 cursor-pointer mr-6">
              <Heart class="hover:text-red-600" />
              <p>Favori</p>
            </div>

            <!-- Bouton de partage -->
            <div class="flex items-center gap-2 text-gray-600 hover:text-green-600 cursor-pointer"
              @click="copyLinkToClipboard(tournament.id)">
              <template v-if="copied[tournament.id]">
                <Check class="text-green-600" />
                <p class="text-green-600">Lien copié</p>
              </template>
              <template v-else>
                <Share2 />
                <p>Partager</p>
              </template>
            </div>
          </div>

        </div>
      </li>
    </ul>
  </div>
</template>
