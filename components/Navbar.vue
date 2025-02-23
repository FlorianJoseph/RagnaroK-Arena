<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next';
const svgIcons: { [key: string]: string } = {
    House: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-house"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
    Swords: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-swords"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" x2="19" y1="19" y2="13"/><line x1="16" x2="20" y1="16" y2="20"/><line x1="19" x2="21" y1="21" y2="19"/><polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"/><line x1="5" x2="9" y1="14" y2="18"/><line x1="7" x2="4" y1="17" y2="20"/><line x1="3" x2="5" y1="19" y2="21"/></svg>',
    Trophy: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trophy"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>',
    Plus: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
    Heart: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
    List: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list"><path d="M3 12h.01"/><path d="M3 18h.01"/><path d="M3 6h.01"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M8 6h13"/></svg>',
    CircleUserRound: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-user-round"><path d="M18 20a6 6 0 0 0-12 0"/><circle cx="12" cy="10" r="4"/><circle cx="12" cy="12" r="10"/></svg>',
};
const authStore = useAuthStore();
const router = useRouter();
const user = useSupabaseUser();
const userStore = useUserStore();

async function handleLogout() {
    await authStore.logout();
}

onMounted(async () => {
    await userStore.getProfile();
});

const items = ref([
    {
        label: 'Accueil',
        icon: 'House',
        command: () => {
            router.push('/');
        }
    },
    {
        label: 'Tournois',
        icon: 'Swords',
        items: [
            {
                label: 'Liste des tournois',
                icon: 'List',
                command: () => {
                    router.push('/tournois');
                },
            },
            {
                label: 'Favoris',
                icon: 'Heart',
                command: () => {
                    router.push('/tournois/favoris');
                },
            },
            {
                label: 'Mes tournois',
                icon: 'CircleUserRound',
                command: () => {
                    router.push('/tournois/mes-tournois');
                },
            },
            {
                separator: true
            },
            {
                label: 'Créer un tournoi',
                icon: 'Plus',
                command: () => {
                    router.push('/tournois/nouveau');
                },
            }
        ]
    },
    {
        label: 'Classement',
        icon: 'Trophy',
        command: () => {
            router.push('/classement');
        }
    },
]);

const menu = ref();
const profileItems = ref([
    {
        label: 'Informations',
        icon: 'pi pi-file',
        items: [
            {
                label: 'Compte',
                icon: 'pi pi-plus',
                command: () => {
                    router.push('/informations/compte');
                },
            },
            {
                label: 'Profil',
                icon: 'pi pi-folder-open',
                command: () => {
                    router.push('/informations/profil');
                },
            },
        ]
    },
    {
        separator: true
    },
    {
        label: 'Déconnexion',
        icon: 'pi pi-share-alt',
        command: () => handleLogout()
    }
]);

const toggle = (event: Event) => {
    menu.value.toggle(event);
};

</script>

<template>
    <div class="card">
        <Menubar :model="items">
            <template #start>
                <p class="ml-8 text-2xl font-bold whitespace-nowrap">RagnaröK Arena</p>
            </template>
            <template #item="{ item, props, hasSubmenu, root }">
                <a v-ripple class="flex items-center" v-bind="props.action">
                    <span v-if="item.icon" v-html="svgIcons[item.icon as string]"></span>
                    <span>{{ item.label }}</span>
                    <span v-if="item.shortcut"
                        class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1">{{
                            item.shortcut }}</span>
                    <ChevronDown v-if="hasSubmenu" class="ml-auto w-4 h-4" />
                </a>
            </template>
            <template #end>
                <div class="flex items-center gap-2">
                    <ToggleTheme />
                    <Button v-if="user" type="button" :label="userStore.profile?.username" @click="toggle"
                        aria-haspopup="true" aria-controls="overlay_tmenu">
                        <template #icon>
                            <Avatar :image="userStore.profile?.avatar_url" shape="circle" />
                        </template>
                    </Button>
                    <TieredMenu ref="menu" id="overlay_tmenu" :model="profileItems" popup />
                </div>
            </template>
        </Menubar>
    </div>
</template>
