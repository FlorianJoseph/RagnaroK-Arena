export const useTheme = () => {
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