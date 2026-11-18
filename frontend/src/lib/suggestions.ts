import type { Persona } from "@/data/personae";

// Règle simple : suggère la prochaine action dans le module en cours, sinon
// la thématique d'entrée du module suivant. Pas de personnalisation fine.
export function suggestionsPersona(persona: Persona): string[] {
  const enCours = persona.modules.find((m) => m.etat === "en-cours");
  if (enCours) {
    const atelierSuivant = enCours.ateliers.find((a) => !a.fait);
    if (atelierSuivant) {
      return [`Continuer "${enCours.nom}" avec l'atelier "${atelierSuivant.nom}"`];
    }
    return [`Tous les ateliers de "${enCours.nom}" sont faits, tu peux avancer à ton rythme vers la suite`];
  }

  const suivant = persona.modules.find((m) => m.etat === "suivant");
  if (suivant && suivant.thematiques.length > 0) {
    return [`Découvrir "${suivant.nom}" (${suivant.thematiques[0]}) quand tu seras prête`];
  }

  return [];
}
