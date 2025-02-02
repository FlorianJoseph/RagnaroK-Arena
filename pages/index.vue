<script setup lang="ts">
const User = useSupabaseUser();
const features = [
  {
    title: "Tournois Épiques",
    description:
      "Participez à des tournois intenses et progressez dans le classement pour devenir une légende.",
  },
  {
    title: "Classement des Champions",
    description:
      "Consultez le classement des meilleurs combattants et mesurez-vous aux plus grands guerriers de l'arène.",
  },
  {
    title: "Votre Légende",
    description:
      "Personnalisez votre profil, affichez vos exploits et partagez votre lien unique avec vos alliés.",
  },
];

definePageMeta({
  layout: 'menu'
})

</script>

<template>
  <!-- Section principale -->
  <div class="grid grid-cols-12 gap-4 grid-nogutter">
    <div class="col-span-12 md:col-span-6 p-12 text-center md:text-left flex items-center ">
      <section>
        <span class="block text-6xl font-bold mb-1">Bienvenue</span>
        <div class="text-6xl font-extrabold text-ltextbold dark:text-dtextbold mb-4">dans RagnaröK Arena</div>
        <p class="mt-0 mb-1 text-lg text-lightText dark:text-darkText">Le site web le plus réactif de
          tournois de jeux vidéo.</p>
        <p class="mt-0 mb-4 text-lg text-lightText dark:text-darkText"> Nous vous aidons à gagner de
          l'argent en jouant à vos jeux vidéo préférés.</p>
        <!-- Boutons de navigation -->
        <div class="flex space-x-4">
          <NuxtLink :to="User ? '/compte/profil' : '/auth/inscription'" class="btn">
            <p>{{ User ? 'Voir le profil' : 'Créer un compte' }}</p>
          </NuxtLink>

          <NuxtLink to="/tournois" class="btnvariant">
            Voir les tournois
          </NuxtLink>
        </div>
      </section>
    </div>
    <div class="col-span-12 md:col-span-6 overflow-hidden max-h-[600px]">
      <img src="~/assets/images/index.png" alt="Image" class="w-full h-full object-cover z-index"
        style="clip-path: polygon(8% 0, 100% 0%, 100% 100%, 0 100%)" />
    </div>
  </div>

  <!-- Section des fonctionnalités -->
  <div class="bg-lcardbg dark:bg-dcardbg py-12">
    <div class="container mx-auto px-6 text-center">
      <h2 class="text-3xl font-bold text-ltext dark:text-dtext mb-12">Fonctionnalités</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        <div v-for="(feature, index) in features" :key="index"
          class="bg-white dark:bg-dbg p-6 rounded-lg shadow-md">
          <h3 class="text-xl font-semibold text-ltextbold dark:text-dtextbold mb-4">{{ feature.title }}</h3>
          <p class="text-sm text-lightText dark:text-darkText">{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Section de présentation -->
  <div class="flex flex-col justify-center items-center px-6 pt-12 md:px-12 lg:px-20">
    <div class="font-bold text-4xl mb-4">
      Rejoignez notre communauté
    </div>
    <div class="text-xl mb-8 mx-40 text-center">
      La communauté est présente pour vous soutenir, que ce soit pour l'entraide ou pour jouer ensemble !
    </div>
    <a href="https://discord.gg/uZfU7YExgD" target="_blank" class="btn">
      Rejoignez-nous maintenant
    </a>
  </div>
</template>
