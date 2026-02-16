# Software Developer Portfolio

A modern, elegant portfolio website built with React, Vite, and Tailwind CSS. Showcasing experiences, skills, projects, and certificates with smooth animations and a responsive design.

## Features

- **Modern UI/UX**: Clean and elegant design with smooth animations using Framer Motion
- **Custom Cursor Effect**: Elegant animated cursor with trailing effect and interactive hover states (desktop only)
- **Smart Tooltips**: Context-aware tooltips throughout the interface for enhanced UX
- **Responsive Design**: Fully responsive across all devices
- **Dynamic Content**: Fetches data from API endpoints
- **Dark Theme**: Professional dark-themed interface
- **Smooth Navigation**: Smooth scrolling between sections
- **Performance Optimized**: Built with Vite for fast loading times

## Component Features

### Navigation
- **Enhanced Logo**: Animated rotating glow with dual text layout (Portfolio + Kenneth Andales)
- **Multi-Color Progress Bar**: 4-color gradient (Blue→Cyan→Purple→Fuchsia) with glow effect
- **Active Indicators**: Floating pulsing dots below active sections
- **Social Integration**: Quick access to GitHub and LinkedIn profiles
- **Dual CTAs**: Contact and Resume download buttons
- **Advanced Glass-Morphism**: Strong backdrop blur effect when scrolled
- **Enhanced Mobile Menu**: Icon containers, social row, body scroll lock, staggered animations
- **Smooth Animations**: Lift effects, shared motion transitions, micro-interactions

### Hero Section
- **Availability Badge**: Dynamic status indicator with pulsing dot
- **Enhanced Typography**: Responsive 5xl→7xl→8xl heading with gradient text
- **Floating Tech Icons**: 8 animated technology icons (React, Node.js, TypeScript, Docker, etc.)
- **Key Highlights**: 3 interactive badges showcasing expertise (Backend, Microservices, AI)
- **Tech Stack Showcase**: Prominent card displaying 8 daily technologies with sequential animations
- **Multiple CTAs**: 3 action buttons (View My Work, Experience, Certificates)
- **Social Links**: GitHub, LinkedIn, Email with hover effects
- **Enhanced Scroll Indicator**: Clickable mouse animation with bounce effect
- **Enhanced Parallax Background**: 8-layer gradient mesh with pulsing orbs, floating particles, and animations

### Projects Section
- **Advanced Filtering**: Filter by project type (personal/company/freelance) and category (frontend/backend/fullstack)
- **Real-time Counts**: See project counts for each filter option
- **Combined Filters**: Use multiple filters together for precise results
- **Category Badges**: Color-coded badges for frontend, backend, and full stack projects
- **AI-Powered Indicators**: Special badges for AI-powered projects with pulsing animation
- **Project Types**: Visual indicators for personal, company, and freelance projects
- **Role Badges**: Display project role (individual contributor, team collaborator, pair programmer)
- **Multiple Links**: GitHub, Docker Hub, and live demo links with distinct icons
- **Technology Stack**: Interactive technology badges with icons, levels, and tooltips
- **Smart Fallbacks**: Graceful handling of missing images and optional fields

### Other Sections
- **Experiences**: Timeline view with expandable nested projects and company details
- **Skills**: Categorized skills with proficiency indicators and visual level bars
- **Certificates**: Filterable certificate gallery with verification links

## Tech Stack

- **React 19** - UI library
- **Vite 7** - Build tool
- **Tailwind CSS 4** - Styling
- **Framer Motion** - Animations & cursor effects
- **React Tooltip** - Elegant tooltips
- **Axios** - API requests
- **React Icons** - Icon library

## API Endpoints

The portfolio fetches data from the following endpoints:

- Experiences: `https://portfolio-api.ksoftdev.site/api/v1/portfolio/experiences`
- Skills: `https://portfolio-api.ksoftdev.site/api/v1/portfolio/skills`
- Projects: `https://portfolio-api.ksoftdev.site/api/v1/portfolio/projects`
- Certificates: `https://portfolio-api.ksoftdev.site/api/v1/portfolio/certificates`

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd portfolio-prompt
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
portfolio-prompt/
├── src/
│   ├── components/
│   │   ├── Navigation.jsx      # Navigation bar
│   │   ├── Hero.jsx            # Hero section
│   │   ├── Experiences.jsx     # Work experience
│   │   ├── Skills.jsx          # Skills showcase
│   │   ├── Projects.jsx        # Featured projects
│   │   ├── Certificates.jsx    # Certificates
│   │   └── Footer.jsx          # Footer
│   ├── hooks/
│   │   └── useFetch.js         # Custom fetch hook
│   ├── services/
│   │   └── api.js              # API service
│   ├── App.jsx                 # Main app component
│   ├── App.css                 # App styles
│   ├── index.css               # Global styles
│   └── main.jsx                # Entry point
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## Customization

### Update Social Links

Edit the social links in `src/components/Hero.jsx` and `src/components/Footer.jsx`:

```jsx
<a href="YOUR_GITHUB_URL">
  <FaGithub />
</a>
```

### Change Color Theme

Modify the color scheme in `tailwind.config.js`:

```js
colors: {
  primary: {
    // Your custom colors
  },
}
```

### Modify API Endpoints

Update the base URL in `src/services/api.js`:

```js
const BASE_URL = 'YOUR_API_BASE_URL';
```

## Building for Production

1. Build the project:
```bash
npm run build
```

2. The built files will be in the `dist` directory

3. Preview the production build:
```bash
npm run preview
```

## Deployment

You can deploy this portfolio to various platforms:

- **Vercel**: Connect your repository and deploy automatically
- **Netlify**: Drag and drop the `dist` folder or connect your repository
- **GitHub Pages**: Use GitHub Actions to deploy
- **Custom Server**: Upload the `dist` folder to your web server

## License

MIT

## Author

Software Developer specializing in backend development
