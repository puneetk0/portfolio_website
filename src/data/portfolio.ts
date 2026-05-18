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
  { id: 'mail', label: 'mail', href: 'mailto:puneetkathuria2525@gmail.com' },
  { id: 'linkedin', label: 'linkedin', href: 'https://www.linkedin.com/in/puneet-kathuria-33a296220/' },
  { id: 'instagram', label: 'instagram', href: 'https://instagram.com/puneet.25_' },
  { id: 'github', label: 'github', href: 'https://github.com/puneetk0' },
  { id: "Resume", label: "Resume", href: "https://drive.google.com/drive/folders/1c4YqG7klP6moDcZ5KS_R36m7GOEs5-pB?usp=drive_link" }
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
];

export const SELECTED_PROJECTS: ProjectDef[] = [
  {
    name: 'Sportfolio',
    desc: 'Trade emerging players like stocks',
    slug: 'sportfolio',
    caseStudy: {
      title: 'Sportfolio: The Future of Fan Engagement',
      overview: 'A platform that combines sports betting with stock market mechanics.',
      challenge: 'Engaging fans beyond the 90 minutes of a game.',
      solution: 'Created a dynamic market where player "values" fluctuate based on real-time performance metrics.',
      results: 'Raised $1.2M in seed funding and partnered with major sports analytics providers.',
      images: ['https://images.unsplash.com/photo-1508098682722-e99c43a406b2', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211']
    }
  },
  {
    name: 'findMyRepo',
    desc: 'Find open source repos by chatting with AI',
    slug: 'find-my-repo',
    caseStudy: {
      title: 'findMyRepo: AI-Powered Discovery',
      overview: 'A smarter way to discover open-source projects on GitHub.',
      challenge: 'GitHub search is powerful but often requires knowing exactly what you are looking for.',
      solution: 'Semantic search engine that understands intent and suggests repos based on project needs.',
      results: 'Open sourced and starred 2k+ times on GitHub.',
      images: ['https://images.unsplash.com/photo-1555066931-4365d14bab8c', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97']
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

export const HERO_LAYOUTS: ImgDef[][] = [
  [
    { src: '/assets/home/hero-01.jpeg', x: 70, y: -265, w: 248, h: 338, r: -1.5, delay: 0 },
    { src: '/assets/home/hero-03.jpeg', x: 298, y: -95, w: 215, h: 285, r: 2.0, delay: 80 },
    { src: '/assets/home/hero-02.jpeg', x: 108, y: 65, w: 215, h: 288, r: -2.0, delay: 160 },
  ],
  [
    { src: '/assets/voca/voca-desktop.png', x: 10, y: -260, w: 480, h: 320, r: -0.5, delay: 0 },
    { src: '/assets/voca/voca-form-builder.png', x: 380, y: -100, w: 190, h: 400, r: 2.5, delay: 80 },
    { src: '/assets/voca/voca-admin-dashboard.png', x: 40, y: -40, w: 190, h: 400, r: -1.5, delay: 160 },
  ],
];

export const PROJECT_LAYOUTS: ImgDef[][] = [
  [
    { src: '/assets/sportfolio/dashboard.png', x: 20, y: -280, w: 210, h: 440, r: -2.5, delay: 0 },
    { src: '/assets/sportfolio/marketplace.png', x: 380, y: -100, w: 210, h: 440, r: 3.5, delay: 80 },
    { src: '/assets/sportfolio/portfolio.png', x: 180, y: -40, w: 210, h: 440, r: -1.5, delay: 160 },
  ],
  [
    { src: '/assets/find-my-repo/home.jpeg', x: 30, y: -270, w: 420, h: 270, r: -1.5, delay: 0 },
    { src: '/assets/find-my-repo/hidden-gems.jpeg', x: 10, y: 60, w: 420, h: 270, r: -1.0, delay: 160 },
    { src: '/assets/find-my-repo/find-my-repo-search.gif', x: 240, y: -60, w: 420, h: 270, r: 2.5, delay: 80 },
  ],
  [
    { src: '/assets/camber/camber-website.png', x: 30, y: -250, w: 480, h: 320, r: -1.0, delay: 0 },
    { src: '/assets/camber/camber-track-view.png', x: 160, y: 20, w: 480, h: 320, r: 2.0, delay: 80 },
  ],
];

export const CATEGORIES: CategoryDef[] = [
  {
    name: "I've won things",
    cards: [
      { src: '/assets/and-what/cognizance.jpeg', caption: 'Cognizance — 2025', subtitle: 'Prod-G winner', x: 28, y: 88, r: -5, delay: 0 },
      { src: '/assets/and-what/dcode.jpeg', caption: 'DCode — 2025', subtitle: 'Runner Up', x: 288, y: 236, r: 3, delay: 65 },
      { src: '/assets/and-what/designx.jpeg', caption: 'DesignX — 2026', subtitle: 'Designathon finalist', x: 60, y: 404, r: -2, delay: 130 },
    ],
  },
  {
    name: "I've built rooms full of people",
    cards: [
      { src: '/assets/and-what/visual-vortex.png', caption: 'Visual Vortex', subtitle: '400+ attendees', x: 40, y: 100, r: -4, delay: 0 },
      { src: '/assets/and-what/workshop.jpeg', caption: 'UI/UX Workshop', subtitle: 'taught design', x: 240, y: 360, r: 5, delay: 65 },
    ],
  },
  {
    name: 'and everything else',
    cards: [
      { src: '/assets/and-what/youtube.png', caption: '600k+ views', subtitle: 'most viewed Figma vid', x: 40, y: 100, r: -4, delay: 0 },
      { src: '/assets/and-what/travel.jpg', caption: 'Travel', subtitle: 'I love to explore new places!', x: 240, y: 360, r: 5, delay: 65 },
    ],
  },
];
