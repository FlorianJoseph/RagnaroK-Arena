<script setup>
import { Moon, Sun, House } from 'lucide-vue-next';

const useTheme = () => {
    const theme = useState('theme', () => 'light');

    const toggleTheme = () => {
        theme.value = theme.value === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', theme.value);
        document.documentElement.classList.toggle('dark', theme.value === 'dark');
    };

    onMounted(() => {
        document.documentElement.classList.toggle('dark', theme.value === 'dark');
    });

    return { theme, toggleTheme };
};

const { theme, toggleTheme } = useTheme();
</script>

<template>
    <div class="card">
        <Menubar>
            <template #start>
                <p class="ml-8 text-2xl font-bold whitespace-nowrap">RagnaröK Arena</p>
            </template>
            <template #end>
                <Button v-tooltip.bottom="'Accueil'" as="router-link" to="/" class="mr-2" severity="secondary" text>
                    <House />
                </Button>
                <Button v-tooltip.bottom="'Changer le thème'" @click="toggleTheme" severity="secondary" text>
                    <div v-if="theme === 'light'">
                        <Moon />
                    </div>
                    <div v-else>
                        <Sun />
                    </div>
                </Button>
            </template>
        </Menubar>
    </div>
</template>
