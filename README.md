# Cinematic Minimalist Portfolio

A high-fidelity, cinematic portfolio website designed with a focus on **minimal aesthetics**, fluid typography, and atmospheric depth. This project uses a deliberate design system to create a premium "beyond the screen" experience.

## 🎯 Project Objective
The main objective is to provide a distraction-free environment that highlights work through cinematic transitions, subtle micro-interactions, and a strict adherence to minimalist design principles.

### Key Design Pillars:
- **Atmospheric Depth:** Using `BackgroundGlow`, `NoiseOverlay`, and `CustomCursor` to create a living interface.
- **Cinematic Motion:** Smooth, scroll-hijacked transitions and parallax image clusters.
- **Typography First:** High-contrast, strictly controlled layouts using `Figtree` (sans) and `Playfair Display` (italic serif).
- **Centralized Content:** Completely decoupled data layer for effortless maintenance.

---

## 🏗 Infrastructure & Folder Structure

### Root Directory
- `index.html`: The entry point with global meta tags and font injections.
- `package.json`: Project dependencies and scripts. Includes **Tailwind CSS v4** and **React Router v6**.
- `vite.config.ts`: Vite configuration with custom asset resolvers for high-performance builds.

### `src/app`
The core application logic and UI.

#### `src/app/pages`
- `CaseStudy.tsx`: Dynamic routing page for detailed project walk-throughs. Matches the home page theme but allows for natural vertical scrolling.

#### `src/app/sections`
The building blocks of the main landing page:
- `Hero.tsx`: The primary entry point. Features a "What I'm building" interactive list.
- `Projects.tsx`: The portfolio showcase with image clusters that react to list hovering.
- `AndWhat.tsx`: The "beyond the screen" section featuring interactive Polaroid clusters.

#### `src/app/components`
Reusable UI units that define the site's atmosphere:
- `NoiseOverlay.tsx`: Adds a subtle film-grain texture to eliminate the "flat" digital look.
- `BackgroundGlow.tsx`: A dynamic radial gradient that follows the mouse for atmospheric depth.
- `CustomCursor.tsx`: A high-fidelity cursor replacement that reacts to magnetic elements.
- `ImageCluster.tsx`: Manages the physics-based parallax groups of project images.
- `Polaroid.tsx`: Specialized component for the "AndWhat" section with rotation and caption support.
- `ProgressIndicator.tsx` / `MobileIndicator.tsx`: Navigation states for desktop and mobile.

#### `src/app/hooks`
- `useParallax.ts`: A custom hook managing the mouse-based offset physics for image clusters.
- `useIsMobile.ts`: Unified responsive detection.

#### `src/app/utils`
- `constants.ts`: **The Design System Core**. Contains easing functions (`EASE_PAGE`, `EASE_TEXT`), font definitions, and the `ls` (Line Sequence) animation helper.

---

## 🎨 Design System

### 1. Typography
We use a strictly enforced hierarchy:
- **Headings/Body:** `Figtree` for a modern, accessible feel.
- **Accents:** `Playfair Display` (Italic) for an editorial, high-end touch.
- **Captions:** `Caveat` for a "hand-written" feel in Polaroid sections.

### 2. Color Palette
- **Primary Background:** `#141414` (Deep matte black).
- **Accent Glow:** Subtle `rgba(255, 255, 255, 0.008)` to provide depth without color interference.
- **Text:** Primarily High-contrast White and `#888` Muted Grey for visual hierarchy.

### 3. Motion & Physics
- **Interpolation:** Mouse movements are smoothed using Linear Interpolation (lerp) with a `0.07` factor for a "heavy" premium feel.
- **Transitions:** Full-page slides use a customized `cubic-bezier(0.76, 0, 0.24, 1)` to mimic film transitions.

---

## ⚙️ Development & Maintenance

### How to update content
The entire website is data-driven. To change your personal info, projects, or images, modify:
`src/data/portfolio.ts`

This file contains:
- `PERSONAL_INFO`: Greeting and tagline.
- `BUILDING_PROJECTS`: Top-level interactive items in the Hero.
- `SELECTED_PROJECTS`: Portfolio items in the Projects section.
- `CATEGORIES`: Data for the Polaroid clusters in the "AndWhat" section.

### Tech Stack
- **Vite:** Next-gen frontend tooling.
- **React:** UI library.
- **TypeScript:** Strict type safety.
- **Tailwind CSS v4:** Modern CSS engine using native CSS variables.
- **React Router:** SPA routing for Case Studies.

---

## 🚀 Getting Started

1. `npm install` - Install dependencies (including TypeScript and React types).
2. `npm run dev` - Start the development server.
3. `npm run build` - Create a production-ready bundle.
