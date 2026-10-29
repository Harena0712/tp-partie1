import { ref, computed } from 'vue';
import { toastController } from '@ionic/vue';

// Déclaré EN DEHORS de la fonction : un seul panier pour toute l'application
const lignes = ref([]); // chaque ligne : { plat, quantite }

export function usePanier() {
  async function ajouter(plat) {
    const platLigne = lignes.value.find((l) => l.plat.id === plat.id);
    if (platLigne) {
      platLigne.quantite++;
    } else {
      lignes.value.push({ plat, quantite: 1 });
    }

  const toast = await toastController.create({
    message: `${plat.nom} ajouté au panier`,
    duration: 1500, position: 'top', color: 'secondary',
  });
  await toast.present();
  }

  function changerQuantite(platId, delta) {
    // TODO : ajoute delta (+1 ou -1) à la quantité ;
    //        si la quantité tombe à 0, retirer la ligne

    const platLigne = lignes.value.find((l) => l.plat.id === platId);

    platLigne.quantite += delta
    if (platLigne.quantite == 0) {
        lignes.value = lignes.value.filter((l) => l.plat.id !== platId);
    }
  }

  function vider() {
    lignes.value = [];
  }

  const nombreArticles = computed(() => lignes.value.reduce(
    (qnt, l) => qnt + l.quantite, 0
  ));

  const total = computed(() => lignes.value.reduce(
    (total, l) => total + Number(l.plat.prix) * l.quantite, 0
  ));

  return { lignes, ajouter, changerQuantite, vider, nombreArticles, total };
}
