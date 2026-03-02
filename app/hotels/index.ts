// app/hotels/index.ts
// Keep this file dead-simple so Vercel builds every time.
// No strict typing here — your hotel objects don’t all share the same shape yet.

export { DEMO } from "./demo";
export { PEMBROKE } from "./pembroke";

import { DEMO } from "./demo";
import { PEMBROKE } from "./pembroke";

export const HOTELS = {
  demo: DEMO,
  pembroke: PEMBROKE,
} as const;

export type HotelId = keyof typeof HOTELS;