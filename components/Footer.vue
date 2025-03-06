<script setup lang="ts">
import { Twitch, Youtube } from 'lucide-vue-next';
</script>

<template>
    <div class="w-full bg-white border-t border-lborder dark:border-dborder dark:bg-dcardbg px-6 py-4 mt-8">
        <footer class="flex flex-col md:flex-row justify-between items-center text-sm text-darkBg dark:text-darkText">
            
            <!-- Section gauche -->
            <div>
                © {{ new Date().getFullYear() }} Ragnarök Arena. Tous droits réservés.
            </div>

            <!-- Section centrale (liens ou navigation rapide) -->
            <nav class="flex space-x-4 mt-2 md:mt-0">
                <a href="#" class="hover:text-lightPrimary dark:hover:text-darkPrimary transition">À propos</a>
                <a href="#" class="hover:text-lightPrimary dark:hover:text-darkPrimary transition">Contact</a>
                <a href="#" class="hover:text-lightPrimary dark:hover:text-darkPrimary transition">Mentions légales</a>
            </nav>

            <!-- Section droite (réseaux sociaux ou autre contenu) -->
            <div class="flex space-x-4 mt-2 md:mt-0 ">
                <a href="https://www.twitch.tv/nordik_saga" target="_blank"
                    class="hover:text-lightPrimary dark:hover:text-darkPrimary transition">
                    <Twitch />
                </a>
                <a href="https://www.youtube.com/@NordiK_FR" target="_blank"
                    class="hover:text-lightPrimary dark:hover:text-darkPrimary transition">
                    <Youtube />
                </a>
            </div>
        </footer>
    </div>
</template>
