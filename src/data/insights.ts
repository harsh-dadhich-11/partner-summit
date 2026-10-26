export type InsightTheme = "Technology & AI" | "GCC & Business" | "Leadership";
export type InsightFormat = "Breakout" | "Panel" | "Presentation" | "Talk";

export type Insight = {
  slug: string;
  title: string;
  theme: InsightTheme;
  format: InsightFormat;
  speakers: string;
  summary: string;
  takeaways: string[];
  relatedSlugs: string[];
};

/** Public-facing editorial summaries, distilled from the session-notes source. */
export const INSIGHTS: Insight[] = [
  {
    slug: "how-ai-learned-to-use-your-tools",
    title: "How AI Learned to Use Your Tools",
    theme: "Technology & AI",
    format: "Breakout",
    speakers: "Adit Khandelwal and Harsh Dadhich",
    summary:
      "A practical look at Model Context Protocol and the role of specialised agents in connecting AI systems to enterprise tools without multiplying fragile integrations.",
    takeaways: [
      "MCP standardises how AI applications connect to tools, resources and enterprise context.",
      "Specialised agents make complex toolsets more dependable by working within defined scopes.",
      "Human approval remains essential for consequential production actions, including rollbacks.",
    ],
    relatedSlugs: ["ai-driven-sdlc", "production-grade-agentcore"],
  },
  {
    slug: "ai-driven-sdlc",
    title: "AI-Driven SDLC: Orchestrating Autonomous Software Development",
    theme: "Technology & AI",
    format: "Breakout",
    speakers: "Rajat Khandelwal and Nitesh Soni",
    summary:
      "An end-to-end, governed development workflow that moves from Jira requirements to design, testing and pull-request creation while retaining deliberate review gates.",
    takeaways: [
      "AI can remove repetitive architecture and implementation work when it is grounded in the real codebase.",
      "Design and post-test approval gates preserve engineering accountability.",
      "The durable outcome is more senior capacity for judgement, not less human involvement.",
    ],
    relatedSlugs: ["how-ai-learned-to-use-your-tools", "pilot-to-p-and-l"],
  },
  {
    slug: "same-seat-different-lengths",
    title: "Same Seat, Different Lens",
    theme: "Leadership",
    format: "Panel",
    speakers: "Lori Williams (Moderator), Manpreet Singh, Sanjay Gidwani, Eran Gil, Glenn Weinstein and Chris Barbin",
    summary:
      "Lori Williams moderated a candid conversation with five CEOs—Manpreet Singh, Sanjay Gidwani, Eran Gil, Glenn Weinstein and Chris Barbin on how judgment, context and conviction shape decisions across people, capital, growth and AI.",
    takeaways: [
      "Hire for the business a company is becoming, then trust the people brought in to lead it.",
      "Investor alignment and culture matter as much as the availability of capital.",
      "AI adoption should reflect an organisation’s operating context, not just the appeal of the technology.",
    ],
    relatedSlugs: ["untold-chapters", "pilot-to-p-and-l"],
  },
  {
    slug: "headless-360",
    title: "Headless 360: Salesforce Beyond the Desktop",
    theme: "Technology & AI",
    format: "Breakout",
    speakers: "Nikita Pahilwani, Naveen Sharma and Snehasis Hazra",
    summary:
      "A view of Salesforce as a governed, event-driven backend: enabling people and AI systems to work through the interfaces that best serve them while retaining CRM context.",
    takeaways: [
      "A decoupled architecture can preserve CRM context without recreating it across every channel.",
      "API-layer permissions are central to responsible AI access to sensitive records.",
      "Production design must account for automated throughput, not only human desktop clicks.",
    ],
    relatedSlugs: ["how-ai-learned-to-use-your-tools", "production-grade-agentcore"],
  },
  {
    slug: "production-grade-agentcore",
    title: "Production-Grade AgentCore: Deploying Multi-Agent Systems at Scale",
    theme: "Technology & AI",
    format: "Breakout",
    speakers: "Rishabh Nagar, Bhanvendra Singh Gaur and Pankaj Phular",
    summary:
      "A walkthrough of using Amazon Bedrock AgentCore, governed tools and policy guardrails to reduce incident investigation time while protecting production systems.",
    takeaways: [
      "Agents become operationally useful when they can read live telemetry through limited, auditable tools.",
      "Policies and IAM boundaries should enforce the distinction between diagnosing and changing production.",
      "Automated RCA output is most valuable when it explains the incident, evidence and next steps for people.",
    ],
    relatedSlugs: ["how-ai-learned-to-use-your-tools", "headless-360"],
  },
  {
    slug: "gcc-panel-allcloud-cloudsmith",
    title: "From Vision to Value: Real GCC Journeys",
    theme: "GCC & Business",
    format: "Panel",
    speakers: "Chris Barbin (Moderator), Nick Peacock, Abhinav Gehlot, Eran Gil and Manish Khatri",
    summary:
      "A partner conversation on how Global Capability Centers create value through integrated culture, customer proximity and continuous learning—not simply offshore capacity.",
    takeaways: [
      "A high-performing GCC needs engineers who pair technical depth with a consulting mindset.",
      "Integration is a shared leadership responsibility, not a hand-off from one geography to another.",
      "AI can accelerate teams, but relationships, change management and execution stay fundamental.",
    ],
    relatedSlugs: ["what-odyssey-is", "pilot-to-p-and-l"],
  },
  {
    slug: "what-odyssey-is",
    title: "Odyssey Demo",
    theme: "GCC & Business",
    format: "Presentation",
    speakers: "Deepali Puri and Ayushi Sharma (Presented with Lisa Burton and Akshay Singh Thakur)",
    summary:
      "A live demonstration of BOT’s operating system for GCC efficiency, linking people, processes and platforms while reserving judgement for the people closest to the work.",
    takeaways: [
      "Shared, source-linked context makes handovers, hiring and delivery decisions more dependable.",
      "AI can accelerate drafts, talent discovery and guidance while humans retain final decisions.",
      "The value of a platform is its ability to surface next steps and risk before teams lose time searching for answers.",
    ],
    relatedSlugs: ["gcc-panel-allcloud-cloudsmith", "ai-driven-sdlc"],
  },
  {
    slug: "pilot-to-p-and-l",
    title: "AI That Works: From Pilots to P&L",
    theme: "GCC & Business",
    format: "Panel",
    speakers: "Moderators: Deepali Puri and  Reem Seghairoun and Panelists: Chris Barbin, Gurvendra Suri, William Fleder, Glenn Weinstein, Sanjay Gidwani",
    summary:
      "A candid discussion about moving AI beyond promising pilots: confronting total cost, data readiness, operating-model change and a real measure of business value.",
    takeaways: [
      "A proof of concept is not a business case until operating and delivery costs are understood.",
      "Data governance is a core production constraint, not a late-stage implementation detail.",
      "Value comes from growth or margin created with released capacity, not efficiency alone.",
    ],
    relatedSlugs: ["gcc-panel-allcloud-cloudsmith", "ai-driven-sdlc"],
  },
  {
    slug: "untold-chapters",
    title: "The Untold Chapters",
    theme: "Leadership",
    format: "Panel",
    speakers: "Manpreet Singh and Lisa Burton (Moderator), Reem Seghairoun, Lori Williams, Ronit Rubin, Anjali Jain",
    summary:
      "Four personal leadership journeys revealed how pivotal choices, mentors and difficult people decisions shape a meaningful working life.",
    takeaways: [
      "The hardest leadership decisions are often people decisions that have been postponed too long.",
      "Feedback is more useful when it is treated as information rather than a judgement of identity.",
      "Meaning, usefulness and sustained curiosity are durable measures of a career.",
    ],
    relatedSlugs: ["same-seat-different-lengths", "chris-barbin-talk"],
  },
  {
    slug: "chris-barbin-talk",
    title: "CB-Rows The Documentary",
    theme: "Leadership",
    format: "Talk",
    speakers: "Chris Barbin",
    summary:
      "A deeply personal reflection on endurance, connection and building support systems—framed through a solo ocean-rowing journey for mental-health causes.",
    takeaways: [
      "Connection is a practical form of support, particularly when someone is struggling.",
      "Long-term challenges require preparation, adaptation and a sustainable definition of progress.",
      "Simple frameworks can help leaders check in on health, work and family pressures together.",
    ],
    relatedSlugs: ["untold-chapters", "same-seat-different-lengths"],
  },
];

export const INSIGHT_THEMES: Array<InsightTheme | "All"> = [
  "All",
  "Technology & AI",
  "GCC & Business",
  "Leadership",
];

export const getInsightBySlug = (slug: string) =>
  INSIGHTS.find((insight) => insight.slug === slug);
