import { useToast } from 'vue-toastification';
import { Check, CircleX, Info } from 'lucide-vue-next';
import { createUserProfile } from './profile';

export const login = async (email: string, password: string) => {
    const toast = useToast();
    const supabase = useSupabaseClient();
    const router = useRouter();
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

export const register = async (email: string, password: string) => {
    const toast = useToast();
    const supabase = useSupabaseClient();

    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: 'http://localhost:3000/login',
            },
        });

        if (error) {
            toast.error("Erreur lors de l'inscription : " + error.message, { icon: CircleX });
            return;
        }

        const user = data.user;
        await createUserProfile(user);

    } catch (err) {
        console.error('Erreur d\'inscription:', err);
    }
};

export const twitchAuth = async () => {
    const toast = useToast();
    const supabase = useSupabaseClient();
    const router = useRouter();

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
};

export const logout = async () => {
    const supabase = useSupabaseClient();
    const router = useRouter();
    await supabase.auth.signOut();
    router.push('/login');
};