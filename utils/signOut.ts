import { useToast } from 'vue-toastification';
import { CircleX } from 'lucide-vue-next';

const signOut = async () => {
    const supabase = useSupabaseClient();
    const router = useRouter();
    const toast = useToast();

    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Erreur lors de la déconnexion :', error);
        toast.error('Erreur lors de la déconnexion :', { icon: CircleX });
    } else {
        router.push('/');
    }
}

export default signOut;