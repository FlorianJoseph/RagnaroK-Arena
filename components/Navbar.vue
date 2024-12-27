<script setup lang="ts">
const supabase = useSupabaseClient();
const user = useSupabaseUser();

async function signOut() {
  const { error } = await supabase.auth.signOut()
}
</script>

<template>
     <!-- Affichage du bouton de déconnexion si l'utilisateur est connecté -->
  <div v-if="user">
    <button @click="signOut" class="btn btn-danger">Déconnexion</button>
  </div>
  <div v-if="!user">
    <router-link to='/login' class="btn btn-danger">Connexion</router-link>
  </div>
</template>