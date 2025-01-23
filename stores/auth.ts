import { useToast } from 'vue-toastification';
import { Check, CircleX, Info } from 'lucide-vue-next';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('AuthStore', () => {
    const toast = useToast();
    const supabase = useSupabaseClient();
    const router = useRouter();
    const userStore = useUserStore();

    async function login(email: string, password: string) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });

            if (error) {
                toast.error("Erreur lors de la connexion : " + error.message, { icon: CircleX });
            } else {
                toast.success('Connexion réussie', { icon: Check });
                router.push('/');
            }
        } catch (err) {
            console.error('Erreur de connexion:', err);
        }
    };

    async function register(email: string, password: string) {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: 'http://localhost:3000/auth/connexion',
                },
            });

            if (error) {
                toast.error("Erreur lors de l'inscription : " + error.message, { icon: CircleX });
                return;
            }

            const user = data.user;
            await userStore.createUserProfile(user);
            toast.info("Utilisateur crée, veuillez vérifier votre adresse email", { icon: Info });

        } catch (err) {
            console.error('Erreur d\'inscription:', err);
        }
    }

    async function twitchAuth() {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'twitch',
                options: {
                    redirectTo: `https://rikzkugzznvcygapwgol.supabase.co/auth/v1/callback`,
                },
            });

            if (error) {
                toast.error("Erreur lors de la connexion Twitch : " + error.message, { icon: CircleX });
                return;
            }

            toast.success("Connexion avec Twitch réussie.", { icon: Check });
            router.push('/');

        } catch (err) {
            console.error('Erreur lors de la connexion Twitch:', err);
        }
    }

    async function logout() {
        await supabase.auth.signOut();
        router.push('/auth/connexion');
    }

    return {
        login,
        register,
        twitchAuth,
        logout,
    };
});
