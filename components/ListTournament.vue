<script setup lang="ts">
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Heart, Share2, Check } from 'lucide-vue-next';
const tournamentStore = useTournamentStore();
const copied = ref<{ [key: number]: boolean }>({});

onMounted(async () => {
  await tournamentStore.fetchTournaments();

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

        <!-- Header -->
        <div class="p-5 flex items-center justify-between bg-lbg dark:bg-dgray">
          <div>
            <h2 class="text-2xl font-semibold text-ltext dark:text-dtext">{{ tournament.title }}</h2>
          </div>

          <!-- Organisateur à droite -->
          <div class="flex items-center gap-2">
            <img :src="tournament.organizer.avatar_url" alt="Avatar" class="w-8 h-8 rounded-full object-cover" />
            <NuxtLink :to="`/@${tournament.organizer.username}`" class="font-medium hover:underline">
              {{ tournament.organizer.username }}
            </NuxtLink>
          </div>
        </div>


        <!-- Image du jeu -->
        <div class="relative">
          <img :src="tournament.games.image_url" :alt="tournament.games.name" class="w-full h-48 object-cover"
            loading="lazy" />

          <!-- Détails du tournoi superposés -->
          <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
            <div class="flex items-center justify-between sm:text-sm md:text-md lg:text-lg">
              <p>Récompense : {{ tournament.reward_amount }} {{ tournament.reward_type }}</p>
              <p class="font-semibold">Prix d'entrée : {{ tournament.prix_entree }} {{ tournament.reward_type }}</p>
            </div>
          </div>

          <!-- Date mise en évidence en haut à droite -->
          <div
            class="absolute top-2 right-2 bg-white bg-opacity-90 text-black px-3 py-1 rounded-full text-xs shadow-md border">
            <p>{{ format(new Date(tournament.date), 'd MMM yyyy à HH:mm', { locale: fr }) }}</p>
          </div>
        </div>

        <!-- Actions -->
        <div
          class="p-5 flex justify-between items-center bg-lbg dark:bg-dgray border-t border-lborder dark:border-dborder">
          <div class="flex gap-4">
            <NuxtLink :to="`/tournois/${tournament.id}`" class="hover:text-laccent">Voir le tournoi</NuxtLink>
            <p class="text-ltext dark:text-dtext">
              {{ tournament.participants.length === 1
                ? `${tournament.participants.length} participant`
                : `${tournament.participants.length} participants`
              }}
            </p>
          </div>

          <div class="flex items-center mr-2">
            <!-- Bouton de favori -->
            <div
              class="flex items-center gap-2 hover:text-red-600 cursor-pointer mr-4 transition-transform duration-200 ease-in-out hover:scale-110">
              <Heart class="hover:text-red-600" />
            </div>

            <!-- Bouton de partage -->
            <div
              class="flex items-center gap-2 hover:text-green-600 cursor-pointer transition-transform duration-200 ease-in-out hover:scale-110"
              @click="copyLinkToClipboard(tournament.id)">
              <template v-if="copied[tournament.id]">
                <Check class="text-green-600" />
                <p class="text-green-600">Lien copié</p>
              </template>
              <template v-else>
                <Share2 />
              </template>
            </div>
          </div>

        </div>
      </li>
    </ul>
  </div>
</template>
