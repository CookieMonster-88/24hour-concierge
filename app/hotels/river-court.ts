// app/hotels/river-court.ts

export const RIVER_COURT = {
  id: "river-court",
  displayName: "River Court Hotel",
  location: "Kilkenny, Ireland",
  website: "https://www.rivercourthotel.com/",
  knowledge: `
RIVER COURT HOTEL — KNOWLEDGE BASE (DRAFT)

ABOUT
- Name: River Court Hotel
- Location: The Bridge, John Street, Kilkenny, Ireland

CHECK-IN / CHECK-OUT
- Check-in: Not provided
- Check-out: Not provided
- Early check-in: Subject to availability
- Late check-out: Subject to availability

PARKING
- Parking available: Yes
- Cost: Not confirmed
- How it works: Confirm with reception

BREAKFAST
- Breakfast available: Yes
- Times: Not provided
- Location: On-site restaurant

FACILITIES
- Restaurant
- Bar
- Free WiFi
- City centre location
- River views

POLICIES
- Pets: Not confirmed
- Smoking: Non-smoking property
- Cancellation: Depends on booking type

LOCAL INFO
- Overlooks River Nore
- Direct view of Kilkenny Castle
- Walking distance to city attractions

IMPORTANT RULE
- If unsure, respond:
  “I’m not certain — I can check with reception.”
- Never fabricate information.
`.trim(),
} as const;