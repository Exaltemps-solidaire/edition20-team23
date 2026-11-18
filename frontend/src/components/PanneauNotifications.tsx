import type { Rappel } from "@/lib/rappels";
import styles from "./PanneauNotifications.module.css";

export function PanneauNotifications({
  rappels,
  activees,
  onActiver,
  onFermer,
}: {
  rappels: Rappel[];
  activees: boolean;
  onActiver: () => void;
  onFermer: () => void;
}) {
  return (
    <div className={styles.panel} role="dialog" aria-label="Notifications">
      <div className={styles.box}>
        <div className={styles.titre}>Tes rappels à venir 🔔</div>
        <div className={styles.desc}>
          Ces notifications sont envoyées automatiquement.
          <br />
          Tu choisis si tu veux les recevoir.
        </div>

        {rappels.length > 0 ? (
          rappels.map((rappel) => (
            <div key={rappel.titre} className={styles.item}>
              <div className={`${styles.dot} ${rappel.inscrite ? styles.dotInscrite : ""}`} />
              <div className={styles.texte}>
                <div className={styles.titreItem}>
                  {rappel.titre} – {rappel.module}
                </div>
                <div className={styles.statut}>{rappel.inscrite ? "Inscrite" : "Pas encore inscrite"}</div>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.neutre}>Aucun rappel pour l&apos;instant, profite de ton rythme 🌿</div>
        )}

        <div className={styles.actions}>
          <button className={styles.btnPrimary} type="button" onClick={onActiver} disabled={activees}>
            {activees ? "Rappels activés ✓" : "Recevoir ces rappels par e-mail"}
          </button>
          <button className={styles.btnSecondary} type="button" onClick={onFermer}>
            Pas maintenant
          </button>
        </div>
      </div>
    </div>
  );
}
