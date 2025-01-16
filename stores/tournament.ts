import { useToast } from 'vue-toastification';
import { CircleX, Check } from 'lucide-vue-next';
import type { Tournament } from '~/models/types';

export const useTournamentStore = defineStore('tournament', () => {
    const tournaments = ref<Tournament[]>([]);
    const currentTournament = ref<Tournament | null>(null);
    const toast = useToast();
    const supabase = useSupabaseClient();

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
    async function createTournament(tournamentData: Omit<Tournament, "id">) {
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

        // Met à jour la liste localement
        const index = tournaments.value.findIndex((t) => t.id === id);
        if (index !== -1) {
            tournaments.value[index] = updatedTournament;
        }
        toast.success('Tournoi mis à jour avec succès', { icon: Check });
    }

    return {
        tournaments,
        fetchTournaments,
        createTournament,
        updateTournament,
    };
});