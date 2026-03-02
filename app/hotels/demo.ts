// app/hotels/demo.ts

export type HotelKB = {
  id: string;
  name: string;
  description: string;
  contact: {
    phone: string;
    email: string;
    address?: string;
  };
  policies: {
    checkIn: string;
    earlyCheckIn: string;
    checkOut: string;
    lateCheckOut: string;
    pets: string;
    parking: string;
    smoking: string;
    cancellation: string;
  };
  breakfast: {
    location: string;
    weekdays: string;
    saturday: string;
    sunday: string;
    notes: string[];
    dietary: string[];
  };
  facilities: {
    wifi: string;
    gym: string;
    pool: {
      location: string;
      hours: string;
      lastEntry: string;
      rules: string[];
    };
    spa: string;
    accessibility: string;
    family: string;
    evCharging: string;
  };
  dining: {
    restaurant: {
      name: string;
      hours: string;
      dressCode: string;
      booking: string;
    };
    bar: {
      name: string;
      hours: string;
      food: string;
    };
    sampleMenu: {
      title: string;
      allergenNote: string;
      items: Array<{
        section: string;
        name: string;
        description: string;
        allergens: string;
        dietary: string[];
      }>;
    };
  };
  nearby: {
    walking: string[];
    transport: string[];
  };
};

export const DEMO: HotelKB = {
  id: "demo",
  name: "Demo Hotel",
  description:
    "A sample hotel knowledge base to demonstrate Concierge 24. Ask about check-in, breakfast, pool, parking, policies, dining, or nearby.",
  contact: {
    phone: "+353 (0)56 000 0000",
    email: "demo@concierge24.ie",
    address: "1 Demo Street, Kilkenny, Ireland",
  },
  policies: {
    checkIn: "Standard check-in starts at 15:00.",
    earlyCheckIn:
      "Early check-in may be available if your room is ready. If not available, luggage storage is offered until check-in time.",
    checkOut: "Standard check-out is by 11:00.",
    lateCheckOut:
      "Late check-out may be available for a fee, subject to availability. Please contact reception to request it.",
    pets: "Pets are not permitted. Assistance animals are welcome.",
    parking:
      "On-site parking is available (limited spaces). If full, reception can direct you to nearby parking options.",
    smoking:
      "This is a non-smoking property. Smoking is only permitted in designated outdoor areas.",
    cancellation:
      "Flexible rates: free cancellation up to 24 hours before arrival. Non-refundable rates cannot be changed or refunded.",
  },
  breakfast: {
    location: "Breakfast is served in the River Room (ground floor).",
    weekdays: "Mon–Fri: 07:00–10:00",
    saturday: "Saturday: 07:30–10:30",
    sunday: "Sunday: 08:00–11:00",
    notes: [
      "Takeaway breakfast bags can be arranged for early departures (request the night before).",
      "Peak times are typically 08:30–09:30.",
    ],
    dietary: [
      "Gluten-free options available on request.",
      "Dairy-free options available on request.",
      "Vegetarian options available daily.",
      "Vegan options available with advance notice.",
      "Allergen information is available for menu items.",
    ],
  },
  facilities: {
    wifi: "Free high-speed Wi-Fi is available throughout the hotel.",
    gym: "Gym hours: 06:00–22:00. Towels and water are provided.",
    pool: {
      location: "Leisure Centre (Level -1).",
      hours: "Pool hours: 07:00–21:00 daily",
      lastEntry: "Last entry is 20:30.",
      rules: [
        "Children must be supervised by an adult at all times.",
        "No glass permitted in the pool area.",
      ],
    },
    spa: "Spa treatments are available by appointment. Reception can book a slot.",
    accessibility:
      "Step-free access is available to main areas. Accessible rooms are available (request when booking).",
    family:
      "Family rooms are available. Cots can be provided on request (subject to availability).",
    evCharging:
      "EV charging is available on-site for an additional charge (subject to availability).",
  },
  dining: {
    restaurant: {
      name: "The River Room",
      hours: "Dinner: 17:30–21:30",
      dressCode: "Smart casual",
      booking: "Walk-ins welcome, but booking is recommended on weekends.",
    },
    bar: {
      name: "The Lobby Bar",
      hours: "Daily: 12:00–23:30",
      food: "Bar food available daily: 12:00–21:00",
    },
    sampleMenu: {
      title: "Sample Menu (Demo)",
      allergenNote:
        "Allergens are listed per item. If you have severe allergies, please contact reception before ordering.",
      items: [
        {
          section: "Breakfast",
          name: "Full Irish Breakfast",
          description:
            "Sausages, rashers, egg, black & white pudding, grilled tomato, mushrooms, baked beans.",
          allergens: "Eggs, Sulphites",
          dietary: [],
        },
        {
          section: "Breakfast",
          name: "Gluten-Free Porridge",
          description:
            "Warm oats with berries and honey. Can be made dairy-free on request.",
          allergens: "May contain Nuts",
          dietary: ["Gluten-free option", "Dairy-free on request", "Vegetarian"],
        },
        {
          section: "Lunch",
          name: "Vegan Buddha Bowl",
          description:
            "Roasted vegetables, quinoa, chickpeas, avocado, tahini dressing.",
          allergens: "Sesame",
          dietary: ["Vegan", "Vegetarian", "Gluten-free option"],
        },
        {
          section: "Dinner",
          name: "Pan-Seared Salmon",
          description: "Seasonal greens, baby potatoes, lemon butter sauce.",
          allergens: "Fish, Milk",
          dietary: ["Gluten-free option"],
        },
      ],
    },
  },
  nearby: {
    walking: [
      "City centre: 5–10 minutes walk (depending on route).",
      "Local pubs & restaurants: 3–12 minutes walk.",
    ],
    transport: [
      "Taxi: reception can call a taxi on request.",
      "Bus/train: ask reception for the quickest route from your location.",
    ],
  },
};

// Compatibility exports
export const hotel = DEMO;
export default DEMO;