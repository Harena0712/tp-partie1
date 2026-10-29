<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Commandes</ion-title>
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/menu" text="Menu" />
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <!-- 1. Chargement en cours -->
      <div v-if="chargement" class="ion-text-center ion-padding">
        <ion-spinner />
      </div>

      <!-- 2. Erreur -->
      <div v-else-if="erreur" class="ion-padding">
        <ion-text color="danger">
          <p>{{ erreur }}</p>
        </ion-text>
        <ion-button expand="block" @click="charger">Réessayer</ion-button>
      </div>
      <div v-else>
      <ion-card>
        <ion-card-header>
            <ion-card-title>{{ nomPlat(plat) }}</ion-card-title>
            <p>{{ plat.description }}</p>
            <ion-card-subtitle>{{ plat.categorie.nom }}</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          <ion-text color="primary"><strong>{{ formatAriary(plat.prix) }}</strong></ion-text>
        </ion-card-content>
      </ion-card>

      <ion-button expand="block" :disabled="!plat.disponible"
                  @click.stop.prevent="ajouterAuPanier(plat)">
                   Ajouter au panie 
        <ion-icon slot="icon-only" :icon="addCircleOutline" />
      </ion-button>

      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { formatAriary } from '@/utils/format';
import { addCircleOutline } from 'ionicons/icons';
import api from '@/services/api';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
         IonButtons, IonBackButton, IonCard, IonCardHeader,
         IonCardTitle, IonCardContent, IonCardSubtitle, IonText,
         IonButton, IonSpinner, IonIcon  } from '@ionic/vue';

import { usePanier } from '@/composables/usePanier';
import { useIonRouter } from '@ionic/vue';

const ionRouter = useIonRouter();
const { ajouter } = usePanier();

const route = useRoute();

const plat = ref();
const chargement = ref(true);
const erreur = ref(null);

function nomPlat(plat) {
  return plat.nom ?? plat.libelle ?? '';
}

async function chargerPlat() {
  chargement.value = true;
  erreur.value = null;

  const id = route.params.id;

  try {
    plat.value = await api.getPlat(id);
  } catch (e) {
    if (e.statut === 404) {
      erreur.value = "Ce plat n'existe pas";
    }
    else {
      erreur.value = "Impossible de joindre l'API. Est-elle lancée ?";
    }
    console.error(e);
  } finally {
    chargement.value = false;
  }
}


async function ajouterAuPanier(plat) {
  ajouter(plat);
  ionRouter.back();
}

onMounted(chargerPlat)
</script>
