<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Panier</ion-title>

        <ion-buttons slot="end">
          <ion-button slot="end" fill="clear"
            @click.stop.prevent="vider()">
            Vider
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div v-if="nombreArticles == 0">
        <p class="ion-text-center">
          <ion-text color="medium">Votre panier est encore vide</ion-text>
        </p>
        <ion-button expand="block" router-link="/tabs/menu">Voir le menu </ion-button>
      </div>

      <ion-list v-else>
        <ion-item v-for="ligne in lignes">
          <h5>
            {{ ligne.plat.nom }} 
            
            {{ formatAriary(ligne.plat.prix) }} x {{ ligne.quantite }}
          
            <ion-button slot="end" fill="clear"
              @click.stop.prevent="changerQuantite(ligne.plat.id, 1)">
              <ion-icon slot="icon-only" :icon="addCircleOutline" />
            </ion-button>

            <ion-button slot="end" fill="clear"
              @click.stop.prevent="changerQuantite(ligne.plat.id, -1)">
              <ion-icon slot="icon-only" :icon="removeCircleOutline" />
            </ion-button>
          </h5>
        </ion-item>
        <p>{{ formatAriary(total) }}</p>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
         IonText, IonButtons, IonList, IonItem, IonIcon, IonButton } from '@ionic/vue';
import { usePanier } from '@/composables/usePanier';
import { addCircleOutline, removeCircleOutline } from 'ionicons/icons';
import { formatAriary } from '@/utils/format';


const { lignes, nombreArticles, changerQuantite, total, vider } = usePanier();
</script>
