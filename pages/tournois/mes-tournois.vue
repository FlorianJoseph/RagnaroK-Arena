<script setup lang="ts">
import type { Tournament } from '~/types/tournaments';

const tournaments = ref<Tournament[]>([])
const tournamentStore = useTournamentStore()
const user = useSupabaseUser();

async function fetchTournamentsbyProfile() {
    const userId = user.value?.id
    if (userId) {
        tournaments.value = await tournamentStore.getTournamentsByOrganizer(userId)
    }
}

onMounted(async () => {
    await fetchTournamentsbyProfile()
})
</script>

<template>
    <Tab class="mb-4" />
    <div v-if="tournaments.length">
        <h2 class="text-xl font-bold">Mes tournois organisés :</h2>
        <ul>
            <li v-for="tournament in tournaments" :key="tournament.id">
                <NuxtLink :to="`/tournois/${tournament.id}`" class="text-blue-500 hover:underline">
                    {{ tournament.title }}
                </NuxtLink>
            </li>
        </ul>
    </div>
    <div v-else>
        <p>Aucun tournoi organisé.</p>
    </div>
</template>
