import type { Module } from "@/data/personae";
import { progressionModule } from "@/data/personae";
import styles from "./Timeline.module.css";

const LIBELLE_STATUT: Record<Module["etat"], string> = {
  fait: "Terminé ✓",
  "en-cours": "En cours",
  suivant: "À venir",
};

function CarteModule({ unModule }: { unModule: Module }) {
  const progression = progressionModule(unModule);
  const faits = unModule.ateliers.filter((a) => a.fait).length;

  return (
    <div className={styles.item}>
      <div className={`${styles.dot} ${styles[unModule.etat]}`} />
      <div
        className={`${styles.card} ${unModule.etat === "en-cours" ? styles.cardActive : ""} ${
          unModule.etat === "suivant" ? styles.cardSuivant : ""
        }`}
      >
        <div className={styles.cardTop}>
          <span className={styles.cardModule}>
            {unModule.cycle} · Module {unModule.numero}
          </span>
          <span className={`${styles.statut} ${styles[`statut-${unModule.etat}`]}`}>
            {LIBELLE_STATUT[unModule.etat]}
          </span>
        </div>
        <div className={styles.cardNom}>{unModule.nom}</div>
        <div className={styles.cardThematique}>
          Thématiques : {unModule.thematiques.join(" · ")}
        </div>
        {unModule.ateliers.length > 0 && (
          <div className={styles.cardProgression}>
            <div className={styles.progBar}>
              <div className={styles.progFill} style={{ width: `${progression}%` }} />
            </div>
            <span className={styles.progLabel}>
              {faits}/{unModule.ateliers.length} ateliers
            </span>
          </div>
        )}
        {unModule.etat === "en-cours" && (
          <button className={styles.btnModule} type="button">
            Reprendre ce module →
          </button>
        )}
      </div>
    </div>
  );
}

export function Timeline({ modules }: { modules: Module[] }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.timeline}>
        {modules.map((unModule) => (
          <CarteModule key={`${unModule.cycle}-${unModule.numero}`} unModule={unModule} />
        ))}
      </div>
    </div>
  );
}
