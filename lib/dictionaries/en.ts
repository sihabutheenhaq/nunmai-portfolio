// English site copy. `ar.ts` must mirror this shape (enforced by the Dictionary type).
// Text marked `// DRAFT` was written to fill panels whose full text wasn't in the
// supplied content: review before going live.

type Control = { id: string; name: string; short: string; what: string; why: string; portal?: string };
// Sample task shown in the AI Workforce product window (illustrative, not real traffic).
type FeedItem = {
  via: "web" | "teams" | "whatsapp" | "telegram" | "email" | "api";
  label: string;
  team: string;
  text: string;
  status: string;
  state: "done" | "review" | "working";
};
// Sample story shown in the Business Intelligence product window (illustrative data).
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
  meta: {
    title: "Nunmai | Private Enterprise AI, Powered by Nunmai Engine",
    description:
      "Nunmai Engine brings models, enterprise knowledge, AI agents, tools, governance and human approval into one secure platform, deployable in your cloud, private VPC or on-premise environment.",
  },

  ui: {
    skip: "Skip to content",
    home: "Nunmai home",
    signIn: "Sign in",
    signInPortal: "Sign in to the Nunmai Portal",
    requestPilot: "Request a Pilot",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    switchLabel: "العربية",
    switchAria: "View this page in Arabic",
    playAnimation: "Play background animation",
    pauseAnimation: "Pause background animation",
    live: "Live",
    sample: "Sample data",
    whyItMatters: "Why it matters",
    channels: "Channels",
    journey: "From data to decisions",
    play: "Play",
    videoUnavailable: "Video unavailable",
  },

  contact: {
    email: "ai@nunmai.in",
    phone: "+91 97919 77903",
    phoneHref: "tel:+919****7903",
    portal: "https://platform.nunmai.in/",
    location: "Kadayanallur, India",
    company: "Nunmai Private Limited",
    pilotMailto: "mailto:ai@nunmai.in?subject=Nunmai%20pilot%20request",
  },

  nav: [
    { label: "Home", href: "#top" },
    { label: "Platform", href: "#platform" },
    { label: "Engine", href: "#engine" },
    { label: "Why Nunmai", href: "#about" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#contact" },
  ],

  hero: {
    eyebrow: "Private Enterprise AI · Built for Your Environment",
    titleA: "Your Enterprise AI.",
    titleB: "Powered by",
    titleHighlight: "Nunmai Engine.",
    lead: "Nunmai Engine brings models, enterprise knowledge, AI agents, tools, governance, and human approval into one secure platform, deployable in your cloud, private VPC, or on-premise environment.",
    primary: { label: "Request a Pilot", href: "#contact" },
    secondary: { label: "Explore the Platform", href: "#platform" },
    // Sample conversation shown in the hero's product window (illustrative, not a real customer).
    console: {
      app: "Nunmai Portal",
      search: "Search",
      groups: [
        { title: "Workers", items: ["IT Service Desk", "HR Assistant", "Finance Ops", "Customer Care"] },
        { title: "Governance", items: ["Approvals", "Audit trail", "Policies"] },
      ],
      crumbs: ["Workers", "IT Service Desk"],
      title: "Conversation",
      chips: ["Local open model", "On-premise"],
      user: { name: "Sara", via: "via Teams", text: "My VPN stopped working after the password change." },
      agent: "Nunmai · IT worker",
      steps: ["Checked her identity in the directory", "Matched runbook VPN-07", "Prepared a credential reset"],
      approval: {
        label: "Needs approval",
        approved: "Approved by IT manager",
        text: "Reset VPN credentials for Sara",
        policy: "Policy: resets need a manager's approval",
        approve: "Approve",
        reject: "Reject",
      },
      done: "Done. Sara can connect again.",
      auditTitle: "Audit trail",
      audit: [
        { time: "10:42", text: "Request received · Teams" },
        { time: "10:42", text: "Identity verified" },
        { time: "10:43", text: "Runbook VPN-07 matched" },
        { time: "10:43", text: "Approval requested" },
        { time: "10:44", text: "Approved by IT manager" },
        { time: "10:44", text: "Reset done · ticket closed" },
      ],
    },
  },

  // Source: Nunmai Product Vision v0.1
  platform: {
    label: "Nunmai AI Engine",
    title: "One intelligent layer. Two core capabilities.",
    text: "Nunmai AI Engine is the core platform: the orchestration and intelligence layer between users, enterprise systems, business data, specialized AI agents and multiple AI models. It turns AI from a standalone chatbot into an operational capability for the entire organization.",
    cta: { label: "See it on your workflow", href: "#contact" },
    products: [
      {
        id: "workforce",
        name: "AI Workforce & Automation",
        tagline: "Specialized AI workers",
        summary: "AI workers that take repetitive work off your teams, reachable in the tools people already use.",
        window: "Nunmai Workers",
        channels: ["Web", "Teams", "WhatsApp", "Telegram", "Email", "API"],
        feed: [
          { via: "whatsapp", label: "WhatsApp", team: "HR", text: "How many leave days do I have left?", status: "Answered from the HR system", state: "done" },
          { via: "teams", label: "Teams", team: "IT", text: "Reset my VPN password", status: "Identity checked · reset done", state: "done" },
          { via: "email", label: "Email", team: "Finance", text: "Match invoice INV-2291 to its PO", status: "Waiting for finance approval", state: "review" },
          { via: "web", label: "Web", team: "Operations", text: "Set up Sara's access before Sunday", status: "3 workers coordinating", state: "working" },
          { via: "telegram", label: "Telegram", team: "Service", text: "Where is order #58213?", status: "Customer updated", state: "done" },
          { via: "api", label: "API", team: "IT", text: "Disk at 92% on db-02", status: "Cleanup approved · logged", state: "done" },
        ],
        points: ["IT, HR & finance", "Operations & service", "Multi-agent coordination", "Approved, audited actions"],
      },
      {
        id: "intelligence",
        name: "Business Intelligence & Foresight",
        tagline: "From Data to Gold",
        summary: "Turns the data you already own into forecasts, early warnings and clear next steps.",
        window: "Nunmai Foresight",
        journey: ["What happened", "Why", "What's next", "What to do"],
        chart: {
          metric: "Weekly demand",
          actual: "Actual",
          forecast: "Forecast",
          today: "Today",
          insights: ["Demand fell 20% in week 8", "Cause: a supplier delay", "Forecast: a peak in week 16", "Act now: reorder early"],
          why: "Supplier delay",
          risk: "Stock-out risk",
          actionTitle: "Next best action",
          action: "Reorder stock two weeks early",
          approve: "Send for approval",
        },
        points: ["Hidden pattern discovery", "Outcome prediction", "Early risk detection", "Next best action"],
      },
    ] as Product[],
  },

  about: {
    label: "Why we built Nunmai",
    title: "Nunmai means “goodness”.",
    story:
      "We spent years running identity, databases and email for regulated organisations. Nunmai Engine is built on what those 3 AM calls taught us.",
    rulesTitle: "Every pilot is measured against three rules:",
    rules: ["Acts only within permissions", "Leaves a record of everything", "Stops for a person when stakes are high"],
    principlesTitle: "How we work",
    principles: [
      { title: "Evidence before opinion", text: "Every recommendation is traced to logs, measurements or documentation." },
      { title: "Long horizon", text: "We design systems we would be comfortable operating five years from now." },
      { title: "Step-by-step verification", text: "Every change has a pre-check, a commit, a post-check and a rollback path." },
      { title: "Documentation as deliverable", text: "Every engagement ends with a runbook your team can use without us." },
    ],
    sectorsTitle: "Built for regulated organisations",
    sectors: [
      "Banking & financial services",
      "Government & public sector",
      "Healthcare",
      "Insurance",
      "Legal & professional services",
      "Education",
      "Large enterprise",
    ],
    lab: "Our research lab studies AI security, agent reliability, private retrieval and evaluation. The findings become guardrails inside Nunmai Engine.",
  },

  founder: {
    label: "From our founders",
    // DRAFT: line taken from the Nunmai Product Vision v0.1; confirm the wording with the founders.
    quote: "“Nunmai exists to turn AI from a standalone chatbot into an operational capability for the entire organization.”",
    // Portraits rotate in this order (photos are listed in components/Founder.tsx).
    people: [
      { name: "Sihabutheen Haq", role: "Co-founder & CEO", photoAlt: "Portrait of Sihabutheen Haq, Co-founder and CEO of Nunmai" },
      { name: "Abdalmohsen Almogel", role: "Founder", photoAlt: "Portrait of Abdalmohsen Almogel, Founder of Nunmai" },
    ],
  },

  explainer: {
    title: "Nunmai Engine in 40 seconds",
    duration: "0:41",
    // Drop the files from nunmai.in/video/ into public/video/ with these names.
    video: "/video/nunmai-engine-explainer.mp4",
    poster: "/video/nunmai-engine-explainer-poster.jpg",
  },

  engine: {
    label: "Nunmai Engine",
    title: "One engine. Every enterprise AI capability.",
    text: "Users reach it through the channels you enable. It decides which model and which tools to use under your policies. It works with the systems your business already runs on.",
    channelsTitle: "Requests come in through",
    channels: ["Web", "Portal", "API", "Email", "WhatsApp", "Telegram", "Enterprise apps"],
    systemsTitle: "Works with your systems",
    systems: [
      "Email & collaboration",
      "Document management",
      "ERP & finance",
      "CRM",
      "Ticketing & ITSM",
      "HR systems",
      "Databases",
      "Internal APIs",
      "Line-of-business applications",
    ],
    connectorsNote: "Connectors for your applications are configured during the pilot.",
    coreEyebrow: "Private AI operating layer",
    coreTitle: "Nunmai Engine",
    controls: [
      {
        id: "identity",
        name: "Identity & Permissions",
        short: "Who may see and do what",
        what: "Every request is scoped by organisation, department, role and user before anything else happens.",
        portal: "Departments, roles and per-user access are managed in the Nunmai Portal.",
        why: "AI answers only from what that person is allowed to see, so a chat window never becomes a back door.",
      },
      {
        id: "knowledge",
        name: "Enterprise Knowledge / RAG",
        short: "Answers grounded in your sources",
        // DRAFT
        what: "Answers are retrieved from your approved enterprise sources and returned with source references.",
        why: "People get answers from your documents, never from a public model's memory.",
      },
      {
        id: "routing",
        name: "Model Routing",
        short: "The right model, by policy",
        // DRAFT
        what: "Workloads route between local, enterprise-hosted and external models by security, capability, cost and policy.",
        why: "Confidential data stays on private models, and the model can change without rebuilding the workflow.",
      },
      {
        id: "orchestration",
        name: "Agent Orchestration",
        short: "Multi-step work, coordinated",
        // DRAFT
        what: "Multi-step work is coordinated across models, knowledge and tools as one governed workflow.",
        why: "Complex requests run end to end under the same permissions and the same audit trail.",
      },
      {
        id: "tools",
        name: "Tool Execution",
        short: "Approved actions only",
        // DRAFT
        what: "Agents act through APIs, tool servers and database connectors, limited to the tools you approve.",
        why: "AI can take real action without getting unrestricted access to your systems.",
      },
      {
        id: "memory",
        name: "Memory & Context",
        short: "Context that persists",
        // DRAFT
        what: "Relevant context persists across a conversation and a workflow, within each user's permissions.",
        why: "People don't have to repeat themselves, and context never crosses access boundaries.",
      },
      {
        id: "approval",
        name: "Human Approval",
        short: "A person decides the sensitive steps",
        // DRAFT
        what: "Wherever you decide an action is sensitive, the agent pauses, a person decides, and the decision is recorded.",
        why: "Sending communications, changing records, spending money: a person stays accountable for each one.",
      },
      {
        id: "audit",
        name: "Observability & Audit",
        short: "Every request on record",
        // DRAFT
        what: "Every request, source, tool call, approval and cost is recorded.",
        why: "You can show exactly what the AI did, with what data, and who approved it.",
      },
      {
        id: "security",
        name: "Security & Guardrails",
        short: "Policy around prompts, data and outputs",
        // DRAFT
        what: "Policy is enforced around prompts, data and outputs, and credentials are encrypted.",
        why: "Data stays in the environment you choose and never trains public models.",
      },
    ] as Control[],
  },

  // Labels inside the animated control illustrations (components/ControlVisuals.tsx)
  visuals: {
    identity: {
      role: "Finance · Analyst",
      rows: [
        { label: "Finance reports", ok: true },
        { label: "Contracts library", ok: true },
        { label: "HR salary data", ok: false },
      ],
    },
    knowledge: { files: ["Policy.pdf", "Contracts.xlsx", "Handbook.docx"] },
    routing: {
      request: "Confidential",
      models: ["Local model", "Private model", "Approved cloud AI"],
      chosen: "CHOSEN BY POLICY",
    },
    orchestration: { planner: "PLANNER", agents: ["Research", "Finance", "IT", "Comms"] },
    memory: {
      user: "Use the same vendor as last quarter.",
      remembered: "Remembered: Q2 vendor & terms",
      reply: "Drafted the order with your Q2 vendor and terms.",
    },
    approval: {
      badge: "Approval needed",
      task: "Send renewal notice to 2 vendors",
      approver: "Finance manager",
      initials: "FM",
      reject: "Reject",
      approve: "Approve",
      done: "Approved · logged",
    },
    audit: {
      title: "Audit trail",
      rec: "Rec",
      rows: [
        ["09:41:02", "Request received · WhatsApp"],
        ["09:41:03", "3 sources retrieved"],
        ["09:41:05", "Private model selected"],
        ["09:41:40", "Approved · Finance manager"],
        ["09:41:41", "Cost recorded"],
      ],
    },
    security: ["PII masked", "Credentials encrypted", "External share blocked"],
  },

  // Source: Nunmai Product Vision v0.1 (Initial Market Entry)
  operations: {
    eyebrow: "Initial market entry",
    title: "Where we start: AI-powered IT services",
    text: "IT services offer clear, measurable enterprise value and a strong environment to validate Nunmai Engine. IT is the first use case, not the boundary of the company: the same engine later supports other departments and prediction-driven business use cases.",
    items: [
      "Account provisioning",
      "Password-reset assistance",
      "Email configuration",
      "Access requests",
      "Endpoint support",
      "Infrastructure operations",
      "Knowledge support",
      "Ticket triage",
      "Approved automated remediation",
    ],
  },

  deployment: {
    label: "Model freedom · Private by design",
    title: "Any model. Any data centre. No lock-in.",
    text: "Pick where it runs and which models it uses. Your rules stay the same.",
    engine: "Nunmai Engine",
    // Shown as a stack: models on top, the engine in the middle, infrastructure below.
    models: {
      title: "Uses",
      options: [
        { id: "local", name: "Local open models", text: "Data never leaves" },
        // DRAFT
        { id: "private", name: "Private enterprise", text: "Hosted just for you" },
        // DRAFT
        { id: "cloud", name: "Approved cloud AI", text: "Only when policy allows" },
      ],
      defaultId: "local",
    },
    where: {
      title: "Runs on",
      options: [
        // DRAFT
        { id: "private-cloud", name: "Private cloud", text: "Isolated for you" },
        { id: "vpc", name: "Your VPC", text: "Inside your cloud account" },
        { id: "on-prem", name: "On-premise", text: "On your own servers" },
      ],
      defaultId: "on-prem",
    },
    alwaysTitle: "Always the same",
    always: ["Scoped access", "Full audit trail", "Smart model routing"],
    footnote: "Your data never trains public models.",
  },

  faq: {
    label: "FAQ",
    title: "Questions enterprises ask first.",
    intro: "Short answers. The written proposal after Discovery carries the detail. Something else? Email",
    introAfter: "and we reply within one business day.",
    items: [
      {
        q: "What is Nunmai Engine?",
        a: "The private AI operating layer under every Nunmai capability: orchestration, model routing, enterprise knowledge, memory, tools, identity, human approval, audit and guardrails. Both core capabilities, AI Workforce & Automation and Business Intelligence & Foresight, run on it.",
      },
      {
        q: "Can Nunmai run AI models locally?",
        a: "Yes. Nunmai Engine works with local inference servers, so open models run on your own hardware without prompts or data leaving your environment.",
      },
      {
        q: "Are we locked into one AI model?",
        a: "No. Workflows are separated from the model. Workloads route between local, enterprise-hosted and external models by security, capability, cost and policy, and the model can change without rebuilding the workflow.",
      },
      {
        q: "Can Nunmai connect to our existing applications?",
        a: "Through APIs, tool servers and database connectors, with agents limited to the tools you approve. Connectors for a specific application are configured during the pilot.",
      },
      {
        q: "How does Nunmai protect sensitive data?",
        a: "Data stays in the environment you choose. Access is scoped by organisation, department, role and user, credentials are encrypted, everything is logged, and your data never trains public models.",
      },
      {
        q: "Where is human approval used?",
        a: "Wherever you decide an action is sensitive: sending communications, changing records, spending money, anything with compliance impact. The agent pauses, a person decides, the decision is recorded.",
      },
      {
        q: "How does a pilot work, and what does it cost?",
        a: "Discovery scopes one workflow (1 to 2 weeks). The pilot runs it on Nunmai Engine with real users (4 to 6 weeks). Production hardens it (4 to 8 weeks). A fixed pilot fee, then an annual platform fee, quoted in writing after Discovery.",
      },
    ],
  },

  locations: {
    label: "Global presence",
    title: "Where you'll find us",
    text: "Nunmai works with organisations across the Gulf and India from three locations.",
    localTime: "Local time",
    items: [
      { id: "riyadh", city: "Riyadh", country: "Saudi Arabia" },
      { id: "dubai", city: "Dubai", country: "United Arab Emirates" },
      { id: "tenkasi", city: "Tenkasi", country: "India" },
    ],
  },

  cta: {
    badge: "Pilot programs now open for selected organizations",
    title: "Ready to run AI on your own terms?",
    text: "Tell us the workflow, the data it depends on, and where it must run. We come back with a scoped pilot proposal on Nunmai Engine. Delivery aligned with the NIST AI Risk Management Framework: Govern, Map, Measure, Manage.",
    secondary: { label: "Explore Nunmai Engine", href: "#engine" },
    phases: [
      { name: "Discovery", duration: "1–2 weeks", text: "Workflow, data audit, success metrics, written proposal." },
      { name: "Pilot", duration: "4–6 weeks", text: "One workflow on Nunmai Engine with real users and human review." },
      { name: "Production", duration: "4–8 weeks", text: "Hardening, guardrails, monitoring, access controls, training." },
    ],
    reachTitle: "Reach out directly",
    portalLabel: "Existing customer? Sign in to the Nunmai Portal",
  },

  footer: {
    tagline: "Your Enterprise AI. Powered by Nunmai Engine.",
    platformTitle: "Platform",
    engineLink: "Nunmai AI Engine",
    companyTitle: "Company",
    companyLinks: [
      { label: "Why Nunmai", href: "#about" },
      { label: "Nunmai Engine", href: "#engine" },
      { label: "FAQ", href: "#faq" },
      { label: "Contact", href: "#contact" },
    ],
    reachTitle: "Reach Us",
    rights: "All rights reserved.",
  },
};

export type Dictionary = typeof en;
