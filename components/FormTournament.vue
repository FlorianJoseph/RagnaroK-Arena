<script setup lang="ts">
import { useToast } from 'vue-toastification';
import { Check, CircleX } from 'lucide-vue-next';

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const tournamentName = ref('');
const tournamentDescription = ref('');
const prixEntree = ref('');
const tournamentDate = ref(''); // Ajouter la date du tournoi
const organizerId = user.value?.id;
const toast = useToast(); // Initialisation du toast

const selectedGameId = ref<number | null>(null); // ID du jeu sélectionné
const games = ref<any[]>([]); // Liste des jeux à afficher

// Récupérer les jeux disponibles depuis Supabase
async function fetchGames() {
  const { data, error } = await supabase
    .from('jeu') // Nom de la table pour les jeux
    .select(); // Sélectionner l'ID et le nom du jeu

  if (error) {
    console.error('Error fetching games:', error);
    toast.error('Erreur lors de la récupération des jeux : ' + error.message, { icon: CircleX });
  } else {
    console.log('Jeux récupérés:', data);  // Vérifie les jeux récupérés
    games.value = data || [];
  }
};

type Tournament = {
  title: string;            // 'text'
  organizer_id: string;     // 'uuid'
  prix_entree: number;      // 'int4'
  date: string;             // 'timestamp' (chaîne ISO 8601)
  jeu_id: number;           // 'int4'
  reward_type: string;      // 'text' ou un type spécifique comme 'cash', 'items', etc.
  reward_amount: number;    // 'int4'
  created_at: string;       // 'timestamp' (chaîne ISO 8601)
  updated_at: string;       // 'timestamp' (chaîne ISO 8601)
};

async function createTournament() {

  const { error } = await supabase
    .from<Tournament>('tournament')
    .insert([
      {
        title: tournamentName.value,
        organizer_id: organizerId, // ID de l'organisateur
        prix_entree: prixEntree.value,
        date: new Date(tournamentDate.value).toISOString(), // Utiliser la date du tournoi
        jeu_id: selectedGameId.value, // Associer le tournoi au jeu sélectionné
      }
    ]);

  if (error) {
    toast.error('Impossible de créer le tournoi :' + error.message, { icon: CircleX });
  } else {
    toast.success('Tournoi créé avec succès !', { icon: Check });
    tournamentName.value = '';
    tournamentDescription.value = '';
    prixEntree.value = '';
    tournamentDate.value = '';
    selectedGameId.value = null; // Réinitialiser le jeu sélectionné
  }
}

// Appeler fetchGames lorsque le composant est monté
onMounted(() => {
  fetchGames();
});
</script>

<template>
<form @submit.prevent="createTournament">
    <!-- Nom du tournoi -->
    <div class="mb-4 mt-10">
      <label for="tournamentName" class="block text-lg font-medium">Nom du tournoi</label>
      <input id="tournamentName" v-model="tournamentName" type="text"
        class="w-full p-3 border rounded-md focus:outline-none focus:ring-1 input"
        placeholder="Nom du tournoi" required />
    </div>

    <!-- Sélection du jeu -->
    <div class="mb-4">
      <label for="gameSelect" class="block text-lg font-medium">Choisir un jeu</label>
      <select id="gameSelect" v-model="selectedGameId"
        class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required>
        <option value="" disabled>Sélectionnez un jeu</option>
        <option v-for="game in games" :key="game.id" :value="game.id">
          {{ game.nom }}
        </option>
      </select>
    </div>

    <!-- Prix d'entrée -->
    <div class="mb-4">
      <label for="prixEntree" class="block text-lg font-medium">Prix d'entrée</label>
      <input id="prixEntree" v-model="prixEntree" type="number" min="1"
        class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Prix d'entrée" required />
    </div>

    <!-- Date du tournoi -->
    <div class="mb-4">
      <label for="tournamentDate" class="block text-lg font-medium">Date du tournoi</label>
      <input id="tournamentDate" v-model="tournamentDate" type="datetime-local"
        class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required />
    </div>

    <!-- Bouton de soumission -->
    <div class="flex justify-center">
      <button type="submit"
        class="btn">
        Créer le tournoi
      </button>
    </div>
  </form>
</template>
