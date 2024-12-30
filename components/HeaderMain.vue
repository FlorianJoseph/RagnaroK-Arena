<script setup lang="ts">
// Crée une variable pour la date actuelle
const today = ref(new Date());

// Définir la prop title passée du parent
const props = defineProps({
  title: {
    type: String,
    required: true,
  }
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
        <p class="text-2xl font-bold opacity-90 m-0">{{ title }}</p>
        <p class="text-xl m-0">{{ formattedDate }}</p>
    </div>
</template>