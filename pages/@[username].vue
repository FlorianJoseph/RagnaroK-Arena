<script setup>

const route = useRoute()
const userStore = useUserStore()
const tournamentStore = useTournamentStore()
const profile = ref(null)
const tournaments = ref([])
const username = route.params.username

onMounted(async () => {
  profile.value = await userStore.getProfileByUsername(username)

  if (profile.value) {
    tournaments.value = await tournamentStore.getTournamentsByOrganizer(profile.value.user_id)
  }
})
</script>

<template>
  <div v-if="profile" class="container mx-auto p-6">
    <h1 class="text-3xl font-bold">{{ profile.username }}</h1>
    <p class="text-gray-600">Nom complet : {{ profile.full_name || 'Non renseigné' }}</p>
    <p class="text-gray-600">Email : {{ profile.email }}</p>
    <p class="text-gray-600">Site Web :
      <a v-if="profile.website" :href="profile.website" target="_blank" class="text-blue-500 underline">
        {{ profile.website }}
      </a>
      <span v-else>Non renseigné</span>
    </p>

    <div class="mt-6">
      <p class="text-xl font-semibold">Tournois organisés :</p>
      <ul v-if="tournaments.length">
        <li v-for="tournament in tournaments" :key="tournament.id">
          <NuxtLink :to="`/tournois/${tournament.id}`" class="text-blue-500 hover:underline">
            {{ tournament.title }}
          </NuxtLink>
        </li>
      </ul>
      <p v-else class="text-gray-500">Aucun tournoi organisé.</p>
    </div>
  </div>

  <div v-else class="text-center">
    <p class="text-red-500">Utilisateur introuvable.</p>
  </div>
</template>