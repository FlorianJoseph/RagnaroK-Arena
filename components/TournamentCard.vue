<script setup lang="ts">
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Heart, Share2, Check, Files } from 'lucide-vue-next';

const copied = ref<{ [key: number]: boolean }>({});
const favoritesStore = useFavoriteStore();
const user = useSupabaseUser();
const isFavorite = ref(false);

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

onMounted(() => {
    if (props.id) {
        checkIfFavorite(props.id);
    }
});


const op = ref();
const members = ref([
    { name: 'Amy Elsner', image: 'amyelsner.png', email: 'amy@email.com', role: 'Owner' },
    { name: 'Bernardo Dominic', image: 'bernardodominic.png', email: 'bernardo@email.com', role: 'Editor' },
    { name: 'Ioni Bowcher', image: 'ionibowcher.png', email: 'ioni@email.com', role: 'Viewer' }
]);

const toggle = (event: Event) => {
    op.value.toggle(event);
}
</script>

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
                    <div v-if="id"
                        class="flex items-center gap-2 cursor-pointer mr-4 transition-transform duration-200 ease-in-out hover:scale-110">
                        <Heart :class="{
                            'fill-red-600 text-red-600': isFavorite,
                            'hover:fill-red-600 hover:text-red-600': !isFavorite,
                        }" @click="handleFavorite(id)" />
                    </div>

                    <!-- Bouton partage -->
                    <Button type="button" label="Partager" @click="toggle">
                        <template #icon>
                            <Share2 class="w-4 h-4" />
                        </template>
                    </Button>

                    <Popover ref="op">
                        <div class="flex flex-col gap-4 w-[25rem]">
                            <div>
                                <span class="font-medium block mb-2">Share this document</span>
                                <InputGroup>
                                    <InputText value="https://primevue.org/12323ff26t2g243g423g234gg52hy25XADXAG3"
                                        readonly class="w-[25rem]"></InputText>
                                    <InputGroupAddon class="hover:cursor-pointer"
                                        @click="id !== undefined && copyLinkToClipboard(id)">
                                        <Files class="w-5 h-5 hover:text-green-600" />
                                    </InputGroupAddon>
                                </InputGroup>
                            </div>
                            <div>
                                <span class="font-medium block mb-2">Invite Member</span>
                                <InputGroup>
                                    <InputText disabled />
                                    <Button label="Invite" icon="pi pi-users"></Button>
                                </InputGroup>
                            </div>
                            <div>
                                <span class="font-medium block mb-2">Team Members</span>
                                <ul class="list-none p-0 m-0 flex flex-col gap-4">
                                    <li v-for="member in members" :key="member.name" class="flex items-center gap-2">
                                        <img :src="`https://primefaces.org/cdn/primevue/images/avatar/${member.image}`"
                                            style="width: 32px" />
                                        <div>
                                            <span class="font-medium">{{ member.name }}</span>
                                            <div class="text-sm text-surface-500 dark:text-surface-400">{{
                                                member.email }}</div>
                                        </div>
                                        <div
                                            class="flex items-center gap-2 text-surface-500 dark:text-surface-400 ml-auto text-sm">
                                            <span>{{ member.role }}</span>
                                            <i class="pi pi-angle-down"></i>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </Popover>
                </div>
            </slot>
        </div>
    </li>
</template>
