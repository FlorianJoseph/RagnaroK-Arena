<script setup>

const tournamentStore = useTournamentStore();
const participationStore = useParticipationStore();
const route = useRoute();
const id = Number(route.params.id);
const tournament = ref(null);
const organizer = ref(null);
const participants = ref([]);

async function loadTournament() {
    try {
        const data = await tournamentStore.getTournament(id);
        tournament.value = data.tournament;
        organizer.value = data.organizer;
        participants.value = data.participants;
    } catch (error) {
        console.error("Erreur lors de la récupération du tournoi :", error);
    }
};
onMounted(async () => {
    participants.value = await participationStore.getParticipants(id);
    await loadTournament();
});

const tournamentTree = computed(() => {
    if (!participants.value.length) return { label: "En attente de participants" };

    // Simulation d'un tournoi simple en mode élimination directe
    let tree = { label: "Finale", children: [] };
    let round = [];

    // On organise les participants en paires (1 vs 1)
    for (let i = 0; i < participants.value.length; i += 2) {
        if (participants.value[i + 1]) {
            round.push({
                label: `${participants.value[i].username} ⚔️ ${participants.value[i + 1].username}`,
                children: [
                    { label: participants.value[i].username },
                    { label: participants.value[i + 1].username }
                ]
            });
        } else {
            // Si un participant est seul (nombre impair), il est qualifié directement
            round.push({
                label: participants.value[i].username,
                children: [{ label: "En attente d'adversaire" }]
            });
        }
    }

    tree.children = round;
    return tree;
});
</script>

<template>
    <div class="card overflow-x-auto">
        <OrganizationChart :value="tournamentTree">
            <template #default="{ node }">
                <span>{{ node.label }}</span>
            </template>
        </OrganizationChart>
    </div>
    <div class="container mx-auto px-4">
        <h1 class="text-center text-3xl font-bold mb-6">Tournament Bracket</h1>

        <div class="flex flex-col sm:flex-row justify-center">
            <!-- Round 1 -->
            <div class="tournament-round flex flex-col items-center sm:mr-12">
                <h2 class="text-lg font-semibold text-gray-700 mb-4">Round 1</h2>
                <div class="flex flex-col space-y-4">
                    <div class="match flex items-center">
                        <div class="team p-4 bg-white shadow-md rounded-md">Team A</div>
                        <div class="bracket-line"></div>
                        <div class="team p-4 bg-white shadow-md rounded-md">Team B</div>
                    </div>
                    <div class="match flex items-center">
                        <div class="team p-4 bg-white shadow-md rounded-md">Team C</div>
                        <div class="bracket-line"></div>
                        <div class="team p-4 bg-white shadow-md rounded-md">Team D</div>
                    </div>
                </div>
            </div>

            <!-- Round 2 -->
            <div class="tournament-round flex flex-col items-center sm:mr-12 mt-10 sm:mt-0">
                <h2 class="text-lg font-semibold text-gray-700 mb-4">Round 2</h2>
                <div class="flex flex-col space-y-4">
                    <div class="match flex items-center">
                        <div class="team p-4 bg-white shadow-md rounded-md">Team A</div>
                        <div class="bracket-line"></div>
                        <div class="team p-4 bg-white shadow-md rounded-md">Team D</div>
                    </div>
                </div>
            </div>

            <!-- Round 3 -->
            <div class="tournament-round flex flex-col items-center">
                <h2 class="text-lg font-semibold text-gray-700 mb-4">Finals</h2>
                <div class="flex flex-col space-y-4">
                    <div class="match flex items-center">
                        <div class="team p-4 bg-white shadow-md rounded-md">Team A</div>
                        <div class="bracket-line"></div>
                        <div class="team p-4 bg-white shadow-md rounded-md">Team B</div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>