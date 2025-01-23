<script setup lang="ts">
import { useTournamentStore } from '~/stores/tournament';
import type { Organizer, Tournament } from '~/types/tournament';
import { CalendarDays, Coins, UserRound } from 'lucide-vue-next';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const route = useRoute();
const tournamentStore = useTournamentStore();

const isVisible = ref(false);
const form = ref<Tournament | null>(null);
const tournament = ref<Tournament | null>(null);
const organizer = ref<Organizer | null>(null);
const loading = ref(true);

const loadTournament = async () => {
    const id = Number(route.params.id);
    const { tournament: t, organizer: org } = await tournamentStore.getTournamentWithOrganizerById(id);

    tournament.value = t;
    organizer.value = org;
    loading.value = false;
};

onMounted(loadTournament);

function openModal(tournament: Tournament) {
    form.value = { ...tournament };
    isVisible.value = true;
}

function closeModal() {
    isVisible.value = false;
}

async function updateTournament() {
    if (form.value) {
        await tournamentStore.updateTournament(form.value);
        await loadTournament();
        closeModal();
    }
}

function editTournament(tournament: Tournament) {
    openModal(tournament);
}

</script>

<template>
    <div v-if="loading" class="text-center py-4">
        <p>Chargement du tournoi...</p>
    </div>

    <div v-if="!loading && tournament"
        class="p-6">
        <h1 class="text-2xl font-bold uppercase border-b-2 pb-2 mb-4">{{ tournament.title }}</h1>
        <div class="text-lg mb-2 flex items-center">
            <CalendarDays />
            <p class="ml-2">Date : {{ format(new Date(tournament.date), 'd MMMM yyyy à HH:mm', { locale: fr }) }}</p>
        </div>
        <div class="text-lg mb-2 flex items-center">
            <Coins />
            <p class="ml-2">Récompense : {{ tournament.reward_amount }} {{ tournament.reward_type }}</p>
        </div>
        <div class="text-lg mb-2 flex items-center">
            <UserRound />
            <p class="ml-2">Organisateur : <span v-if="organizer">
                    <img v-if="organizer.avatar_url" :src="organizer.avatar_url" alt="Avatar de l'organisateur"
                        class="w-8 h-8 rounded-full mr-2" />
                    {{ organizer.username }}
                </span></p>
        </div>

        <button @click="editTournament(tournament)" class="btnvariant">
            Modifier le tournoi
        </button>
    </div>

    <!-- Modale d'édition -->
    <EditTournamentModal :isVisible="isVisible" :form="form" @close="closeModal" @update="updateTournament" />
</template>
