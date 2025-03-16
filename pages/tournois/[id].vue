<script setup lang="ts">
import type { Organizer, Tournament, Participant } from '~/types/tournaments';
import type { Game } from '~/types/games';
import { CalendarDays, Coins, User, Quote, Gamepad2 } from 'lucide-vue-next';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const route = useRoute();
const tournamentStore = useTournamentStore();
const participationStore = useParticipationStore();
const userStore = useUserStore();
const visible = ref(false);
const tournament = ref<Tournament | null>(null);
const organizer = ref<Organizer | null>(null);
const participants = ref<Participant[]>([]);
const game = ref<Game | null>(null);
const loading = ref(true);
const id = Number(route.params.id);
const router = useRouter();
const toast = useToast();
const supabase = useSupabaseClient();
const matches = ref([]);
const brackets = ref([]);
const winnerId = ref(null);
const formattedDate = computed(() => {
    return tournament.value ? format(new Date(tournament.value.date), 'd MMMM yyyy à HH:mm', { locale: fr }) : '';
});

async function loadTournament() {
    try {
        const data = await tournamentStore.getTournament(id);
        tournament.value = data.tournament;
        organizer.value = data.organizer;
        participants.value = data.participants;
        game.value = data.game;
        loading.value = false;
        await loadBrackets();
    } catch (error) {
        console.error("Erreur lors de la récupération du tournoi :", error);
    }
};

async function loadMatchesForBracket(bracketId) {
    try {
        const { data, error } = await supabase
            .from('matches')
            .select('*')
            .eq('bracket_id', bracketId)
            .order('match_index', { ascending: true });

        if (error) throw error;

        data.forEach((match) => {
            const player1 = participants.value.find(p => String(p.user_id) === String(match.player1_id));
            const player2 = participants.value.find(p => String(p.user_id) === String(match.player2_id));

            match.player1 = player1;
            match.player2 = player2;
        });

        matches.value = matches.value.filter(m => m.bracket_id !== bracketId).concat(data);

    } catch (error) {
        console.error("Erreur lors de la récupération des matchs :", error.message);
    }
}


async function loadBrackets() {
    try {
        const { data, error } = await supabase
            .from('brackets')
            .select('*')
            .eq('tournament_id', id)
            .order('round_number', { ascending: true });

        if (error) throw error;

        brackets.value = data;

        for (const bracket of brackets.value) {
            await loadMatchesForBracket(bracket.id);
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des brackets :", error.message);
    }
}

async function setWinner(match, winnerId) {
    try {
        const { data, error } = await supabase
            .from('matches')
            .update({ winner_id: winnerId })
            .eq('id', match.id)
            .select();

        if (error) throw Error(error.message);

        if (data && data.length) {
            match.winner_id = data[0].winner_id;
        }
        winnerId = null;
        await loadMatchesForBracket(match.bracket_id);

    } catch (error) {
        console.error('Erreur lors de la mise à jour du gagnant:', error.message);
    }
}

const getWinner = (match) => {
    return participants.value.find(p => p.user_id === match.winner_id) || null;
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
    try {
        participants.value = await participationStore.getParticipants(id);
        await loadTournament();
    } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
    }
});

const saveTournament = async () => {
    if (tournament.value && tournament.value.title && tournament.value.date) {
        await tournamentStore.updateTournament(tournament.value);
        visible.value = false;
        await loadTournament();
        toast.add({ severity: 'success', summary: 'Tournoi modifié', detail: 'Le tournoi a été modifié avec succès.' });
    } else {
        alert('Veuillez remplir tous les champs');
    }
};

const isUserParticipant = computed(() => {
    return participants.value?.some(participant => participant.user_id === userStore.profile?.user_id);
});

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
        image: "https://primefaces.org/cdn/primevue/images/usercard.png",

    },
];
</script>

<template>
    <!-- Informations -->
    <Fieldset legend="Informations du tournoi" v-if="tournament" class="mb-4">
        <div class="flex flex-row gap-10">
            <div class="text-lg flex items-center">
                <Quote />
                <p class="ml-2"> Titre : {{ tournament.title }}</p>
            </div>
            <div class="text-lg flex items-center">
                <Gamepad2 />
                <p class="ml-2"> Jeu : {{ game?.name }}</p>
            </div>
            <div class="text-lg flex items-center">
                <CalendarDays />
                <p class="ml-2">Date : {{ format(new Date(tournament.date), 'd MMMM yyyy à HH:mm', { locale: fr }) }}
                </p>
            </div>
            <div class="text-lg flex items-center">
                <Coins />
                <p class="ml-2">Récompense : {{ tournament.reward_amount }} {{ tournament.reward_type }}</p>
            </div>
            <div class="text-lg flex items-center">
                <User />
                <div v-if="organizer" class="flex items-center gap-2">
                    <p class="ml-2"> Organisateur :</p>
                    <NuxtLink class="hover:underline" :to="`/@${organizer.username}`">
                        <Chip v-tooltip.bottom="'Voir le profil'" :label="organizer.username"
                            :image="organizer.avatar_url" class="mr-2" />
                    </NuxtLink>
                </div>
            </div>
        </div>
    </Fieldset>

    <!-- Actions -->
    <div class="flex items-center gap-2 mb-4">
        <Button v-if="tournament && userStore.profile?.user_id === tournament.organizer_id" label="Valider le tournoi" />
        <Button v-if="tournament && userStore.profile?.user_id === tournament.organizer_id" @click="visible = true" severity="info"
            variant="text" label="Modifier le tournoi" />
        <Dialog v-model:visible="visible" modal header="Modifier le tournoi" :style="{ width: '25rem' }">
            <!-- Titre -->
            <InputGroup class="my-4">
                <InputGroupAddon>
                    <Quote />
                </InputGroupAddon>
                <FloatLabel variant="on">
                    <InputText id="on_label" v-model="tournament.title" fluid />
                    <label for="on_label">Titre</label>
                </FloatLabel>
            </InputGroup>
            <!-- Date -->
            <InputGroup>
                <InputGroupAddon>
                    <CalendarDays />
                </InputGroupAddon>
                <FloatLabel variant="on">
                    <DatePicker id="on_label" v-model="tournament.date" fluid iconDisplay="input" showButtonBar showTime
                        hourFormat="24" :dateFormat="formattedDate">
                    </DatePicker>
                    <label for="on_label">Date</label>
                </FloatLabel>
            </InputGroup>
            <!-- Format -->
            <Fieldset legend="Format" class="mb-4">
                <RadioButtonGroup v-model="tournament.format" name="format" class="flex flex-wrap gap-4">
                    <div class="flex flex-col gap-2">
                        <div v-for="format in tournamentFormats" :key="format.value"
                            class="flex flex-row items-center gap-2">
                            <RadioButton :value="format.value" name="format" class="flex flex-wrap gap-4" />
                            <label for="format">{{ format.title }}</label>
                        </div>
                    </div>
                </RadioButtonGroup>
            </Fieldset>

            <div class="flex justify-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                <Button type="button" label="Save" @click="saveTournament()"></Button>
            </div>
        </Dialog>
    </div>

    <!-- Participants -->
    <Fieldset legend="Participants" class="mb-4">
        <template v-if="participants?.length">
            <NuxtLink v-for="p in participants" :key="p.id" :to="`/@${p.username}`">
                <Chip v-tooltip.bottom="'Voir le profil'" :label="p.username" :image="p.avatar_url" class="mr-1" />
            </NuxtLink>
        </template>
        <p v-else class="text-gray-500 dark:text-gray-400">Aucun participant pour le moment.</p>
    </Fieldset>
    <div class="mb-4">
        <Button v-if="isUserParticipant" @click="leaveTournament()" severity="danger" label="Désinscription au tournoi"
            variant="outlined" />
        <Button v-else @click="joinTournament()" severity="succes" label="Participer" variant="outlined" />
    </div>

    <!-- Brackets -->
    <Fieldset legend="Brackets">
        <div v-for="(bracket, bracketIndex) in brackets" :key="bracketIndex">
            <h3 class="text-lg font-semibold mb-3">Tour {{ bracket.round_number }}</h3>
            <div v-for="match in matches.filter(m => m.bracket_id === bracket.id)" :key="match.id">
                <div v-if="match.player1 && match.player2" class="flex justify-center items-center my-4">
                    <Chip v-if="match.player1?.username" :label="match.player1?.username"
                        :image="match.player1?.avatar_url" class="mr-1" />
                    <p class="mx-2">vs</p>
                    <Chip v-if="match.player2?.username" :label="match.player2?.username"
                        :image="match.player2?.avatar_url" class="mr-1" />
                </div>
                <div v-if="match.winner_id" class="mt-2 text-green-500 font-semibold flex items-center gap-2">
                    🏆 Gagnant :
                    <Chip v-if="getWinner(match)?.username" :label="getWinner(match)?.username"
                        :image="getWinner(match)?.avatar_url" class="mr-1" />
                </div>
                <Form v-else @submit="setWinner(match, winnerId)" class="flex flex-col gap-4 w-full md:w-56">
                    <div class="flex flex-col gap-1">
                        <Select name="winner" v-model="winnerId" :options="[
                            { id: match.player1.id, user_id: match.player1.user_id, name: match.player1.username },
                            { id: match.player2.id, user_id: match.player2.user_id, name: match.player2.username }
                        ]" optionLabel="name" optionValue="user_id" placeholder="Sélectionner le vainqueur" fluid />
                    </div>
                    <Button type="submit" severity="secondary" label="Valider" />
                </Form>
            </div>
        </div>
    </Fieldset>
    <p v-if="loading">Chargement...</p>
    <Toast position="bottom-right" />
</template>
