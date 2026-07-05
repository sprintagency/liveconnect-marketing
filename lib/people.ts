/** Sample directory data (placeholder, human-sounding) from the design handoff. */
export type Person = {
  face: string;
  name: string;
  role: string;
  company: string;
  industry: string;
  online: boolean;
};

export const wallA: Person[] = [
  { face: "/assets/face-1.png", name: "Maya Thompson", role: "VP Marketing", company: "Talbot Media", industry: "Marketing", online: true },
  { face: "/assets/face-4.png", name: "Carlos Mendez", role: "Founder & CEO", company: "Cedar & Co.", industry: "Real Estate", online: true },
  { face: "/assets/face-7.png", name: "Priya Nair", role: "Operations Lead", company: "Ridgeway Freight", industry: "Logistics", online: true },
  { face: "/assets/face-3.png", name: "Lena Ortiz", role: "Growth Lead", company: "Draper Agency", industry: "Marketing", online: false },
  { face: "/assets/face-6.png", name: "Andre Wells", role: "Head of Partnerships", company: "Ellison Health", industry: "Sales", online: true },
  { face: "/assets/face-9.png", name: "Ryan Cho", role: "Associate", company: "Caldwell Partners", industry: "Venture Capital", online: false },
];

export const wallB: Person[] = [
  { face: "/assets/face-2.png", name: "David Cole", role: "Managing Director", company: "Continental Capital", industry: "Finance", online: false },
  { face: "/assets/face-5.png", name: "Susan Whitfield", role: "Board Advisor", company: "Whitfield Partners", industry: "Consulting", online: true },
  { face: "/assets/face-8.png", name: "Omar Haddad", role: "Creative Director", company: "Marsh Creative", industry: "Design", online: false },
  { face: "/assets/face-1.png", name: "Grace Abara", role: "People Partner", company: "Benson Group", industry: "HR", online: true },
  { face: "/assets/face-2.png", name: "Tom Fisher", role: "Principal", company: "Harbor Law", industry: "Legal", online: true },
  { face: "/assets/face-7.png", name: "Nadia Khan", role: "Supply Chain Dir.", company: "Ridgeway Freight", industry: "Logistics", online: false },
];

export const wallC: Person[] = [
  { face: "/assets/face-3.png", name: "Aiko Tanaka", role: "Head of Product", company: "Harlow Software", industry: "Technology", online: true },
  { face: "/assets/face-6.png", name: "Marcus Bell", role: "Sales Director", company: "Ellison Health", industry: "Healthcare", online: true },
  { face: "/assets/face-9.png", name: "Kevin Park", role: "Investment Partner", company: "Caldwell Partners", industry: "Venture Capital", online: true },
  { face: "/assets/face-4.png", name: "Diego Ramos", role: "Regional Manager", company: "Sutton Realty", industry: "Real Estate", online: false },
  { face: "/assets/face-5.png", name: "Ellen Frost", role: "Advisor", company: "Frost Group", industry: "Consulting", online: true },
  { face: "/assets/face-8.png", name: "Sam Rivera", role: "Brand Lead", company: "Marsh Creative", industry: "Design", online: true },
];

export const eventTypes: string[] = [
  "Chambers of commerce", "Summits", "Conferences", "Trade shows", "Expos",
  "Corporate mixers", "Galas & fundraisers", "Member networks", "Founder meetups",
  "Investor days", "Alumni reunions", "Networking breakfasts", "Product launches",
  "Award ceremonies", "Career fairs", "Community meetups",
];

export const cities: string[] = [
  "Dallas", "Austin", "Houston", "Nashville", "Denver",
  "Atlanta", "Phoenix", "Charlotte", "Chicago",
];
