"use client";

import { useEffect, useRef } from "react";
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
  const primaireRef = useRef<HTMLButtonElement>(null);
  const secondaireRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const elementPrecedent = document.activeElement;
    const cible = activees ? secondaireRef.current : primaireRef.current;
    cible?.focus();

    return () => {
      if (elementPrecedent instanceof HTMLElement) {
        elementPrecedent.focus();
      }
    };
  }, [activees]);

  useEffect(() => {
    function gererClavier(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onFermer();
        return;
      }
      if (e.key !== "Tab") return;

      const focusables = [primaireRef.current, secondaireRef.current].filter(
        (el): el is HTMLButtonElement => el !== null && !el.disabled,
      );
      if (focusables.length === 0) return;
      const premier = focusables[0];
      const dernier = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === premier) {
        e.preventDefault();
        dernier.focus();
      } else if (!e.shiftKey && document.activeElement === dernier) {
        e.preventDefault();
        premier.focus();
      }
    }

    document.addEventListener("keydown", gererClavier);
    return () => document.removeEventListener("keydown", gererClavier);
  }, [onFermer]);

  return (
    <div className={styles.panel} role="dialog" aria-modal="true" aria-label="Notifications">
      <div className={styles.box}>
        <div className={styles.titre}>Tes rappels à venir 🔔</div>
        <div className={styles.desc}>
          Ces notifications sont envoyées automatiquement.
          <br />
          Tu choisis si tu veux les recevoir.
        </div>

        {rappels.length > 0 ? (
          rappels.map((rappel) => (
            <div key={`${rappel.module}-${rappel.titre}`} className={styles.item}>
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
          <button
            ref={primaireRef}
            className={styles.btnPrimary}
            type="button"
            onClick={onActiver}
            disabled={activees}
          >
            {activees ? "Rappels activés ✓" : "Recevoir ces rappels par e-mail"}
          </button>
          <button ref={secondaireRef} className={styles.btnSecondary} type="button" onClick={onFermer}>
            Pas maintenant
          </button>
        </div>
      </div>
    </div>
  );
}
