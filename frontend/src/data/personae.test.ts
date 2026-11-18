import { describe, expect, it } from "vitest";
import { historiquePersona, progressionModule, trouverPersona } from "./personae";
import type { Module, Persona } from "./personae";

describe("trouverPersona", () => {
  it("retrouve une persona existante par son id", () => {
    expect(trouverPersona("sofia").nom).toBe("Sofia");
  });

  it("lève une erreur pour une persona inconnue", () => {
    expect(() => trouverPersona("inconnue")).toThrow("Persona inconnue");
  });
});

describe("progressionModule", () => {
  it("calcule le pourcentage d'ateliers faits", () => {
    const unModule: Module = {
      cycle: "BBA",
      numero: 2,
      nom: "Se reconstruire",
      thematiques: [],
      etat: "en-cours",
      ateliers: [
        { nom: "a", fait: true },
        { nom: "b", fait: false },
        { nom: "c", fait: false },
      ],
    };
    expect(progressionModule(unModule)).toBe(33);
  });

  it("renvoie 0 pour un module sans atelier (cas limite)", () => {
    const unModule: Module = {
      cycle: "BBA",
      numero: 3,
      nom: "Mieux me connaître",
      thematiques: [],
      etat: "suivant",
      ateliers: [],
    };
    expect(progressionModule(unModule)).toBe(0);
  });
});

describe("historiquePersona", () => {
  const persona: Persona = {
    id: "test",
    nom: "Test",
    role: "role",
    derniereConnexionJours: 5,
    modules: [
      { cycle: "BBA", numero: 1, nom: "Module fait", thematiques: [], etat: "fait", ateliers: [] },
      { cycle: "BBA", numero: 2, nom: "Module en cours", thematiques: [], etat: "en-cours", ateliers: [] },
      { cycle: "BBA", numero: 3, nom: "Module suivant", thematiques: [], etat: "suivant", ateliers: [] },
    ],
  };

  it("sépare les modules terminés et en cours", () => {
    expect(historiquePersona(persona)).toEqual({
      derniereConnexionJours: 5,
      parcoursTermines: ["Module fait"],
      parcoursEnCours: ["Module en cours"],
    });
  });

  it("renvoie des listes vides sans modules terminés ni en cours (cas limite)", () => {
    const sansProgres: Persona = { ...persona, modules: [persona.modules[2]] };
    expect(historiquePersona(sansProgres).parcoursTermines).toEqual([]);
    expect(historiquePersona(sansProgres).parcoursEnCours).toEqual([]);
  });
});
