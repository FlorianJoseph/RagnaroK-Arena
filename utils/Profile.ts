import { useToast } from 'vue-toastification';
import { CircleX, Check } from 'lucide-vue-next';

// Définir le type du profil
type Profile = {
    id: string;
    email: string;
    username: string | null;
    full_name: string | null;
    website: string | null;
    created_at: string;
    updated_at: string;
};

// Fonction pour récupérer le profil
const getProfile = async (profile: Ref<Profile>) => {
    const supabase = useSupabaseClient();
    const user = useSupabaseUser();
    const toast = useToast();

    // Vérifier si l'utilisateur est authentifié
    if (!user.value) {
        toast.error('Vous devez être connecté pour accéder à votre profil.', { icon: CircleX });
        return;
    }

    // Récupérer le profil authentifié
    const { data, error } = await supabase
        .from('profile')
        .select('*')
        .eq('user_id', user.value.id)
        .single();

    if (error) {
        toast.error("Erreur lors de la récupération du profil : " + error.message, { icon: CircleX });
    } else if (data) {
        // Mettre à jour le profil avec les données récupérées
        profile.value = {
            id: String(data.id),
            email: data.email,
            username: data.username || '',
            full_name: data.full_name || '',
            website: data.website || '',
            created_at: data.created_at,
            updated_at: data.updated_at,
        };
    } else {
        toast.error('Aucun profil trouvé pour cet utilisateur.', { icon: CircleX });
    }
}

// Fonction pour sauvegarder le profil
const saveProfile = async (profile: Ref<Profile>) => {
    const supabase = useSupabaseClient();
    const user = useSupabaseUser();
    const toast = useToast();

    if (!user.value) {
        toast.error('Vous devez être connecté pour mettre à jour votre profil.', { icon: CircleX });
        return;
    }

    const { data, error } = await supabase
        .from('profile')
        .upsert(
            {
                user_id: user.value.id,
                email: profile.value.email,
                username: profile.value.username,
                full_name: profile.value.full_name,
                website: profile.value.website,
                updated_at: new Date().toISOString(),  // Mise à jour du champ 'updated_at'
            },
            { onConflict: ['user_id'] })

    if (error) {
        toast.error('Erreur lors de la mise à jour :' + error.message, { icon: CircleX });
    } else {
        toast.success('Profil mis à jour avec succès !', { icon: Check });
        // Optionnel : recharger le profil après mise à jour
        await getProfile(profile);
    }
}

// Export groupé des fonctions
export { getProfile, saveProfile };