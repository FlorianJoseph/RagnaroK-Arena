import { defineStore } from 'pinia';
import { useToast } from 'vue-toastification';
import { CircleX } from 'lucide-vue-next';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: null,
    }),
    actions: {
        async logout() {
            try {
                const supabase = useSupabaseClient();
                const toast = useToast();
                const router = useRouter(); // Vérifie que tu es dans un composant avec accès au contexte Vue

                const { error } = await supabase.auth.signOut();
                if (error) {
                    toast.error('Erreur lors de la déconnexion :', { icon: CircleX });
                } else {
                    this.user = null;
                    this.token = null;
                    toast.success('Déconnexion réussie');
                    router.push('/'); // Redirection vers la page d’accueil
                }
            } catch (err) {
                console.error('Erreur lors de la déconnexion', err);
            }
        },
    },
});