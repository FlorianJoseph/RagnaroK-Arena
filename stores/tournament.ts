import { useToast } from 'vue-toastification';
import { CircleX, Check } from 'lucide-vue-next';
import type { Tournament, CategoryType } from '~/models/types';
import { RewardType } from '~/models/types';

export const useTournamentStore = defineStore('tournament', () => {
    const tournaments = ref<Tournament[]>([]);
    const currentTournament = ref<Tournament | null>(null);
    const toast = useToast();
    const supabase = useSupabaseClient();
    const userStore = useUserStore();
    const userParticipations = ref<Record<number, boolean>>({});

    const newTournament = ref({
        title: '',
        prix_entree: 0,
        date: '',
        reward_type: RewardType.coins,
        reward_amount: 0,
        game_id: 1,
    });

    // Fonction pour récupérer tous les tournois
    async function fetchTournaments() {
        const { data, error } = await supabase
            .from('tournament')
            .select('*');

        if (error) {
            toast.error('Erreur lors de la récupération des tournois' + error.message, { icon: CircleX });
            return;
        }
        tournaments.value = data as Tournament[];
    }

    // Fonction pour créer un nouveau tournoi
    async function createTournament(newTournamentData: typeof newTournament.value) {
        const tournamentData = {
            ...newTournament.value,
            title: newTournamentData.title,
            prix_entree: newTournamentData.prix_entree,
            date: new Date(newTournamentData.date),
            reward_type: newTournamentData.reward_type,
            reward_amount: newTournamentData.reward_amount,
            organizer_id: userStore.profile?.user_id,
            game_id: newTournamentData.game_id,
            created_at: new Date(),
            updated_at: new Date(),
        };

        const { data, error } = await supabase
            .from('tournament')
            .insert([tournamentData]);

        if (error) {
            toast.error('Erreur lors de la création du tournoi : ' + error.message, { icon: CircleX });
            return;
        }
        if (data) {
            tournaments.value.push(data[0] as Tournament);
            currentTournament.value = data[0] as Tournament;
            toast.success('Tournoi créé avec succès !', { icon: Check });
        }

        newTournament.value = {
            title: '',
            prix_entree: 0,
            date: '',
            reward_type: RewardType.coins,
            reward_amount: 0,
            game_id: 1,
        };

        await fetchTournaments();
    }

    async function updateTournament(updatedTournament: Tournament) {
        const { id, ...data } = updatedTournament;
        const { error } = await supabase
            .from('tournament')
            .update(data)
            .eq('id', id);

        if (error) {
            toast.error('Erreur lors de la mise à jour du tournoi : ' + error.message, { icon: CircleX });
            return;
        }

        const index = tournaments.value.findIndex((t) => t.id === id);
        if (index !== -1) {
            tournaments.value[index] = updatedTournament;
        }
        toast.success('Tournoi mis à jour avec succès', { icon: Check });
    }

    async function fetchUserParticipations() {
        if (!userStore.profile?.user_id) return;

        const { data, error } = await supabase
            .from('participant')
            .select('tournament_id')
            .eq('user_id', userStore.profile.user_id);

        if (error) {
            toast.error('Erreur lors de la récupération des participations : ' + error.message);
            return;
        }

        userParticipations.value = (data || []).reduce((acc, { tournament_id }) => {
            acc[tournament_id] = true;
            return acc;
        }, {} as Record<number, boolean>);
    }

    async function joinTournament(tournamentId: number) {
        if (!userStore.profile?.user_id) {
            toast.error("Vous devez être connecté pour participer !");
            return;
        }
        if (userParticipations.value[tournamentId]) {
            toast.error("Vous êtes déjà inscrit à ce tournoi !");
            return;
        }

        const participantData = {
            tournament_id: tournamentId,
            user_id: userStore.profile.user_id,
            joined_at: new Date(),
        };

        const { error } = await supabase.from('participant')
            .insert([participantData]);

        if (error) {
            toast.error('Erreur lors de l’inscription : ' + error.message);
            return;
        }

        userParticipations.value[tournamentId] = true;+
        await fetchUserParticipations();
        toast.success('Vous êtes inscrit au tournoi !');
    }

    async function leaveTournament(tournamentId: number) {
        if (!userStore.profile?.user_id) {
            toast.error("Vous devez être connecté pour vous désinscrire !");
            return;
        }

        const { error } = await supabase
            .from('participant')
            .delete()
            .eq('tournament_id', tournamentId)
            .eq('user_id', userStore.profile.user_id);

        if (error) {
            toast.error('Erreur lors de la désinscription : ' + error.message);
            return;
        }

        delete userParticipations.value[tournamentId];
        await fetchUserParticipations();
        toast.success('Vous vous êtes désinscrit du tournoi.');
    }

    return {
        tournaments,
        fetchTournaments,
        newTournament,
        createTournament,
        updateTournament,
        fetchUserParticipations,
        joinTournament,
        leaveTournament,
    };
});