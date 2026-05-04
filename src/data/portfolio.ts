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

export const BUILDING_PROJECTS = [
  { 
    name: 'VC Data Analytics', 
    desc: 'A venture capital data analytics pipeline generating statistical insights and Tableau-ready KPI dashboards.',
    href: 'https://github.com/puneetk0/A_G11_StartupInvestments/commits/'
  },
];

export const SELECTED_PROJECTS = [
  { 
    name: 'Car Data Quality Audit', 
    desc: 'Interactive dashboard visualizing a 7-domain car data quality audit.',
    href: 'https://github.com/puneetk0/car_price_data_audit'
  },
  { 
    name: 'Netflix-Style User Behavior Analysis', 
    desc: 'Analyzing user viewing patterns and behavior metrics.', 
    href: 'https://github.com/Chait0001/Section_A_G-1_Netflix-Style-User-Behavior-Dataset-'
  },
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
