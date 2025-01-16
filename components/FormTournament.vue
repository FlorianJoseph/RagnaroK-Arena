<script setup lang="ts">
import type { Tournament, CategoryType } from '~/models/types';

const userStore = useUserStore();
const tournamentStore = useTournamentStore();
const gameStore = useGameStore();

// Définir les enums pour reward_type
enum RewardType {
  coins = 'coins',
  tickets = 'tickets',
  real_money = 'real_money',
}

// Variables réactives pour le formulaire de création de tournoi
const newTournament = ref({
  title: '',
  prix_entree: 0,
  date: '',
  reward_type: RewardType.coins,
  reward_amount: 0,
  game_id: 1,
});

// Les valeurs prédéfinies pour les prix d'entrée
const predefinedPrices = [10, 20, 50, 100];

// Méthode pour définir le prix d'entrée
const setPrice = (price: number) => {
  newTournament.value.prix_entree = price;
};

onMounted(async () => {
  await tournamentStore.fetchTournaments();
  await userStore.fetchProfile();
  gameStore.fetchGames();
});

// Méthode pour créer un tournoi
const createNewTournament = async () => {

  if (!userStore.profile?.id) {
    console.error('Utilisateur non connecté ou profil non chargé');
    return;
  }

  const tournamentData = {
    ...newTournament.value,
    title: newTournament.value.title,
    prix_entree: newTournament.value.prix_entree,
    date: new Date(newTournament.value.date),
    reward_type: newTournament.value.reward_type,
    reward_amount: newTournament.value.reward_amount,
    organizer_id: userStore.profile.user_id,
    game_id: newTournament.value.game_id,
    created_at: new Date(),
    updated_at: new Date(),
    organizer: userStore.profile,
    game: gameStore.games.find(game => game.id === newTournament.value.game_id) || {
      id: 0,
      nom: '',
      categorie: '' as CategoryType,
      tournament: []  // Ajout d'un tableau vide pour 'tournament'
    }, participants: [],
  };

  await tournamentStore.createTournament(tournamentData);

  newTournament.value = {
    title: '',
    prix_entree: 0,
    date: '',
    reward_type: RewardType.coins,
    reward_amount: 0,
    game_id: 1,
  };

  await tournamentStore.fetchTournaments();
};
</script>

<template>
  <div class="max-h-max p-4 bg-white dark:bg-dcardbg rounded-lg shadow border border-lborder dark:border-dborder">
    <div class="text-2xl font-bold opacity-90 m-0 text-lightPrimary dark:text-darkPrimary mb-8">Créer un tournoi</div>
    <!-- Formulaire pour créer un tournoi -->
    <form @submit.prevent="createNewTournament">

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
        <option v-for="(type, key) in RewardType" :key="key" :value="type">
          {{ type }}
        </option>
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
