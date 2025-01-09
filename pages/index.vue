<script setup lang="ts">

const features = [
  {
    title: "Tournois Épiques",
    description:
      "Participez à des tournois intenses et progressez dans des arènes mythologiques pour devenir une légende.",
  },
  {
    title: "Progression Personnalisée",
    description:
      "Améliorez votre personnage avec des équipements légendaires et des compétences spéciales.",
  },
  {
    title: "Système de Clans",
    description:
      "Créez un clan, recrutez des alliés et affrontez d'autres clans dans des batailles épiques.",
  },
];

definePageMeta({
  layout: 'menu' // Utilise le layout "menu.vue"
})

</script>

<template>
  <!-- Section principale -->
  <div class="flex flex-col items-center justify-center text-center py-16 px-6">
    <h1 class="text-4xl font-extrabold text-ltextbold dark:text-dtextbold mb-4">
      Bienvenue dans RagnaröK Arena
    </h1>
    <p class="text-lg text-lightText dark:text-darkText mb-6 max-w-2xl mx-auto">
      Défiez des guerriers légendaires, progressez dans des arènes mythologiques et devenez une légende
      parmi les Vikings. Que la bataille commence !
    </p>

    <!-- Boutons de navigation -->
    <div class="flex space-x-4">
      <router-link to="/tournois" class="btn">
        Voir les tournois
      </router-link>
      <router-link to="/profil" class="btnvariant">
        Mon profil
      </router-link>
    </div>
  </div>

  <!-- Section des fonctionnalités -->
  <div class="bg-lcardbg dark:bg-dcardbg py-16">
    <div class="container mx-auto px-6 text-center">
      <h2 class="text-3xl font-bold text-ltext dark:text-dtext mb-12">Fonctionnalités</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        <div v-for="(feature, index) in features" :key="index"
          class="bg-white dark:bg-dbg p-6 rounded-lg shadow-md hover:scale-105">
          <h3 class="text-xl font-semibold text-ltextbold dark:text-dtextbold mb-4">{{ feature.title }}</h3>
          <p class="text-sm text-lightText dark:text-darkText">{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Section de présentation -->
  <div class="flex flex-col items-center justify-center py-16 px-6">
    <h2 class="text-3xl font-bold text-lightText dark:text-darkText mb-6">Rejoignez la bataille</h2>
    <p class="text-lg text-lightText dark:text-darkText mb-6 max-w-2xl mx-auto">
      L’arène de RagnaröK vous attend. Que vous soyez un novice ou un vétéran des combats, chaque bataille
      vous
      rapproche de la gloire éternelle. Serez-vous prêt à vous mesurer aux plus grands guerriers de l'histoire
      ?
    </p>
    <router-link to="/tournois" class="btn">
      Commencez maintenant
    </router-link>
  </div>
</template>
