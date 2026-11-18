import type { Persona } from "@/data/personae";

// Règle simple : suggère la prochaine action dans le module en cours, sinon
// la thématique d'entrée du module suivant. Pas de personnalisation fine.
export function suggestionsPersona(persona: Persona): string[] {
  const enCours = persona.modules.find((m) => m.etat === "en-cours");
  if (enCours) {
    if (enCours.ateliers.length === 0) {
      return [`Le module "${enCours.nom}" est en cours, reviens bientôt pour ses ateliers`];
    }
    const atelierSuivant = enCours.ateliers.find((a) => !a.fait);
    if (atelierSuivant) {
      return [`Continuer "${enCours.nom}" avec l'atelier "${atelierSuivant.nom}"`];
    }
    return [`Tous les ateliers de "${enCours.nom}" sont faits, tu peux avancer à ton rythme vers la suite`];
  }

  const suivantAvecThematique = persona.modules.find(
    (m) => m.etat === "suivant" && m.thematiques.length > 0,
  );
  if (suivantAvecThematique) {
    return [
      `Découvrir "${suivantAvecThematique.nom}" (${suivantAvecThematique.thematiques[0]}) quand tu seras prête`,
    ];
  }

  return [];
}
