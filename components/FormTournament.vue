<script setup lang="ts">
import { RewardType } from '~/types/tournaments'; // Importation de l'énumération
import type { NewTournament } from '~/types/tournaments';

const userStore = useUserStore();
const tournamentStore = useTournamentStore();
const gameStore = useGameStore();

onMounted(async () => {
  await tournamentStore.fetchTournaments();
  await userStore.fetchProfile();
  await gameStore.fetchGames();
});

const newTournament = ref<NewTournament>({
  title: '',
  prix_entree: 0,
  date: new Date(),
  reward_type: RewardType.coins,
  reward_amount: 0,
  game_id: 1,
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
    reward_type: RewardType.coins,
    reward_amount: 0,
    game_id: 1,
  };
};
</script>

<template>
  <!-- Formulaire pour créer un tournoi -->
  <form @submit.prevent="createTournament">
    <div class="mb-4">
      <label class="block font-medium">Titre</label>
      <input v-model="newTournament.title" type="text" class="w-full border rounded p-2" required />
    </div>

    <div class="mb-4">
      <label class="block font-medium">Jeu</label>
      <select v-model="newTournament.game_id" class="w-full border rounded p-2" required>
        <option v-for="game in gameStore.games" :key="game.id" :value="game.id">
          {{ game.nom }} - {{ game.categorie }}
        </option>
      </select>
    </div>

    <div class="mb-4">
      <label class="block font-medium">Type de récompense</label>
      <select v-model="newTournament.reward_type" class="w-full border rounded p-2" required>
        <option value="coins">Coins</option>
        <option value="tickets">Tickets</option>
        <option value="real_money">Argent réel</option>
      </select>
    </div>

    <div class="mb-4">
      <label class="block font-medium">Prix d'entrée</label>
      <div class="flex space-x-2 mt-2">
        <button v-for="price in predefinedPrices" :key="price" type="button" @click="setPrice(price)"
          :class="{ 'bg-blue-500 text-white': newTournament.prix_entree === price, 'bg-gray-300': newTournament.prix_entree !== price }"
          class="px-4 py-2 rounded focus:outline-none">
          {{ price }} {{ newTournament.reward_type }}
        </button>
      </div>
    </div>

    <div class="mb-4" v-if="newTournament.prix_entree === 0">
      <input v-model="newTournament.prix_entree" type="number" placeholder="Montant personnalisé"
        class="w-full border rounded p-2" />
    </div>

    <div class="flex justify-center items-center mb-4 gap-4">
      <div>
        <label class="block font-medium">Date</label>
        <input v-model="newTournament.date" type="date" class="w-full border rounded p-2" required />
      </div>
      <div>
        <label class="block font-medium">Heure</label>
        <input v-model="newTournament.date" type="time" class="w-full border rounded p-2" required />
      </div>
    </div>

    <div class="mb-4">
      <label class="block font-medium">Montant de la récompense</label>
      <input v-model="newTournament.reward_amount" type="number" class="w-full border rounded p-2" required />
    </div>

    <div class="flex justify-end space-x-4">
      <button type="submit" class="btn">Créer</button>
    </div>
  </form>
</template>
