// app/hotels/kilkenny-ormonde.ts

export const KILKENNY_ORMONDE = {
  id: "kilkenny-ormonde",
  displayName: "Kilkenny Ormonde Hotel",
  location: "Kilkenny, Ireland",
  website: "https://www.kilkennyormonde.com/",
  knowledge: `
KILKENNY ORMONDE HOTEL — KNOWLEDGE BASE (DRAFT)

ABOUT
- Name: Kilkenny Ormonde Hotel
- Location: Ormonde Street, Kilkenny, Ireland

CHECK-IN / CHECK-OUT
- Check-in: Not provided
- Check-out: Not provided
- Early check-in: Subject to availability
- Late check-out: Subject to availability

PARKING
- Parking available: Yes
- Cost: Not confirmed
- Accessible parking: Available

BREAKFAST
- Breakfast available: Yes
- Times: Not provided
- Location: On-site restaurant

FACILITIES
- Restaurant
- Bar
- Leisure Centre
- Swimming pool
- Gym
- Free WiFi

POLICIES
- Pets: Not confirmed
- Smoking: Non-smoking property
- Cancellation: Varies by booking type

LOCAL INFO
- City centre location
- Close to Kilkenny Castle
- Close to shops and restaurants

IMPORTANT RULE
- If unsure, say:
  “I’m not certain — I can check with reception.”
- Never invent details.
`.trim(),
} as const;