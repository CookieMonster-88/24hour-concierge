// app/hotels/langtons.ts

export const LANGTONS = {
  id: "langtons",
  displayName: "Langtons Hotel Kilkenny",
  location: "Kilkenny, Ireland",
  website: "https://www.langtons.ie/",
  knowledge: `
LANGTONS HOTEL — KNOWLEDGE BASE (DRAFT)

ABOUT
- Name: Langtons Hotel Kilkenny
- Location: John Street, Kilkenny, Ireland

CHECK-IN / CHECK-OUT
- Check-in: Not provided
- Check-out: Not provided
- Early check-in: Subject to availability
- Late check-out: Subject to availability

PARKING
- Parking available: Not confirmed
- Cost: Not confirmed
- How it works: Please confirm with reception

BREAKFAST
- Breakfast available: Yes
- Times: Not provided
- Location: On-site
- Special diets: Available on request

FACILITIES
- Restaurant
- Bar
- Event & wedding venue
- Free WiFi

POLICIES
- Pets: Not confirmed
- Smoking: Non-smoking property
- Cancellation: Varies by rate

LOCAL INFO
- Located in Kilkenny City Centre
- Walking distance to Kilkenny Castle
- Walking distance to Medieval Mile

IMPORTANT RULE
- If you’re not 100% sure, say:
  “I’m not certain — I can check with reception.”
- Never guess or invent information.
`.trim(),
} as const;