// stores/user.ts
import { defineStore } from 'pinia';
import { useToast } from 'vue-toastification';
import { CircleX, Check } from 'lucide-vue-next';
import type { User } from '@supabase/supabase-js';

type Profile = {
    id: string;
    email: string;
    username: string | null;
    full_name: string | null;
    website: string | null;
    created_at: string;
    updated_at: string;
};

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null as User | null,
        profile: null as Profile | null,
    }),

    actions: {
        // Fonction pour récupérer l'utilisateur
        async fetchUser() {
            const user = useSupabaseUser();
            this.user = user.value;  // Utilisation de .value pour accéder à l'utilisateur
        },

        // Fonction pour récupérer le profil
        async fetchProfile() {
            const toast = useToast();
            const supabase = useSupabaseClient();
            const user = this.user;

            if (!user) {
                toast.error('Vous devez être connecté pour accéder à votre profil.', { icon: CircleX });
                return;
            }

            const { data, error } = await supabase
                .from('profile')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (error) {
                toast.error("Erreur lors de la récupération du profil : " + error.message, { icon: CircleX });
            } else if (data) {
                this.profile = {
                    id: String(data.id),
                    email: data.email,
                    username: data.username || '',
                    full_name: data.full_name || '',
                    website: data.website || '',
                    created_at: data.created_at || '',
                    updated_at: data.updated_at || '',
                };
            } else {
                toast.error('Aucun profil trouvé pour cet utilisateur.', { icon: CircleX });
            }
        },

        // Fonction pour sauvegarder le profil
        async updateProfile(updatedProfile: Profile) {
            const toast = useToast();
            const supabase = useSupabaseClient();
            const user = this.user;

            if (!user) {
                toast.error('Vous devez être connecté pour mettre à jour votre profil.', { icon: CircleX });
                return;
            }

            const { data, error } = await supabase
                .from('profile')
                .upsert(
                    {
                        user_id: user.id,
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
                // Optionnel : recharger le profil après mise à jour
                await this.fetchProfile();
            }
        },
    }
});