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
    <p class="text-gray-600">Site Web :
      <a v-if="profile.website" :href="profile.website" target="_blank" class="text-blue-500 underline">
        {{ profile.website }}
      </a>
      <span v-else>Non renseigné</span>
    </p>

    <div class="mt-6">
      <p class="text-xl font-semibold">Tournois organisés :</p>

      <ul v-if="tournaments.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <TournamentCard v-for="tournament in tournaments" :key="tournament.id" :id="tournament.id"
          :title="tournament.title" :organizer="tournament.organizer" :game="tournament.games"
          :reward_amount="tournament.reward_amount" :reward_type="tournament.reward_type"
          :entry_fee="tournament.entry_fee" :participants="tournament.participants" :date="tournament.date"
          :isIndexPage="false" />
      </ul>

      <p v-else class="text-gray-500">Aucun tournoi organisé.</p>
    </div>
  </div>
</template>
