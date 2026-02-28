// app/hotels/index.ts

import { PEMBROKE } from "./pembroke";
import { HOTEL_KILKENNY } from "./hotel-kilkenny";

// Add more hotels here later:
// import { LANGTONS } from "./langtons";
// import { ORMONDE } from "./kilkenny-ormonde";
// import { NEWPARK } from "./newpark";
// import { RIVER_COURT } from "./river-court";

export type HotelKB = {
  id: string;
  displayName: string;
  location: string;
  website?: string;
  knowledge: string;
};

export const HOTELS: Record<string, HotelKB> = {
  [PEMBROKE.id]: PEMBROKE,
  [HOTEL_KILKENNY.id]: HOTEL_KILKENNY,
  // langtons: LANGTONS,
  // "kilkenny-ormonde": ORMONDE,
  // newpark: NEWPARK,
  // "river-court": RIVER_COURT,
};

export const DEFAULT_HOTEL_ID = "pembroke";

export function getHotelById(id?: string | null): HotelKB {
  if (!id) return HOTELS[DEFAULT_HOTEL_ID];
  return HOTELS[id] ?? HOTELS[DEFAULT_HOTEL_ID];
}