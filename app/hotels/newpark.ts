// app/hotels/newpark.ts

export const NEWPARK = {
  id: "newpark",
  displayName: "Newpark Hotel",
  location: "Kilkenny, Ireland",
  website: "https://www.newparkhotel.com/",
  knowledge: `
NEWPARK HOTEL — KNOWLEDGE BASE (DRAFT)

ABOUT
- Name: Newpark Hotel
- Location: Castlecomer Road, Kilkenny, Ireland

CHECK-IN / CHECK-OUT
- Check-in: Not provided
- Check-out: Not provided
- Early check-in: Subject to availability
- Late check-out: Subject to availability

PARKING
- Parking available: Yes
- Free parking: Not confirmed

BREAKFAST
- Breakfast available: Yes
- Times: Not provided
- Location: On-site restaurant

FACILITIES
- Restaurant
- Bar
- Leisure Centre
- Swimming pool
- Spa
- Outdoor facilities
- Free WiFi

POLICIES
- Pets: Not confirmed
- Smoking: Non-smoking property
- Cancellation: Varies by rate

LOCAL INFO
- Short drive from Kilkenny City Centre
- Close to local attractions

IMPORTANT RULE
- If you are unsure, say:
  “I’m not certain — I can check with reception.”
- Do not guess.
`.trim(),
} as const;