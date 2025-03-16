<script setup>
const tournamentStore = useTournamentStore();
const supabase = useSupabaseClient();
const route = useRoute();
const id = Number(route.params.id);
const tournament = ref(null);
const organizer = ref(null);
const participants = ref([]);
const matches = ref([]);
const brackets = ref([]);
const winnerId = ref(null);

async function loadTournament() {
    try {
        const data = await tournamentStore.getTournament(id);
        tournament.value = data.tournament;
        organizer.value = data.organizer;
        participants.value = data.participants;
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

onMounted(async () => {
    try {
        await loadTournament();
    } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
    }
});

const log = (evt) => {
    console.log(evt);
};

const clone = (participant) => ({ ...participant });
</script>

<template>
    <div class="flex gap-6 p-6">
        <!-- Joueurs de départ -->
        <Fieldset class="w-1/4" legend="Participants">
            <template v-if="participants?.length">
                <draggable :list="participants" item-key="id" :clone="clone" :group="{ name: 'participants' }"
                    @end="log">
                    <template #item="{ element: participant }">
                        <Chip v-if="participant.username" :label="participant.username" :image="participant.avatar_url"
                            class="mr-1 cursor-grab" />
                    </template>
                </draggable>
            </template>
            <p v-else class="text-gray-500 dark:text-gray-400">Aucun participant pour le moment.</p>
        </Fieldset>

        <!-- Tournois et brackets -->
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
                    <!-- Affichage du gagnant -->
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
                            ]" optionLabel="name" optionValue="user_id" placeholder="Sélectionner le vainqueur"
                                fluid />
                        </div>
                        <Button type="submit" severity="secondary" label="Valider" />
                    </Form>
                </div>
            </div>
        </Fieldset>
    </div>
</template>