<template>
    <li class="bg-white shadow-lg rounded-lg overflow-hidden border border-lborder dark:border-dborder">

        <!-- Header -->
        <div class="p-5 flex items-center justify-between bg-lbg dark:bg-dgray">
            <h2 class="text-2xl font-semibold text-ltext dark:text-dtext">{{ title }}</h2>

            <!-- Organisateur -->
            <div v-if="isIndexPage && organizer" class="flex items-center gap-2">
                <img :src="organizer.avatar_url" alt="Avatar" class="w-8 h-8 rounded-full object-cover" />
                <NuxtLink :to="`/@${organizer.username}`" class="font-medium hover:underline">
                    {{ organizer.username }}
                </NuxtLink>
            </div>
        </div>

        <!-- Image du jeu -->
        <div v-if="game" class="relative">
            <img :src="game.image_url" :alt="game.name" class="w-full h-48 object-cover" loading="lazy" />

            <!-- Détails du tournoi -->
            <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 flex justify-between">
                <slot name="tournament-details">
                    <p class="text-left">Récompense : {{ reward_amount }} {{ reward_type }}</p>
                    <p class="font-semibold text-right">Prix d'entrée : {{ entry_fee }} {{ reward_type }}</p>
                </slot>
            </div>


            <!-- Date -->
            <div
                class="absolute top-2 right-2 bg-white bg-opacity-90 text-black px-3 py-1 rounded-full text-xs shadow-md border">
                <p>{{ formattedDate }}</p>
            </div>
        </div>

        <!-- Actions -->
        <div
            class="p-5 flex justify-between items-center bg-lbg dark:bg-dgray border-t border-lborder dark:border-dborder">
            <div class="flex gap-4">
                <NuxtLink :to="`/tournois/${id}`" class="hover:text-laccent">Voir le tournoi</NuxtLink>
                <p class="text-ltext dark:text-dtext">
                    {{ participants.length === 1
                        ? `${participants.length} participant`
                        : `${participants.length} participants`
                    }}
                </p>
            </div>

            <slot name="actions">
                <div class="flex items-center">

                    <!-- Bouton favori -->
                    <div
                        class="flex items-center gap-2 hover:text-red-600 cursor-pointer mr-4 transition-transform duration-200 ease-in-out hover:scale-110">
                        <Heart class="hover:text-red-600" />
                    </div>

                    <!-- Bouton partage -->
                    <div v-if="id !== undefined"
                        class="flex items-center gap-2 hover:text-green-600 cursor-pointer transition-transform duration-200 ease-in-out hover:scale-110"
                        @click="copyLinkToClipboard(id)">
                        <template v-if="copied[id]">
                            <Check class="text-green-600" />
                            <p class="text-green-600">Lien copié</p>
                        </template>
                        <template v-else>
                            <Share2 />
                        </template>
                    </div>
                </div>
            </slot>
        </div>
    </li>
</template>

<script setup lang="ts">
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Heart, Share2, Check } from 'lucide-vue-next';
const copied = ref<{ [key: number]: boolean }>({});

const props = defineProps({
    isIndexPage: {
        type: Boolean,
        required: true,
    },
    id: Number,
    title: String,
    organizer: Object,
    game: Object,
    reward_amount: Number,
    reward_type: String,
    entry_fee: Number,
    participants: {
        type: Array,
        default: () => [],
    },
    date: [String, Date],
});

const formattedDate = computed(() => {
    if (!props.date) return 'Date inconnue'

    return format(props.date, 'dd MMM à HH:mm', { locale: fr })
})


function copyLinkToClipboard(tournamentId: number) {
    navigator.clipboard.writeText(`${window.location.origin}/tournois/${tournamentId}`);
    copied.value[tournamentId] = true;
    setTimeout(() => { copied.value[tournamentId] = false; }, 3000);
}
</script>