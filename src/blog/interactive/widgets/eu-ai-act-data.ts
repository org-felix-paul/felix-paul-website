// Data of the EU AI Act quick-check, taken unchanged from the workshop tool
// (workshop-material, software-prototypes/eu-ai-act-quickcheck, app.js).
// Educational aid, not legal advice. Legal basis: Regulation (EU) 2024/1689.

export type Tier = "prohibited" | "high" | "transparency" | "gpai" | "minimal";

export interface Criterion { id: string; label: string; note?: string }
export interface Group {
  id: string; tier: Tier; legend: string; badge: string; hint: string;
  criteria: Criterion[]; filterNote?: string;
}
export interface TierInfo {
  title: string; badgeClass: string; cardClass: string; meta: string; lines: string[];
}

export const GROUPS: Group[] = [
  {
    id: "prohibited",
    tier: "prohibited",
    legend: "1 · Banned uses",
    badge: "Prohibited",
    hint:
      "Does the system do any of the following? These practices are banned outright (Art. 5) and have been unlawful since 2 February 2025.",
    criteria: [
      { id: "emotion-edu", label: "Infers emotions of pupils, students or staff in a school or workplace",
        note: "Emotion recognition in education and at work is banned, except for narrow medical or safety reasons." },
      { id: "social-scoring", label: "Scores or ranks people by their behaviour or personal traits (social scoring)",
        note: "Leading to detrimental treatment in unrelated contexts, or that is unjustified/disproportionate." },
      { id: "manipulation", label: "Uses subliminal, manipulative or deceptive techniques to distort behaviour and cause harm",
        note: "Techniques that materially impair a person's ability to make an informed decision." },
      { id: "exploit-vuln", label: "Exploits vulnerabilities due to age, disability, or a specific social or economic situation",
        note: "To materially distort behaviour in a way that causes harm." },
      { id: "biometric-cat", label: "Categorises people by biometrics to infer race, political or religious beliefs, or sexual orientation",
        note: "Inferring these special-category attributes from biometric data is prohibited." },
      { id: "rt-biometric", label: "Does real-time remote biometric identification of people in public spaces",
        note: "Broadly banned; only narrow law-enforcement exceptions with prior authorisation." },
      { id: "face-scraping", label: "Builds or expands a facial-recognition database by untargeted scraping of images",
        note: "Scraping faces from the internet or CCTV to grow a recognition database is banned." },
      { id: "predictive-policing", label: "Predicts an individual's risk of committing a crime based solely on profiling",
        note: "Risk assessment of a person based only on profiling or personality traits." },
    ],
  },
  {
    id: "high",
    tier: "high",
    legend: "2 · High-risk uses",
    badge: "High-risk",
    hint:
      "Does the system do any of the following? These are high-risk (Art. 6 + Annex III). They are allowed but carry heavy obligations, applicable from 2 August 2026.",
    criteria: [
      { id: "edu-access", label: "Decides admission or access to an educational institution, or assigns people to one",
        note: "Annex III(3)(a). Directly relevant to schools." },
      { id: "edu-evaluate", label: "Evaluates learning outcomes, grades, or steers a student's learning process",
        note: "Annex III(3)(b). Includes AI grading and adaptive learning that steers outcomes." },
      { id: "edu-level", label: "Assesses the appropriate level of education a person should receive",
        note: "Annex III(3)(c)." },
      { id: "edu-proctor", label: "Monitors and detects prohibited behaviour of students during tests (proctoring)",
        note: "Annex III(3)(d)." },
      { id: "employment", label: "Is used for recruitment, task allocation, promotion, or termination decisions",
        note: "Annex III(4). Employment and worker management." },
      { id: "essential-services", label: "Decides access to essential services or benefits (credit scoring, welfare, insurance, emergency triage)",
        note: "Annex III(5)." },
      { id: "biometrics-hr", label: "Does biometric identification, categorisation, or emotion recognition in an allowed context",
        note: "Annex III(1). If not outright banned above, remote biometric ID is still high-risk." },
      { id: "other-annex3", label: "Is used in critical infrastructure, law enforcement, migration/border control, or justice/democracy",
        note: "Other Annex III domains." },
    ],
    filterNote:
      "A system in these areas is NOT high-risk if it only performs a narrow procedural task, improves a completed human activity, flags patterns without replacing human judgement, or does purely preparatory work — UNLESS it profiles a person, in which case it is always high-risk (Art. 6(3)).",
  },
  {
    id: "transparency",
    tier: "transparency",
    legend: "3 · Transparency (disclosure) duties",
    badge: "Transparency",
    hint:
      "Does the system do any of the following? Even if not high-risk, these trigger disclosure duties (Art. 50), applicable from 2 August 2026.",
    criteria: [
      { id: "chatbot", label: "Interacts directly with people (e.g. a chatbot or voice assistant)",
        note: "People must be told they are dealing with an AI, unless it is obvious." },
      { id: "synthetic-media", label: "Generates or manipulates image, audio, or video content (including deepfakes)",
        note: "Output must be marked machine-readably as artificially generated/manipulated, and deepfakes disclosed." },
      { id: "public-text", label: "Generates text published to inform the public on matters of public interest",
        note: "Must be disclosed as AI-generated unless a human reviews and takes editorial responsibility." },
      { id: "emotion-allowed", label: "Recognises emotions or categorises people biometrically in an allowed context",
        note: "The people exposed to it must be informed." },
    ],
  },
  {
    id: "gpai",
    tier: "gpai",
    legend: "4 · General-purpose AI models",
    badge: "GPAI",
    hint:
      "Are you the PROVIDER of a general-purpose AI model (e.g. you train and place a large language model on the market)? Obligations from 2 August 2025.",
    criteria: [
      { id: "gpai-provider", label: "We develop and place a general-purpose AI model on the market ourselves",
        note: "Most schools only USE such models (a deployer) and this does not apply. It applies to the model maker." },
    ],
  },
];

export const TIER_INFO: Record<Tier, TierInfo> = {
  prohibited: {
    title: "Prohibited — this use is banned",
    badgeClass: "badge-prohibited",
    cardClass: "t-prohibited",
    meta: "Art. 5 · unlawful since 2 February 2025",
    lines: [
      "This practice may not be put on the market, put into service, or used in the EU.",
      "There is no compliance path that makes it lawful — the use itself must stop or be redesigned so it no longer meets the banned description.",
      "Penalties are the most severe tier: up to €35 million or 7% of worldwide annual turnover.",
    ],
  },
  high: {
    title: "High-risk — allowed, but heavily regulated",
    badgeClass: "badge-high",
    cardClass: "t-high",
    meta: "Art. 6 + Annex III · obligations from 2 August 2026",
    lines: [
      "Providers must run a risk-management system, ensure data governance and quality, keep technical documentation and automatic logs, ensure transparency to deployers, enable human oversight, and meet accuracy/robustness/cybersecurity requirements, then register the system in the EU database.",
      "Deployers (e.g. a school using it) must use it per instructions, ensure human oversight and relevant/representative input data, monitor operation, keep logs, and inform affected people; a public body may need a fundamental-rights impact assessment.",
      "Check the Art. 6(3) filter first — a narrow, non-profiling helper task can fall out of high-risk.",
    ],
  },
  transparency: {
    title: "Transparency — allowed, but you must disclose",
    badgeClass: "badge-transparency",
    cardClass: "t-transparency",
    meta: "Art. 50 · from 2 August 2026",
    lines: [
      "Tell people when they are interacting with an AI system (unless it is obvious from the context).",
      "Mark AI-generated or manipulated audio, image, video, and text in a machine-readable way, and clearly label deepfakes as artificially generated.",
      "This duty can apply on top of a high-risk classification — do both.",
    ],
  },
  gpai: {
    title: "General-purpose AI model provider duties",
    badgeClass: "badge-transparency",
    cardClass: "t-gpai",
    meta: "Art. 53/55 · from 2 August 2025",
    lines: [
      "Providers of general-purpose AI models must keep technical documentation, give information to downstream providers, put a copyright policy in place, and publish a summary of training content.",
      "Models with systemic risk carry extra duties: model evaluation, systemic-risk assessment and mitigation, incident reporting, and cybersecurity.",
      "If you only use such a model in a school, you are a deployer, not a provider — these duties fall on the model maker, not on you.",
    ],
  },
  minimal: {
    title: "Minimal risk — no AI-Act-specific duties",
    badgeClass: "badge-minimal",
    cardClass: "t-minimal",
    meta: "Not otherwise regulated by the AI Act",
    lines: [
      "The AI Act imposes no specific obligations on this use (think spam filters, AI in video games, or a spelling helper).",
      "You may voluntarily follow a code of conduct and the same good practice as high-risk systems.",
      "Data-protection law (GDPR) still applies fully whenever personal data is involved — this is where most school use cases actually need attention.",
    ],
  },
};

export const EDU_NOTE =
  "School lens: teaching-related AI clusters in two places. Emotion recognition of pupils is <strong>prohibited</strong> (Art. 5). AI that decides admission, grades, steers learning, or proctors exams is <strong>high-risk</strong> (Annex III(3)). A classroom chatbot or an image/video generator triggers <strong>transparency</strong> duties (Art. 50). Ordinary, low-stakes tools are usually <strong>minimal risk</strong> — but GDPR still governs any pupil data.";

export const SEVERITY_ORDER: Tier[] = ["prohibited", "high", "transparency", "gpai", "minimal"];
