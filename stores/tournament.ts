import { useToast } from 'vue-toastification';
import { CircleX, Check } from 'lucide-vue-next';
import type { Tournament, NewTournament } from '~/models/types';

export const useTournamentStore = defineStore('tournament', () => {
    const tournaments = ref<Tournament[]>([]);
    const toast = useToast();
    const supabase = useSupabaseClient();
    const userStore = useUserStore();
    const userParticipations = ref<Record<number, boolean>>({});

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
    async function createTournament(newTournamentData: NewTournament) {
        const tournamentInsertData = {
            ...newTournamentData,
            organizer_id: userStore.profile?.user_id,
            updated_at: new Date(),
        };

        const { data, error } = await supabase
            .from('tournament')
            .insert([tournamentInsertData]);

        if (error) {
            toast.error('Erreur lors de la création du tournoi : ' + error.message, { icon: CircleX });
            return;
        }

        else {
            await fetchTournaments();
            toast.success('Tournoi créé avec succès !', { icon: Check });
        }
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

    async function deleteTournament(tournamentId: number) {
        const { data, error } = await supabase
            .from('tournament')
            .delete()
            .eq('id', tournamentId);

        if (error) {
            toast.error('Erreur lors de la suppression du tournoi : ' + error.message, { icon: CircleX });
            return;
        }

        if (data) {
            tournaments.value = tournaments.value.filter(tournament => tournament.id !== tournamentId);
            toast.success('Tournoi supprimé avec succès !', { icon: Check });
        }
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

        userParticipations.value[tournamentId] = true;
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
        createTournament,
        updateTournament,
        deleteTournament,
        fetchUserParticipations,
        joinTournament,
        leaveTournament,
    };
});