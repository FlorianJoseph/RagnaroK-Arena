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
                <!-- <a href="https://www.tiktok.com/@nordik_fr" target="_blank"
                    class="hover:text-lightPrimary dark:hover:text-darkPrimary transition">
                    <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
                        <path fill="currentColor"
                            d="M16.6 5.82s.51.5 0 0A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6c0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64c0 3.33 2.76 5.7 5.69 5.7c3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48" />
                    </svg>
                </a> -->
                <a href="https://www.youtube.com/@NordiK_FR" target="_blank"
                    class="hover:text-lightPrimary dark:hover:text-darkPrimary transition">
                    <Youtube />
                </a>
            </div>
        </footer>
    </div>
</template>
