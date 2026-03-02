// app/hotels/pembroke.ts

export const PEMBROKE = {
  id: "pembroke",
  name: "Pembroke Hotel",
  contact: {
    // Put real details later. For now: keep them non-empty so the bot never says “I don’t have that”.
    phone: "+353 (0)56 000 0000",
    email: "reception@pembrokekilkenny.com",
  },
  knowledge: `
PEMBROKE HOTEL — KNOWLEDGE BASE

CHECK-IN / CHECK-OUT
- Standard check-in time: 16:00 – 23:00
- Standard check-out time: 04:00 – 12:00
- Minimum check-in age: 18

BREAKFAST
- Breakfast available: Yes
- Served on-site: Yes
- Award: Gold Medal Awards 2024 Silver Winner – Hotel Breakfast
- Breakfast in room available: Yes
- Special diet menus: Available on request
- Breakfast times: Not provided (do not guess)

PARKING
- Free private parking: Available
- How it works: Guests set down in front of hotel; staff direct guests to nearest available space
- Accessible parking: Available
- EV charging: Available (additional charge)

MOST POPULAR FACILITIES
- Free WiFi (all areas, free of charge)
- Restaurant: Statham’s Bar & Restaurant (onsite)
- Bar
- Spa & Wellness Centre (additional charge)
- Room service
- 24-hour front desk
- Non-smoking rooms
- Facilities for disabled guests

WELLNESS (ADDITIONAL CHARGE)
- Spa & Wellness Centre
- Massage
- Waxing services
- Facial treatments

POLICIES
- Pets: Not allowed
- Children: Welcome (all ages)
- Children 13+: Considered adults
- Cots: 0–2 years, free upon request
- Camp beds: Free up to 10 years, upon request
- Cancellation: Varies by accommodation type

LOCATION CONTEXT (DISTANCES)
- Kilkenny Castle: 200m
- St. Mary’s Medieval Mile Museum: 250m
- Kilkenny Railway Station: 800m
- Waterford Airport: 53km
- Dublin Airport: 136km
`,
} as const;