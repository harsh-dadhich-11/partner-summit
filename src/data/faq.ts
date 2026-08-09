import type { FaqCategory } from "@/types";

export const faqCategories: FaqCategory[] = [
  {
    icon: "pin",
    title: "About Partner Summit: Odyssey 2026",
    questions: [
      {
        question: "What is Odyssey 2026?",
        answers: [
          {
            text: "Odyssey is BOT's annual Partner Summit, bringing together partners, customers, employees, and leadership from around the world to connect, collaborate, celebrate achievements, and shape what's next. This is the second edition, building on last year's summit with more networking opportunities, leadership sessions, customer conversations, cultural experiences, family activities, and our Śrī Giving-Back Initiative.",
          },
        ],
      },
      {
        question: "When & where is the Summit?",
        answers: [{ text: "23–25 October 2026 · Ananta Spa & Resort, Jaipur, India." }],
      },
      {
        question: "Who can attend?",
        answers: [{ text: "BOT employees, partners, customers, invited guests, and family members." }],
      },
    ],
  },
  {
    icon: "check",
    title: "Registration & RSVP",
    questions: [
      {
        question: "How do I RSVP?",
        answers: [
          { label: "BOT Employees", text: "Use the Employee RSVP form shared internally." },
          { label: "Partners & Guests", text: "Use the RSVP button included in your invitation email." },
        ],
      },
      {
        question: "Can I update my RSVP?",
        answers: [
          {
            text: "Yes. If your travel plans change after submitting your RSVP, please contact the Odyssey Travel Team.",
          },
        ],
      },
      {
        question: "What information will I need during RSVP?",
        answers: [
          {
            text: "Depending on your attendee type, we may ask for: passport details, arrival & departure information, dietary preferences, family member details, emergency contact, and accommodation preferences.",
          },
        ],
      },
    ],
  },
  {
    icon: "plane",
    title: "Travel, Visa & Arrival",
    questions: [
      {
        question: "How should I plan my travel?",
        answers: [
          {
            label: "Airport",
            text: "Fly into Jaipur International Airport (JAI). If there are no direct flights, connect via Delhi before a domestic flight to Jaipur.",
          },
          {
            label: "Recommended Arrival",
            text: "Partners & international guests: arrive 22 October, one day before the Summit, to recover from travel and settle in comfortably.",
          },
          {
            text: "BOT employees: arrive 23 October, either driving directly to Ananta Spa & Resort or joining the BOT carpool from the office (details shared separately).",
          },
          { label: "Return Flights", text: "Book flights after the afternoon of 25 October." },
          {
            label: "Airport Transfers",
            text: "BOT will arrange transfers between Jaipur Airport and the resort for registered attendees.",
          },
        ],
      },
      {
        question: "Can I arrive early or stay longer?",
        answers: [
          {
            text: "Yes. Our Travel Team can assist with accommodation recommendations and bookings before or after the Summit.",
          },
        ],
      },
      {
        question: "Do I need a visa?",
        answers: [
          {
            text: "Visa requirements depend on your nationality. If required, BOT can provide Visa Invitation Letters.",
          },
        ],
      },
    ],
  },
  {
    icon: "luggage",
    title: "Before You Travel",
    questions: [
      {
        question: "What should I do before travelling?",
        answers: [
          {
            text: "Make sure you have: passport, visa (if required), flight confirmation, hotel details, offline Google Maps, digital & printed copies of travel documents, and Odyssey emergency contacts.",
          },
        ],
      },
      {
        question: "What should I pack?",
        layout: "cols",
        answers: [
          { label: "Travel essentials", text: "Passport, wallet, cards, Indian Rupees (recommended)" },
          { label: "Electronics", text: "Laptop, universal adapter, chargers, power bank" },
          {
            label: "Clothing",
            text: "Business casual, Indian festive outfit for Cultural Night, comfortable shoes, sportswear (optional)",
          },
          { label: "Personal items", text: "Sunglasses, sunscreen, medication, toiletries" },
        ],
      },
      {
        question: "What's the weather like?",
        answers: [
          {
            text: "Late October is pleasant — 25–30°C during the day with comfortable evenings. Light cotton clothing is recommended.",
          },
        ],
      },
      {
        question: "Any packing tips?",
        answers: [
          {
            text: "Leave extra room in your suitcase — you'll likely head home with BOT merchandise, gifts, and Jaipur souvenirs.",
          },
        ],
      },
    ],
  },
  {
    icon: "landing",
    title: "Airport & Customs Guide",
    questions: [
      {
        question: "What should I expect when I arrive at Jaipur Airport?",
        answers: [
          {
            text: "Immigration → biometric verification → baggage collection → customs → arrivals hall → meet the BOT transfer team.",
          },
          {
            label: "Immigration",
            text: "Keep your passport, visa, boarding pass, hotel address, and return flight details ready to help speed things up.",
          },
          {
            label: "Biometric verification",
            text: "Look for the designated counters immediately after immigration, if required.",
          },
          { label: "Baggage collection", text: "Double-check you've collected all luggage before exiting." },
          {
            label: "Customs",
            text: "If carrying items requiring declaration, use the appropriate channel — ask an officer if unsure.",
          },
          { label: "Arrivals hall", text: "Follow the airport pickup instructions shared by the Odyssey team." },
        ],
      },
      {
        question: "Any airport tips for international travellers?",
        answers: [
          {
            text: "Complete any required online arrival forms before departure. Don't rely on airport Wi-Fi — it may require QR code registration. Keep your passport, visa, hotel address, and boarding pass easily accessible. If travelling on an e-Visa, use the designated e-Visa counters. Carry a charged phone and power bank, and save important documents offline.",
          },
        ],
      },
      {
        question: "How do I find my airport transfer?",
        answers: [
          {
            text: "Follow the pickup instructions shared before your flight and look for BOT representatives after Arrivals. Contact the Travel Desk if you need assistance. The resort is approximately 45–60 minutes from Jaipur Airport.",
          },
        ],
      },
    ],
  },
  {
    icon: "bed",
    title: "Accommodation & Stay",
    questions: [
      {
        question: "Where will I stay?",
        answers: [{ text: "All attendees will stay at Ananta Spa & Resort, Jaipur." }],
      },
      {
        question: "What is included with my Summit registration?",
        answers: [
          {
            text: "BOT covers accommodation, meals, Summit sessions, cultural events, and local transportation during official Summit dates. International travel and accommodation outside official Summit dates are not included.",
          },
        ],
      },
      {
        question: "Will Wi-Fi be available?",
        answers: [{ text: "Yes — complimentary Wi-Fi is available throughout the resort." }],
      },
      {
        question: "Can dietary requirements be accommodated?",
        answers: [{ text: "Absolutely. Please indicate them during RSVP." }],
      },
    ],
  },
  {
    icon: "calendar",
    title: "During the Summit",
    questions: [
      {
        question: "What can I expect during the Summit?",
        answers: [
          {
            text: "Over three days: leadership sessions, product demonstrations, fireside chats, breakout sessions, networking, wellness activities, the FunBug sports event, our Śrī Giving-Back Initiative, Cultural Night, a gala dinner, and awards & recognition. The detailed run of show will be shared closer to the event.",
          },
        ],
      },
      {
        question: "What's the dress code?",
        answers: [
          { label: "Leadership sessions", text: "Business casual" },
          { label: "Cultural Night & Gala", text: "Smart casual / Indian festive outfit" },
          { label: "Sports & wellness", text: "Comfortable activewear" },
        ],
      },
    ],
  },
  {
    icon: "users",
    title: "Families",
    questions: [
      {
        question: "Can I bring my family?",
        answers: [{ text: "Yes. Family members are welcome for designated activities." }],
      },
      {
        question: "Are there activities for children?",
        answers: [{ text: "Yes — dedicated kids' and family activities are planned throughout the Summit." }],
      },
    ],
  },
  {
    icon: "landmark",
    title: "Exploring Jaipur",
    questions: [
      {
        question: "What can I do if I'm extending my stay?",
        answers: [
          {
            text: "We recommend Amber Fort, Hawa Mahal, City Palace, Jantar Mantar, Johari Bazaar, and Bapu Bazaar. Jaipur is known as the Pink City and offers a rich blend of history, culture, shopping, and cuisine.",
          },
        ],
      },
    ],
  },
  {
    icon: "help",
    title: "Contact Us",
    questions: [
      {
        question: "Need help?",
        answers: [
          {
            label: "Travel Desk",
            text: "partnersummit@botconsulting.io",
            href: "mailto:partnersummit@botconsulting.io",
          },
          { label: "Phone", text: "+91 92567 68903 | +91 85519 60354" },
        ],
      },
    ],
  },
];
