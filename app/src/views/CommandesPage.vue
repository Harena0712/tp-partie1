<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Commandes</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div v-if="chargement" class="ion-text-center ion-padding">
        <ion-spinner />
      </div>

      <div v-else-if="erreur" class="ion-padding">
        <ion-text color="danger">
          <p>{{ erreur }}</p>
        </ion-text>
        <ion-button expand="block" @click="charger">Réessayer</ion-button>
      </div>

      <ion-list v-else v-for="commande in commandes" :key="commande.id">
        <ion-card>
          <ion-card-header>
              <ion-card-title>Commande n°{{ commande.id }}</ion-card-title>
              <ion-card-subtitle>
                Table n°{{ commande.table}} le {{ formatDate(commande.date) }}
                <ion-badge style="margin-left: 20%;" color="medium">{{ commande.statut }}</ion-badge>
              </ion-card-subtitle>
            </ion-card-header>

            <ion-card-content>
            <ion-list v-for="ligne in commande.lignes">
              <ion-text>{{ ligne.quantite}} x {{ ligne.nom}}</ion-text>
            </ion-list>
            <ion-text color="primary"><strong>Total: {{ formatAriary(commande.total) }}</strong></ion-text>
          </ion-card-content>
        </ion-card>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
         IonText, IonCard, IonCardHeader, IonCardTitle, IonCardContent, 
         IonCardSubtitle, onIonViewWillEnter, IonList, IonButton, IonSpinner,
         IonBadge } from '@ionic/vue';
import api from '@/services/api'; 
import { ref } from 'vue';
import { formatAriary, formatDate } from '@/utils/format';

const commandes = ref([]);
const erreur = ref(null);
const chargement = ref(true);

async function chargerCommandes() {
  erreur.value = null;
  chargement.value = true;

  try {
    commandes.value = await api.getCommandes();
    console.log(commandes.value);
  } catch (e) {
    erreur.value = "Impossible de joindre l'API. Est-elle lancée ?";
    console.error(e);
  } finally {
    chargement.value = false;
  }
} 

onIonViewWillEnter(chargerCommandes);
</script>
