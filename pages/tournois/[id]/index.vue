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

async function loadTournament() {
    try {
        const data = await tournamentStore.getTournament(id);
        tournament.value = data.tournament;
        organizer.value = data.organizer;
        participants.value = data.participants;
        game.value = data.game;
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
    participants.value = await participationStore.getParticipants(id);
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

</script>

<template>
    <Fieldset legend="Informations du tournoi" v-if="tournament" class="mb-8">
        <div class="flex flex-col gap-2">
            <div class="text-lg flex items-center">
                <Quote />
                <p class="ml-2"> Titre : {{ tournament.title }}</p>
            </div>
            <Divider />
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
            <Divider />
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
            <Divider />

            <!-- Vérification de l'inscription de l'utilisateur -->
            <div class="flex items-center gap-2">
                <Button @click="router.push(`/tournois/${id}/match`)" label="Voir le match" severity="primary" />

                <Button v-if="isUserParticipant" @click="leaveTournament()" severity="danger"
                    label="Désinscription au tournoi" variant="outlined" />
                <Button v-else @click="joinTournament()" severity="succes" label="Participer" variant="outlined" />

                <Button v-if="userStore.profile?.user_id === tournament.organizer_id" @click="visible = true"
                    severity="info" variant="text" label="Modifier le tournoi"></Button>

                <Dialog v-model:visible="visible" modal header="Modifier le tournoi" :style="{ width: '25rem' }">
                    <!-- Titre -->
                    <InputGroup class="my-4">
                        <InputGroupAddon>
                            <Quote />
                        </InputGroupAddon>
                        <FloatLabel variant="on">
                            <InputText id="on_label" v-model="tournament.title" fluid />
                            <label for="on_label">Titre du tournoi</label>
                        </FloatLabel>
                    </InputGroup>
                    <!-- Date -->
                    <InputGroup class="mb-4">
                        <InputGroupAddon>
                            <CalendarDays />
                        </InputGroupAddon>
                        <FloatLabel variant="on">
                            <DatePicker id="on_label" v-model="tournament.date" fluid iconDisplay="input" showButtonBar
                                showTime hourFormat="24">
                            </DatePicker>
                            <label for="on_label">Date</label>
                        </FloatLabel>
                    </InputGroup>
                    <div class="flex justify-end gap-2">
                        <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                        <Button type="button" label="Save" @click="saveTournament()"></Button>
                    </div>
                </Dialog>
            </div>
        </div>
    </Fieldset>

    <Fieldset legend="Participants">
        <template v-if="participants?.length">
            <NuxtLink v-for="p in participants" :key="p.id" :to="`/@${p.username}`">
                <Chip v-tooltip.bottom="'Voir le profil'" :label="p.username" :image="p.avatar_url" class="mr-1" />
            </NuxtLink>
        </template>
        <p v-else class="text-gray-500 dark:text-gray-400">Aucun participant pour le moment.</p>
    </Fieldset>

    <p v-if="loading">Chargement...</p>
    <Toast position="bottom-right" />
</template>
