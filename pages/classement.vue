<script setup>
const profiles = ref([]);
const rankingStore = useRankingStore();

onMounted(async () => {
  profiles.value = await rankingStore.fetchProfiles();
});

</script>

<template>
    <div class="border border-2 rounded" v-if="profiles.length">
      <DataTable :value="profiles" paginator stripedRows :rows="5" :rowsPerPageOptions="[5, 10, 20]" tableStyle="min-width: 50rem">
        <Column field="username" header="Pseudo" style="width: 25%"></Column>
        <Column field="xp" header="Montant d'expérience" style="width: 25%"></Column>
        <Column field="rank" header="Rang" style="width: 25%"></Column>
      </DataTable>
    </div>
    <div v-else>
      <p>Chargement du classement...</p>
    </div>
</template>