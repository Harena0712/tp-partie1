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

      <div v-if="erreur" class="ion-padding">
        <ion-text color="danger">
          <p>{{ erreur }}</p>
        </ion-text>
        <ion-button expand="block" @click="charger">Réessayer</ion-button>
      </div>

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

      <div v-if="nombreArticles > 0">
        <ion-input v-model="table" type="number" label="Numéro de table"
                  label-placement="floating" fill="outline"
                  :class="{ 'ion-invalid ion-touched': erreurTable }"
                  :error-text="erreurTable" />
        <ion-button expand="block" class="ion-margin-top" :disabled="envoi" @click="confirmer">
          Envoyer la commande
        </ion-button>
      </div>

    </ion-content>
  </ion-page>
</template>

<script setup>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
         IonText, IonButtons, IonList, IonItem, IonIcon, 
         IonButton, IonInput, loadingController, alertController, useIonRouter, toastController} from '@ionic/vue';
import { usePanier } from '@/composables/usePanier';
import { addCircleOutline, removeCircleOutline } from 'ionicons/icons';
import { formatAriary } from '@/utils/format';
import { ref } from 'vue';
import api from '@/services/api';

const ionRouter = useIonRouter();

const { lignes, nombreArticles, changerQuantite, total, vider } = usePanier();

const table = ref(null);
const erreur = ref(null);
const erreurTable = ref(null);

async function envoyer() {
  const load = await loadingController.create({
    message: `Commande n°${table.value} envoyer`,
    duration: 15000, position: 'top', color: 'secondary',
  })

  erreur.value = null;
  
  try {
    const ligneCommande = lignes.value.map((l) => {
      return {"plat_id": l.plat.id, "quantite": l.quantite}
    });

    const panierCommande = { "table": Number(table.value), "lignes": ligneCommande};
    await api.creerCommande(panierCommande);

    vider();
    await load.present();
    
    const toast = await toastController.create({
      message: `Commande n°${table.value} envoyer`,
      duration: 1500, position: 'top', color: 'secondary',
    });
    await toast.present();
    
    table.value = null;

    ionRouter.navigate('/tabs/commandes', 'forward', 'replace') ;
  } catch (e) {
    if (e.statut === 422) {
      erreurTable.value = e.message;
    }
    else {
      erreur.value = e.message;
      console.error(e);
    }
  } finally {
    await load.dismiss();
  }
}

async function confirmer() {
  const alerte = await alertController.create({
    header: 'Confirmer la commande',
    message: `Table ${table.value} : ${formatAriary(total.value)}`,
    buttons: [
      { text: 'Annuler', role: 'cancel' },
      { text: 'Envoyer', role: 'confirm' },
    ],
  });
  await alerte.present();
  const { role } = await alerte.onDidDismiss();
  if (role === 'confirm') await envoyer();
}

</script>
