type Control = { id: string; name: string; short: string; what: string; why: string; portal?: string };
type FeedItem = { via: "web" | "teams" | "whatsapp" | "telegram" | "email" | "api"; label: string; team: string; text: string; status: string; state: "done" | "review" | "working" };
type Chart = { metric: string; actual: string; forecast: string; today: string; insights: string[]; why: string; risk: string; actionTitle: string; action: string; approve: string };
type Product = { id: string; name: string; tagline: string; summary: string; points: string[]; window: string; channels?: string[]; journey?: string[]; feed?: FeedItem[]; chart?: Chart };
export const en = {
  meta: { title: "Nunmai | Private Enterprise AI, Powered by Nunmai Engine", description: "Nunmai Engine brings models, enterprise knowledge, AI agents, tools, governance and human approval into one secure platform." },
  ui: { skip:"Skip",home:"Nunmai",signIn:"Sign in",signInPortal:"Sign in",requestPilot:"Request a Pilot",openMenu:"Open",closeMenu:"Close",switchLabel:"العربية",switchAria:"Arabic",playAnimation:"Play",pauseAnimation:"Pause",live:"Live",sample:"Sample",whyItMatters:"Why",channels:"Channels",journey:"Journey",play:"Play",videoUnavailable:"Unavailable" },
  contact:{email:"ai@nunmai.in",phone:"+91 97919 77903",phoneHref:"tel:+919791977903",portal:"https://platform.nunmai.in/",location:"Kadayanallur, India",company:"Nunmai Private Limited",pilotMailto:"mailto:ai@nunmai.in"},
  nav:[],hero:{},platform:{},about:{},explainer:{},engine:{},visuals:{},operations:{},deployment:{},faq:{},locations:{},cta:{},footer:{},
  founder: {
    label: "From our founders",
    quote: "Nunmai exists to turn AI from a standalone chatbot into an operational capability for the entire organization.",
    people: [
      { name: "Imran Khan", role: "Founder", photoAlt: "Portrait of Imran Khan, Founder of Nunmai" },
      { name: "Sihabutheen Haq", role: "Co-founder & CEO", photoAlt: "Portrait of Sihabutheen Haq, Co-founder and CEO of Nunmai" },
      { name: "Samsul Hameed.S.A", role: "Founder", photoAlt: "Portrait of Samsul Hameed.S.A, Founder of Nunmai" },
    ],
  },
} as Dictionary;
