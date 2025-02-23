import { defineStore } from 'pinia';
import { useToast } from 'vue-toastification';
import { CircleX } from 'lucide-vue-next';
import type { Game } from '~/types/games';

export const useGameStore = defineStore('gameStore', () => {
    const games = ref<Game[]>([]);
    const toast = useToast();
    const supabase = useSupabaseClient();

    // Fonction pour récupérer les jeux
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

    // Fonction pour récupérer le jeu du tournoi
    async function getGame(game_id: number) {
        let game = games.value.find(g => g.id === game_id);
        if (game) return game;

        const { data, error } = await supabase
            .from('games')
            .select('*')
            .eq('id', game_id)
            .single();

        if (data) {
            games.value.push(data as Game);
            return data as Game;
        } else {
            toast.error('Jeu non trouvé', { icon: CircleX });
            return null;
        }
    }

    return {
        games,
        fetchGames,
        getGame,
    };
});