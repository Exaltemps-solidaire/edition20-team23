import type { Persona } from "@/data/personae";

export type Rappel = {
  titre: string;
  module: string;
  inscrite: boolean;
};

// Règle simple : les 3 premiers ateliers non faits, dans l'ordre des modules.
// Pas de vraie date : c'est la position dans la liste qui fait office d'ordre.
export function rappelsPersona(persona: Persona): Rappel[] {
  const rappels: Rappel[] = [];
  for (const unModule of persona.modules) {
    for (const atelier of unModule.ateliers) {
      if (!atelier.fait) {
        rappels.push({ titre: atelier.nom, module: unModule.nom, inscrite: rappels.length === 0 });
      }
    }
  }
  return rappels.slice(0, 3);
}
