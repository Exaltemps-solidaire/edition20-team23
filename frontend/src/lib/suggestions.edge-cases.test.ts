import { describe, expect, it } from "vitest";
import { suggestionsPersona } from "./suggestions";
import type { Persona } from "@/data/personae";

describe("suggestionsPersona — cas limites", () => {
  it("renvoie une liste vide pour une persona sans aucun module", () => {
    const persona: Persona = {
      id: "vide",
      nom: "Vide",
      role: "role",
      derniereConnexionJours: 0,
      modules: [],
    };
    expect(suggestionsPersona(persona)).toEqual([]);
  });

  it("ne retient que le premier module 'en-cours' si plusieurs le sont (hors contrat de données)", () => {
    const persona: Persona = {
      id: "double-en-cours",
      nom: "Double",
      role: "role",
      derniereConnexionJours: 1,
      modules: [
        {
          cycle: "BBA",
          numero: 1,
          nom: "Premier en cours",
          thematiques: [],
          etat: "en-cours",
          ateliers: [{ nom: "Atelier X", fait: false }],
        },
        {
          cycle: "BBA",
          numero: 2,
          nom: "Second en cours",
          thematiques: [],
          etat: "en-cours",
          ateliers: [{ nom: "Atelier Y", fait: false }],
        },
      ],
    };
    // `find` s'arrête au premier match : le second module "en-cours" est
    // silencieusement ignoré. Documente le comportement actuel.
    expect(suggestionsPersona(persona)).toEqual([
      'Continuer "Premier en cours" avec l\'atelier "Atelier X"',
    ]);
  });

  it("module en-cours avec ateliers: [] -> message dédié, pas le 'tous faits' trompeur", () => {
    const persona: Persona = {
      id: "sans-atelier",
      nom: "SansAtelier",
      role: "role",
      derniereConnexionJours: 1,
      modules: [
        {
          cycle: "BBA",
          numero: 1,
          nom: "Module creux",
          thematiques: [],
          etat: "en-cours",
          ateliers: [],
        },
      ],
    };
    // Un module en-cours sans AUCUN atelier déclaré ne doit pas produire le
    // même message qu'un module dont les ateliers sont tous faits : rien n'a
    // été "fini" ici.
    expect(suggestionsPersona(persona)).toEqual([
      'Le module "Module creux" est en cours, reviens bientôt pour ses ateliers',
    ]);
  });

  it("retombe sur un module 'suivant' ultérieur si le premier trouvé n'a pas de thématique", () => {
    const persona: Persona = {
      id: "suivant-sans-thematique",
      nom: "SuivantSansThematique",
      role: "role",
      derniereConnexionJours: 1,
      modules: [
        { cycle: "BBA", numero: 1, nom: "Suivant A (sans thematique)", thematiques: [], etat: "suivant", ateliers: [] },
        { cycle: "BBA", numero: 2, nom: "Suivant B (avec thematique)", thematiques: ["X"], etat: "suivant", ateliers: [] },
      ],
    };
    // Le premier module "suivant" n'a pas de thématique : la fonction doit
    // essayer les suivants dans l'ordre plutôt que renvoyer [].
    expect(suggestionsPersona(persona)).toEqual([
      'Découvrir "Suivant B (avec thematique)" (X) quand tu seras prête',
    ]);
  });

  it("modules avec ateliers: [] mélangés à des modules avec ateliers ne cassent rien", () => {
    const persona: Persona = {
      id: "mixte",
      nom: "Mixte",
      role: "role",
      derniereConnexionJours: 1,
      modules: [
        { cycle: "BBA", numero: 1, nom: "Fini", thematiques: [], etat: "fait", ateliers: [] },
        {
          cycle: "BBA",
          numero: 2,
          nom: "En cours",
          thematiques: [],
          etat: "en-cours",
          ateliers: [{ nom: "Atelier unique", fait: false }],
        },
      ],
    };
    expect(suggestionsPersona(persona)).toEqual([
      'Continuer "En cours" avec l\'atelier "Atelier unique"',
    ]);
  });
});
