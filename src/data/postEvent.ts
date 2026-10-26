export const POST_EVENT = {
  name: "Odyssey, Partner Summit '26",
  shortName: "Odyssey 2026",
  dates: "23–25 October 2026",
  venue: "Ananta Spa & Resorts, Jaipur",
  bucket: "odyssey-2026-gallery",
} as const;

export const POST_EVENT_STATS = [
  { value: "350+", label: "People" },
  { value: "16", label: "Guest speakers" },
  { value: "4", label: "Panel Talks by our guest speakers" },
  { value: "8", label: "GCC teams" },
  { value: "4", label: "Data & AI sessions" },
  { value: "15", label: "Yearly R&R" },
  { value: "90 min", label: "Śrī volunteer activity" },
] as const;

export const RECAP_DESTINATIONS = [
  {
    href: "/highlights",
    eyebrow: "The story",
    title: "Highlights",
    description:
      "The conversations, ceremonies and shared experiences that made Odyssey ’26 memorable.",
    image: "team-photo",
  },
  {
    href: "/insights",
    eyebrow: "The ideas",
    title: "Session insights",
    description:
      "The essential lessons from technology, GCC, business and leadership conversations.",
    image: "ai-panel",
  },
  {
    href: "/gallery",
    eyebrow: "The moments",
    title: "Photo gallery",
    description:
      "A curated visual record of the people, ideas and energy behind the summit.",
    image: "celebration-selfie",
  },
] as const;

export const GALLERY_CATEGORIES = [
  "All",
  "Sessions",
  "Community",
  "Śrī",
  "Ceremony",
  "Celebration",
] as const;

export type GalleryCategory = Exclude<(typeof GALLERY_CATEGORIES)[number], "All">;

export type GalleryPhoto = {
  id: string;
  category: GalleryCategory;
  title: string;
  alt: string;
  /** A 1600px-wide rendition for the responsive grid. */
  mediumPath: string;
  /** A 2560px-wide rendition for the lightbox and optional download. */
  largePath: string;
};

/**
 * The gallery is intentionally a curated set rather than a folder listing. Its metadata is
 * public-facing copy: keep it here so categories, alt text and image permission decisions are
 * reviewed together. The source originals and RAW files never enter this manifest.
 */
export const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: "celebration-selfie",
    category: "Celebration",
    title: "A night to remember",
    alt: "Three Odyssey guests take a selfie together during the evening celebration",
    mediumPath: "medium/celebration-selfie.jpg",
    largePath: "large/celebration-selfie.jpg",
  },
  {
    id: "sri-collaboration",
    category: "Śrī",
    title: "Making it together",
    alt: "Odyssey participants collaborate during the Śrī volunteer activity",
    mediumPath: "medium/sri-collaboration.jpg",
    largePath: "large/sri-collaboration.jpg",
  },
  {
    id: "sri-young-maker",
    category: "Śrī",
    title: "A careful hand",
    alt: "An Odyssey volunteer helps a young participant create during the Śrī activity",
    mediumPath: "medium/sri-young-maker.jpg",
    largePath: "large/sri-young-maker.jpg",
  },
  {
    id: "sri-house-painting",
    category: "Śrī",
    title: "Small details, shared purpose",
    alt: "Odyssey guests paint a small house together during the Śrī volunteer activity",
    mediumPath: "medium/sri-house-painting.jpg",
    largePath: "large/sri-house-painting.jpg",
  },
  {
    id: "welcome-address",
    category: "Ceremony",
    title: "An opening with purpose",
    alt: "A BOT Consulting leader welcomes guests to Odyssey 2026 from the main stage",
    mediumPath: "medium/welcome-address.jpg",
    largePath: "large/welcome-address.jpg",
  },
  {
    id: "sri-gift-moment",
    category: "Śrī",
    title: "Created with care",
    alt: "Odyssey participants share their completed volunteer-activity creations on stage",
    mediumPath: "medium/sri-gift-moment.jpg",
    largePath: "large/sri-gift-moment.jpg",
  },
  {
    id: "sri-worktable",
    category: "Śrī",
    title: "Care in the details",
    alt: "Odyssey guests work together at a table during the Śrī volunteer activity",
    mediumPath: "medium/sri-worktable.jpg",
    largePath: "large/sri-worktable.jpg",
  },
  {
    id: "celebration-group",
    category: "Celebration",
    title: "Together after hours",
    alt: "Odyssey guests gather outdoors for the evening celebration in Jaipur",
    mediumPath: "medium/celebration-group.jpg",
    largePath: "large/celebration-group.jpg",
  },
  {
    id: "team-photo",
    category: "Community",
    title: "Together at Odyssey",
    alt: "Odyssey 2026 delegates gathered outside Ananta Spa and Resorts in Jaipur",
    mediumPath: "medium/team-photo.jpg",
    largePath: "large/team-photo.jpg",
  },
  {
    id: "welcome-table",
    category: "Community",
    title: "Around the table",
    alt: "Odyssey guests in conversation around a table at the Partner Summit",
    mediumPath: "medium/welcome-table.jpg",
    largePath: "large/welcome-table.jpg",
  },
  {
    id: "speaker-stage",
    category: "Sessions",
    title: "A conversation in motion",
    alt: "A speaker addresses the Odyssey Partner Summit audience from the stage",
    mediumPath: "medium/speaker-stage.jpg",
    largePath: "large/speaker-stage.jpg",
  },
  {
    id: "recognition-moment",
    category: "Community",
    title: "Recognition, shared",
    alt: "Odyssey speakers share a recognition moment on stage",
    mediumPath: "medium/recognition-moment.jpg",
    largePath: "large/recognition-moment.jpg",
  },
  {
    id: "capability-stage",
    category: "Sessions",
    title: "From capability to impact",
    alt: "Presenters on the Odyssey main stage beside a capability to impact presentation",
    mediumPath: "medium/capability-stage.jpg",
    largePath: "large/capability-stage.jpg",
  },
  {
    id: "team-embedding",
    category: "Community",
    title: "Team embedding",
    alt: "A GCC team stands together on stage at Odyssey 2026",
    mediumPath: "medium/team-embedding.jpg",
    largePath: "large/team-embedding.jpg",
  },
  {
    id: "ai-panel",
    category: "Sessions",
    title: "AI that works",
    alt: "Panel discussion on the Odyssey stage about moving AI pilots to profit and loss impact",
    mediumPath: "medium/ai-panel.jpg",
    largePath: "large/ai-panel.jpg",
  },
  {
    id: "untold-chapters",
    category: "Sessions",
    title: "Untold chapters",
    alt: "Panelists discuss the experiences that shaped their leadership journeys",
    mediumPath: "medium/untold-chapters.jpg",
    largePath: "large/untold-chapters.jpg",
  },
  {
    id: "cbrows-talk",
    category: "Sessions",
    title: "The C-Brows documentary",
    alt: "A presenter introduces the C-Brows documentary during a summit session",
    mediumPath: "medium/cbrows-talk.jpg",
    largePath: "large/cbrows-talk.jpg",
  },
  {
    id: "ceremony-opening",
    category: "Ceremony",
    title: "Opening light",
    alt: "The Odyssey opening lamp-lighting ceremony on stage",
    mediumPath: "medium/ceremony-opening.jpg",
    largePath: "large/ceremony-opening.jpg",
  },
  {
    id: "ceremony-stage",
    category: "Ceremony",
    title: "Opening the summit",
    alt: "Odyssey hosts and guests stand together on the ceremony stage",
    mediumPath: "medium/ceremony-stage.jpg",
    largePath: "large/ceremony-stage.jpg",
  },
  {
    id: "evening-portrait",
    category: "Celebration",
    title: "An evening together",
    alt: "Odyssey guests gather outdoors during the evening celebration",
    mediumPath: "medium/evening-portrait.jpg",
    largePath: "large/evening-portrait.jpg",
  },
  {
    id: "small-team",
    category: "Community",
    title: "One team, one journey",
    alt: "A group of Odyssey attendees in front of the Odyssey 2026 sign",
    mediumPath: "medium/small-team.jpg",
    largePath: "large/small-team.jpg",
  },
  {
    id: "sri-story",
    category: "Śrī",
    title: "A story of giving",
    alt: "Two Odyssey participants hold a painted gift box during the Śrī volunteer activity",
    mediumPath: "medium/sri-story.jpg",
    largePath: "large/sri-story.jpg",
  },
  {
    id: "sri-group",
    category: "Śrī",
    title: "90 minutes, shared",
    alt: "Participants gather after the Śrī volunteer activity at Odyssey 2026",
    mediumPath: "medium/sri-group.jpg",
    largePath: "large/sri-group.jpg",
  },
  {
    id: "partner-portrait",
    category: "Community",
    title: "Partners in person",
    alt: "Odyssey guests pose together at Ananta Spa and Resorts",
    mediumPath: "medium/partner-portrait.jpg",
    largePath: "large/partner-portrait.jpg",
  },
  {
    id: "speaker-walk",
    category: "Sessions",
    title: "Taking the stage",
    alt: "A speaker walks onto the Odyssey Partner Summit stage",
    mediumPath: "medium/speaker-walk.jpg",
    largePath: "large/speaker-walk.jpg",
  },
  {
    id: "award-moment",
    category: "Community",
    title: "A meaningful handover",
    alt: "Odyssey guests share an award moment on stage",
    mediumPath: "medium/award-moment.jpg",
    largePath: "large/award-moment.jpg",
  },
  {
    id: "night-portrait",
    category: "Celebration",
    title: "After hours",
    alt: "Odyssey guests together during the evening celebration",
    mediumPath: "medium/night-portrait.jpg",
    largePath: "large/night-portrait.jpg",
  },
  {
    id: "leadership-group",
    category: "Community",
    title: "The people behind it",
    alt: "Odyssey leaders and guests seated together in front of the Odyssey 2026 sign",
    mediumPath: "medium/leadership-group.jpg",
    largePath: "large/leadership-group.jpg",
  },
];

export const galleryPublicUrl = (path: string) => {
  const baseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
  if (!baseUrl) return null;
  return `${baseUrl}/storage/v1/object/public/${POST_EVENT.bucket}/${path}`;
};

export type PublishedGalleryPhoto = GalleryPhoto & {
  mediumUrl: string | null;
  largeUrl: string | null;
};

export const getPublishedGalleryPhotos = (): PublishedGalleryPhoto[] =>
  GALLERY_PHOTOS.map((photo) => ({
    ...photo,
    mediumUrl: galleryPublicUrl(photo.mediumPath),
    largeUrl: galleryPublicUrl(photo.largePath),
  }));
