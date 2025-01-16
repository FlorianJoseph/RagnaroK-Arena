<script setup lang="ts">
// Crée une variable pour la date actuelle
const today = ref(new Date());
const route = useRoute();

const pathAfterSlash = computed(() => {
    const path = route.path.split('/')[1]; // Récupère la première partie après '/'
    // Met la première lettre en majuscule et concatène avec le reste de la chaîne
    return path.charAt(0).toUpperCase() + path.slice(1);
});

// Formatage de la date
const formattedDate = ref(
    today.value
        .toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
        .replace(/^\w/, (c) => c.toUpperCase()) // Met la première lettre du mois en majuscule
    + " - " + today.value.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
);

</script>

<template>
    <div class="flex justify-between items-center mb-6">
        <p class="text-2xl font-bold opacity-90 m-0 text-lightPrimary dark:text-darkPrimary">{{ pathAfterSlash }}</p>
        <p class="text-xl m-0">{{ formattedDate }}</p>
    </div>
</template>