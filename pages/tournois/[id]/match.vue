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
</template>
