<script lang="ts">
export default defineComponent({
    setup() {
        const supabase = useSupabaseClient();

        const signInWithTwitch = async () => {
            await supabase.auth.signInWithOAuth({
                provider: 'twitch',
                options: {
                    redirectTo: `https://qgpfftkjoktjzylwtvbx.supabase.co/auth/v1/callback`,
                },
            });
        };

        return {
            signInWithTwitch,
        };
    },
});

</script>

<template>
    <Sidebar />
    <!-- Bouton pour se connecter avec Twitch -->
    <div class="mt-4 text-center">
        <button @click="signInWithTwitch"
            class="w-full py-2 px-4 bg-purple-600 text-white font-semibold rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400">
            Se connecter avec Twitch
        </button>
    </div>
</template>