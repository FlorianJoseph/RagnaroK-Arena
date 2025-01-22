import { defineStore } from 'pinia';
import { useToast } from 'vue-toastification';
import type { Wallet } from '~/types/wallet';

export const useWalletStore = defineStore('walletStore', () => {
    const wallet = ref<Wallet | null>(null);
    const toast = useToast();
    const supabase = useSupabaseClient();

    // Fonction pour récupérer le portefeuille
    async function fetchWallet(userId: string) {
        const { data, error } = await supabase
            .from('wallet')
            .select('*')
            .eq('user_id', userId);

        if (error) {
            toast.error('Erreur lors de la récupération du portefeuille: ' + error.message);
            return;
        }
        wallet.value = data ? (data[0] as Wallet) : null;
    }

    // Fonction pour mettre à jour le portefeuille
    async function updateWallet(walletData: Wallet) {
        const { error } = await supabase
            .from('wallet')
            .update(walletData)
            .eq('id', walletData.id);

        if (error) {
            toast.error('Erreur lors de la mise à jour du portefeuille: ' + error.message);
            return;
        }

        wallet.value = walletData;
        toast.success('Portefeuille mis à jour avec succès!');
    }

    return {
        wallet,
        fetchWallet,
        updateWallet,
    };
});
