<script setup lang="ts">
const supabase = useSupabaseClient();
const tournaments = ref<any[] | null>(null);

async function fetchTournaments() {
    const { data, error: fetchError } = await supabase
        .from('tournament')
        .select()

    tournaments.value = data;
}

// Appeler fetchGames lorsque le composant est monté
onMounted(() => {
    fetchTournaments();
});
</script>

<template>
    <!-- Affichage des tournois -->
    <div v-if="tournaments && tournaments.length > 0" class="space-y-4">
        <div v-for="tournament in tournaments" :key="tournament.id"
            class="bg-lightBg border-2 border-lightPrimary p-6 rounded shadow-sm hover:shadow-md transition-all">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-2xl font-bold text-lightPrimary">{{ tournament.title }}</h3>
                <p class="text-sm text-lightSecondary">Prix d'entrée: {{ tournament.prix_entree }}€</p>
            </div>
            <div class="mt-4">
                <!-- <p class="text-sm text-lightSecondary">Jeu : <span class="font-semibold">{{ tournament.jeu.nom }}</span>
                </p> -->
                <!-- <p class="text-sm text-lightSecondary">Catégorie : <span class="font-semibold">{{
                    tournament.jeu }}</span></p> -->
            </div>
            <p class="text-sm text-gray-500 mt-4">
                Date : {{ new Date(tournament.date).toLocaleString('fr-FR', {
                    weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
                }) }}
            </p>
        </div>
    </div>
    <!-- Message si aucun tournoi n'est trouvé -->
    <div v-else class="text-gray-500">
        <p>Aucun tournoi trouvé.</p>
    </div>

</template>