<script setup lang="ts">
import { ro } from 'date-fns/locale';
import { RewardType, FormatType } from '~/types/tournaments'; // Importation de l'énumération
import type { NewTournament } from '~/types/tournaments';

const userStore = useUserStore();
const tournamentStore = useTournamentStore();
const gameStore = useGameStore();
const router = useRouter();

onMounted(async () => {
  await tournamentStore.fetchTournaments();
  await userStore.getProfile();
});

const newTournament = ref<NewTournament>({
  title: '',
  prix_entree: 0,
  date: new Date(),
  reward_type: RewardType.Pièces,
  reward_amount: 0,
  game_id: 1,
  format: FormatType.single_elimination,
});

const predefinedPrices = [10, 20, 50, 100];
const setPrice = (price: number) => {
  newTournament.value.prix_entree = price;
};

async function createTournament() {
  const newTournamentData = {
    ...newTournament.value
  }
  await tournamentStore.createTournament(newTournamentData);

  newTournament.value = {
    title: '',
    prix_entree: 0,
    date: new Date(),
    reward_type: RewardType.Pièces,
    reward_amount: 0,
    game_id: 1,
    format: FormatType.single_elimination,
  };

  router.push('/tournois');
};
</script>

<template>
  <div class="flex justify-center min-h-full items-center mt-24">
    <!-- Formulaire pour créer un tournoi -->
    <form @submit.prevent="createTournament" class="max-w-96 flex justify-center flex-col space-y-4">

      <div>
        <label class="block font-medium">Format du tournoi</label>
        <select v-model="newTournament.format" class="w-full border rounded p-2" required>
          <option value="single_elimination">Élimination simple</option>
          <option value="double_elimination">Élimination double</option>
          <option value="free_for_all">Free for all</option>
        </select>
      </div>

      <div>
        <label class="block font-medium">Titre</label>
        <input v-model="newTournament.title" type="text" class="w-full border rounded p-2" required />
      </div>

      <div>
        <label class="block font-medium">Jeu</label>
        <select v-model="newTournament.game_id" class="w-full border rounded p-2" required>
          <option v-for="game in gameStore.games" :key="game.id" :value="game.id">
            {{ game.name }} - {{ game.category }}
          </option>
        </select>
      </div>

      <div>
        <label class="block font-medium">Type de récompense</label>
        <select v-model="newTournament.reward_type" class="w-full border rounded p-2" required>
          <option value="Pièces">Pièces</option>
          <option value="Tickets">Tickets</option>
          <option value="Euros">Euros</option>
        </select>
      </div>

      <div>
        <label class="block font-medium">Prix d'entrée</label>
        <div class="flex space-x-2 mt-2">
          <button v-for="price in predefinedPrices" :key="price" type="button" @click="setPrice(price)"
            :class="{ 'bg-blue-500 text-white': newTournament.prix_entree === price, 'bg-gray-300': newTournament.prix_entree !== price }"
            class="px-4 py-2 rounded focus:outline-none">
            {{ price }} {{ newTournament.reward_type }}
          </button>
        </div>
      </div>

      <div v-if="newTournament.prix_entree === 0">
        <input v-model="newTournament.prix_entree" type="number" placeholder="Montant personnalisé"
          class="w-full border rounded p-2" />
      </div>

      <div>
        <label class="block font-medium">Date</label>
        <input v-model="newTournament.date" type="datetime-local" class="w-full border rounded p-2" required />
      </div>

      <div>
        <label class="block font-medium">Montant de la récompense</label>
        <input v-model="newTournament.reward_amount" type="number" class="w-full border rounded p-2" required />
      </div>

      <div>
        <button type="submit" class="btn">Créer</button>
      </div>
    </form>
  </div>
</template>
