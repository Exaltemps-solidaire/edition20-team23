import { describe, expect, it } from "vitest";
import { rappelsPersona } from "./rappels";
import type { Persona } from "@/data/personae";

describe("rappelsPersona", () => {
  it("liste les ateliers non faits, le premier inscrit", () => {
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
            { nom: "Atelier Feel Good", fait: false },
          ],
        },
      ],
    };
    expect(rappelsPersona(persona)).toEqual([
      { titre: "Atelier socle 2", module: "Se reconstruire", inscrite: true },
      { titre: "Atelier Feel Good", module: "Se reconstruire", inscrite: false },
    ]);
  });

  it("renvoie une liste vide sans atelier restant (cas limite)", () => {
    const persona: Persona = {
      id: "test",
      nom: "Test",
      role: "role",
      derniereConnexionJours: 1,
      modules: [
        {
          cycle: "BBA",
          numero: 1,
          nom: "Fini",
          thematiques: [],
          etat: "fait",
          ateliers: [{ nom: "Atelier socle 1", fait: true }],
        },
      ],
    };
    expect(rappelsPersona(persona)).toEqual([]);
  });

  it("limite la liste à 3 rappels", () => {
    const persona: Persona = {
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
          ateliers: [
            { nom: "a", fait: false },
            { nom: "b", fait: false },
            { nom: "c", fait: false },
            { nom: "d", fait: false },
          ],
        },
      ],
    };
    expect(rappelsPersona(persona)).toHaveLength(3);
  });
});
