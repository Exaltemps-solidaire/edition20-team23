import type { Historique } from "@/data/personae";
import styles from "./Historique.module.css";

export function BlocHistorique({ historique }: { historique: Historique }) {
  return (
    <div className={styles.bloc}>
      <div className={styles.ligne}>
        🕐 Dernière connexion il y a {historique.derniereConnexionJours} jours
      </div>
      <div className={styles.ligne}>
        ✓ Parcours terminés :{" "}
        {historique.parcoursTermines.length > 0 ? historique.parcoursTermines.join(", ") : "Aucun pour l'instant."}
      </div>
      <div className={styles.ligne}>
        🌱 Parcours en cours :{" "}
        {historique.parcoursEnCours.length > 0 ? historique.parcoursEnCours.join(", ") : "Aucun pour l'instant."}
      </div>
    </div>
  );
}
