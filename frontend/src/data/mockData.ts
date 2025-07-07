import type { Persona, FilterOption } from "../types";

export const mockPersonas: Persona[] = [
  {
    id: "1",
    name: "Ethan Carter",
    role: "Chief Marketing Officer (CMO)",
    department: "Marketing",
    avatar:
      "https://static.vecteezy.com/system/resources/thumbnails/027/951/137/small_2x/stylish-spectacles-guy-3d-avatar-character-illustrations-png.png",
    hasStartChat: false,
  },
  {
    id: "2",
    name: "David Lee",
    role: "Chief Business Officer (CBO)",
    department: "Sales",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQidULZph_aP3ma55diUiMYcbfKLd0mL069tw&s",
    hasStartChat: false,
  },
]

export const mockFilters: FilterOption[] = [
  { label: "Tech", value: "Tech", active: true },
  { label: "Marketing", value: "Marketing", active: false },
  { label: "Sales", value: "Sales", active: false },
];
