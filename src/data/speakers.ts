import type { Speaker, CompanySpeakerGroup } from "@/types";

export const featuredSpeakerGroups: CompanySpeakerGroup[] = [
  {
    company: "Tercera",
    logo: "/assets/logos/tercera.webp",
    website: "https://tercera.io/",
    speakers: [
      {
        name: "Chris Barbin",
        role: "Founder & CEO",
        company: "Tercera",
        photo: "/assets/guests/chris-barbin.webp",
        linkedin: "https://www.linkedin.com/in/chrisbarbin/",
      },
      {
        name: "Michelle Swan",
        role: "Partner & CMO",
        company: "Tercera",
        photo: "/assets/guests/michelle-swan.webp",
        linkedin: "https://www.linkedin.com/in/michelleswan/",
      },
      {
        name: "Lisa Burton",
        role: "Partner & COO",
        company: "Tercera",
        photo: "/assets/guests/Lisa-Burton.webp",
        linkedin: "https://www.linkedin.com/in/lisaaburton/",
      },
      {
        name: "Lori Williams",
        role: "Advisor",
        company: "Tercera",
        photo: "/assets/guests/lori-williams.webp",
        linkedin: "https://www.linkedin.com/in/loriwilliams4/",
      },
    ],
  },
  {
    company: "Tailwind Capital",
    logo: "/assets/logos/tailwind.webp",
    website: "https://www.tailwind.com/",
    speakers: [
      {
        name: "Gurvendra Suri",
        role: "Tailwind Operating Executive",
        company: "Tailwind Capital",
        photo: "/assets/guests/gurvendra-suri.webp",
        linkedin: "https://www.linkedin.com/in/gurvendra-suri-aa103b7/",
      },
      {
        name: "William Fleder",
        role: "Partner",
        company: "Tailwind Capital",
        photo: "/assets/guests/fleder.webp",
        linkedin: "https://www.linkedin.com/in/william-fleder-6181346a/",
      },
      {
        name: "Justin Schneiderman",
        role: "Vice President",
        company: "Tailwind Capital",
        photo: "/assets/guests/justin-schneiderman.webp",
        linkedin: "https://www.linkedin.com/in/justin-schneiderman-a69233178/",
      },
    ],
  },
  {
    company: "AllCloud",
    logo: "/assets/logos/allcloud.webp",
    website: "https://allcloud.io/",
    speakers: [
      {
        name: "Eran Gil",
        role: "CEO",
        company: "AllCloud",
        photo: "/assets/guests/eran-gil.webp",
        linkedin: "https://www.linkedin.com/in/erangil/",
      },
      {
        name: "Ronit Rubin",
        role: "President, EMEA",
        company: "AllCloud",
        photo: "/assets/guests/ronit-rubin.webp",
        linkedin: "https://www.linkedin.com/in/ronitrubin/",
      },
      {
        name: "Andrei Balea",
        role: "VP, Global Services",
        company: "AllCloud",
        photo: "/assets/guests/andrei.webp",
        linkedin: "https://www.linkedin.com/in/andrei-balea-8172b672/",
      },
    ],
  },
  {
    company: "Cloudsmith",
    logo: "/assets/logos/cloudsmith.webp",
    website: "https://cloudsmith.com/",
    speakers: [
      {
        name: "Glenn Weinstein",
        role: "CEO",
        company: "Cloudsmith",
        photo: "/assets/guests/glenn-weinstein.webp",
        linkedin: "https://www.linkedin.com/in/grweinstein/",
      },
      {
        name: "Nick Peacock",
        role: "VP Customer Success",
        company: "Cloudsmith",
        photo: "/assets/guests/nick-peacock.webp",
        linkedin: "https://www.linkedin.com/in/nickpeacock/",
      },
      {
        name: "Mihai Paun",
        role: "Engineering Manager",
        company: "Cloudsmith",
        photo: "/assets/guests/Mihai-Paun.webp",
        linkedin: "https://www.linkedin.com/in/mihaipaun/",
      },
      {
        name: "Dara Hayes",
        role: "Senior Software Engineer",
        company: "Cloudsmith",
        photo: "/assets/guests/dara-hayes.webp",
        linkedin: "https://www.linkedin.com/in/dara-hayes-b264685a/",
      },
    ],
  },
  {
    company: "KOSMOS",
    logo: "/assets/logos/kosmos.webp",
    website: "https://kosmoslabs.ai/",
    speakers: [
      {
        name: "Sanjay Gidwani",
        role: "Founder & CEO",
        company: "KOSMOS",
        photo: "/assets/guests/sanjay-gidwani.webp",
        linkedin: "https://www.linkedin.com/in/sgidwani/",
      },
    ],
  },
  {
    company: "Auctor",
    logo: "/assets/logos/auctor.webp",
    website: "https://www.getauctor.com/",
    speakers: [
      {
        name: "William Sun",
        role: "Co-Founder & CEO",
        company: "Auctor",
        photo: "/assets/guests/willson.webp",
        linkedin: "https://www.linkedin.com/in/weihongsun/",
      },
    ],
  },
  // {
  //   company: "Eliza",
  //   logo: "/assets/logos/eliza.webp",
  //   website: "https://eliza.com/",
  //   speakers: [
  //     {
  //       name: "Patrick Buell",
  //       role: "Chief Deployment Officer",
  //       company: "Eliza",
  //       photo: "/assets/guests/patrick.webp",
  //       linkedin: "https://www.linkedin.com/in/patrick-buell-81756a8/",
  //     },
  //   ],
  // },
];

export const guestGroups: CompanySpeakerGroup[] = [];

export const featuredSpeakers: Speaker[] = featuredSpeakerGroups.flatMap(
  (group) => group.speakers
);

export const guests: Speaker[] = guestGroups.flatMap(
  (group) => group.speakers
);

export const speakers: Speaker[] = [
  ...featuredSpeakers,
  ...guests,
];