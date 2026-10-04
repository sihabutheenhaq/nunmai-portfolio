/**
 * Privacy Policy and Terms of Service (English; the same text is served under /en and /ar).
 * The Google section follows the Google API Services User Data Policy, which the OAuth consent screen links to:
 * keep it accurate to what the platform really does with Google data, and change it together with the code.
 */
export type LegalSection = { title: string; body: string[] };
export type LegalDoc = { title: string; updated: string; intro: string; sections: LegalSection[] };

const CONTACT = "ai@nunmai.in";
const COMPANY = "Nunmai Private Limited";

export const privacy: LegalDoc = {
  title: "Privacy Policy",
  updated: "5 October 2026",
  intro: `${COMPANY} ("Nunmai", "we") runs the Nunmai platform: AI assistants and agents that organisations and individuals use through our portals (such as inside.nunmai.in, platform.nunmai.in and chat.nunmai.in), WhatsApp, email and meetings. This policy explains what we collect, why, and the choices you have.`,
  sections: [
    {
      title: "What we collect",
      body: [
        "Account details: your name, email address and the organisation or personal workspace you belong to, from your invitation or from the sign-in provider you use.",
        "What you give your assistants: messages, voice notes, files and instructions, and the replies and documents they produce for you.",
        "Connected apps: when you connect an app (for example Google, Microsoft or Zoho), the data that app returns while your assistants work on a request you or your organisation asked for. The sign-in token for that app is stored encrypted.",
        "Usage and records: which assistant ran, how long it took, how much it cost, and an audit trail of actions, so your organisation can review and bill what happened.",
      ],
    },
    {
      title: "How we use it",
      body: [
        "To run the service you asked for: answer, draft, look things up and carry out the tasks you or your organisation approved.",
        "To keep it safe and working: security monitoring, fixing faults, preventing abuse and keeping the audit trail.",
        "We do not sell personal data and we do not use it for advertising.",
      ],
    },
    {
      title: "Google user data",
      body: [
        "If you connect a Google account, Nunmai can access only what you approve on Google's consent screen: Gmail messages and labels, Google Calendar events, Google Drive files (reading, and the files Nunmai creates), Google Docs, Google Sheets and Google Contacts.",
        "Use: we use this data only to do what you ask your assistants to do in your workspace, for example summarise or tidy your inbox, check your calendar, read a document or update a sheet, and to show you the result. Sending an email or an invitation, and changing your mailbox, waits for your approval when your settings say so. Nunmai cannot permanently delete your mail or files: cleaning mail moves it to Gmail's Trash.",
        "Sharing: Google data is not sold, not used for advertising and not transferred to anyone except as needed to provide the features you use. To answer a request, the relevant content is processed by the AI model service that runs your assistant, under terms that do not allow it to use the data for its own purposes. We may also disclose data where the law requires it.",
        "AI training: Google user data is never used to develop, improve or train generalised AI or machine-learning models.",
        "Human access: no person at Nunmai reads your Google data unless you ask us to for support, it is needed for security or abuse investigation, or the law requires it.",
        "Storage: your Google sign-in token is stored encrypted on servers operated by Nunmai. Content an assistant reads is used for the request; what it reports back stays in your chat or task history in your workspace until you delete it.",
        "Your control: disconnect Google at any time on the Connectors page (the token is deleted at once) or revoke access at myaccount.google.com/permissions.",
        "Nunmai's use and transfer to any other app of information received from Google APIs will adhere to the Google API Services User Data Policy, including the Limited Use requirements.",
      ],
    },
    {
      title: "Where data is kept and for how long",
      body: [
        "Data is kept on servers operated by Nunmai and, for the parts of a request an AI model processes, by the model service that runs it.",
        "We keep your data while your account or your organisation's subscription is active. When you delete content, disconnect an app or close your account, we delete the related data from our systems, except records we must keep by law or for security, which are kept no longer than needed.",
      ],
    },
    {
      title: "Your choices and rights",
      body: [
        `You can see, export or delete your conversations and files in the portal, disconnect any app, and ask us to access, correct or delete your data by writing to ${CONTACT}. If your account belongs to an organisation, that organisation controls its workspace and may also handle your request.`,
      ],
    },
    {
      title: "Security",
      body: [
        "Sign-in tokens and keys are encrypted at rest, connections are encrypted in transit, access is limited by role, and actions are logged. No system is perfectly secure; if something goes wrong that affects your data we will tell you as the law requires.",
      ],
    },
    {
      title: "Children",
      body: ["Nunmai is for businesses and adults. It is not meant for anyone under 18."],
    },
    {
      title: "Changes and contact",
      body: [
        "We will post changes here and update the date above; for important changes we will tell you in the portal or by email.",
        `Questions or requests: ${CONTACT}. ${COMPANY}, Kadayanallur, Tenkasi, Tamil Nadu, India.`,
      ],
    },
  ],
};

export const terms: LegalDoc = {
  title: "Terms of Service",
  updated: "5 October 2026",
  intro: `These terms apply when you or your organisation use the Nunmai platform provided by ${COMPANY}. By using it you agree to them. If you use Nunmai for an organisation, you confirm you may accept these terms for it; a signed agreement with that organisation takes precedence where it differs.`,
  sections: [
    {
      title: "The service",
      body: [
        "Nunmai gives you AI assistants and agents that answer, draft and act in the apps you connect, within the permissions you or your organisation set. Features may change as we improve the service.",
      ],
    },
    {
      title: "Accounts",
      body: [
        "Access is by invitation or sign-up we approve. Keep your sign-in safe and tell us at once if you think someone else is using it. You are responsible for what is done through your account.",
      ],
    },
    {
      title: "Your content and connected apps",
      body: [
        "You keep ownership of your content and of the data in the apps you connect. You give Nunmai permission to process it only to provide the service to you.",
        "When you connect another service (such as Google or Microsoft), your use of it stays subject to that service's own terms. You can disconnect it at any time.",
      ],
    },
    {
      title: "AI results",
      body: [
        "Assistants can make mistakes. Check important results before you rely on them, and use the approval settings for anything that sends, pays, signs or changes records. Nunmai is not legal, financial or medical advice.",
      ],
    },
    {
      title: "Acceptable use",
      body: [
        "Do not use Nunmai to break the law, to harm, deceive or harass people, to send spam, to get into systems or data you are not allowed to access, or to interfere with the service. We may suspend use that does.",
      ],
    },
    {
      title: "Fees",
      body: ["Paid plans are billed as agreed in your order or subscription. Taxes are added where they apply."],
    },
    {
      title: "Ending use",
      body: [
        "You can stop using Nunmai at any time. We may suspend or end access for a serious breach of these terms, with notice where we can. After an account ends we delete its data as described in the Privacy Policy.",
      ],
    },
    {
      title: "Liability",
      body: [
        "We provide the service with care, but as far as the law allows it is provided as it is, and Nunmai is not liable for indirect or consequential losses. Our total liability for any claim is limited to the fees you paid us for the service in the 12 months before it.",
      ],
    },
    {
      title: "Law and contact",
      body: [
        "These terms are governed by the laws of India. We may update them; the date above shows the latest version, and we will tell you about important changes.",
        `Contact: ${CONTACT}. ${COMPANY}, Kadayanallur, Tenkasi, Tamil Nadu, India.`,
      ],
    },
  ],
};
