# Astarus AI Website

## Overview
A professional marketing website for Astarus AI, showcasing their memory-augmented transformer technology (LUT-LLM) for continuous learning AI systems. The website features a modern, complex UI/UX design with emphasis on the interactive demo (Chat/Try It) page.

## Tech Stack
- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Routing**: React Router

## Project Structure
```
AstarusAI/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Hero.tsx     # Main landing hero section
│   │   ├── Navbar.tsx   # Navigation with glass-morphism
│   │   ├── Problem.tsx  # Problem statement section
│   │   ├── Solution.tsx # Solution overview
│   │   ├── Advantages.tsx # Key metrics section
│   │   ├── UseCases.tsx # Use cases section
│   │   ├── CTA.tsx      # Call-to-action section
│   │   └── Footer.tsx   # Site footer
│   ├── pages/           # Page components
│   │   ├── Home.tsx     # Landing page
│   │   ├── Chat.tsx     # Interactive demo (Try It page)
│   │   ├── Technology.tsx # Technology deep dive
│   │   ├── Team.tsx     # Team members
│   │   ├── Investors.tsx # Investment opportunity
│   │   └── Contact.tsx  # Contact form
│   ├── lib/
│   │   └── motion.ts    # Framer Motion animation presets
│   └── index.css        # Global styles and design system
├── public/              # Static assets
└── package.json
```

## Design System
The design uses a sophisticated color palette and effects:

### Colors
- **Primary**: Purple (HSL 262, 83%, 58%) - Main brand color
- **Secondary**: Orange (HSL 25, 95%, 53%) - Accent color
- **Success**: Green (HSL 152, 76%, 36%)

### Effects
- Glass morphism for navigation and cards
- Gradient text effects
- Mesh gradient backgrounds
- Animated glows and shadows
- Smooth hover transitions

### CSS Classes
- `.text-gradient` - Primary gradient text
- `.text-gradient-secondary` - Secondary gradient text
- `.bg-gradient-primary` - Primary gradient background
- `.bg-gradient-secondary` - Secondary gradient background
- `.glass` / `.glass-dark` - Glass morphism effects
- `.glow-primary` / `.glow-secondary` - Glow effects
- `.cta-button` / `.cta-button-secondary` - CTA button styles
- `.section-badge` - Section label badges

## Key Features

### Chat Page (Priority)
- Real-time AI chat interface
- Pre-trained LUT model integration
- Custom knowledge teaching capability
- Advanced settings for LUT configuration
- Animated message bubbles
- Typing indicators

### Home Page
- Hero section with background image
- Problem/Solution narrative flow
- Key advantages with metrics
- Use cases section
- Professional CTA

### Other Pages
- Technology: Architecture deep dive
- Team: Team member profiles
- Investors: Investment opportunity details
- Contact: Form with FAQ accordion

## Recent Changes (November 2025)
- Complete professional UI/UX revamp
- Enhanced design system with modern gradients
- Glass morphism effects throughout
- Improved Chat page with professional controls
- Consistent styling across all pages
- Better responsive design
- Framer Motion animations

## Development
The site runs on port 5000 with Vite dev server.

```bash
npm run dev
```

## User Preferences
- Modern, professional, complex UI/UX
- Purple/orange color scheme
- Glass morphism and gradient effects
- Smooth animations
- Special focus on Chat/Try It page quality
