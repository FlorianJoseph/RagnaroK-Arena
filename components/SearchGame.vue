<script setup>
import { Gamepad2 } from 'lucide-vue-next';
const gameStore = useGameStore();
const games = ref([]);
const selectedGame = ref();

onMounted(async () => {
    games.value = await gameStore.fetchGames();
});
</script>

<template>
    <InputGroup>
        <InputGroupAddon>
            <Gamepad2 />
        </InputGroupAddon>
        <Select v-model="selectedGame" checkmark :options="games" optionValue="id" optionLabel="name"
            placeholder="Sélectionner un jeu" class="w-full md:w-56" />
    </InputGroup>
</template>
