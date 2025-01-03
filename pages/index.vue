<script lang="ts">

definePageMeta({
    layout: 'menu' // Utilise le layout "menu.vue"
})

</script>

<template>
    <!-- Section principale -->
    <div class="flex flex-col items-center justify-center text-center py-16 px-6">
        <h1 class="text-4xl font-extrabold text-lightText dark:text-darkText mb-4">
            Bienvenue dans RagnaröK Arena
        </h1>
        <p class="text-lg text-lightText dark:text-darkText mb-6 max-w-2xl mx-auto">
            Défiez des guerriers légendaires, progressez dans des arènes mythologiques et devenez une légende
            parmi les Vikings. Que la bataille commence !
        </p>

        <!-- Boutons de navigation -->
        <div class="flex space-x-4">
            <router-link to="/tournois"
                class="px-6 py-3 bg-lightPrimary dark:bg-darkPrimary text-lightBg dark:text-darkText rounded-md shadow-lg hover:bg-lightPrimaryHover dark:hover:bg-darkPrimaryHover transition-all">
                Voir les tournois
            </router-link>
            <router-link to="/profil"
                class="px-6 py-3 bg-lightSecondary dark:bg-darkSecondary text-lightText dark:text-darkText rounded-md shadow-lg hover:bg-lightSecondaryHover dark:hover:bg-darkSecondaryHover transition-all">
                Mon profil
            </router-link>
        </div>
    </div>

    <!-- Section des fonctionnalités -->
    <div class="bg-lightSecondary dark:bg-darkSecondary py-16">
        <div class="container mx-auto px-6 text-center">
            <h2 class="text-3xl font-bold text-lightText dark:text-darkText mb-8">Fonctionnalités</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                <!-- Fonctionnalité 1 -->
                <div class="bg-white dark:bg-stone-800 p-6 rounded-lg shadow-md hover:scale-105 transition-all">
                    <h3 class="text-xl font-semibold text-lightText dark:text-darkText mb-4">Tournois Épiques</h3>
                    <p class="text-sm text-lightText dark:text-darkText">
                        Participez à des tournois intenses et progressez dans des arènes mythologiques pour devenir
                        une légende.
                    </p>
                </div>

                <!-- Fonctionnalité 2 -->
                <div class="bg-white dark:bg-stone-800 p-6 rounded-lg shadow-md hover:scale-105 transition-all">
                    <h3 class="text-xl font-semibold text-lightText dark:text-darkText mb-4">Système de Clans</h3>
                    <p class="text-sm text-lightText dark:text-darkText">
                        Créez un clan, recrutez des alliés et affrontez d'autres clans dans des batailles épiques.
                    </p>
                </div>

                <!-- Fonctionnalité 3 -->
                <div class="bg-white dark:bg-stone-800 p-6 rounded-lg shadow-md hover:scale-105 transition-all">
                    <h3 class="text-xl font-semibold text-lightText dark:text-darkText mb-4">Progression
                        Personnalisée</h3>
                    <p class="text-sm text-lightText dark:text-darkText">
                        Améliorez votre personnage avec des équipements légendaires et des compétences spéciales.
                    </p>
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
        <router-link to="/tournois"
            class="px-8 py-4 bg-lightPrimary dark:bg-darkPrimary text-lightBg dark:text-darkText rounded-full shadow-lg hover:bg-lightPrimaryHover dark:hover:bg-darkPrimaryHover transition-all">
            Commencez maintenant
        </router-link>
    </div>
</template>
