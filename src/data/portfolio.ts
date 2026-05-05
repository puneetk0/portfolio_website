export interface ImgDef {
  src: string;
  x: number;
  y: number;
  w: number;
  h: number;
  r: number;
  delay: number;
}

export interface PolaroidDef {
  src: string;
  caption: string;
  subtitle: string;
  x: number;
  y: number;
  r: number;
  delay: number;
}

export interface CategoryDef {
  name: string;
  cards: PolaroidDef[];
}

export interface ProjectDef {
  name: string;
  desc: string;
  slug: string;
  caseStudy: {
    title: string;
    overview: string;
    challenge: string;
    solution: string;
    results: string;
    images: string[];
  };
}

export const PERSONAL_INFO = {
  greeting: "Hi, I'm Puneet.",
  tagline: "I design and build products that people actually use.",
};

export const SECTION_LABELS = ['intro', 'projects', 'and ?'];

export const SOCIAL_LINKS = [
  { id: 'mail', label: 'mail', href: 'mailto:hi@puneet.xyz' },
  { id: 'linkedin', label: 'linkedin', href: 'https://linkedin.com/in/puneet' },
  { id: 'instagram', label: 'instagram', href: 'https://instagram.com/puneet' },
];

export const BUILDING_PROJECTS: ProjectDef[] = [
  { 
    name: 'Voca Form', 
    desc: 'Conversational AI that turns forms into stories',
    slug: 'voca-form',
    caseStudy: {
      title: 'Voca Form: Humanizing Data Collection',
      overview: 'Voca Form is a revolutionary tool that transforms boring static forms into engaging conversational experiences using LLMs.',
      challenge: 'Traditional forms have high abandonment rates because they feel like digital paperwork.',
      solution: 'By implementing a chat-based interface that feels like a real conversation, we increased completion rates by 40%.',
      results: 'Successfully processed over 10k responses in the first month of beta testing.',
      images: ['https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71']
    }
  },
  { 
    name: 'Camber', 
    desc: "F1-themed task manager that lives in your Mac's notch",
    slug: 'camber',
    caseStudy: {
      title: 'Camber: High Performance Productivity',
      overview: 'A task manager for power users who love Formula 1 and minimal desktop setups.',
      challenge: 'Most task managers are buried in windows or browser tabs, leading to "out of sight, out of mind".',
      solution: 'We built a lightweight app that utilizes the screen real estate around the MacBook notch for persistent but unobtrusive visibility.',
      results: 'Featured on Product Hunt and downloaded by 5,000+ users in the first week.',
      images: ['https://images.unsplash.com/photo-1550745165-9bc0b252726f', 'https://images.unsplash.com/photo-1580273916550-e323be2ae537']
    }
  },
];

export const SELECTED_PROJECTS: ProjectDef[] = [
  { 
    name: 'Sportsolio', 
    desc: 'Trade emerging players like stocks',
    slug: 'sportsolio',
    caseStudy: {
      title: 'Sportsolio: The Future of Fan Engagement',
      overview: 'A platform that combines sports betting with stock market mechanics.',
      challenge: 'Engaging fans beyond the 90 minutes of a game.',
      solution: 'Created a dynamic market where player "values" fluctuate based on real-time performance metrics.',
      results: 'Raised $1.2M in seed funding and partnered with major sports analytics providers.',
      images: ['https://images.unsplash.com/photo-1508098682722-e99c43a406b2', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211']
    }
  },
  { 
    name: 'GitRepo', 
    desc: 'Find open source repos by chatting with AI',
    slug: 'gitrepo',
    caseStudy: {
      title: 'GitRepo: AI-Powered Discovery',
      overview: 'A smarter way to discover open-source projects on GitHub.',
      challenge: 'GitHub search is powerful but often requires knowing exactly what you are looking for.',
      solution: 'Semantic search engine that understands intent and suggests repos based on project needs.',
      results: 'Open sourced and starred 2k+ times on GitHub.',
      images: ['https://images.unsplash.com/photo-1555066931-4365d14bab8c', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97']
    }
  },
  { 
    name: 'Visual Vortex', 
    desc: 'Brand identity — theme, social, web, mailers',
    slug: 'visual-vortex',
    caseStudy: {
      title: 'Visual Vortex: A Complete Brand Overhaul',
      overview: 'Full-scale design system and branding for a creative agency.',
      challenge: 'The agency had a fragmented identity that didn\'t reflect their high-end work.',
      solution: 'Developed a "cinematic minimal" design language across all touchpoints.',
      results: 'Increased high-value lead generation by 65%.',
      images: ['https://images.unsplash.com/photo-1586717791821-3f44a563eb4c', 'https://images.unsplash.com/photo-1626785774573-4b799315345d']
    }
  },
  { 
    name: 'HiGrow', 
    desc: 'Marketplace for hosting and joining workshops',
    slug: 'higrow',
    caseStudy: {
      title: 'HiGrow: Empowering Local Education',
      overview: 'A marketplace for experts to host in-person workshops.',
      challenge: 'Finding and booking niche workshops is often a manual, disjointed process.',
      solution: 'A unified platform with integrated booking, payments, and attendee management.',
      results: 'Host to 500+ workshops in 10 different cities.',
      images: ['https://images.unsplash.com/photo-1515187029135-18ee286d815b', 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655']
    }
  },
];

export const HERO_LAYOUTS: ImgDef[][] = [
  [
    { src: 'https://images.unsplash.com/photo-1755157161839-0b0fbd5fef74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', x: 70,  y: -195, w: 248, h: 338, r: -1.5, delay: 0   },
    { src: 'https://images.unsplash.com/photo-1771873437314-9dbadc707dcc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', x: 298, y:  -55, w: 215, h: 285, r:  2.0, delay: 80  },
    { src: 'https://images.unsplash.com/photo-1752952952773-80378cefc23d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', x: 108, y:  165, w: 215, h: 198, r: -2.0, delay: 160 },
  ],
  [
    { src: 'https://images.unsplash.com/photo-1662974770404-468fd9660389?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700', x: 55,  y: -148, w: 352, h: 235, r: -1.0, delay: 0   },
    { src: 'https://images.unsplash.com/photo-1561446289-4112a4f79116?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500', x: 342, y:  -22, w: 188, h: 258, r:  2.0, delay: 80  },
    { src: 'https://images.unsplash.com/photo-1749006590475-4592a5dbf99f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500', x: 65,  y:  118, w: 218, h: 168, r: -0.5, delay: 160 },
  ],
  [
    { src: 'https://images.unsplash.com/photo-1774487671620-b9174d206849?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700', x: 45,  y: -162, w: 368, h: 248, r:  1.0, delay: 0   },
    { src: 'https://images.unsplash.com/photo-1771216596227-f17c69f33912?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500', x: 360, y:    5, w: 202, h: 268, r: -2.0, delay: 80  },
    { src: 'https://images.unsplash.com/photo-1762921006421-8b6ae0c17e44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500', x: 78,  y:  108, w: 228, h: 172, r:  1.5, delay: 160 },
  ],
];

export const PROJECT_LAYOUTS: ImgDef[][] = [
  [
    { src: 'https://images.unsplash.com/photo-1764050359179-517599dab87b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700', x: 55,  y: -155, w: 360, h: 240, r: -1.5, delay: 0   },
    { src: 'https://images.unsplash.com/photo-1759694542153-ad02551b15b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500', x: 335, y:  -35, w: 195, h: 265, r:  2.0, delay: 80  },
    { src: 'https://images.unsplash.com/photo-1642692704130-2f50860c15ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500', x: 72,  y:  118, w: 208, h: 162, r: -0.5, delay: 160 },
  ],
  [
    { src: 'https://images.unsplash.com/photo-1753998943619-b9cd910887e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700', x: 28,  y: -128, w: 348, h: 238, r:  1.0, delay: 0   },
    { src: 'https://images.unsplash.com/photo-1588686031323-ec683d066691?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500', x: 352, y:    8, w: 182, h: 252, r: -2.0, delay: 80  },
    { src: 'https://images.unsplash.com/photo-1749006590475-4592a5dbf99f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500', x: 38,  y:  138, w: 228, h: 172, r:  1.5, delay: 160 },
  ],
  [
    { src: 'https://images.unsplash.com/photo-1728467459756-211f3c738697?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700', x: 92,  y: -178, w: 312, h: 288, r: -2.0, delay: 0   },
    { src: 'https://images.unsplash.com/photo-1770581939371-326fc1537f10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500', x: 362, y:   28, w: 232, h: 172, r:  1.0, delay: 80  },
    { src: 'https://images.unsplash.com/photo-1742440710402-721332ea7898?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500', x: 42,  y:  148, w: 178, h: 178, r:  2.5, delay: 160 },
  ],
  [
    { src: 'https://images.unsplash.com/photo-1557734864-c78b6dfef1b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700', x: 38,  y: -152, w: 338, h: 258, r:  1.5, delay: 0   },
    { src: 'https://images.unsplash.com/photo-1574962325789-fbe9cbcfacf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500', x: 358, y:   22, w: 252, h: 175, r: -1.0, delay: 80  },
    { src: 'https://images.unsplash.com/photo-1710596220294-3f88dfe02fd8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500', x: 48,  y:  128, w: 188, h: 248, r: -2.0, delay: 160 },
  ],
];

export const CATEGORIES: CategoryDef[] = [
  {
    name: "I've won things",
    cards: [
      { src: 'https://images.unsplash.com/photo-1756273421509-054de38d1016?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500', caption: 'Cognizance — 2025', subtitle: 'Prod-G winner',          x: 28,  y: 88,  r: -5, delay: 0   },
      { src: 'https://images.unsplash.com/photo-1772971919868-6aaaa5c5afb1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500', caption: 'DCode — 2025',      subtitle: 'Best UI/UX award',    x: 218, y: 236, r:  3, delay: 65  },
      { src: 'https://images.unsplash.com/photo-1624201986343-2766c0ebe7df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500', caption: 'DesignX — 2026',    subtitle: 'Designathon finalist', x: 78,  y: 384, r: -2, delay: 130 },
    ],
  },
  {
    name: "I've built rooms full of people",
    cards: [
      { src: 'https://images.unsplash.com/photo-1763962274119-1a0a0d418520?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500', caption: 'Visual Vortex',  subtitle: '2000+ attendees',    x: 36,  y: 74,  r:  4, delay: 0   },
      { src: 'https://images.unsplash.com/photo-1557734864-c78b6dfef1b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500', caption: 'UI/UX Workshop', subtitle: 'taught design',         x: 228, y: 220, r: -6, delay: 65  },
      { src: 'https://images.unsplash.com/photo-1539017367106-9b247d897964?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500', caption: "Neutron '25",    subtitle: 'North India',          x: 64,  y: 366, r:  2, delay: 130 },
    ],
  },
  {
    name: 'and everything else',
    cards: [
      { src: 'https://images.unsplash.com/photo-1742144897663-6c8c6faaf1ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500', caption: '12M views',  subtitle: 'most viewed Figma vid', x: 32,  y: 96,  r: -3, delay: 0   },
      { src: 'https://images.unsplash.com/photo-1776239979769-ab5672b094f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500', caption: '14 cities',  subtitle: 'I collect airports',    x: 228, y: 246, r:  5, delay: 65  },
      { src: 'https://images.unsplash.com/photo-1768370771259-db3fa0d34be5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500', caption: 'Tifosi.',    subtitle: 'F1 & snooker',          x: 54,  y: 394, r: -4, delay: 130 },
    ],
  },
];
