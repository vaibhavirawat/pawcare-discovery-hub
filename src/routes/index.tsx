import { createFileRoute } from "@tanstack/react-router";
import {
  Accessibility,
  ArrowDownRight,
  ArrowLeftRight,
  ArrowRight,
  BadgeCheck,
  Bandage,
  Bird,
  BriefcaseMedical,
  Check,
  ChevronDown,
  CircleAlert,
  Clock3,
  Dog,
  Filter,
  Heart,
  HeartHandshake,
  Hospital,
  LocateFixed,
  MapPin,
  Menu,
  Navigation,
  PawPrint,
  Phone,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Stethoscope,
  Syringe,
  TentTree,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import vetPhoto from "@/assets/pawcare-vet.jpg";
import {
  filterProviders,
  providers,
  type AnimalType,
  type Provider,
  type ProviderCategory,
} from "@/lib/provider-directory";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const categories: { label: ProviderCategory; icon: typeof Stethoscope; hint: string }[] = [
  { label: "Veterinary Clinics", icon: Stethoscope, hint: "Everyday & specialist care" },
  { label: "24/7 Hospitals", icon: Hospital, hint: "Here for the unexpected" },
  { label: "Pet Boarding", icon: TentTree, hint: "A happy home from home" },
  { label: "Diagnostics", icon: Syringe, hint: "Clear answers, sooner" },
  { label: "Ambulances", icon: Accessibility, hint: "Help when every minute counts" },
  { label: "Animal NGOs", icon: HeartHandshake, hint: "Local rescue & community care" },
];

const animalTypes: AnimalType[] = ["Dogs", "Cats", "Birds", "Exotic", "Street/Stray"];

const iconForAnimal = (animal: AnimalType) => {
  if (animal === "Dogs") return Dog;
  if (animal === "Birds") return Bird;
  if (animal === "Street/Stray") return Heart;
  if (animal === "Exotic") return Sparkles;
  return PawPrint;
};

type DialogState =
  | { kind: "appointment"; provider: Provider }
  | { kind: "call"; provider: Provider }
  | { kind: "correction" }
  | { kind: "listing" }
  | null;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PawCare — Trusted Animal Care, Closer to Home" },
      {
        name: "description",
        content:
          "Find trusted veterinary clinics, emergency hospitals, pet boarding, diagnostics, animal ambulances and local NGOs near you.",
      },
      { property: "og:title", content: "PawCare — Trusted Animal Care, Closer to Home" },
      {
        property: "og:description",
        content:
          "Find a little more care for every paw and claw. Discover trusted animal-care providers around Bengaluru.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PawCareHome,
});

function PawCareHome() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ProviderCategory | null>(null);
  const [openOr24x7, setOpenOr24x7] = useState(false);
  const [emergencyAmbulance, setEmergencyAmbulance] = useState(false);
  const [selectedAnimals, setSelectedAnimals] = useState<AnimalType[]>([]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [maxDistanceKm, setMaxDistanceKm] = useState(10);
  const [location, setLocation] = useState("Bengaluru, Karnataka");
  const [locationMenuOpen, setLocationMenuOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [dialog, setDialog] = useState<DialogState>(null);
  const [submissionComplete, setSubmissionComplete] = useState(false);

  const matchingProviders = useMemo(
    () =>
      filterProviders(providers, {
        query: submittedQuery,
        category: selectedCategory,
        openOr24x7,
        emergencyAmbulance,
        animals: selectedAnimals,
        verifiedOnly,
        maxDistanceKm,
      }),
    [
      submittedQuery,
      selectedCategory,
      openOr24x7,
      emergencyAmbulance,
      selectedAnimals,
      verifiedOnly,
      maxDistanceKm,
    ],
  );

  const resetFilters = () => {
    setQuery("");
    setSubmittedQuery("");
    setSelectedCategory(null);
    setOpenOr24x7(false);
    setEmergencyAmbulance(false);
    setSelectedAnimals([]);
    setVerifiedOnly(false);
    setMaxDistanceKm(10);
  };

  const toggleAnimal = (animal: AnimalType) => {
    setSelectedAnimals((current) =>
      current.includes(animal) ? current.filter((item) => item !== animal) : [...current, animal],
    );
  };

  const showDialog = (nextDialog: Exclude<DialogState, null>) => {
    setSubmissionComplete(false);
    setDialog(nextDialog);
  };

  const dialogTitle =
    dialog?.kind === "appointment"
      ? `Request a visit at ${dialog.provider.name}`
      : dialog?.kind === "call"
        ? `Contact ${dialog.provider.name}`
        : dialog?.kind === "correction"
          ? "Help us keep PawCare accurate"
          : "List your animal-care facility";

  const isMessageDialog = dialog?.kind === "correction" || dialog?.kind === "listing";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border bg-hero-foreground text-primary-foreground">
        <div className="site-shell flex min-h-9 items-center justify-center gap-2 text-center text-xs font-medium sm:text-sm">
          <Sparkles className="size-3.5 shrink-0 text-accent" aria-hidden="true" />
          <span>Local care. Kind people. Happier animals.</span>
          <span className="hidden text-primary-foreground/60 sm:inline">
            A better way to find their village.
          </span>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="site-shell flex h-[4.4rem] items-center justify-between gap-3">
          <a className="flex shrink-0 items-center gap-2.5" href="#top" aria-label="PawCare home">
            <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground">
              <PawPrint className="size-[1.35rem]" aria-hidden="true" />
            </span>
            <span className="text-[1.45rem] font-bold leading-none">
              paw<span className="text-primary">care</span>
            </span>
          </a>

          <nav className="hidden items-center gap-2 lg:flex" aria-label="Main navigation">
            <a
              href="#providers"
              className="px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Explore care
            </a>
            <Button
              variant="outline"
              size="sm"
              onClick={() => showDialog({ kind: "listing" })}
              className="border-primary/25 text-foreground"
            >
              <HeartHandshake aria-hidden="true" /> List Your Business
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                setEmergencyAmbulance(true);
                setSelectedCategory(null);
                document.getElementById("providers")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-emergency text-emergency-foreground hover:bg-emergency/90"
            >
              <Phone aria-hidden="true" /> Emergency 24/7 Ambulance
            </Button>
            <Button
              variant="link"
              size="sm"
              onClick={() => showDialog({ kind: "correction" })}
              className="text-muted-foreground"
            >
              Submit a correction
            </Button>
          </nav>

          <div className="flex items-center gap-2 lg:hidden">
            <Button
              aria-label="Find emergency ambulance"
              variant="destructive"
              size="icon"
              onClick={() => {
                setEmergencyAmbulance(true);
                setSelectedCategory(null);
                document.getElementById("providers")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-emergency text-emergency-foreground hover:bg-emergency/90"
            >
              <Phone aria-hidden="true" />
            </Button>
            <Button
              aria-label={mobileNavOpen ? "Close navigation" : "Open navigation"}
              variant="outline"
              size="icon"
              onClick={() => setMobileNavOpen((open) => !open)}
            >
              {mobileNavOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </Button>
          </div>
        </div>
        {mobileNavOpen && (
          <nav
            className="site-shell flex flex-col gap-2 border-t border-border py-3 lg:hidden"
            aria-label="Mobile navigation"
          >
            <a
              href="#providers"
              onClick={() => setMobileNavOpen(false)}
              className="px-3 py-2 text-sm font-medium"
            >
              Explore care
            </a>
            <Button
              variant="outline"
              onClick={() => {
                setMobileNavOpen(false);
                showDialog({ kind: "listing" });
              }}
            >
              List Your Business
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setMobileNavOpen(false);
                showDialog({ kind: "correction" });
              }}
            >
              Submit a Correction
            </Button>
          </nav>
        )}
      </header>

      <section id="top" className="site-shell pt-5 sm:pt-7">
        <div className="grid overflow-hidden rounded-2xl bg-hero lg:min-h-[23.5rem] lg:grid-cols-[1.08fr_0.92fr]">
          <div className="flex flex-col justify-center px-5 pb-8 pt-7 sm:px-9 sm:py-10 lg:py-11 lg:pl-12">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-primary">
              <span className="grid size-7 place-items-center rounded-full bg-background/80">
                <PawPrint className="size-4" aria-hidden="true" />
              </span>
              GOOD CARE STARTS HERE
            </div>
            <h1 className="font-display max-w-[34rem] text-[2.8rem] leading-[1.1] text-hero-foreground sm:text-[3.55rem]">
              Trusted Care for Every Paw &amp; Claw
            </h1>
            <p className="mt-3 max-w-[30rem] text-[0.96rem] leading-7 text-muted-foreground">
              Find the right people, places, and help for every animal in your life.
            </p>

            <div className="relative mt-6 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setLocationMenuOpen((open) => !open)}
                aria-expanded={locationMenuOpen}
                className="inline-flex h-10 max-w-full items-center gap-2 rounded-lg border border-border bg-background/80 px-3 text-sm font-medium transition-colors hover:bg-background"
              >
                <MapPin className="size-4 shrink-0 text-primary" aria-hidden="true" />
                <span className="truncate">{location}</span>
                <ChevronDown
                  className="size-3.5 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
              </button>
              <button
                type="button"
                onClick={() => setLocation("Near me (Bengaluru)")}
                className="inline-flex h-10 items-center gap-1.5 px-2 text-sm font-medium text-primary hover:underline"
              >
                <LocateFixed className="size-4" aria-hidden="true" /> Use my location
              </button>
              {locationMenuOpen && (
                <div className="absolute left-0 top-12 z-20 min-w-60 rounded-lg border border-border bg-popover p-1.5 shadow-lg">
                  {[
                    "Bengaluru, Karnataka",
                    "Indiranagar, Bengaluru",
                    "Koramangala, Bengaluru",
                    "Jayanagar, Bengaluru",
                  ].map((place) => (
                    <button
                      key={place}
                      type="button"
                      onClick={() => {
                        setLocation(place);
                        setLocationMenuOpen(false);
                      }}
                      className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-accent"
                    >
                      {place}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                setSubmittedQuery(query);
                document.getElementById("providers")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="mt-3 flex max-w-[37rem] items-center gap-2 rounded-xl border border-border bg-background p-1.5 shadow-sm"
            >
              <Search className="ml-2 size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
              <Input
                aria-label="Search animal-care providers"
                placeholder="Search vets, clinics, pet boarding, NGOs..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-11 min-w-0 border-0 bg-transparent px-1 text-sm shadow-none focus-visible:ring-0"
              />
              <Button type="submit" className="h-10 shrink-0 rounded-lg px-4">
                <span className="hidden sm:inline">Search</span>
                <ArrowRight className="sm:hidden" aria-hidden="true" />
              </Button>
            </form>
            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <BadgeCheck className="size-4 shrink-0 text-primary" aria-hidden="true" />
              <span>Thoughtfully gathered. Community minded. Made for every kind of animal.</span>
            </div>
          </div>
          <div
            role="img"
            aria-label="A veterinarian caring for a dog and a cat"
            className="hero-photo relative min-h-56 bg-[image:var(--hero-image)] lg:min-h-full"
            style={{ "--hero-image": `url(${vetPhoto})` } as React.CSSProperties}
          >
            <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 rounded-xl border border-background/60 bg-background/95 p-3 shadow-md sm:bottom-5 sm:left-5 sm:right-auto sm:max-w-[18rem] sm:p-3.5">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-success text-success-foreground">
                <Heart className="size-5 fill-current" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold">Their care team is out there.</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Let's help you find them.</p>
              </div>
            </div>
            <span className="absolute right-4 top-4 grid size-10 place-items-center rounded-xl bg-background/90 text-primary shadow sm:right-5 sm:top-5">
              <Sparkles className="size-5" aria-hidden="true" />
            </span>
          </div>
        </div>
      </section>

      <section className="site-shell pt-8 sm:pt-10" aria-labelledby="categories-heading">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase text-primary">A GOOD PLACE TO START</p>
            <h2 id="categories-heading" className="font-display mt-1 text-2xl sm:text-[1.75rem]">
              What kind of care are you looking for?
            </h2>
          </div>
          <span className="hidden text-sm text-muted-foreground sm:block">
            Care for every kind of companion.
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map(({ label, icon: Icon, hint }) => {
            const selected = selectedCategory === label;
            return (
              <button
                key={label}
                type="button"
                onClick={() => setSelectedCategory((current) => (current === label ? null : label))}
                aria-pressed={selected}
                className={`group min-h-[7rem] rounded-xl border p-3.5 text-left transition-all sm:min-h-[7.5rem] ${selected ? "border-primary bg-success ring-1 ring-primary" : "border-border bg-card hover:border-primary/40 hover:bg-hero"}`}
              >
                <span
                  className={`grid size-9 place-items-center rounded-lg ${selected ? "bg-primary text-primary-foreground" : "bg-hero text-primary"}`}
                >
                  <Icon className="size-[1.15rem]" aria-hidden="true" />
                </span>
                <span className="mt-2 block text-[0.83rem] font-semibold leading-snug">
                  {label}
                </span>
                <span className="mt-0.5 block text-[0.7rem] leading-snug text-muted-foreground">
                  {hint}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section id="providers" className="site-shell pb-14 pt-10 sm:pb-20 sm:pt-14">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-4 sm:mb-6">
          <div>
            <p className="text-xs font-bold uppercase text-primary">GOOD PEOPLE, CLOSE BY</p>
            <h2 className="font-display mt-1 text-3xl sm:text-[2rem]">
              Care around {location.split(",")[0]}
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Find a little help, a lot of heart, and the right care for them.
            </p>
          </div>
          <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end">
            <span aria-live="polite" className="text-sm text-muted-foreground">
              <strong className="text-foreground">{matchingProviders.length}</strong>{" "}
              {matchingProviders.length === 1 ? "place" : "places"} to explore
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMobileFiltersOpen((open) => !open)}
              aria-expanded={mobileFiltersOpen}
              className="lg:hidden"
            >
              <SlidersHorizontal aria-hidden="true" /> Filters
            </Button>
            <label className="hidden items-center gap-2 text-sm sm:flex">
              <span className="text-muted-foreground">Sort by</span>
              <select
                aria-label="Sort providers"
                className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                defaultValue="recommended"
              >
                <option value="recommended">Recommended</option>
                <option value="rating">Top rated</option>
                <option value="distance">Nearest first</option>
              </select>
            </label>
          </div>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[14.5rem_minmax(0,1fr)] lg:gap-8">
          <aside
            className={`${mobileFiltersOpen ? "block" : "hidden"} rounded-xl border border-border bg-card p-4 lg:sticky lg:top-24 lg:block`}
            aria-label="Filter animal-care providers"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-semibold">
                <Filter className="size-4 text-primary" aria-hidden="true" /> Refine your search
              </h3>
              <Button
                variant="link"
                size="sm"
                onClick={resetFilters}
                className="h-auto px-1 text-xs text-primary"
              >
                Clear all
              </Button>
            </div>
            <div className="space-y-4">
              <div className="border-b border-border pb-4">
                <label className="flex cursor-pointer items-center justify-between gap-3 text-sm">
                  <span>
                    <span className="block font-medium">Open now or 24/7</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      Care that's available
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    checked={openOr24x7}
                    onChange={(event) => setOpenOr24x7(event.target.checked)}
                    className="size-4 shrink-0 accent-primary"
                  />
                </label>
              </div>
              <div className="border-b border-border pb-4">
                <label className="flex cursor-pointer items-center justify-between gap-3 text-sm">
                  <span>
                    <span className="block font-medium">Emergency ambulance</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      For urgent journeys
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    checked={emergencyAmbulance}
                    onChange={(event) => setEmergencyAmbulance(event.target.checked)}
                    className="size-4 shrink-0 accent-primary"
                  />
                </label>
              </div>
              <fieldset className="border-b border-border pb-4">
                <legend className="mb-2.5 text-sm font-medium">Animal type</legend>
                <div className="grid grid-cols-2 gap-x-2 gap-y-2.5">
                  {animalTypes.map((animal) => {
                    const Icon = iconForAnimal(animal);
                    return (
                      <label
                        key={animal}
                        className="flex cursor-pointer items-center gap-2 text-xs"
                      >
                        <input
                          type="checkbox"
                          checked={selectedAnimals.includes(animal)}
                          onChange={() => toggleAnimal(animal)}
                          className="size-3.5 accent-primary"
                        />
                        <Icon
                          className="size-3.5 shrink-0 text-muted-foreground"
                          aria-hidden="true"
                        />
                        {animal}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
              <div className="border-b border-border pb-4">
                <label className="flex cursor-pointer items-center justify-between gap-3 text-sm">
                  <span>
                    <span className="block font-medium">Verified providers</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      Reviewed for this directory
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(event) => setVerifiedOnly(event.target.checked)}
                    className="size-4 shrink-0 accent-primary"
                  />
                </label>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="distance" className="text-sm font-medium">
                    Distance
                  </label>
                  <span className="text-sm font-semibold text-primary">{maxDistanceKm} km</span>
                </div>
                <input
                  id="distance"
                  aria-label="Maximum distance in kilometers"
                  type="range"
                  min={2}
                  max={20}
                  step={1}
                  value={maxDistanceKm}
                  onChange={(event) => setMaxDistanceKm(Number(event.target.value))}
                  className="distance-slider w-full"
                />
                <div className="mt-1.5 flex justify-between text-[0.7rem] text-muted-foreground">
                  <span>2 km</span>
                  <span>20 km</span>
                </div>
              </div>
            </div>
          </aside>

          <div className="min-w-0">
            {(selectedCategory ||
              emergencyAmbulance ||
              openOr24x7 ||
              verifiedOnly ||
              selectedAnimals.length > 0 ||
              submittedQuery) && (
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">Showing:</span>
                {selectedCategory && (
                  <FilterChip label={selectedCategory} onRemove={() => setSelectedCategory(null)} />
                )}
                {emergencyAmbulance && (
                  <FilterChip
                    label="Emergency ambulance"
                    onRemove={() => setEmergencyAmbulance(false)}
                  />
                )}
                {openOr24x7 && (
                  <FilterChip label="Open now or 24/7" onRemove={() => setOpenOr24x7(false)} />
                )}
                {verifiedOnly && (
                  <FilterChip label="Verified" onRemove={() => setVerifiedOnly(false)} />
                )}
                {selectedAnimals.map((animal) => (
                  <FilterChip key={animal} label={animal} onRemove={() => toggleAnimal(animal)} />
                ))}
                {submittedQuery && (
                  <FilterChip
                    label={`“${submittedQuery}”`}
                    onRemove={() => {
                      setSubmittedQuery("");
                      setQuery("");
                    }}
                  />
                )}
              </div>
            )}
            <div className="space-y-3">
              {matchingProviders.map((provider, index) => (
                <ProviderCard
                  key={provider.id}
                  provider={provider}
                  featured={index === 0 && !selectedCategory}
                  onAction={(action) => showDialog({ kind: action, provider })}
                />
              ))}
              {matchingProviders.length === 0 && (
                <div className="flex min-h-[18rem] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 text-center">
                  <span className="grid size-12 place-items-center rounded-full bg-hero text-primary">
                    <PawPrint className="size-6" aria-hidden="true" />
                  </span>
                  <h3 className="font-display mt-4 text-2xl">No matches just yet</h3>
                  <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
                    Try a different animal-care category or widen your search distance to find their
                    people.
                  </p>
                  <Button variant="outline" onClick={resetFilters} className="mt-4">
                    Clear filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-hero">
        <div className="site-shell flex flex-col items-start justify-between gap-5 py-7 sm:flex-row sm:items-center sm:py-8">
          <div className="flex items-start gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-background text-primary">
              <HeartHandshake className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-display text-[1.35rem] sm:text-2xl">
                Better care grows together.
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                Spot outdated info or know a local animal NGO? Help the whole community find the
                right care.
              </p>
            </div>
          </div>
          <div className="flex w-full flex-wrap gap-2 sm:w-auto">
            <Button variant="outline" onClick={() => showDialog({ kind: "correction" })}>
              Submit a correction <ArrowRight aria-hidden="true" />
            </Button>
            <Button onClick={() => showDialog({ kind: "listing" })}>
              List your facility for free <ArrowRight aria-hidden="true" />
            </Button>
          </div>
        </div>
      </section>

      <footer className="site-shell flex flex-col items-start justify-between gap-2 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
        <a href="#top" className="flex items-center gap-1.5 font-semibold text-foreground">
          <PawPrint className="size-3.5 text-primary" aria-hidden="true" /> pawcare
        </a>
        <p>
          Care should never have to be hard to find.{" "}
          <span className="ml-1">
            Made with <Heart className="inline size-3 text-emergency" aria-label="love" />
          </span>
        </p>
        <p>Example listings · Bengaluru</p>
      </footer>

      <Dialog
        open={dialog !== null}
        onOpenChange={(open) => {
          if (!open) setDialog(null);
        }}
      >
        <DialogContent className="max-h-[90svh] overflow-y-auto sm:rounded-xl">
          <DialogHeader>
            <DialogTitle className="pr-7">
              {submissionComplete ? "Thank you for caring" : dialogTitle}
            </DialogTitle>
            <DialogDescription>
              {submissionComplete
                ? "Your details have been noted in this PawCare demo. No facility has been contacted."
                : dialog?.kind === "call"
                  ? "This example directory doesn't have live phone numbers yet."
                  : dialog?.kind === "appointment"
                    ? "Share the best way to reach you. This demo won't send requests to a real clinic."
                    : "Share a few details to help animal lovers across the community."}
            </DialogDescription>
          </DialogHeader>
          {submissionComplete ? (
            <div className="flex items-start gap-3 rounded-lg bg-success p-4 text-sm text-success-foreground">
              <Check className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
              <p>All set. Your request is saved in this demo only.</p>
            </div>
          ) : dialog?.kind === "call" ? (
            <div className="rounded-lg bg-hero p-4">
              <p className="text-sm font-medium">{dialog.provider.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {dialog.provider.timing} · {dialog.provider.location}
              </p>
            </div>
          ) : (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setSubmissionComplete(true);
              }}
              className="space-y-4"
            >
              {!isMessageDialog && (
                <div className="flex items-center gap-2 rounded-lg bg-hero p-3 text-sm">
                  <MapPin className="size-4 shrink-0 text-primary" aria-hidden="true" />
                  <span>
                    {dialog?.kind === "appointment"
                      ? dialog.provider.name
                      : "Local animal-care provider"}
                  </span>
                </div>
              )}
              <label className="block text-sm font-medium">
                {isMessageDialog ? "Your name or organization" : "Your name"}
                <Input
                  required
                  autoComplete="name"
                  placeholder={isMessageDialog ? "How should we address you?" : "Your name"}
                  className="mt-1.5"
                />
              </label>
              {isMessageDialog ? (
                <>
                  <label className="block text-sm font-medium">
                    {dialog?.kind === "correction"
                      ? "What needs updating?"
                      : "Facility name and location"}
                    <textarea
                      required
                      rows={3}
                      placeholder={
                        dialog?.kind === "correction"
                          ? "Share the provider and the updated details…"
                          : "Tell animal lovers a little about your facility…"
                      }
                      className="mt-1.5 w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                  </label>
                  <label className="block text-sm font-medium">
                    Contact email{" "}
                    <Input
                      required
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      className="mt-1.5"
                    />
                  </label>
                </>
              ) : (
                <>
                  <label className="block text-sm font-medium">
                    Phone number
                    <Input
                      required
                      type="tel"
                      autoComplete="tel"
                      placeholder="Your phone number"
                      className="mt-1.5"
                    />
                  </label>
                  <label className="block text-sm font-medium">
                    Anything we should know?
                    <textarea
                      rows={2}
                      placeholder="A good time to reach you, or a note about your companion"
                      className="mt-1.5 w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                  </label>
                </>
              )}
              <Button type="submit" className="w-full">
                {dialog?.kind === "appointment"
                  ? "Continue in demo"
                  : isMessageDialog
                    ? "Submit in demo"
                    : "Continue in demo"}
                <ArrowRight aria-hidden="true" />
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex min-h-7 items-center gap-1 rounded-full bg-success px-2.5 py-1 text-xs font-medium text-success-foreground">
      {label}
      <button
        type="button"
        aria-label={`Remove ${label} filter`}
        onClick={onRemove}
        className="ml-0.5 grid size-4 place-items-center rounded-full hover:bg-background/70"
      >
        <X className="size-3" aria-hidden="true" />
      </button>
    </span>
  );
}

function ProviderCard({
  provider,
  featured,
  onAction,
}: {
  provider: Provider;
  featured: boolean;
  onAction: (action: "appointment" | "call") => void;
}) {
  const categoryIcon =
    provider.category === "Veterinary Clinics"
      ? Stethoscope
      : provider.category === "24/7 Hospitals"
        ? Hospital
        : provider.category === "Pet Boarding"
          ? TentTree
          : provider.category === "Diagnostics"
            ? Bandage
            : provider.category === "Ambulances"
              ? BriefcaseMedical
              : HeartHandshake;
  const CategoryIcon = categoryIcon;
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${provider.name}, ${provider.location}`)}`;

  return (
    <article
      className={`relative overflow-hidden rounded-xl border bg-card transition-colors hover:border-primary/35 ${featured ? "border-primary/35" : "border-border"}`}
    >
      {featured && (
        <span className="absolute right-0 top-0 flex items-center gap-1 rounded-bl-lg bg-success px-3 py-1.5 text-[0.67rem] font-semibold text-success-foreground">
          <Sparkles className="size-3" aria-hidden="true" /> A lovely local pick
        </span>
      )}
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3.5">
          <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-hero text-primary">
            <CategoryIcon className="size-5" aria-hidden="true" />
          </span>
          <div className={`min-w-0 flex-1 ${featured ? "pr-[7.5rem]" : ""}`}>
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
              <h3 className="text-[1.03rem] font-semibold leading-snug sm:text-[1.1rem]">
                {provider.name}
              </h3>
              {provider.verified && (
                <span className="inline-flex items-center gap-1 text-[0.7rem] font-semibold text-primary">
                  <BadgeCheck className="size-3.5" aria-hidden="true" /> Verified
                </span>
              )}
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="rounded bg-secondary px-2 py-0.5 text-[0.67rem] font-medium text-secondary-foreground">
                {provider.category}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold">
                <Star className="size-3.5 fill-rating text-rating" aria-hidden="true" />{" "}
                {provider.rating}{" "}
                <span className="font-normal text-muted-foreground">
                  ({provider.reviewCount} reviews)
                </span>
              </span>
            </div>
            <p className="mt-2 flex items-start gap-1.5 text-xs leading-relaxed text-muted-foreground">
              <MapPin className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" /> {provider.location}{" "}
              <span aria-hidden="true">·</span> {provider.distanceKm} km away
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-2 border-t border-border pt-3 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
            <span
              className={`inline-flex items-center gap-1.5 font-medium ${provider.isOpenNow ? "text-success-foreground" : "text-muted-foreground"}`}
            >
              <Clock3 className="size-3.5" aria-hidden="true" /> {provider.timing}
            </span>
            {provider.is24x7 && (
              <span className="inline-flex items-center gap-1 text-[0.68rem] font-semibold text-emergency">
                <CircleAlert className="size-3.5" aria-hidden="true" /> 24 / 7
              </span>
            )}
          </div>
          <span className="text-sm font-semibold sm:text-right">{provider.fee}</span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5" aria-label="Services offered">
          {provider.services.map((service) => (
            <span
              key={service}
              className="rounded-md bg-muted px-2 py-1 text-[0.68rem] text-muted-foreground"
            >
              {service}
            </span>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-2 border-t border-border pt-3 sm:flex-row">
          <Button
            onClick={() => onAction(provider.bookingLabel === "Call now" ? "call" : "appointment")}
            className="h-10 flex-1 rounded-lg"
          >
            <Phone className="size-4" aria-hidden="true" />
            {provider.bookingLabel}
          </Button>
          <Button asChild variant="outline" className="h-10 flex-1 rounded-lg">
            <a href={directionsUrl} target="_blank" rel="noreferrer">
              <Navigation className="size-4" aria-hidden="true" /> Get directions{" "}
              <ArrowDownRight className="ml-auto size-4 text-muted-foreground" aria-hidden="true" />
            </a>
          </Button>
        </div>
      </div>
    </article>
  );
}
