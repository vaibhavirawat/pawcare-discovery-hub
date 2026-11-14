import { describe, expect, it } from "vitest";

import { filterProviders, providers } from "@/lib/provider-directory";

describe("PawCare discovery filters", () => {
  it("starts with six example providers", () => {
    expect(providers).toHaveLength(6);
  });

  it("filters providers to a chosen category", () => {
    expect(filterProviders(providers, { category: "Pet Boarding" }).map((item) => item.id)).toEqual([
      "little-paws-stay",
    ]);
  });

  it("shows providers that are open now or available around the clock", () => {
    expect(filterProviders(providers, { openOr24x7: true }).map((item) => item.id)).toEqual([
      "greenleaf-veterinary",
      "city-paws-emergency",
      "little-paws-stay",
      "petwell-diagnostics",
      "swift-tails-ambulance",
    ]);
  });

  it("restricts emergency ambulance results to ambulance providers", () => {
    expect(filterProviders(providers, { emergencyAmbulance: true }).map((item) => item.id)).toEqual([
      "swift-tails-ambulance",
    ]);
  });

  it("matches any selected animal type", () => {
    expect(filterProviders(providers, { animals: ["Birds"] }).map((item) => item.id)).toEqual([
      "greenleaf-veterinary",
      "petwell-diagnostics",
      "swift-tails-ambulance",
    ]);
  });

  it("keeps only verified providers when requested", () => {
    expect(filterProviders(providers, { verifiedOnly: true })).toHaveLength(5);
  });

  it("applies the selected distance limit", () => {
    expect(filterProviders(providers, { maxDistanceKm: 2 }).map((item) => item.id)).toEqual([
      "greenleaf-veterinary",
    ]);
  });

  it("searches provider names, services, and neighborhoods", () => {
    expect(filterProviders(providers, { query: "jayanagar" }).map((item) => item.id)).toEqual([
      "petwell-diagnostics",
    ]);
  });
});