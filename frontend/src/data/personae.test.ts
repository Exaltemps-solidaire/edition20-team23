import { describe, expect, it } from "vitest";
import { progressionModule, trouverPersona } from "./personae";
import type { Module } from "./personae";

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
