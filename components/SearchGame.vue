<template>
    <div class="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-8 relative">
        <label for="game" class="w-full sm:w-80 font-medium text-left">Jeu</label>
        <div class="relative flex-1 w-full">
            <!-- Champ de recherche -->
            <input id="game" type="text" v-model="searchQuery" placeholder="Rechercher un jeu..."
                class="w-full border rounded p-2" @focus="isDropdownOpen = true" @keydown.down.prevent="navigate(1)"
                @keydown.up.prevent="navigate(-1)" @keydown.enter.prevent="selectGame(filteredGames[selectedIndex])" />

            <!-- Liste déroulante des jeux -->
            <ul v-show="isDropdownOpen && filteredGames.length"
                class="absolute w-full bg-white dark:bg-dgray border rounded shadow-lg mt-1 max-h-60 overflow-y-auto z-10">
                <li v-for="(game, index) in filteredGames" :key="game.id" @click="selectGame(game)"
                    @mouseenter="selectedIndex = index"
                    class="p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                    :class="{ 'bg-gray-300 dark:bg-gray-600': index === selectedIndex }">
                    {{ game.name }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
const gameStore = useGameStore();
const searchQuery = ref("");
const isDropdownOpen = ref(false);
const selectedIndex = ref(-1);
const newTournament = ref({ game_id: null });

// Filtrage des jeux en fonction de la recherche
const filteredGames = computed(() =>
    gameStore.games.filter((game) =>
        game.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
);

// Navigation avec les flèches du clavier
const navigate = (direction) => {
    if (filteredGames.value.length === 0) return;
    selectedIndex.value = (selectedIndex.value + direction + filteredGames.value.length) % filteredGames.value.length;
};

// Sélection d'un jeu
const selectGame = (game) => {
    newTournament.value.game_id = game.id;
    searchQuery.value = game.name;
    isDropdownOpen.value = false;
};

// Fermer la liste déroulante si on clique ailleurs
watch(searchQuery, (newValue) => {
    isDropdownOpen.value = newValue.length > 0;
});
</script>