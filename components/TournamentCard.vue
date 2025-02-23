<script setup lang="ts">
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Heart, Share2, Check, Files, Users } from 'lucide-vue-next';
import type { Profile } from '~/types/profiles';
import type { Participant } from '~/types/tournaments';

const copied = ref<{ [key: number]: boolean }>({});
const favoritesStore = useFavoriteStore();
const user = useSupabaseUser();
const isFavorite = ref(false);
const profiles = ref<Profile[]>([]);
const userStore = useUserStore();

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
        type: Array as PropType<Participant[]>,
        required: true,
    },
    date: [String, Date],
});

const formattedDate = computed(() => {
    if (!props.date) return 'Date inconnue'

    return format(props.date, 'dd MMM à HH:mm', { locale: fr })
})

async function checkIfFavorite(tournamentId: number) {
    const userId = user.value?.id;
    if (userId) {
        isFavorite.value = await favoritesStore.isFavorite(userId, tournamentId);
    }
}

async function handleFavorite(tournamentId: number) {
    const userId = user.value?.id
    if (userId) {
        if (isFavorite.value) {
            await favoritesStore.removeFavorite(userId, tournamentId);
        } else {
            await favoritesStore.addFavorite(userId, tournamentId);
        }
        isFavorite.value = !isFavorite.value;
    }
}

function copyLinkToClipboard(tournamentId: number) {
    navigator.clipboard.writeText(`${window.location.origin}/tournois/${tournamentId}`);
    copied.value[tournamentId] = true;
    setTimeout(() => { copied.value[tournamentId] = false; }, 3000);
}

onMounted(async () => {
    if (props.id) {
        checkIfFavorite(props.id);
    }
    profiles.value = await userStore.fetchProfiles();
});


const op = ref();
const toggle = (event: Event) => {
    op.value.toggle(event);
}
</script>

<template>
    <li class="bg-white shadow-lg rounded-lg overflow-hidden border border-lborder dark:border-dborder">

        <!-- En-tête -->
        <div class="p-5 bg-lbg dark:bg-dgray flex justify-between">
            <div class="flex items-center gap-3">
                <h2 class="text-2xl font-semibold text-ltext dark:text-dtext">{{ title }}</h2>
                <!-- <div v-if="isIndexPage && organizer" class="flex items-center gap-2">
                    <img :src="organizer.avatar_url" alt="Avatar" class="w-8 h-8 rounded-full object-cover" />
                    <NuxtLink :to="`/@${organizer.username}`" class="font-medium hover:underline">
                        {{ organizer.username }}
                    </NuxtLink>
                </div> -->
                <!-- Avatars des participants -->
                <div v-if="participants && participants.length > 0">
                    <AvatarGroup>
                        <Avatar v-for="(participant, index) in participants.slice(0, 3)" :key="participant.id"
                            :image="participant.avatar_url" shape="circle" />
                        <Avatar v-if="participants.length > 3" :label="'+' + (participants.length - 3).toString()"
                            shape="circle" class="bg-gray-500 text-white font-bold" />
                    </AvatarGroup>
                </div>

                <p class="text-ltext dark:text-dtext">
                    {{ participants.length === 1
                        ? `${participants.length} participant`
                        : `${participants.length} participants`
                    }}
                </p>
            </div>
        </div>


        <!-- Image du jeu -->
        <div v-if="game" class="relative">
            <img :src="game.image_url" :alt="game.name" class="w-full h-48 object-cover" loading="lazy" />

            <!-- Overlay des détails -->
            <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 flex justify-between">
                <p class="text-left">Récompense : {{ reward_amount }} {{ reward_type }}</p>
                <p class="font-semibold text-right">Prix d'entrée : {{ entry_fee }} {{ reward_type }}</p>
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
            </div>

            <slot name="actions">
                <div class="flex items-center gap-1">
                    <!-- Bouton favori -->
                    <Button v-if="id" type="button" @click="handleFavorite(id)">
                        <template #icon>
                            <Heart class="w-5 h-5" :class="{
                                'fill-red-600 text-red-600 ': isFavorite,
                                'hover:fill-red-600 hover:text-red-600': !isFavorite,
                            }" />
                        </template>
                    </Button>

                    <!-- Bouton partage -->
                    <Button type="button" @click="toggle">
                        <template #icon>
                            <Share2 class="w-5 h-5" />
                        </template>
                    </Button>

                    <Popover ref="op">
                        <div class="flex flex-col gap-4 w-[25rem]">
                            <div>
                                <span class="font-medium block mb-2">Partager ce tournoi</span>
                                <InputGroup>
                                    <InputText readonly class="w-[25rem]"></InputText>
                                    <InputGroupAddon class="hover:cursor-pointer"
                                        @click="id !== undefined && copyLinkToClipboard(id)">
                                        <Files class="w-5 h-5 hover:text-green-600" />
                                    </InputGroupAddon>
                                </InputGroup>
                            </div>
                            <div>
                                <span class="font-medium block mb-2">Inviter un ami</span>
                                <InputGroup>
                                    <InputText />
                                    <Button label="Inviter">
                                        <template #icon>
                                            <Users class="w-4 h-4" />
                                        </template></Button>
                                </InputGroup>
                            </div>
                            <div>
                                <span class="font-medium block mb-2">Utilisateurs</span>
                                <ul class="list-none p-0 m-0 flex flex-col gap-4">
                                    <li v-for="profil in profiles" :key="profil.username"
                                        class="flex items-center gap-2">
                                        <Avatar :image="profil.avatar_url" shape="circle" />
                                        <div>
                                            <span class="font-medium">{{ profil.username }}</span>
                                            <div class="text-sm text-surface-500 dark:text-surface-400">{{
                                                profil.email }}</div>
                                        </div>
                                        <!-- <div
                                            class="flex items-center gap-2 text-surface-500 dark:text-surface-400 ml-auto text-sm">
                                            <span>{{ member.role }}</span>
                                            <i class="pi pi-angle-down"></i>
                                        </div> -->
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </Popover>
                </div>
            </slot>
        </div>
    </li>

    <!-- <Card style="width: 25rem; overflow: hidden">
        <template #header>
            <div v-if="game" class="relative">
                <img :src="game.image_url" :alt="game.name" class="w-full h-48 object-cover" loading="lazy" /> -->

    <!-- Titre du jeu en overlay -->
    <!-- <div
                    class="absolute top-2 left-2 bg-black bg-opacity-60 text-white px-3 py-1 rounded-md text-sm font-semibold">
                    {{ game.name }}
                </div> -->

    <!-- Overlay des détails -->
    <!-- <div
                    class="absolute inset-x-0 bottom-0 bg-black bg-opacity-50 text-white p-3 flex justify-between text-sm">
                    <p>Récompense : {{ reward_amount }} {{ reward_type }}</p>
                    <p class="font-semibold">Prix d'entrée : {{ entry_fee }} {{ reward_type }}</p>
                </div> -->

    <!-- Date -->
    <!-- <div
                    class="absolute top-2 right-2 bg-white bg-opacity-90 text-black px-3 py-1 rounded-full text-xs shadow-md border">
                    {{ formattedDate }}
                </div>
            </div>
        </template>

        <template #title>{{ title }}</template>
        <template #subtitle>
            <div v-if="game" class="-mt-2">{{ game.name }}</div>
        </template> -->
    <!-- <template #content>
            <p class="m-0">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error
                repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam
                perferendis esse, cupiditate neque
                quas!
            </p>
        </template> -->
    <!-- <template #footer>
            <div class="flex gap-4 mt-1">
                <Button label="Favori" severity="secondary" outlined class="w-full" />
                <Button label="Partager" class="w-full" />
                <Button label="Voir" class="w-full" />
            </div>
        </template>
    </Card> -->
</template>
