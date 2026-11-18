import { describe, expect, it } from "vitest";
import { suggestionsPersona } from "./suggestions";
import type { Persona } from "@/data/personae";

describe("suggestionsPersona", () => {
  it("suggère le prochain atelier non fait du module en cours", () => {
    const persona: Persona = {
      id: "test",
      nom: "Test",
      role: "role",
      derniereConnexionJours: 1,
      modules: [
        {
          cycle: "BBA",
          numero: 2,
          nom: "Se reconstruire",
          thematiques: [],
          etat: "en-cours",
          ateliers: [
            { nom: "Atelier socle 1", fait: true },
            { nom: "Atelier socle 2", fait: false },
          ],
        },
      ],
    };
    expect(suggestionsPersona(persona)).toEqual([
      'Continuer "Se reconstruire" avec l\'atelier "Atelier socle 2"',
    ]);
  });

  it("propose le module suivant quand aucun module n'est en cours", () => {
    const persona: Persona = {
      id: "test",
      nom: "Test",
      role: "role",
      derniereConnexionJours: 1,
      modules: [
        {
          cycle: "BBA",
          numero: 3,
          nom: "Mieux me connaître",
          thematiques: ["Introspection"],
          etat: "suivant",
          ateliers: [],
        },
      ],
    };
    expect(suggestionsPersona(persona)).toEqual([
      'Découvrir "Mieux me connaître" (Introspection) quand tu seras prête',
    ]);
  });

  it("renvoie une liste vide sans module en cours ni suivant (cas limite)", () => {
    const persona: Persona = {
      id: "test",
      nom: "Test",
      role: "role",
      derniereConnexionJours: 1,
      modules: [
        { cycle: "BBA", numero: 1, nom: "Fini", thematiques: [], etat: "fait", ateliers: [] },
      ],
    };
    expect(suggestionsPersona(persona)).toEqual([]);
  });
});
