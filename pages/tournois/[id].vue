<script setup lang="ts">
import type { Organizer, Tournament, Participant, Match } from '~/types/tournaments';
import type { Profile } from '~/types/profiles';
import type { Game } from '~/types/games';
import { CalendarDays, Coins, User, Quote, Gamepad2 } from 'lucide-vue-next';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const route = useRoute();
const tournamentStore = useTournamentStore();
const participationStore = useParticipationStore();
const bracketStore = useBracketStore();
const userStore = useUserStore();
const visible = ref(false);
const tournament = ref<Tournament | null>(null);
const organizer = ref<Organizer | null>(null);
const participants = ref<Participant[]>([]);
const game = ref<Game | null>(null);
const id = Number(route.params.id);
const toast = useToast();
const brackets = ref([]);
const winnerId = ref('');
const rounds = ref<{ matches: Match[] }[]>([]);
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
        await loadBrackets();
    } catch (error) {
        console.error("Erreur lors de la récupération du tournoi :", error);
    }
};

async function loadBrackets() {
    const bracketData = await bracketStore.getBrackets(id);
    console.log("Brackets récupérés :", bracketData);
    rounds.value = (bracketData ?? []).map(round => ({
        ...(typeof round === 'object' && round !== null ? round : {}),
        matches: Array.isArray(round.matches) ? round.matches : []
    }));
}

async function createBracket() {
    try {
        const newBracket = await bracketStore.createBracket(participants.value, id);
        brackets.value.push(newBracket);
        toast.add({ severity: 'success', summary: 'Bracket créé', detail: 'Le bracket a été créé avec succès.' });
        await loadTournament();
    } catch (error) {
        console.error('Erreur lors de la création du bracket:', error);
        toast.add({ severity: 'error', summary: 'Erreur', detail: 'La création du bracket a échoué.' });
    }
}

async function setWinnerHandler(matchId: number, winnerId: string) {
    let match = null;

    for (const bracket of brackets.value) {
        match = bracket.matches.find(m => m.id === matchId);
        if (match) {
            break;
        }
    }
    await bracketStore.setWinner(match, winnerId);
    match.winner_id = winnerId;
    await loadBrackets();
}

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
    },
    {
        value: "double_elimination",
        title: "Élimination double",
    },
    {
        value: "free_for_all",
        title: "Battle Royale",
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
    <div class="flex items-center gap-2 mb-4" v-if="tournament">

        <!-- Affichage des participants et autres sections -->
        <div v-if="tournament && !brackets.length && userStore.profile?.user_id === tournament.organizer_id">
            <Button @click="createBracket" label="Créer un bracket" />
            <Button @click="visible = true" severity="info" variant="text" label="Modifier le tournoi" />
        </div>

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
    <Fieldset v-if="!brackets.length" legend="Participants" class="mb-4">
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

    <Fieldset v-if="!brackets.length" legend="Bracket">
        <div v-for="round in rounds" :key="round.id">
            <h3>Round {{ round.matches.length > 0 ? round.matches[0].round : 'N/A' }}</h3>
            <ul v-if="round.matches.length > 0">
                <li v-for="match in round.matches" :key="match.id">
                    Match {{ match.index }}:
                    <!-- <pre>{{ match }}</pre> -->
                    <!-- Affichage des informations des joueurs -->
                    <div v-if="match.player1 && match.player2" class="flex justify-center items-center my-4">
                        <Chip v-if="match.player1.username" :label="match.player1.username"
                            :image="match.player1.avatar_url" />
                        <p class="mx-2">vs</p>
                        <Chip v-if="match.player2.username" :label="match.player2.username"
                            :image="match.player2.avatar_url" />

                        <div v-if="match.winner_id" class="mt-2 text-green-500 font-semibold flex items-center gap-2">
                            🏆 Gagnant :
                            <Chip v-if="match.winner_id"
                                :label="match.winner_id === match.player1.user_id ? match.player1.username : match.player2.username"
                                :image="match.winner_id === match.player1.user_id ? match.player1.avatar_url : match.player2.avatar_url"
                                class="mr-1" />
                        </div>
                        <Form v-else @submit="setWinnerHandler(match.id, winnerId)"
                            class="flex flex-col gap-4 w-full md:w-56">
                            <div class="flex flex-col gap-1">
                                <Select name="winner" v-model="winnerId" :options="[{
                                    id: match.player1.id,
                                    user_id: match.player1.user_id,
                                    username: match.player1.username
                                }, {
                                    id: match.player2.id,
                                    user_id: match.player2.user_id,
                                    username: match.player2.username
                                }]" optionLabel="username" optionValue="user_id"
                                    placeholder="Sélectionner le vainqueur" fluid />
                            </div>
                            <Button type="submit" severity="secondary" label="Valider" :disabled="!winnerId" />
                        </Form>
                    </div>
                </li>
            </ul>
            <div v-else>Aucun match pour ce round.</div>
        </div>
    </Fieldset>
</template>
