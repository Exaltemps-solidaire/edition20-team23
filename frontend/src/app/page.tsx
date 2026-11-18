"use client";

import { useState } from "react";
import { Timeline } from "@/components/Timeline";
import { BlocHistorique } from "@/components/Historique";
import { BlocSuggestions } from "@/components/Suggestions";
import { historiquePersona, personae, trouverPersona } from "@/data/personae";
import { suggestionsPersona } from "@/lib/suggestions";
import styles from "./page.module.css";

export default function Home() {
  const [personaId, setPersonaId] = useState(personae[0].id);
  const persona = trouverPersona(personaId);

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <span className={styles.headerLogo}>L&apos;BURN</span>
        <select
          className={styles.personaSelect}
          value={personaId}
          onChange={(e) => setPersonaId(e.target.value)}
          aria-label="Choisir l'utilisatrice à incarner"
        >
          {personae.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nom} · {p.role}
            </option>
          ))}
        </select>
      </header>

      <div className={styles.bienvenue}>
        <div className={styles.bienvenueLabel}>Bonjour</div>
        <div className={styles.bienvenueTitre}>Bienvenue, {persona.nom} 🌿</div>
        <div className={styles.bienvenueTexte}>
          Tu peux reprendre là où tu t&apos;es arrêtée, à ton rythme, sans pression.
        </div>
        <span className={styles.derniereCo}>
          🕐 Dernière connexion il y a {persona.derniereConnexionJours} jours
        </span>
      </div>

      <div className={styles.sectionTitre}>Ton parcours</div>
      <Timeline modules={persona.modules} />

      <div className={styles.sectionTitre}>Ton historique</div>
      <BlocHistorique historique={historiquePersona(persona)} />

      <div className={styles.sectionTitre}>Pour toi</div>
      <BlocSuggestions suggestions={suggestionsPersona(persona)} />
    </div>
  );
}
