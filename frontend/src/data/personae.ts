// Données en dur de l'itération 1 : reproduisent la persona "Sofia" du prototype retenu
// (passation/prototype/index.html). Pas d'API métier avant une itération ultérieure.

export type EtatModule = "fait" | "en-cours" | "suivant";

export type Atelier = {
  nom: string;
  fait: boolean;
};

export type Module = {
  cycle: string;
  numero: number;
  nom: string;
  thematiques: string[];
  etat: EtatModule;
  ateliers: Atelier[];
};

export type Persona = {
  id: string;
  nom: string;
  role: string;
  derniereConnexionJours: number;
  modules: Module[];
};

export const personae: Persona[] = [
  {
    id: "sofia",
    nom: "Sofia",
    role: "La BURN'ette en reconstruction",
    derniereConnexionJours: 5,
    modules: [
      {
        cycle: "BBA",
        numero: 1,
        nom: "Comprendre son burn-out",
        thematiques: ["Épuisement", "Écoute de soi", "Acceptation"],
        etat: "fait",
        ateliers: [
          { nom: "Atelier socle 1", fait: true },
          { nom: "Atelier socle 2", fait: true },
          { nom: "Atelier Feel Good", fait: true },
        ],
      },
      {
        cycle: "BBA",
        numero: 2,
        nom: "Se reconstruire",
        thematiques: ["Récupération", "Corps & repos", "Ressources internes"],
        etat: "en-cours",
        ateliers: [
          { nom: "Atelier socle 1", fait: true },
          { nom: "Atelier socle 2", fait: false },
          { nom: "Atelier Feel Good", fait: false },
        ],
      },
      {
        cycle: "BBA",
        numero: 3,
        nom: "Mieux me connaître",
        thematiques: ["Introspection", "Valeurs", "Envies"],
        etat: "suivant",
        ateliers: [],
      },
    ],
  },
];

export function trouverPersona(id: string): Persona {
  const trouvee = personae.find((p) => p.id === id);
  if (!trouvee) {
    throw new Error(`Persona inconnue : ${id}`);
  }
  return trouvee;
}

export function progressionModule(module: Module): number {
  if (module.ateliers.length === 0) {
    return 0;
  }
  const faits = module.ateliers.filter((a) => a.fait).length;
  return Math.round((faits / module.ateliers.length) * 100);
}
