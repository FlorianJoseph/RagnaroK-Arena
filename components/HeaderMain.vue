<script setup lang="ts">
const today = ref(new Date());
const route = useRoute();
let intervalId: number | null = null;

const pathAfterSlash = computed(() => {
    const path = route.path.split('/')[1];
    return path.charAt(0).toUpperCase() + path.slice(1);
});

const formattedDate = computed(() =>
    today.value
        .toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
        .replace(/^\w/, (c) => c.toUpperCase())
    + " - " + today.value.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
);

onMounted(() => {
    intervalId = window.setInterval(() => {
        today.value = new Date();
    }, 1000);
});

onUnmounted(() => {
    if (intervalId !== null) {
        clearInterval(intervalId);
    }
});
</script>

<template>
    <div class="flex justify-between items-center mb-6">
        <p class="text-2xl font-bold opacity-90 m-0 text-lightPrimary dark:text-darkPrimary">{{ pathAfterSlash }}</p>
        <p class="text-xl m-0">{{ formattedDate }}</p>
    </div>
</template>