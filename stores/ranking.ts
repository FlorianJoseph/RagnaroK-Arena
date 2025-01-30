import { defineStore } from 'pinia';

export const useRankingStore = defineStore('ranking', () => {
    const supabase = useSupabaseClient();
    const userStore = useUserStore();

    async function fetchProfiles() {
        const { data, error } = await supabase
            .from('profile')
            .select('id, username, xp, rank')
            .order('xp', { ascending: false });

        if (error) {
            console.error('Erreur lors de la récupération du classement :', error.message);
            return [];
        }
        return data;
    }

    async function updateUserXP(userId: string, xpGained: number) {
        const profile = await userStore.getProfile();
        const newXP = profile.xp + xpGained;
        let newRank = 'Novice';

        if (newXP >= 1000) newRank = 'Expert';
        else if (newXP >= 500) newRank = 'Avancé';
        else if (newXP >= 100) newRank = 'Intermédiaire';

        const { error: updateError } = await supabase
            .from('profile')
            .update({ xp: newXP, rank: newRank })
            .eq('id', userId);

        if (updateError) {
            console.error('Erreur lors de la mise à jour de l\'XP et du rang :', updateError.message);
        }
    }

    return {
        fetchProfiles,
        updateUserXP,
    };
});