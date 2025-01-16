<script setup>
import { Moon, Sun } from 'lucide-vue-next';

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
    <!-- Bouton de bascule -->
    <button @click="toggleTheme" class="p-2 rounded hover:bg-lgray dark:hover:bg-dgray mr-1">
        <div v-if="theme === 'light'">
            <Moon />
        </div>
        <div v-else>
            <Sun />
        </div>
    </button>
</template>