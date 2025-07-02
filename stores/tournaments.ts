import { defineStore } from 'pinia';
import { useToast } from 'vue-toastification';
import { CircleX, Check } from 'lucide-vue-next';
import type { Tournament, NewTournament, Participant, Match, Bracket } from '~/types/tournaments';
import type { Organizer } from '~/types/tournaments';
import type { Game } from '~/types/games';

export const useTournamentStore = defineStore('tournament', () => {
    const tournaments = ref<Tournament[]>([]);
    const toast = useToast();
    const supabase = useSupabaseClient();
    const userStore = useUserStore();
    const participationStore = useParticipationStore();
    const gameStore = useGameStore();

    // Récupérer tous les tournois
    async function fetchTournaments() {
        const { data, error } = await supabase
            .from('tournaments')
            .select('*')
            .order('date', { ascending: true });

        if (error) {
            toast.error('Erreur lors de la récupération des tournois' + error.message, { icon: CircleX });
            return;
        }

        for (let tournament of data) {
            const organizer = await getOrganizer(tournament.id);
            const participants = await participationStore.getParticipants(tournament.id);
            const games = await gameStore.getGame(tournament.id);
            tournament.organizer = organizer;
            tournament.participants = participants;
            tournament.games = games;
        }

        tournaments.value = data as Tournament[];
    }

    // Afficher un tournoi
    async function getTournament(id: number): Promise<{ tournament: Tournament, organizer: Organizer, participants: Participant[], game: Game | null }> {
        let tournament = tournaments.value.find(t => t.id === id);
        let organizer: Organizer | null = null;
        let participants: Participant[] = [];
        let game: Game | null = null;

        if (!tournament) {
            const { data, error } = await supabase
                .from('tournaments')
                .select(`*`)
                .eq('id', id)
                .single();

            if (error) {
                toast.error("Erreur lors de la récupération du tournoi :" + error.message, { icon: CircleX });
                throw new Error(error.message);
            }

            if (data) {
                tournaments.value.push(data);
                tournament = data;
                organizer = await getOrganizer(tournament.id);
                participants = await participationStore.getParticipants(tournament.id);
                game = await gameStore.getGame(tournament.id);
            }
        } else {
            organizer = await getOrganizer(tournament.id);
            participants = await participationStore.getParticipants(tournament.id);
            game = await gameStore.getGame(tournament.id);
        }

        if (!tournament) {
            throw new Error(`Le tournoi numéro ${id} non trouvé`);
        }

        if (!organizer) {
            throw new Error(`L'organisateur du tournoi numéro ${id} non trouvé`);
        }
        if (!game) {
            throw new Error(`Le jeu du tournoi ${id} n'a pas pu être récupéré.`);
        }
        return { tournament, organizer, participants, game };
    }

    // Récupérer un organisateur
    async function getOrganizer(tournamentId: number) {
        const { data: tournamentData, error: tournamentError } = await supabase
            .from('tournaments')
            .select('organizer_id')
            .eq('id', tournamentId)
            .single();

        if (tournamentError) {
            console.error("Erreur lors de la récupération des informations du tournoi :", tournamentError.message);
            return null;
        }

        const { data: organizerData, error: organizerError } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', tournamentData.organizer_id)
            .single();

        if (organizerError) {
            console.error("Erreur lors de la récupération de l'organisateur :", organizerError.message);
            return null;
        }

        return organizerData;
    }

    // Créer un nouveau tournoi
    async function createTournament(newTournamentData: NewTournament) {
        const tournamentInsertData = {
            ...newTournamentData,
            organizer_id: userStore.profile?.user_id,
            updated_at: new Date(),
        };

        const { data, error } = await supabase
            .from('tournaments')
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

    // Mettre à jour le tournoi
    async function updateTournament(updatedTournament: Tournament) {
        const { participants, organizer, ...data } = updatedTournament;
        const { error } = await supabase
            .from('tournaments')
            .update(data)
            .eq('id', updatedTournament.id);

        if (error) {
            toast.error('Erreur lors de la mise à jour du tournoi : ' + error.message, { icon: CircleX });
            return;
        }

        const index = tournaments.value.findIndex((t) => t.id === updatedTournament.id);
        if (index !== -1) {
            tournaments.value[index] = updatedTournament;
        }
    }

    // Supprimer tournoi
    async function deleteTournament(tournamentId: number) {
        const { data, error } = await supabase
            .from('tournaments')
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

    async function getTournamentsByOrganizer(user_id: string) {
        const { data, error } = await supabase
            .from('tournaments')
            .select('*')
            .eq('organizer_id', user_id)
            .order('date', { ascending: true })

        if (error) {
            console.error('Erreur lors de la récupération des tournois :', error.message)
            return []
        }

        const tournamentsWithDetails = await Promise.all(
            data.map(async (tournament) => {
                try {
                    const [organizer, participants, games] = await Promise.all([
                        getOrganizer(tournament.id),
                        participationStore.getParticipants(tournament.id),
                        gameStore.getGame(tournament.id)
                    ]);

                    tournament.organizer = organizer;
                    tournament.participants = participants;
                    tournament.games = games;
                } catch (err) {
                    console.error('Erreur lors de la récupération des détails du tournoi:', err);
                }
                return tournament;
            })
        );

        return tournamentsWithDetails;
    }

    return {
        tournaments,
        fetchTournaments,
        getTournament,
        createTournament,
        updateTournament,
        deleteTournament,
        getTournamentsByOrganizer,
        getOrganizer,
    };
});

export const useFavoriteStore = defineStore('favorites', () => {
    const supabase = useSupabaseClient();
    const participationStore = useParticipationStore();
    const tournamentStore = useTournamentStore();
    const gameStore = useGameStore();

    // Ajouter un tournoi aux favoris
    async function addFavorite(user_id: string, tournament_id: number) {
        const { error } = await supabase
            .from('favorites')
            .insert([{ user_id, tournament_id }]);

        if (error) {
            console.error('Erreur lors de l\'ajout aux favoris:', error.message);
            return;
        }
    }

    // Récupérer les tournois favoris
    async function fetchFavorites(user_id: string) {
        const { data, error } = await supabase
            .from('favorites')
            .select('tournament_id')
            .eq('user_id', user_id);

        if (error) {
            console.error('Erreur lors de la récupération des favoris:', error.message);
            return [];
        }

        const tournamentIds = data.map(fav => fav.tournament_id);

        // Récupérer les détails des tournois favoris
        const { data: tournaments, error: tournamentsError } = await supabase
            .from('tournaments')
            .select('*')
            .in('id', tournamentIds);

        if (tournamentsError) {
            console.error('Erreur lors de la récupération des tournois:', tournamentsError.message);
            return [];
        }

        const tournamentsWithDetails = await Promise.all(
            tournaments.map(async (tournament) => {
                try {
                    const [organizer, participants, games] = await Promise.all([
                        tournamentStore.getOrganizer(tournament.id),
                        participationStore.getParticipants(tournament.id),
                        gameStore.getGame(tournament.id)
                    ]);

                    tournament.organizer = organizer;
                    tournament.participants = participants;
                    tournament.games = games;
                } catch (err) {
                    console.error('Erreur lors de la récupération des détails du tournoi:', err);
                }
                return tournament;
            })
        );

        return tournamentsWithDetails;
    }

    // Supprimer un tournoi des favoris
    async function removeFavorite(user_id: string, tournament_id: number) {
        const { error } = await supabase
            .from('favorites')
            .delete()
            .eq('user_id', user_id)
            .eq('tournament_id', tournament_id);

        if (error) {
            console.error('Erreur lors de la suppression du favori:', error.message);
            return;
        }

        console.log('Tournoi supprimé des favoris');
    }

    async function isFavorite(user_id: string, tournament_id: number) {
        const { data, error } = await supabase
            .from('favorites')
            .select('tournament_id')
            .eq('user_id', user_id)
            .eq('tournament_id', tournament_id);

        if (error) {
            console.error('Erreur lors de la vérification du favori:', error.message);
            return false;
        }

        return data.length > 0;
    }

    return {
        addFavorite,
        fetchFavorites,
        removeFavorite,
        isFavorite,
    };
});

export const useParticipationStore = defineStore('participation', () => {
    const toast = useToast();
    const supabase = useSupabaseClient();
    const userStore = useUserStore();

    // Récupérer les participants
    async function getParticipants(tournamentId: number) {
        const { data: participantData, error: participantError } = await supabase
            .from('participants')
            .select('user_id')
            .eq('tournament_id', tournamentId);

        if (participantError) {
            console.error("Erreur lors de la récupération des participants :", participantError.message)
            return [];
        }

        const participantIds = participantData.map(p => p.user_id);
        const { data: usersData, error: usersError } = await supabase
            .from('profiles')
            .select('*')
            .in('user_id', participantIds);

        if (usersError) {
            console.error("Erreur lors de la récupération des profils des participants :", usersError.message);
            return [];
        }

        return usersData || [];
    }

    // Rejoindre un tournoi
    async function joinTournament(tournamentId: number) {
        if (!userStore.profile?.user_id) {
            toast.error("Vous devez être connecté pour participer !");
            return;
        }

        const participantData = {
            tournament_id: tournamentId,
            user_id: userStore.profile.user_id,
            joined_at: new Date(),
        };

        const { error } = await supabase
            .from('participants')
            .insert([participantData]);

        if (error) {
            toast.error('Erreur lors de l’inscription : ' + error.message);
            return;
        }
        toast.success('Vous êtes inscrit au tournoi !');

    }

    // Quitter un tournoi
    async function leaveTournament(tournamentId: number) {
        if (!userStore.profile?.user_id) {
            toast.error("Vous devez être connecté pour vous désinscrire !");
            return;
        }

        const { error } = await supabase
            .from('participants')
            .delete()
            .eq('tournament_id', tournamentId)
            .eq('user_id', userStore.profile.user_id);

        if (error) {
            toast.error('Erreur lors de la désinscription : ' + error.message);
        }
        toast.success('Vous vous êtes désinscrit du tournoi.');
    }

    return {
        getParticipants,
        joinTournament,
        leaveTournament,
    };
});

export const useBracketStore = defineStore('brackets', () => {
    const supabase = useSupabaseClient();
    const participationStore = useParticipationStore();
    const userStore = useUserStore();

    // Fonction pour mélanger aléatoirement un tableau (algorithme de Fisher-Yates)
    function shuffleArray<T>(array: T[]): T[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Fonction pour créer un bracket en fonction du nombre de participants
    async function createBracket(participants: Participant[], tournamentId: number): Promise<Bracket[]> {
        const numRounds = Math.ceil(Math.log2(participants.length));
        const rounds: Bracket[] = [];
        let remainingParticipants = shuffleArray([...participants]);

        // Vérifier si des brackets existent déjà pour ce tournoi
        const { data: existingBrackets, error: existingBracketsError } = await supabase
            .from('brackets')
            .select('id')
            .eq('tournament_id', tournamentId);

        if (existingBracketsError) {
            throw new Error('Erreur lors de la vérification des brackets existants.');
        }

        if (existingBrackets && existingBrackets.length > 0) {
            return existingBrackets as Bracket[];
        }

        // Créer les rounds
        let round = 1;

        while (remainingParticipants.length > 1) {
            const roundMatches: Match[] = [];
            const nextRoundParticipants: Participant[] = [];

            for (let i = 0; i < remainingParticipants.length; i += 2) {
                const player1 = remainingParticipants[i];
                const player2 = remainingParticipants[i + 1] || null;

                const [profile1, profile2] = await Promise.all([
                    userStore.getProfileByUserId(player1.user_id),
                    player2 ? userStore.getProfileByUserId(player2.user_id) : Promise.resolve(null),
                ]);

                if (!player2) {
                // Le joueur passe automatiquement au prochain tour
                    remainingParticipants.push(player1);
                    continue;
                }

                const match: Match = {
                    player1: profile1 || undefined,
                    player2: profile2 || undefined,
                    round,
                    index: i / 2 + 1,
                    winner_id: null, 
                };

                roundMatches.push(match);
            }

            rounds.push({
                tournament_id: tournamentId,
                matches: roundMatches,
                is_losers_bracket: false,
            });

            // Met à jour les participants pour le round suivant
            remainingParticipants = nextRoundParticipants;
            round++;
        }

        if (remainingParticipants.length === 1) {
            const winner = remainingParticipants[0];
            console.log(`Vainqueur du tournoi : ${winner.username}`);
            // Tu peux stocker ce vainqueur dans un état global ou l'enregistrer dans la base
        }

        try {
            const { data, error } = await supabase
                .from('brackets')
                .insert(rounds)

            if (error) throw new Error(error.message);

            return data || [];

        } catch (error: any) {
            console.error('Erreur lors de la création des brackets:', error.message);
            throw new Error('Erreur lors de la création des brackets.');
        }
    }

    // Fonction pour charger les brackets
    async function getBrackets(tournamentId: number) {
        try {
            const { data, error } = await supabase
                .from('brackets')
                .select('*')
                .eq('tournament_id', tournamentId)

            if (error) throw new Error(error.message);
            return data;

        } catch (error) {
            console.error('Erreur lors de la récupération des brackets:', error.message);
        }
    }

    async function setWinner(match: Match, winnerId: string) {
        try {
            const { data, error } = await supabase
                .from('matches')
                .update({ winner_id: winnerId })
                .eq('id', match.id)
                .select();

            if (error) throw new Error(error.message);

            if (data && data.length > 0) {
                const updatedMatch = data[0];
                match.winner_id = updatedMatch.winner_id; // Mise à jour du match localement avec le winner_id

                // Log ou notification pour confirmer la mise à jour
                console.log(`Gagnant mis à jour pour le match ID: ${match.id} avec winner_id: ${updatedMatch.winner_id}`);

                // Retourner éventuellement les données mises à jour (si tu veux les utiliser ailleurs)
                return updatedMatch;
            } else {
                throw new Error('Match non trouvé ou mise à jour échouée');
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour du gagnant:', error.message);
        }
    }

    return {
        createBracket,
        getBrackets,
        setWinner,
    };
});