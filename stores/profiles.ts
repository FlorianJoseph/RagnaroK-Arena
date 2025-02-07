import { defineStore } from 'pinia';
import { useToast } from 'vue-toastification';
import { CircleX, Check, Info } from 'lucide-vue-next';
import type { Profile } from '~/types/profiles';

export const useUserStore = defineStore('user', () => {
    const user = useSupabaseUser();
    const profile = ref<Profile | null>(null);
    const toast = useToast();
    const supabase = useSupabaseClient();
    const router = useRouter();

    async function createUserProfile(user: any) {
        try {
            const { data: existingProfiles, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', user.id);

            if (profileError) {
                toast.error("Erreur lors de la récupération du profil : " + profileError.message, { icon: CircleX });
                return;
            }

            if (!existingProfiles || existingProfiles.length === 0) {
                const { error: insertError } = await supabase
                    .from('profiles')
                    .insert([
                        {
                            user_id: user.id,
                            email: user.email,
                            username: user.email.split('@')[0],
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
    }

    // Fonction pour récupérer le profil de l'utilisateur
    async function getProfile() {
        const currentUser = user.value;

        if (currentUser) {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', currentUser.id)
                .single();

            if (error) {
                toast.error("Erreur lors de la récupération du profil : " + error.message, { icon: CircleX });
            } else if (data) {
                const profileData = data as Profile;
                profile.value = {
                    id: profileData.id,
                    user_id: profileData.user_id,
                    email: profileData.email,
                    username: profileData.username || '',
                    full_name: profileData.full_name || '',
                    website: profileData.website || '',
                    xp: profileData.xp || 0,
                    rank: profileData.rank || '',
                    avatar_url: profileData.avatar_url || '',
                    created_at: profileData.created_at || '',
                    updated_at: profileData.updated_at || '',
                    wallet: profileData.wallet || [],
                    participant: profileData.participant || [],
                    members: profileData.members || [],
                    tournament: profileData.tournament || [],
                };
            }
        }
    }

    // Fonction pour sauvegarder le profil
    async function updateProfile(updatedProfile: Profile) {
        const currentUser = user.value;

        if (!currentUser) {
            toast.error('Vous devez être connecté pour mettre à jour votre profil.', { icon: CircleX });
            return;
        }

        const { data, error } = await supabase
            .from('profiles')
            .upsert(
                {
                    user_id: currentUser.id,
                    email: updatedProfile.email,
                    username: updatedProfile.username,
                    full_name: updatedProfile.full_name,
                    website: updatedProfile.website,
                    updated_at: new Date().toISOString(),  // Mise à jour du champ 'updated_at'
                },
                { onConflict: ['user_id'] }
            );

        if (error) {
            toast.error('Erreur lors de la mise à jour : ' + error.message, { icon: CircleX });
        } else {
            toast.success('Profil mis à jour avec succès !', { icon: Check });
        }
    }

    async function uploadAvatar(event: Event, userId: string) {
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
            .from('avatars')
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
            .from('avatars')
            .getPublicUrl(filePath);

        const avatarUrl = publicUrlData.publicUrl;

        const { error: updateError } = await supabase
            .from('profiles')
            .update({ avatar_url: avatarUrl })
            .eq('user_id', userId);

        if (updateError) {
            toast.error('Erreur lors de la mise à jour des métadonnées de l\'utilisateur ' + updateError.message, { icon: CircleX });
            return;
        }
        toast.success("Avatar modifié avec succès ", { icon: Check });

        return avatarUrl;
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
        createUserProfile,
        profile,
        getProfile,
        updateProfile,
        uploadAvatar,
        getProfileByUsername,
    };
});