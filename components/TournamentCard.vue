<script setup lang="ts">
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Heart, Share2, Check, Files, Users, CalendarDays } from 'lucide-vue-next';
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

const emit = defineEmits(['update-favorites']);

async function handleFavorite(tournamentId: number) {
    const userId = user.value?.id;
    if (userId) {
        if (isFavorite.value) {
            await favoritesStore.removeFavorite(userId, tournamentId);
        } else {
            await favoritesStore.addFavorite(userId, tournamentId);
        }
        isFavorite.value = !isFavorite.value;
        emit('update-favorites');
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
    <Card class="w-full overflow-hidden max-w-xl mx-auto">
        <template #header>
            <div class="relative">
                <img :src="game?.image_url" :alt="game?.name" class="w-full h-40 sm:h-52 object-cover" />

                <!-- Overlay des détails -->
                <div
                    class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 sm:p-4 flex flex-col sm:flex-row justify-between text-xs sm:text-sm">
                    <p class="text-left">Récompense : {{ reward_amount }} {{ reward_type }}</p>
                    <p class="font-semibold text-right">Prix d'entrée : {{ entry_fee }} {{ reward_type }}</p>
                </div>

                <!-- Date -->
                <Tag class="absolute top-2 right-2" severity="secondary" value="Secondary">
                    <template #icon>
                        <CalendarDays class="w-4 h-4" />
                    </template>
                    {{ formattedDate }}
                </Tag>
            </div>
        </template>

        <template #title>
            <div class="flex items-center justify-between flex-wrap">
                <div class="flex flex-col">
                    <p class="text-base font-semibold">{{ title }}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ game?.name }}</p>
                </div>

                <!-- Bouton favori -->
                <div>
                    <ButtonGroup class="w-full">
                        <Button type="button" v-tooltip.bottom="'Mettre en favori'" placeholder="Bottom"
                            severity="secondary" outlined class="text-xs sm:text-sm" v-if="id"
                            @click="handleFavorite(id)">
                            <template #icon >
                                <Heart class="w-5 h-5" :class="{
                                    'fill-red-600 text-red-600 ': isFavorite,
                                    'hover:fill-red-600 hover:text-red-600': !isFavorite,
                                }" />
                            </template>
                        </Button>

                        <!-- Bouton partage -->
                        <Button type="button" v-tooltip.bottom="'Partager le tournoi'" placeholder="Bottom"
                            severity="secondary" outlined class="text-xs sm:text-sm" @click="toggle">
                            <template #icon>
                                <Share2 class="w-5 h-5" />
                            </template>
                        </Button>
                    </ButtonGroup>

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
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </Popover>
                </div>
            </div>
        </template>

        <template #subtitle></template>
        <template #content>
            <!-- Avatars des participants -->
            <div v-if="participants && participants.length > 0" class="flex items-center gap-2">
                <p class="text-gray-600 dark:text-gray-300 text-sm">
                    {{ participants.length === 1
                        ? `${participants.length} participant`
                        : `${participants.length} participants`
                    }} :</p>
                <AvatarGroup>
                    <Avatar v-for="(participant, index) in participants.slice(0, 3)" :key="participant.id"
                        :image="participant.avatar_url" shape="circle" />
                    <Avatar v-if="participants.length > 3" :label="'+' + (participants.length - 3).toString()"
                        shape="circle" class="font-bold" />
                </AvatarGroup>
            </div>
            <p v-else class="text-gray-500 dark:text-gray-400 text-sm">Aucun participant pour le moment.</p>
        </template>
        <template #footer>
            <NuxtLink :to="`/tournois/${id}`">
                <Button label="Voir le tournoi" severity="contrast" class="w-full mt-1 text-xs sm:text-sm xl:text-lg" />
            </NuxtLink>
        </template>
    </Card>
</template>
