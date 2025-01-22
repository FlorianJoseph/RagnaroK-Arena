<script setup lang="ts">
import type { Tournament } from '~/types/tournament';

// Définir les props
const props = defineProps<{
    isVisible: boolean;
    form: Tournament | null;
}>();

const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'update'): void;
}>();

function closeModal() {
    emit('close');
}

function saveTournament() {
    emit('update');
}
</script>

<template>
    <div v-if="props.isVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white w-96 p-6 rounded-lg shadow-lg">
            <h2 class="text-xl font-bold mb-4">Modifier le tournoi</h2>
            <form @submit.prevent="saveTournament" v-if="props.form">
                <div class="mb-4">
                    <label class="block font-medium">Titre</label>
                    <input v-model="props.form.title" type="text" class="w-full border rounded p-2" required />
                </div>

                <div class="mb-4">
                    <label class="block font-medium">Date</label>
                    <input v-model="props.form.date" type="datetime-local" class="w-full border rounded p-2" required />
                </div>

                <div class="mb-4">
                    <label class="block font-medium">Prix d'entrée (coins)</label>
                    <input v-model="props.form.prix_entree" type="number" class="w-full border rounded p-2" required />
                </div>

                <div class="mb-4">
                    <label class="block font-medium">Type de récompense</label>
                    <select v-model="props.form.reward_type" class="w-full border rounded p-2">
                        <option value="coins">Coins</option>
                        <option value="tickets">Tickets</option>
                        <option value="real_money">Argent réel</option>
                    </select>
                </div>

                <div class="mb-4">
                    <label class="block font-medium">Montant de la récompense</label>
                    <input v-model="props.form.reward_amount" type="number" class="w-full border rounded p-2"
                        required />
                </div>

                <div class="flex justify-end space-x-4">
                    <button type="button" @click="closeModal" class="btnvariant">Annuler</button>
                    <button type="submit" class="btn">Enregistrer</button>
                </div>
            </form>
        </div>
    </div>
</template>
