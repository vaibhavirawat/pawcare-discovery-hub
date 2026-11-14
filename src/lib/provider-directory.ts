export type ProviderCategory =
  | "Veterinary Clinics"
  | "24/7 Hospitals"
  | "Pet Boarding"
  | "Diagnostics"
  | "Ambulances"
  | "Animal NGOs";

export type AnimalType = "Dogs" | "Cats" | "Birds" | "Exotic" | "Street/Stray";

export interface Provider {
  id: string;
  name: string;
  category: ProviderCategory;
  rating: number;
  reviewCount: number;
  distanceKm: number;
  timing: string;
  isOpenNow: boolean;
  is24x7: boolean;
  verified: boolean;
  animals: AnimalType[];
  services: string[];
  fee: string;
  location: string;
  bookingLabel: "Book appointment" | "Call now";
}

// Example directory data for the homepage prototype; replace with real local listings later.
export const providers: Provider[] = [
  {
    id: "greenleaf-veterinary",
    name: "Greenleaf Veterinary Clinic",
    category: "Veterinary Clinics",
    rating: 4.9,
    reviewCount: 382,
    distanceKm: 1.2,
    timing: "Open until 9:00 pm",
    isOpenNow: true,
    is24x7: false,
    verified: true,
    animals: ["Dogs", "Cats", "Birds"],
    services: ["Wellness visits", "Vaccinations", "Dental care"],
    fee: "Consults from ₹500",
    location: "Indiranagar, Bengaluru",
    bookingLabel: "Book appointment",
  },
  {
    id: "city-paws-emergency",
    name: "City Paws Emergency Hospital",
    category: "24/7 Hospitals",
    rating: 4.8,
    reviewCount: 516,
    distanceKm: 3.4,
    timing: "Open 24 hours",
    isOpenNow: true,
    is24x7: true,
    verified: true,
    animals: ["Dogs", "Cats", "Exotic", "Street/Stray"],
    services: ["Emergency care", "ICU", "Surgery"],
    fee: "Emergency consults from ₹900",
    location: "Domlur, Bengaluru",
    bookingLabel: "Call now",
  },
  {
    id: "little-paws-stay",
    name: "Little Paws Stay & Play",
    category: "Pet Boarding",
    rating: 4.7,
    reviewCount: 194,
    distanceKm: 4.8,
    timing: "Check-in until 7:00 pm",
    isOpenNow: true,
    is24x7: false,
    verified: true,
    animals: ["Dogs", "Cats"],
    services: ["Overnight stays", "Day care", "Grooming"],
    fee: "Stays from ₹800 / night",
    location: "Koramangala, Bengaluru",
    bookingLabel: "Book appointment",
  },
  {
    id: "petwell-diagnostics",
    name: "PetWell Diagnostics Lab",
    category: "Diagnostics",
    rating: 4.6,
    reviewCount: 248,
    distanceKm: 6.1,
    timing: "Open until 8:00 pm",
    isOpenNow: true,
    is24x7: false,
    verified: true,
    animals: ["Dogs", "Cats", "Birds", "Exotic"],
    services: ["Blood tests", "Digital X-ray", "Ultrasound"],
    fee: "Tests from ₹350",
    location: "Jayanagar, Bengaluru",
    bookingLabel: "Book appointment",
  },
  {
    id: "swift-tails-ambulance",
    name: "Swift Tails Animal Ambulance",
    category: "Ambulances",
    rating: 4.9,
    reviewCount: 163,
    distanceKm: 2.1,
    timing: "Available 24 hours",
    isOpenNow: true,
    is24x7: true,
    verified: true,
    animals: ["Dogs", "Cats", "Birds", "Exotic", "Street/Stray"],
    services: ["Emergency pickup", "Oxygen support", "Rescue transport"],
    fee: "Trips from ₹700",
    location: "Central Bengaluru",
    bookingLabel: "Call now",
  },
  {
    id: "street-heart-collective",
    name: "Street Heart Animal Collective",
    category: "Animal NGOs",
    rating: 4.8,
    reviewCount: 129,
    distanceKm: 7.3,
    timing: "Community visits: 10:00 am–5:00 pm",
    isOpenNow: false,
    is24x7: false,
    verified: false,
    animals: ["Dogs", "Cats", "Street/Stray"],
    services: ["Street-animal rescue", "Adoption", "Vaccination drives"],
    fee: "Community-supported care",
    location: "Malleshwaram, Bengaluru",
    bookingLabel: "Book appointment",
  },
];

export interface ProviderFilters {
  query?: string;
  category?: ProviderCategory | null;
  openOr24x7?: boolean;
  emergencyAmbulance?: boolean;
  animals?: AnimalType[];
  verifiedOnly?: boolean;
  maxDistanceKm?: number;
}

export function filterProviders(
  listings: Provider[],
  filters: ProviderFilters,
): Provider[] {
  const query = filters.query?.trim().toLowerCase() ?? "";

  return listings.filter((provider) => {
    if (filters.category && provider.category !== filters.category) return false;
    if (
      filters.openOr24x7 &&
      !provider.isOpenNow &&
      !provider.is24x7
    ) {
      return false;
    }
    if (filters.emergencyAmbulance && provider.category !== "Ambulances") return false;
    if (filters.verifiedOnly && !provider.verified) return false;
    if (
      filters.animals?.length &&
      !filters.animals.some((animal) => provider.animals.includes(animal))
    ) {
      return false;
    }
    if (provider.distanceKm > (filters.maxDistanceKm ?? 50)) return false;
    if (
      query &&
      ![provider.name, provider.category, provider.location, ...provider.services]
        .join(" ")
        .toLowerCase()
        .includes(query)
    ) {
      return false;
    }
    return true;
  });
}