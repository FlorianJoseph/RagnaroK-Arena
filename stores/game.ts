import { defineStore } from 'pinia';
import { useToast } from 'vue-toastification';
import { CircleX } from 'lucide-vue-next';
import type { Game } from '~/types/game';

export const useGameStore = defineStore('gameStore', () => {
    const games = ref<Game[]>([]);
    const toast = useToast();
    const supabase = useSupabaseClient();

    // Fonction pour récupérer les jeux
    async function fetchGames() {
        const { data, error } = await supabase
            .from('game')
            .select('*');

        if (error) {
            toast.error('Erreur lors de la récupération des jeux: ' + error.message, { icon: CircleX });
            return;
        }
        games.value = data as Game[];
    }

    return {
        games,
        fetchGames,
    };
});