import { describe, expect, it } from "vitest";
import { historiquePersona, progressionModule, trouverPersona } from "./personae";
import type { Module, Persona } from "./personae";

describe("progressionModule — arrondi", () => {
  it.each([
    [1, 3, 33],
    [2, 3, 67],
    [1, 8, 13], // 12.5 % arrondi au supérieur (Math.round)
    [3, 8, 38], // 37.5 %
    [5, 8, 63], // 62.5 %
    [7, 8, 88], // 87.5 %
  ])("%i/%i ateliers faits -> %i %%", (faits, total, attendu) => {
    const ateliers = Array.from({ length: total }, (_, i) => ({
      nom: `atelier-${i}`,
      fait: i < faits,
    }));
    const unModule: Module = {
      cycle: "BBA",
      numero: 1,
      nom: "Module",
      thematiques: [],
      etat: "en-cours",
      ateliers,
    };
    expect(progressionModule(unModule)).toBe(attendu);
  });

  it("renvoie 100 quand tous les ateliers sont faits", () => {
    const unModule: Module = {
      cycle: "BBA",
      numero: 1,
      nom: "Module",
      thematiques: [],
      etat: "fait",
      ateliers: [
        { nom: "a", fait: true },
        { nom: "b", fait: true },
      ],
    };
    expect(progressionModule(unModule)).toBe(100);
  });
});

describe("trouverPersona — cas limites", () => {
  it("lève une erreur pour un id vide", () => {
    expect(() => trouverPersona("")).toThrow("Persona inconnue");
  });
});

describe("historiquePersona — cas limites", () => {
  it("renvoie des listes vides pour une persona sans aucun module", () => {
    const persona: Persona = {
      id: "vide",
      nom: "Vide",
      role: "role",
      derniereConnexionJours: 0,
      modules: [],
    };
    expect(historiquePersona(persona)).toEqual({
      derniereConnexionJours: 0,
      parcoursTermines: [],
      parcoursEnCours: [],
    });
  });

  it("liste tous les modules 'en-cours' si plusieurs le sont simultanément (hors contrat de données)", () => {
    const persona: Persona = {
      id: "double-en-cours",
      nom: "Double",
      role: "role",
      derniereConnexionJours: 1,
      modules: [
        { cycle: "BBA", numero: 1, nom: "Module A", thematiques: [], etat: "en-cours", ateliers: [] },
        { cycle: "BBA", numero: 2, nom: "Module B", thematiques: [], etat: "en-cours", ateliers: [] },
      ],
    };
    // La fonction ne valide pas le contrat « un seul module en-cours » : elle
    // doit rester cohérente (pas de crash, pas de perte silencieuse) même si
    // la donnée en amont viole ce contrat.
    expect(historiquePersona(persona).parcoursEnCours).toEqual(["Module A", "Module B"]);
  });

  it("conserve l'ordre des modules tel que fourni, sans tri", () => {
    const persona: Persona = {
      id: "ordre",
      nom: "Ordre",
      role: "role",
      derniereConnexionJours: 1,
      modules: [
        { cycle: "BBA", numero: 3, nom: "Z termine en dernier", thematiques: [], etat: "fait", ateliers: [] },
        { cycle: "BBA", numero: 1, nom: "A termine en premier", thematiques: [], etat: "fait", ateliers: [] },
      ],
    };
    expect(historiquePersona(persona).parcoursTermines).toEqual([
      "Z termine en dernier",
      "A termine en premier",
    ]);
  });
});
