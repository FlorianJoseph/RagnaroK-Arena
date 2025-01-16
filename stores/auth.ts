import { defineStore } from 'pinia';
import { useToast } from 'vue-toastification';
import { CircleX } from 'lucide-vue-next';

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null);
    const token = ref(null);
    const supabase = useSupabaseClient();
    const toast = useToast();
    const router = useRouter();

    const logout = async () => {
        try {
            const { error } = await supabase.auth.signOut();

            if (error) {
                toast.error('Erreur lors de la déconnexion : ' + error.message, { icon: CircleX });
            } else {
                user.value = null;
                token.value = null;
                toast.success('Déconnexion réussie');
                router.push('/');
            }
        } catch (err) {
            console.error('Erreur lors de la déconnexion', err);
        }
    };

    return {
        user,
        token,
        logout,
    };
});