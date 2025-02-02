<script setup>
const profiles = ref([]);
const rankingStore = useRankingStore();

onMounted(async () => {
  profiles.value = await rankingStore.fetchProfiles();
});

</script>

<template>
  <div class="container mx-auto p-6">
    <div v-if="profiles.length">
      <ul>
        <li v-for="profile in profiles" :key="profile.id" class="border-b py-2">
          <NuxtLink :to="`/@${profile.username}`">
            <p><strong class="hover:underline">{{ profile.username }}</strong> - XP : {{ profile.xp }} - Rang : {{
              profile.rank }}</p>
          </NuxtLink>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>Chargement du classement...</p>
    </div>
  </div>
</template>