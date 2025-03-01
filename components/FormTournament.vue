<script setup lang="ts">
import { RewardType, FormatType } from '~/types/tournaments';
import { Ticket, Coins, Euro, CalendarDays, Gamepad2, Quote } from 'lucide-vue-next';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { useToast } from "primevue/usetoast";
import { z } from 'zod';
import type { Game } from '~/types/games';
import { ro } from 'date-fns/locale';
const userStore = useUserStore();
const tournamentStore = useTournamentStore();
const toast = useToast();
const gameStore = useGameStore();
const games = ref<Game[]>([]);
const router = useRouter();

onMounted(async () => {
  await tournamentStore.fetchTournaments();
  await userStore.getProfile();
  games.value = await gameStore.fetchGames();
});

const initialValues = ref({
  title: '',
  entry_fee: 0,
  date: new Date(),
  reward_type: RewardType.Pièces,
  reward_amount: 0,
  game_id: 1,
  format: FormatType.single_elimination,
});

const rewardOptions = [
  { label: 'Pièces', icon: Coins, value: 'Pièces' },
  { label: 'Tickets', icon: Ticket, value: 'Tickets' },
  { label: 'Euros', icon: Euro, value: 'Euros' },
];

const tournamentFormats = [
  {
    value: "single_elimination",
    title: "Élimination simple",
    description: "Un seul match perdu et c'est fini ! Un format rapide et intense.",
    image: "https://primefaces.org/cdn/primevue/images/usercard.png", // Remplace avec ton image
  },
  {
    value: "double_elimination",
    title: "Élimination double",
    description: "Deuxième chance ! Vous pouvez perdre un match et rester en compétition.",
    image: "https://primefaces.org/cdn/primevue/images/usercard.png",
  },
  {
    value: "free_for_all",
    title: "Battle Royale",
    description: "Tout le monde s'affronte, un seul survivant à la fin !",
    image: "https://primefaces.org/cdn/primevue/images/usercard.png",

  },
];

const predefinedPrices = [0, 10, 20, 50, 100];
const setPrice = (price: number) => {
  initialValues.value.entry_fee = price;
};

const resolver = zodResolver(
  z.object({
    format: z.string()
      .min(1, { message: 'Choisissez un format.' }),
    title: z.string()
      .min(1, { message: 'Le titre est requis.' }),
    entry_fee: z.number()
      .min(0, { message: 'Le prix ne peut pas être négatif.' })
      .max(1000, { message: 'Prix trop élevé.' }),
    reward_type: z.string()
      .min(1, { message: 'Choisissez un type de récompense.' }),
  })
);

async function createTournament(values: any) {
  initialValues.value = { ...values };
  await tournamentStore.createTournament(initialValues.value);

  initialValues.value = {
    title: '',
    entry_fee: 0,
    date: new Date(),
    reward_type: RewardType.Pièces,
    reward_amount: 0,
    game_id: 1,
    format: FormatType.single_elimination,
  };
}

const onFormSubmit = async ({ valid }: { valid: boolean }) => {
  if (!valid) {
    toast.add({ severity: 'error', summary: 'Remplissez les champs de création', life: 3000 });
    return;
  }
  await createTournament(initialValues.value);
  toast.add({ severity: 'success', summary: 'Tournoi créé', detail: 'Le tournoi a été créé avec succès.' });
  router.push('/tournois');
};
</script>

<template>
  <div class="card flex justify-center">
    <Form v-slot="$form" :resolver="resolver" :initialValues="initialValues" @submit="onFormSubmit"
      class="flex flex-col gap-4">
      <!-- Catégorie: Format du tournoi -->
      <div class="flex flex-col gap-2">
        <Fieldset legend="Format du tournoi">
          <RadioButtonGroup v-model="initialValues.format" name="format" class="flex flex-wrap gap-4">
            <div v-for="format in tournamentFormats" :key="format.value" class="flex items-center gap-2">
              <RadioButton :value="format.value" name="format" class="flex flex-wrap gap-4" />
              <label for="format">{{ format.title }}</label>
            </div>
          </RadioButtonGroup>
        </Fieldset>
        <Toast position="bottom-right" />
        <Message v-if="$form.format?.invalid" severity="error" size="small" variant="simple">{{
          $form.format.error?.message }}</Message>
      </div>

      <Fieldset legend="Informations générales">
        <div class="flex flex-col gap-2">
          <!-- Titre -->
          <InputGroup>
            <InputGroupAddon>
              <Quote />
            </InputGroupAddon>
            <FloatLabel variant="on">
              <InputText id="on_label" v-model="initialValues.title" fluid />
              <label for="on_label">Titre du tournoi</label>
              <Message v-if="$form.title?.invalid" severity="error" size="small" variant="simple">{{
                $form.title.error?.message }}</Message>
            </FloatLabel>
          </InputGroup>

          <!-- Jeu -->
          <InputGroup>
            <InputGroupAddon>
              <Gamepad2 />
            </InputGroupAddon>
            <FloatLabel variant="on">
              <Select v-model="initialValues.game_id" editable :options="games" optionValue="id" optionLabel="name"
                class="w-full md:w-56">
                <template #option="slotProps">
                  <div v-if="slotProps.option" class="flex items-center">
                    <img :src="slotProps.option.image_url" class="size-8 mr-2 object-cover" />
                    <div>{{ slotProps.option.name }}</div>
                  </div>
                </template>
              </Select>
              <label for="on_label">Sélectionner un jeu</label>
            </FloatLabel>
          </InputGroup>

          <!-- Date -->
          <InputGroup>
            <InputGroupAddon>
              <CalendarDays />
            </InputGroupAddon>
            <FloatLabel variant="on">
              <DatePicker id="on_label" v-model="initialValues.date" fluid iconDisplay="input" showButtonBar showTime
                hourFormat="24">
              </DatePicker>
              <label for="on_label">Date</label>
            </FloatLabel>
          </InputGroup>

        </div>
      </Fieldset>

      <!-- Récompense -->
      <Fieldset legend="Récompense">
        <div class="flex flex-col gap-4">
          <RadioButtonGroup v-model="initialValues.reward_type" name="format" class="flex flex-wrap gap-4">
            <div v-for="reward in rewardOptions" :key="reward.value" class="flex items-center gap-2">
              <RadioButton :value="reward.value" name="format" class="flex flex-wrap gap-4" />
              <label for="format">{{ reward.label }}</label>
            </div>
          </RadioButtonGroup>

          <!-- Prix d'entrée -->
          <div class="flex-1 w-full flex items-center gap-1">
            <!-- Bouton pour tournoi gratuit -->
            <Button type="button" @click="setPrice(0)" severity="secondary">
              <span>Gratuit</span>
            </Button>

            <!-- Boucle pour afficher les prix prédéfinis (sauf 0) -->
            <Button v-for="price in predefinedPrices.slice(1)" :key="price" type="button" @click="setPrice(price)"
              severity="secondary">
              <span>{{ price }}</span>
            </Button>

            <!-- Champ d'entrée pour montant personnalisé avec icône alignée -->
            <InputGroup>
              <InputNumber v-model="initialValues.entry_fee" type="number" placeholder="Prix d'entrée" />
              <Message v-if="$form.entry_fee?.invalid" severity="error" size="small" variant="simple">{{
                $form.entry_fee.error?.message }}</Message>
              <InputGroupAddon>
                <component :is="Coins" class="h-6 w-6" />
              </InputGroupAddon>
            </InputGroup>
          </div>
        </div>
      </Fieldset>

      <Button type="submit" severity="secondary" label="Valider" />
    </Form>
  </div>
</template>
