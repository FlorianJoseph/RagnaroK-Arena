import { defineStore } from 'pinia';
import { useToast } from 'vue-toastification';
import { CircleX } from 'lucide-vue-next';
import type { Game } from '~/types/games';

export const useGameStore = defineStore('gameStore', () => {
    const games = ref<Game[]>([]);
    const toast = useToast();
    const supabase = useSupabaseClient();

    async function fetchGames() {
        const { data, error } = await supabase
            .from('games')
            .select('*');

        if (error) {
            toast.error('Erreur lors de la récupération des jeux: ' + error.message, { icon: CircleX });
            return [];
        }
        return data as Game[];
    }

    async function getGame(tournamentId: number) {
        const { data: gameData, error: tournamentError } = await supabase
            .from('tournaments')
            .select('game_id')
            .eq('id', tournamentId)
            .single();

        if (tournamentError || !gameData) {
            console.error("Erreur lors de la récupération des informations du tournoi :", tournamentError?.message);
            return null;
        }

        const game_id = gameData?.game_id;
        if (!game_id) {
            toast.error(`Le tournoi ${tournamentId} n'est associé à aucun jeu.`, { icon: CircleX });
            return null;
        }

        const { data: gameDetails, error: gameError } = await supabase
        .from('games')
        .select('*')
        .eq('id', game_id)
        .single();

        if (gameError || !gameDetails) {
            console.error("Erreur lors de la récupération des détails du jeu :", gameError?.message);
            return null;
        }

        return gameDetails;
    }

    return {
        games,
        fetchGames,
        getGame,
    };
});