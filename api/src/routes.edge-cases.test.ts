import { describe, expect, it } from "vitest";
import { router } from "./routes.ts";

describe("router — méthodes non GET sur les routes de santé", () => {
  it.each(["POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"])(
    "%s /health -> 404",
    (methode) => {
      expect(router(methode, "/health").statut).toBe(404);
    },
  );

  it.each(["POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"])(
    "%s /sante -> 404",
    (methode) => {
      expect(router(methode, "/sante").statut).toBe(404);
    },
  );
});

describe("router — variantes de chemin", () => {
  it("trailing slash /health/ -> 404 (pas de normalisation de chemin)", () => {
    expect(router("GET", "/health/").statut).toBe(404);
  });

  it("trailing slash /sante/ -> 404", () => {
    expect(router("GET", "/sante/").statut).toBe(404);
  });

  it("casse différente /HEALTH -> 404 (sensible à la casse)", () => {
    expect(router("GET", "/HEALTH").statut).toBe(404);
  });

  it("chemin racine vide -> 404", () => {
    expect(router("GET", "").statut).toBe(404);
  });

  it("chemin racine / -> 404", () => {
    expect(router("GET", "/").statut).toBe(404);
  });

  it("/health avec plusieurs paramètres de requête -> 200", () => {
    expect(router("GET", "/health?x=1&y=2").statut).toBe(200);
  });

  it("/health avec un fragment -> 200 (le fragment n'affecte pas le chemin)", () => {
    expect(router("GET", "/health#section").statut).toBe(200);
  });

  it("préfixe /api/ sur une route de santé -> 404 (health/sante ne sont pas sous /api/)", () => {
    expect(router("GET", "/api/health").statut).toBe(404);
  });
});

describe("router — corps de réponse", () => {
  it("renvoie toujours le même corps { status: 'ok' } pour /health et /sante", () => {
    expect(router("GET", "/health").corps).toEqual({ status: "ok" });
    expect(router("GET", "/sante").corps).toEqual({ status: "ok" });
  });

  it("la réponse 404 n'a pas de corps", () => {
    expect(router("GET", "/inconnue").corps).toBeUndefined();
  });
});
