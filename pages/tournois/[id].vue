<script setup lang="ts">
import type { Organizer, Tournament, Participant } from '~/types/tournament';
import { CalendarDays, Coins, UserRound } from 'lucide-vue-next';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const route = useRoute();
const tournamentStore = useTournamentStore();
const participationStore = useParticipationStore();
const userStore = useUserStore();
const isVisible = ref(false);
const form = ref<Tournament | null>(null);
const tournament = ref<Tournament | null>(null);
const organizer = ref<Organizer | null>(null);
const participants = ref<Participant[]>([]);
const loading = ref(true);
const id = Number(route.params.id);

async function loadTournament() {
    try {
        const data = await tournamentStore.getTournament(id);
        tournament.value = data.tournament;
        organizer.value = data.organizer;
        participants.value = data.participants;
        loading.value = false;
    } catch (error) {
        console.error("Erreur lors de la récupération du tournoi :", error);
    }
};


async function joinTournament() {
    await participationStore.joinTournament(id);
    await loadTournament();
}

async function leaveTournament() {
    await participationStore.leaveTournament(id);
    await loadTournament();
}

onMounted(async () => {
    await loadTournament();
});

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
    if (userStore.profile?.user_id === tournament.organizer_id) {
        openModal(tournament);
    } else {
        alert('Vous devez être l\'organisateur du tournoi pour le modifier.');
    }
}

</script>

<template>
    <div v-if="tournament" class="p-6">
        <h1 class="text-2xl font-bold uppercase border-b-2 pb-2 mb-4">{{ tournament.title }}</h1>
        <div class="text-lg mb-2 flex items-center">
            <CalendarDays />
            <p class="ml-2">Date : {{ format(new Date(tournament.date), 'd MMMM yyyy à HH:mm', { locale: fr }) }}
            </p>
        </div>
        <div class="text-lg mb-2 flex items-center">
            <Coins />
            <p class="ml-2">Récompense : {{ tournament.reward_amount }} {{ tournament.reward_type }}</p>
        </div>

        <div v-if="organizer" class="flex flex-row items-center py-2 text-lg mb-2">
            <img v-if="organizer.avatar_url" :src="organizer.avatar_url" alt="Avatar de l'organisateur"
                class="w-10 h-10 rounded-full object-cover mr-3" />
            <span v-if="organizer">
                {{ organizer.username }}
            </span>
        </div>

        <h2 class="text-xl font-bold border-b pb-2 mb-4">Participants</h2>
        <div v-if="participants && participants?.length" class="mt-6 mb-4">
            <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
                <li v-for="participant in participants" :key="participant.id"
                    class="flex items-center p-4 bg-gray-800 text-white rounded-lg shadow-lg hover:shadow-2xl transition-all">
                    <img :src="participant.avatar_url" alt="Avatar"
                        class="w-12 h-12 rounded-full border-4 border-[#b68e5d] object-cover mr-4" />
                    <p class="font-bold text-xl">{{ participant.username }}</p>
                    <div class="ml-auto flex items-center">
                        <span class="text-[#b68e5d] text-lg">⚔️</span>
                    </div>
                </li>
            </ul>
        </div>
        <p v-else class="text-center text-lg text-gray-400">Pas de participants pour le moment</p>

        <div class="flex space-x-4">
            <button v-if="userStore.profile?.user_id === tournament.organizer_id" @click="editTournament(tournament)"
                class="btnvariant">
                Modifier le tournoi
            </button>

            <button @click="joinTournament()" class="btn bg-[#27ae60]">
                Participer au tournoi
            </button>
            <button @click="leaveTournament()" class="btn bg-[#c0392b]">
                Désinscription au tournoi
            </button>
        </div>

    </div>
    <p v-if="loading">Chargement...</p>

    <!-- Modale d'édition -->
    <EditTournamentModal :isVisible="isVisible" :form="form" @close="closeModal" @update="updateTournament" />
</template>
