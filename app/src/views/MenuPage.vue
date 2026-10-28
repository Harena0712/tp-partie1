<template>
  <!-- ion-page : l'enveloppe obligatoire de chaque page -->
  <ion-page>
    <!-- En-tête fixe en haut de l'écran -->
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Menu du jour</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar v-model="recherche" placeholder="Rechercher un plat" :debounce="250" />
      </ion-toolbar>
      <ion-segment v-model="categorieChoisie" scrollable @ion-change="charger">
        <ion-segment-button value="toutes"><ion-label>Tout</ion-label></ion-segment-button>
        <ion-segment-button v-for="c in categories" :key="c.id" :value="String(c.id)">
          <ion-label>{{ c.nom }}</ion-label>
        </ion-segment-button>
      </ion-segment>
    </ion-header>

    <!-- Zone qui défile -->  
    <ion-content>
    <ion-refresher slot="fixed" @ion-refresh="rafraichir">
      <ion-refresher-content />
    </ion-refresher>

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

      <!-- 3. La liste des plats -->
      <ion-list v-else>
        <ion-item v-for="plat in platsFiltres" :key="plat.id">
          <ion-label>
            <h2>{{ nomPlat(plat) }}</h2>
            <p>{{ plat.description }}</p>
            <p>{{ plat.categorie.nom }}</p>
          </ion-label>
          <ion-badge v-if="!plat.disponible" color="medium">Épuisé</ion-badge>
          <ion-text slot="end" color="primary"><strong>{{ formatAriary(plat.prix) }}</strong></ion-text>
        </ion-item>
      </ion-list>
    </ion-content>

  </ion-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonSpinner, IonText, IonButton,
  IonSearchbar, IonSegment, IonSegmentButton, IonBadge, IonRefresherContent, IonRefresher,
} from '@ionic/vue';
import api from '@/services/api';
import { formatAriary } from '@/utils/format';

const plats = ref([]);
const categories = ref([]);
const chargement = ref(true);
const erreur = ref(null);

const recherche = ref('');
const categorieChoisie = ref('toutes');

function nomPlat(plat) {
  return plat.nom ?? plat.libelle ?? '';
}

async function charger() {
  chargement.value = true;
  erreur.value = null;
  try {
    const cat = categorieChoisie.value === 'toutes' ? null : categorieChoisie.value;
    plats.value = await api.getPlats(cat);
    categories.value = await api.getCategories();
  } catch (e) {
    erreur.value = "Impossible de joindre l'API. Est-elle lancée ?";
    console.error(e);
  } finally {
    chargement.value = false;
  }
}

const platsFiltres = computed(() =>
  plats.value.filter((p) =>
    nomPlat(p).toLowerCase().includes(recherche.value.toLowerCase())
  )
);

async function rafraichir(event) {
  await charger();
  event.target.complete(); // arrête l'animation
}


onMounted(charger);
</script>
