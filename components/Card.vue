<template>
    <div
        class="p-6 border rounded-lg shadow-md bg-lightBgAlt text-lightText border-lightPrimary dark:bg-darkBg dark:text-darkText dark:border-darkPrimary hover:shadow-xl transition-shadow duration-300">
        <!-- En-tête avec le nom du tournoi et une icône -->
        <div class="flex items-center justify-between mb-4">
            <h3 class="font-title text-2xl text-lightPrimary dark:text-darkPrimary">
                Tournoi : Gloire des Jarls
            </h3>
            <!-- Icône Viking -->
        </div>

        <!-- Description du tournoi -->
        <p class="text-sm text-darkBg dark:text-lightBg leading-relaxed">
            Rejoignez les plus valeureux guerriers pour un affrontement épique. Montrez votre force et votre stratégie
            pour
            conquérir la gloire !
        </p>

        <!-- Informations supplémentaires -->
        <ul class="mt-4 space-y-2 text-sm">
            <li class="flex items-center">
                <span class="font-semibold text-lightPrimary dark:text-darkPrimary">Début :</span>
                <span class="ml-2 text-darkBg dark:text-lightBg">10 janvier 2025</span>
            </li>
            <li class="flex items-center">
                <span class="font-semibold text-lightPrimary dark:text-darkPrimary">Participants :</span>
                <span class="ml-2 text-darkBg dark:text-lightBg">128 joueurs</span>
            </li>
            <li class="flex items-center">
                <span class="font-semibold text-lightPrimary dark:text-darkPrimary">Récompense :</span>
                <span class="ml-2 text-darkBg dark:text-lightBg">10,000 Or</span>
            </li>
            <li class="flex items-center">
                <span class="font-semibold text-lightPrimary dark:text-darkPrimary">Prix d'entrée :</span>
                <span class="ml-2 text-yellow-500 dark:text-yellow-400">50 Or</span>
            </li>
        </ul>
        <!-- Boutons d'action -->
        <div class="mt-6 flex justify-between">
            <button
                class="px-4 py-2 text-sm font-medium text-white bg-lightPrimary rounded-lg hover:bg-lightPrimaryHover dark:bg-darkPrimary dark:hover:bg-darkPrimaryHover">
                S'inscrire
            </button>
            <button
                class="px-4 py-2 text-sm font-medium text-lightPrimary dark:text-darkPrimary border border-lightPrimary dark:border-darkPrimary rounded-lg hover:bg-lightPrimary hover:text-white dark:hover:bg-darkPrimary dark:hover:text-white">
                Voir les résultats
            </button>
        </div>
    </div>
</template>