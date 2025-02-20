<template>
    <nav class="relative bg-white dark:bg-gray-800 shadow">
      <div class="container mx-auto px-4 py-2 flex justify-between items-center">
        <router-link
          to="/informations/compte"
          class="relative text-gray-600 dark:text-gray-300 py-2 px-4 transition-colors duration-200 hover:text-blue-600"
          exact-active-class="active"
          @click="setActive('compte')"
        >
          Compte
        </router-link>
        <router-link
          to="/informations/profil"
          class="relative text-gray-600 dark:text-gray-300 py-2 px-4 transition-colors duration-200 hover:text-blue-600"
          exact-active-class="active"
          @click="setActive('profil')"
        >
          Profil
        </router-link>
  
        <div
          class="absolute bottom-0 left-0 h-1 bg-blue-600 transition-all duration-300"
          :style="activeStyle"
        ></div>
      </div>
    </nav>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useRoute } from 'vue-router';
  
  const route = useRoute();
  const activeLink = ref(route.path.includes('compte') ? 'compte' : 'profil');
  
  const setActive = (link: string) => {
    activeLink.value = link;
  };
  
  const activeStyle = computed(() => {
    const position = activeLink.value === 'compte' ? '0' : '100%';
    return {
      transform: `translateX(${position})`,
      width: '50%',
    };
  });
  </script>
  
  <style scoped>
  .active {
    font-weight: bold;
    border-bottom: 2px solid blue;
  }
  </style>
  