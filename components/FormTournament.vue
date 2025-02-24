<script setup lang="ts">
import { RewardType, FormatType } from '~/types/tournaments';
import type { NewTournament } from '~/types/tournaments';
import { Ticket, Coins, Euro, CalendarDays } from 'lucide-vue-next';

const userStore = useUserStore();
const tournamentStore = useTournamentStore();
const router = useRouter();

onMounted(async () => {
  await tournamentStore.fetchTournaments();
  await userStore.getProfile();
});

const newTournament = ref<NewTournament>({
  title: '',
  entry_fee: 0,
  date: new Date(),
  reward_type: RewardType.Pièces,
  reward_amount: 0,
  game_id: 1,
  format: FormatType.single_elimination,
});

const predefinedPrices = [0, 10, 20, 50, 100];
const setPrice = (price: number) => {
  newTournament.value.entry_fee = price;
};

async function createTournament() {

  const newTournamentData = {
    ...newTournament.value
  }
  await tournamentStore.createTournament(newTournamentData);

  newTournament.value = {
    title: '',
    entry_fee: 0,
    date: new Date(),
    reward_type: RewardType.Pièces,
    reward_amount: 0,
    game_id: 1,
    format: FormatType.single_elimination,
  };

  router.push('/tournois');
};

const rewardOptions = [
  { label: 'Pièces', icon: Coins, value: 'Pièces' },
  { label: 'Tickets', icon: Ticket, value: 'Tickets' },
  { label: 'Euros', icon: Euro, value: 'Euros' },
];

const tournamentFormats = [
  {
    value: "single_elimination",
    title: "Élimination simple",
    description: "Un seul match perdu et c'est fini ! Un format rapide et intense.",
    image: "https://primefaces.org/cdn/primevue/images/usercard.png", // Remplace avec ton image
  },
  {
    value: "double_elimination",
    title: "Élimination double",
    description: "Deuxième chance ! Vous pouvez perdre un match et rester en compétition.",
    image: "https://primefaces.org/cdn/primevue/images/usercard.png",
  },
  {
    value: "free_for_all",
    title: "Battle Royale",
    description: "Tout le monde s'affronte, un seul survivant à la fin !",
    image: "assets\images\tournoi.jpg",
  },
];
</script>

<template>
  <div class="flex justify-center min-h-full items-center mt-12 px-4 sm:px-40">
    <!-- Formulaire pour créer un tournoi -->
    <form @submit.prevent="createTournament" class="min-w-full max-w-7xl flex flex-col space-y-8">

      <!-- Catégorie: Format du tournoi -->
      <div class="flex flex-col space-y-6">
        <h3 class="font-semibold text-2xl text-ltext dark:text-dtext">Format du tournoi</h3>
        <div class="flex flex-wrap gap-4">
          <div v-for="format in tournamentFormats" :key="format.value" class="flex items-center gap-2 text-ltext dark:text-dtext">
            <RadioButton :value="format.value" v-model="newTournament.format" name="format" />
            <label for="format">{{ format.title }}</label>
          </div>
        </div>
      </div>

      <!-- Catégorie: Informations supplémentaires -->
      <div class="flex flex-col space-y-8 mt-8">
        <h3 class="font-semibold text-2xl text-ltext dark:text-dtext">Informations supplémentaires</h3>

        <!-- Titre -->
        <div class="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-8">
          <label for="title" class="w-full sm:w-80 font-medium text-left text-ltext dark:text-dtext">Titre</label>
          <input id="title" v-model="newTournament.title" type="text" class="flex-1 w-full border rounded p-2"
            required />
        </div>

        <!-- Jeu -->
        <div class="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-8">
          <label for="game" class="w-full sm:w-80 font-medium text-left text-ltext dark:text-dtext">Jeu</label>
          <SearchGame />
        </div>
        <!-- Type de récompense -->
        <div class="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-8">
          <label class="w-full sm:w-80 font-medium text-left text-ltext dark:text-dtext">Type de récompense</label>
          <div class="flex flex-wrap gap-2 sm:gap-4">
            <label v-for="option in rewardOptions" :key="option.value" class="cursor-pointer">
              <input type="radio" :value="option.value" v-model="newTournament.reward_type" class="hidden peer" />
              <div :class="{
                'bg-laccent dark:bg-daccent text-white': newTournament.reward_type === option.value,
                'bg-lgray dark:bg-dgray': newTournament.reward_type !== option.value
              }" class="px-4 py-2 rounded flex items-center space-x-2 transition-all peer-checked:scale-105">
                <component :is="option.icon" class="h-6 w-6" />
                <span class="text-lg">{{ option.label }}</span>
              </div>
            </label>
          </div>
        </div>

        <!-- Prix d'entrée -->
        <div class="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-8">
          <label for="entry_fee" class="w-full sm:w-80 font-medium text-left text-ltext dark:text-dtext">Prix d'entrée</label>
          <div class="flex-1 w-full flex items-center gap-2 sm:gap-4">
            <!-- Bouton pour tournoi gratuit -->
            <button type="button" @click="setPrice(0)" :class="{
              'bg-laccent dark:bg-daccent text-white scale-105': newTournament.entry_fee === 0,
              'bg-lgray dark:bg-dgray': newTournament.entry_fee !== 0
            }" class="px-4 py-2 rounded flex items-center space-x-2 transition-all">
              <span>Gratuit</span>
            </button>

            <!-- Boucle pour afficher les prix prédéfinis (sauf 0) -->
            <button v-for="price in predefinedPrices.slice(1)" :key="price" type="button" @click="setPrice(price)"
              :class="{
                'bg-laccent dark:bg-daccent text-white scale-105': newTournament.entry_fee === price,
                'bg-lgray dark:bg-dgray': newTournament.entry_fee !== price
              }" class="px-4 py-2 rounded flex items-center space-x-2 transition-all">
              <span>{{ price }}</span>
            </button>

            <!-- Champ d'entrée pour montant personnalisé avec icône alignée -->
            <div class="relative w-24 sm:w-32">
              <input v-model="newTournament.entry_fee" type="number"
                class="w-full border-2 border-laccent rounded p-2 pr-8 text-center" :max="500" />
              <component :is="rewardOptions.find(option => option.value === newTournament.reward_type)?.icon"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
            </div>
          </div>
        </div>

        <!-- Date -->
        <div class="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-8">
          <label for="date" class="w-full sm:w-80 font-medium text-left text-ltext dark:text-dtext">Date</label>
          <FloatLabel variant="on">
            <DatePicker v-model="newTournament.date" showIcon fluid iconDisplay="input" showButtonBar showTime
              hourFormat="24">
              <template #inputicon="slotProps">
                <CalendarDays @click="slotProps.clickCallback" />
              </template>
            </DatePicker>
            <label for="on_label">Date</label>
          </FloatLabel>
        </div>

        <!-- Bouton de soumission -->
        <div class="flex justify-center mt-6">
          <button type="submit" class="btn">Valider</button>
        </div>
      </div>
    </form>
  </div>
</template>
