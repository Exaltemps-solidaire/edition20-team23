import { describe, expect, it } from "vitest";
import { rappelsPersona } from "./rappels";
import type { Persona } from "@/data/personae";

function personaAvecAteliers(nbNonFaits: number): Persona {
  return {
    id: "test",
    nom: "Test",
    role: "role",
    derniereConnexionJours: 1,
    modules: [
      {
        cycle: "BBA",
        numero: 1,
        nom: "Module",
        thematiques: [],
        etat: "en-cours",
        ateliers: Array.from({ length: nbNonFaits }, (_, i) => ({ nom: `atelier-${i}`, fait: false })),
      },
    ],
  };
}

describe("rappelsPersona — bornes du plafond de 3", () => {
  it("exactement 3 ateliers non faits -> les 3 sont renvoyés, aucune troncature", () => {
    const rappels = rappelsPersona(personaAvecAteliers(3));
    expect(rappels).toHaveLength(3);
    expect(rappels.map((r) => r.titre)).toEqual(["atelier-0", "atelier-1", "atelier-2"]);
  });

  it("exactement 4 ateliers non faits -> tronqué à 3, le 4e est perdu", () => {
    const rappels = rappelsPersona(personaAvecAteliers(4));
    expect(rappels).toHaveLength(3);
    expect(rappels.map((r) => r.titre)).toEqual(["atelier-0", "atelier-1", "atelier-2"]);
  });
});

describe("rappelsPersona — cas limites", () => {
  it("renvoie une liste vide pour une persona sans aucun module", () => {
    const persona: Persona = {
      id: "vide",
      nom: "Vide",
      role: "role",
      derniereConnexionJours: 0,
      modules: [],
    };
    expect(rappelsPersona(persona)).toEqual([]);
  });

  it("'inscrite' ne vaut true que pour le tout premier atelier non fait, même réparti sur plusieurs modules", () => {
    const persona: Persona = {
      id: "multi-module",
      nom: "MultiModule",
      role: "role",
      derniereConnexionJours: 1,
      modules: [
        {
          cycle: "BBA",
          numero: 1,
          nom: "Module 1",
          thematiques: [],
          etat: "fait",
          ateliers: [{ nom: "Deja fait", fait: true }],
        },
        {
          cycle: "BBA",
          numero: 2,
          nom: "Module 2",
          thematiques: [],
          etat: "en-cours",
          ateliers: [
            { nom: "Premier restant", fait: false },
            { nom: "Second restant", fait: false },
          ],
        },
      ],
    };
    expect(rappelsPersona(persona)).toEqual([
      { titre: "Premier restant", module: "Module 2", inscrite: true },
      { titre: "Second restant", module: "Module 2", inscrite: false },
    ]);
  });

  it("plusieurs modules 'en-cours' simultanés (hors contrat) : agrège sans crasher, dans l'ordre des modules", () => {
    const persona: Persona = {
      id: "double-en-cours",
      nom: "Double",
      role: "role",
      derniereConnexionJours: 1,
      modules: [
        {
          cycle: "BBA",
          numero: 1,
          nom: "Module A",
          thematiques: [],
          etat: "en-cours",
          ateliers: [{ nom: "A1", fait: false }],
        },
        {
          cycle: "BBA",
          numero: 2,
          nom: "Module B",
          thematiques: [],
          etat: "en-cours",
          ateliers: [{ nom: "B1", fait: false }],
        },
      ],
    };
    expect(rappelsPersona(persona)).toEqual([
      { titre: "A1", module: "Module A", inscrite: true },
      { titre: "B1", module: "Module B", inscrite: false },
    ]);
  });

  it("modules avec ateliers: [] mélangés à des modules avec ateliers n'introduisent pas de trou", () => {
    const persona: Persona = {
      id: "mixte",
      nom: "Mixte",
      role: "role",
      derniereConnexionJours: 1,
      modules: [
        { cycle: "BBA", numero: 1, nom: "Creux", thematiques: [], etat: "suivant", ateliers: [] },
        {
          cycle: "BBA",
          numero: 2,
          nom: "Plein",
          thematiques: [],
          etat: "en-cours",
          ateliers: [{ nom: "Atelier", fait: false }],
        },
      ],
    };
    expect(rappelsPersona(persona)).toEqual([{ titre: "Atelier", module: "Plein", inscrite: true }]);
  });

  it("même titre d'atelier répété dans deux modules différents : pas de déduplication par titre", () => {
    const persona: Persona = {
      id: "doublon-titre",
      nom: "DoublonTitre",
      role: "role",
      derniereConnexionJours: 1,
      modules: [
        {
          cycle: "BBA",
          numero: 1,
          nom: "Module A",
          thematiques: [],
          etat: "en-cours",
          ateliers: [{ nom: "Atelier socle 1", fait: false }],
        },
        {
          cycle: "BBA",
          numero: 2,
          nom: "Module B",
          thematiques: [],
          etat: "suivant",
          ateliers: [{ nom: "Atelier socle 1", fait: false }],
        },
      ],
    };
    // Les deux rappels ont le même `titre` mais des `module` différents : la
    // fonction ne déduplique pas, ce qui est correct ici. Voir en revanche
    // PanneauNotifications.tsx qui utilise `rappel.titre` seul comme clé React
    // (risque de collision de clé si ce cas se présente en production).
    const rappels = rappelsPersona(persona);
    expect(rappels).toHaveLength(2);
    expect(rappels[0]).toEqual({ titre: "Atelier socle 1", module: "Module A", inscrite: true });
    expect(rappels[1]).toEqual({ titre: "Atelier socle 1", module: "Module B", inscrite: false });
  });
});
