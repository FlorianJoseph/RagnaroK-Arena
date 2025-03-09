<script setup>
import { Moon, Sun, House, Twitch, Youtube, Search } from 'lucide-vue-next';

const useTheme = () => {
    const theme = useState('theme', () => 'light');

    const setTheme = (value) => {
        theme.value = value;
        localStorage.setItem('theme', value);
        document.documentElement.classList.toggle('dark', value === 'dark');
    };

    const toggleTheme = () => {
        setTheme(theme.value === 'dark' ? 'light' : 'dark');
    };

    onMounted(() => {
        const storedTheme = localStorage.getItem('theme') ||
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        setTheme(storedTheme);
    });

    return { theme, toggleTheme };
};

const { theme, toggleTheme } = useTheme();
</script>

<template>
    <div class="card">
        <Menubar>
            <template #start>
                <Button as="router-link" to="/" class="ml-2" severity="secondary" text>
                    <House />
                    <span>Retourner à l'accueil</span>
                </Button>
            </template>
            <template #end>
                <div class="flex gap-2">
                    <ButtonGroup>
                        <Button v-tooltip.left="'Changer le thème'" @click="toggleTheme" severity="secondary" text>
                            <div v-if="theme === 'light'">
                                <Moon />
                            </div>
                            <div v-else>
                                <Sun />
                            </div>
                        </Button>
                        <Button as="a" href="https://www.twitch.tv/nordik_saga" target="_blank" severity="secondary"
                            text>
                            <Twitch />
                        </Button>
                        <Button as="a" href="https://www.youtube.com/@NordiK_Saga" target="_blank" severity="secondary"
                            text>
                            <Youtube />
                        </Button>
                    </ButtonGroup>
                </div>
            </template>
        </Menubar>
    </div>
</template>
