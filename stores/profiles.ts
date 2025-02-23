import { defineStore } from 'pinia';
import { useToast } from 'vue-toastification';
import { CircleX, Check, Info } from 'lucide-vue-next';
import type { Profile } from '~/types/profiles';

export const useUserStore = defineStore('user', () => {
    const user = useSupabaseUser();
    const toast = useToast();
    const supabase = useSupabaseClient();
    const router = useRouter();
    const profile = ref<Profile | null>(null);

    async function createUserProfile(user: any) {
        try {
            const { data: existingProfiles, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (profileError) {
                toast.error("Erreur lors de la récupération du profil : " + profileError.message, { icon: CircleX });
                return;
            }

            if (!existingProfiles) {
                const { error: insertError } = await supabase
                    .from('profiles')
                    .insert([
                        {
                            user_id: user.id,
                            email: user.email,
                            username: user.email.split('@')[0],
                            avatar_url: 'https://rikzkugzznvcygapwgol.supabase.co/storage/v1/object/sign/avatars/default/default.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhdmF0YXJzL2RlZmF1bHQvZGVmYXVsdC5qcGciLCJpYXQiOjE3MzkxODI5MzMsImV4cCI6MjA1NDU0MjkzM30.MBDOEA5uSvMZ4DqC6cFrboE71ljPirEOcMZ0cQOBvPg',
                            created_at: new Date(),
                            updated_at: new Date(),
                        },
                    ]);

                if (insertError) {
                    toast.info("Vous possédez déjà un compte", { icon: Info });
                    router.push("/auth/connexion");
                }
            }
        } catch (err) {
            console.error("Erreur lors de la vérification du profil :", err);
        }
    }

    // Fonction pour récupérer le profil de l'utilisateur
    async function getProfile() {
        if (!user.value) return;

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.value.id)
            .single();

        if (error) {
            toast.error(`Erreur lors de la récupération du profil : ${error.message}`, { icon: CircleX });
            return;
        }

        profile.value = data;
    }

    async function fetchProfiles() {
        const { data, error } = await supabase
            .from('profiles')
            .select('username, avatar_url')

        if (error) {
            console.error("Erreur lors de la récupération de l'utilisateur :", error.message);
            return [];
        }
        return data;
    }

    // Fonction pour sauvegarder le profil
    async function updateProfile(updatedProfile: Profile) {
        if (!user.value) {
            toast.error('Vous devez être connecté pour mettre à jour votre profil.', { icon: CircleX });
            return;
        }

        const { data, error } = await supabase
            .from('profiles')
            .upsert(
                {
                    ...updatedProfile,
                    email: user.value.email,
                    user_id: user.value.id,
                    updated_at: new Date().toISOString(),
                },
                { onConflict: ['user_id'] }
            );

        error
            ? toast.error(`Erreur lors de la mise à jour : ${error.message}`, { icon: CircleX })
            : toast.success('Profil mis à jour avec succès !', { icon: Check });

    }

    async function uploadAvatar(event: Event, userId: string) {
        try {
            const target = event.target as HTMLInputElement;

            if (!target?.files?.length) {
                toast.error('Aucun fichier sélectionné.', { icon: CircleX });
                return;
            }

            const avatarFile = target.files[0];
            const fileExt = avatarFile.name.split('.').pop();
            const filePath = `avatars/${userId}.${fileExt}`;

            // Vérifier s'il y a une ancienne image
            const { data: existingFiles, error: listError } = await supabase
                .storage
                .from('avatars')
                .list('', { search: userId });

            if (listError) {
                toast.error("Erreur lors de la récupération des fichiers.", { icon: CircleX });
            }

            if (existingFiles?.length) {
                // Supprimer l'ancien fichier si un avatar existe déjà
                const oldFile = existingFiles.find(f => f.name.includes(userId));
                if (oldFile) {
                    const { error: removeError } = await supabase.storage.from('avatars').remove([oldFile.name]);
                    if (removeError) {
                        console.error("Erreur lors de la suppression de l'ancien avatar :", removeError);
                        toast.error(`Erreur lors de la suppression de l'ancien avatar : ${removeError.message}`, { icon: CircleX });
                        return;
                    }
                }
            }

            // Upload du nouveau fichier
            const { error: uploadError } = await supabase
                .storage
                .from('avatars')
                .upload(filePath, avatarFile, { upsert: true });

            if (uploadError) {
                toast.error(`Erreur lors de l'upload : ${uploadError.message}`, { icon: CircleX });
                return;
            }

            // Récupérer l'URL publique
            const { data: publicUrlData } = supabase
                .storage
                .from('avatars')
                .getPublicUrl(filePath);

            const publicUrl = publicUrlData?.publicUrl;
            if (!publicUrl) {
                toast.error("Impossible de récupérer l'URL de l'avatar.", { icon: CircleX });
                return;
            }

            // Mettre à jour l'avatar dans la base de données
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('user_id', userId);

            if (updateError) {
                console.error("Erreur de mise à jour du profil :", updateError);
                toast.error(`Erreur lors de la mise à jour : ${updateError.message}`, { icon: CircleX });
                return;
            }

            toast.success("Avatar mis à jour avec succès !", { icon: Check });
            return publicUrl;

        } catch (error) {
            console.error("Erreur inattendue :", error);
            toast.error("Une erreur inattendue est survenue.", { icon: CircleX });
        }
    }

    async function getProfileByUsername(username: string) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('username', username)
            .single()

        if (error) {
            console.error('Utilisateur non trouvé :', error.message)
            return null
        }

        return data
    }

    return {
        profile,
        createUserProfile,
        fetchProfiles,
        getProfile,
        getProfileByUsername,
        updateProfile,
        uploadAvatar,
    };
});