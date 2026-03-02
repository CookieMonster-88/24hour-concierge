// app/hotels/index.ts
//
// This file exists only to provide a single place to import hotels + keep TypeScript happy.
// Your hotels are NOT all the same shape (demo is structured; pembroke is string-based),
// so we use a flexible type here.

import { DEMO } from "./demo";
import { PEMBROKE } from "./pembroke";

export type HotelAny = {
  id: string;

  // Demo-style fields
  name?: string;
  description?: string;
  contact?: {
    phone?: string;
    email?: string;
    address?: string;
  };

  // Pembroke-style fields
  displayName?: string;
  location?: string;
  website?: string;
  knowledge?: string;

  // Allow extra fields without TS blowing up
  [key: string]: any;
};

export const HOTELS: Record<string, HotelAny> = {
  demo: DEMO,
  pembroke: PEMBROKE,
};

export function getHotelById(hotelIdRaw?: string | null): HotelAny {
  const key = (hotelIdRaw || "").toLowerCase().trim();
  return HOTELS[key] || HOTELS["demo"];
}

export function getHotelName(hotel: HotelAny): string {
  return hotel?.name || hotel?.displayName || "Hotel";
}

export function getHotelPhone(hotel: HotelAny): string {
  return hotel?.contact?.phone || "+353 (0)56 000 0000";
}

export function getHotelEmail(hotel: HotelAny): string {
  return hotel?.contact?.email || "demo@concierge24.ie";
}