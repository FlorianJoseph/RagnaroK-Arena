import { useToast } from 'vue-toastification';
import { Check, CircleX, Info } from 'lucide-vue-next';

export const createUserProfile = async (user: any) => {
    const supabase = useSupabaseClient();
    const toast = useToast();
    const router = useRouter();

    try {
        const { data: existingProfiles, error: profileError } = await supabase
            .from('profile')
            .select('*')
            .eq('user_id', user.id);

        if (profileError) {
            toast.error("Erreur lors de la récupération du profil : " + profileError.message, { icon: CircleX });
            return;
        }

        if (!existingProfiles || existingProfiles.length === 0) {
            const { error: insertError } = await supabase
                .from('profile')
                .insert([
                    {
                        user_id: user.id,
                        email: user.email,
                        username: user.user_metadata.nickname || user.email.split('@')[0],
                        avatar_url: 'https://rikzkugzznvcygapwgol.supabase.co/storage/v1/object/public/avatar/default/default.jpg?t=2025-01-16T13%3A42%3A28.357Z',
                        created_at: new Date(),
                        updated_at: new Date(),
                    },
                ]);

            if (insertError) {
                toast.info("Vous possédez déjà un compte", { icon: Info });
                router.push("/login")
            }
        }
    } catch (err) {
        console.error("Erreur lors de la vérification du profil :", err);
    }
};

export const uploadAvatar = async (event: Event, userId: string) => {
    const toast = useToast();
    const supabase = useSupabaseClient();
    const target = event.target as HTMLInputElement;

    if (!target?.files?.length) {
        toast.error('Aucun fichier sélectionné.', { icon: CircleX });
        return;
    }

    const avatarFile = target.files[0];
    const fileExt = avatarFile.name.split('.').pop();
    const filePath = `avatars/${userId}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('avatar')
        .upload(filePath, avatarFile, {
            cacheControl: '3600',
            upsert: true
        });

    if (uploadError) {
        toast.error('Erreur lors du téléchargement de l\'avatar : ' + uploadError.message, { icon: CircleX });
        return;
    }

    const { data: publicUrlData } = supabase
        .storage
        .from('avatar')
        .getPublicUrl(filePath);

    const avatarUrl = publicUrlData.publicUrl;

    const { error: updateError } = await supabase
        .from('profile')
        .update({ avatar_url: avatarUrl })
        .eq('user_id', userId);

    if (updateError) {
        toast.error('Erreur lors de la mise à jour des métadonnées de l\'utilisateur ' + updateError.message, { icon: CircleX });
        return;
    }
    toast.success("Avatar modifié avec succès ", { icon: Check });

    return avatarUrl;
};