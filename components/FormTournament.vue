<script setup lang="ts">
import { RewardType } from '~/models/types'; // Importation de l'énumération

const userStore = useUserStore();
const tournamentStore = useTournamentStore();
const gameStore = useGameStore();

const newTournament = ref({
  title: '',
  prix_entree: 0,
  date: '',
  reward_type: RewardType.coins,
  reward_amount: 0,
  game_id: 1,
});

onMounted(async () => {
  await tournamentStore.fetchTournaments();
  await userStore.fetchProfile();
  gameStore.fetchGames();
});


const predefinedPrices = [10, 20, 50, 100];
const setPrice = (price: number) => {
  newTournament.value.prix_entree = price;
};

const createTournament = async (event: Event) => {
  event.preventDefault();
  const newTournamentData = { ...newTournament.value };
  await tournamentStore.createTournament({ ...newTournamentData });
};
</script>

<template>
  <div class="max-h-max p-4 bg-white dark:bg-dcardbg rounded-lg shadow border border-lborder dark:border-dborder">
    <div class="text-2xl font-bold opacity-90 m-0 text-lightPrimary dark:text-darkPrimary mb-8">Créer un tournoi</div>
    <!-- Formulaire pour créer un tournoi -->
    <form @submit.prevent="createTournament">

      <div>
        <label for="title">Titre</label>
        <input v-model="newTournament.title" id="title" placeholder="Titre" class="input" required />
      </div>

      <div>
        <label for="jeu_id">Jeu</label>
        <select v-model="newTournament.game_id" id="jeu_id" class="input" required>
          <option v-for="game in gameStore.games" :key="game.id" :value="game.id">
            {{ game.nom }} - {{ game.categorie }}
          </option>
        </select>
      </div>

      <!-- 4 boutons de choix pour prix d'entrée -->
      <div class="my-4">
        <span class="text-lg font-semibold">Prix d'entrée</span>
        <div class="flex space-x-2 mt-2">
          <button v-for="price in predefinedPrices" :key="price" type="button" @click="setPrice(price)" :class="{
            'bg-blue-500': newTournament.prix_entree === price,
            'bg-gray-300': newTournament.prix_entree !== price
          }" class="px-4 py-2 rounded text-white focus:outline-none">
            {{ price }} coins
          </button>
        </div>
      </div>

      <!-- Montant personnalisé -->
      <div class="my-4">
        <input v-if="newTournament.prix_entree === 0" v-model="newTournament.prix_entree" type="number"
          placeholder="Montant personnalisé" class="input" />
      </div>

      <div class="form-group">
        <label for="date">Date</label>
        <input v-model="newTournament.date" type="datetime-local" id="date" class="input" required />
      </div>

      <!-- Sélectionner le type de récompense -->
      <select v-model="newTournament.reward_type" class="input" required>
        <option value="coins">Coins</option>
        <option value="tickets">Tickets</option>
        <option value="real_money">Argent réel</option>
      </select>

      <div class="form-group">
        <label for="reward_amount">Montant de la récompense</label>
        <input v-model="newTournament.reward_amount" type="number" id="reward_amount"
          placeholder="Montant de la récompense" class="input" required />
      </div>

      <button type="submit" class="btn">Créer le tournoi</button>
    </form>
  </div>
</template>
