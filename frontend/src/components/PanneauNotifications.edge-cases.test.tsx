import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PanneauNotifications } from "./PanneauNotifications";
import type { Rappel } from "@/lib/rappels";

describe("PanneauNotifications — critères d'acceptation itération 4", () => {
  it("affiche un message neutre sans zone vide ni erreur quand il n'y a aucun rappel", () => {
    render(
      <PanneauNotifications rappels={[]} activees={false} onActiver={() => {}} onFermer={() => {}} />,
    );
    expect(screen.getByText(/aucun rappel/i)).toBeInTheDocument();
  });

  it("'Recevoir ces rappels par e-mail' appelle onActiver sans appel réseau, le bouton se désactive une fois activé", () => {
    const onActiver = vi.fn();
    const { rerender } = render(
      <PanneauNotifications rappels={[]} activees={false} onActiver={onActiver} onFermer={() => {}} />,
    );
    const bouton = screen.getByRole("button", { name: "Recevoir ces rappels par e-mail" });
    fireEvent.click(bouton);
    expect(onActiver).toHaveBeenCalledTimes(1);

    rerender(
      <PanneauNotifications rappels={[]} activees={true} onActiver={onActiver} onFermer={() => {}} />,
    );
    const boutonActive = screen.getByRole("button", { name: "Rappels activés ✓" });
    expect(boutonActive).toBeDisabled();
  });

  it("'Pas maintenant' appelle onFermer et n'appelle jamais onActiver", () => {
    const onActiver = vi.fn();
    const onFermer = vi.fn();
    render(
      <PanneauNotifications rappels={[]} activees={false} onActiver={onActiver} onFermer={onFermer} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Pas maintenant" }));
    expect(onFermer).toHaveBeenCalledTimes(1);
    expect(onActiver).not.toHaveBeenCalled();
  });

  it("liste chaque rappel avec son statut 'Inscrite' / 'Pas encore inscrite'", () => {
    const rappels: Rappel[] = [
      { titre: "Atelier socle 2", module: "Se reconstruire", inscrite: true },
      { titre: "Atelier Feel Good", module: "Se reconstruire", inscrite: false },
    ];
    render(
      <PanneauNotifications rappels={rappels} activees={false} onActiver={() => {}} onFermer={() => {}} />,
    );
    expect(screen.getByText("Inscrite")).toBeInTheDocument();
    expect(screen.getByText("Pas encore inscrite")).toBeInTheDocument();
  });

  it("FIX : deux rappels de modules différents partageant le même titre ne produisent plus de collision de clé React", () => {
    // rappelsPersona() n'empêche pas deux ateliers de même nom dans des modules
    // différents (voir frontend/src/lib/rappels.edge-cases.test.ts). Le composant
    // utilisait `key={rappel.titre}` (défaut confirmé), qui ne distinguait pas le
    // module d'origine : React avertissait d'une collision de clé dans ce cas.
    // Clé composite désormais utilisée : `${rappel.module}-${rappel.titre}`.
    const rappels: Rappel[] = [
      { titre: "Atelier socle 1", module: "Module A", inscrite: true },
      { titre: "Atelier socle 1", module: "Module B", inscrite: false },
    ];
    const avertissements: unknown[] = [];
    const espionConsoleError = vi.spyOn(console, "error").mockImplementation((...args) => {
      avertissements.push(args.join(" "));
    });

    render(
      <PanneauNotifications rappels={rappels} activees={false} onActiver={() => {}} onFermer={() => {}} />,
    );

    const aLaCollisionDeCle = avertissements.some((a) =>
      String(a).includes("same key") || String(a).includes("unique"),
    );
    expect(aLaCollisionDeCle).toBe(false);

    espionConsoleError.mockRestore();
  });

  it("déplace le focus sur le bouton principal à l'ouverture du panneau", () => {
    render(
      <PanneauNotifications rappels={[]} activees={false} onActiver={() => {}} onFermer={() => {}} />,
    );
    expect(screen.getByRole("button", { name: "Recevoir ces rappels par e-mail" })).toHaveFocus();
  });

  it("la touche Échap appelle onFermer", () => {
    const onFermer = vi.fn();
    render(
      <PanneauNotifications rappels={[]} activees={false} onActiver={() => {}} onFermer={onFermer} />,
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onFermer).toHaveBeenCalledTimes(1);
  });
});
