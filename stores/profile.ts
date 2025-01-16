import { defineStore } from 'pinia';
import { useToast } from 'vue-toastification';
import { CircleX, Check } from 'lucide-vue-next';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '~/models/types';

export const useUserStore = defineStore('user', () => {
    const user = ref<User | null>(null);
    const profile = ref<Profile | null>(null);
    const toast = useToast();
    const supabase = useSupabaseClient();

    // Fonction pour récupérer l'utilisateur
    async function fetchUser(): Promise<void> {
        const userData = useSupabaseUser();
        user.value = userData.value;
    }

    // Fonction pour récupérer le profil
    async function fetchProfile() {
        const currentUser = user.value;

        if (currentUser) {
            const { data, error } = await supabase
                .from('profile')
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
            .from('profile')
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

    return {
        user,
        profile,
        fetchUser,
        fetchProfile,
        updateProfile,
    };
});