// English site copy. `ar.ts` must mirror this shape (enforced by the Dictionary type).
// Text marked `// DRAFT` was written to fill panels whose full text wasn't in the
// supplied content: review before going live.

type Control = { id: string; name: string; short: string; what: string; why: string; portal?: string };
type FeedItem = {
  via: "web" | "teams" | "whatsapp" | "telegram" | "email" | "api";
  label: string;
  team: string;
  text: string;
  status: string;
  state: "done" | "review" | "working";
};
type Chart = {
  metric: string;
  actual: string;
  forecast: string;
  today: string;
  insights: string[];
  why: string;
  risk: string;
  actionTitle: string;
  action: string;
  approve: string;
};
type Product = {
  id: string;
  name: string;
  tagline: string;
  summary: string;
  points: string[];
  window: string;
  channels?: string[];
  journey?: string[];
  feed?: FeedItem[];
  chart?: Chart;
};

export const en = {
  founder: {
    label: "From our founders",
    quote: "\u201cNunmai exists to turn AI from a standalone chatbot into an operational capability for the entire organization.\u201d",
    people: [
      { name: "Imran Khan", role: "Founder", photoAlt: "Portrait of Imran Khan, Founder of Nunmai" },
      { name: "Sihabutheen Haq", role: "Co-founder & CEO", photoAlt: "Portrait of Sihabutheen Haq, Co-founder and CEO of Nunmai" },
      { name: "Samsul Hameed.S.A", role: "Founder", photoAlt: "Portrait of Samsul Hameed.S.A, Founder of Nunmai" },
    ],
  },
