# Customization Guide

## Quick Customization Checklist

### 1. Personal Information

#### Update Your Name and Title
**File**: `src/components/Hero.jsx`

```jsx
// Line 54 - Update the title
<span className="text-gradient">Your Name Here</span>

// Line 62 - Update the description
Backend specialist crafting robust, scalable solutions...
```

#### Update Footer Copyright
**File**: `src/components/Footer.jsx`

```jsx
// Line 70
by Your Name
```

### 2. Social Media Links

#### Hero Section
**File**: `src/components/Hero.jsx` (Lines 83-105)

```jsx
<a href="https://github.com/yourusername">
<a href="https://linkedin.com/in/yourusername">
<a href="mailto:your.email@example.com">
```

#### Footer Section
**File**: `src/components/Footer.jsx` (Line 12)

```jsx
const socialLinks = [
  { icon: FaGithub, href: 'https://github.com/yourusername', label: 'GitHub' },
  { icon: FaLinkedin, href: 'https://linkedin.com/in/yourusername', label: 'LinkedIn' },
  { icon: FaTwitter, href: 'https://twitter.com/yourusername', label: 'Twitter' },
  { icon: FaEnvelope, href: 'mailto:your.email@example.com', label: 'Email' },
];
```

### 3. Color Scheme

#### Current Color Palette
- **Primary**: Blue to Cyan gradient (#0ea5e9 → #06b6d4)
- **Background**: Slate 950 (#020617)
- **Cards**: Slate 800/50 with transparency
- **Text**: Slate 100 (primary), Slate 400 (secondary)
- **Borders**: Slate 700

#### Change Primary Colors
**File**: `tailwind.config.js`

```js
colors: {
  primary: {
    50: '#f0f9ff',   // Lightest
    100: '#e0f2fe',
    // ... modify these hex values
    900: '#0c4a6e',  // Darkest
  },
}
```

#### Change Gradient Colors
**File**: `src/index.css`

```css
.text-gradient {
  @apply bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent;
  /* Change: from-YOUR_COLOR via-YOUR_COLOR to-YOUR_COLOR */
}
```

### 4. Typography

#### Current Font
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800

#### Change Font
**File**: `src/index.css`

```css
@import url('https://fonts.googleapis.com/css2?family=YOUR_FONT:wght@300;400;500;600;700;800&display=swap');
```

**File**: `tailwind.config.js`

```js
fontFamily: {
  sans: ['YOUR_FONT', 'system-ui', 'sans-serif'],
},
```

### 5. Navigation Items

**File**: `src/components/Navigation.jsx` (Line 26)

```jsx
const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'experiences', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'certificates', label: 'Certificates' },
  // Add more items here
];
```

### 6. Hero CTA Buttons

**File**: `src/components/Hero.jsx` (Lines 70-84)

```jsx
<button onClick={() => /* Your action */}>
  View My Work
</button>

<button onClick={() => /* Your action */}>
  Experience
</button>
```

### 7. API Endpoints

**File**: `src/services/api.js`

```js
const BASE_URL = 'https://your-api-domain.com/api/v1/portfolio';
```

Or use environment variables:

**File**: `.env`
```env
VITE_API_BASE_URL=https://your-api-domain.com/api/v1/portfolio
```

**File**: `src/services/api.js`
```js
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'default-url';
```

### 8. Add New Section

1. **Create Component** (`src/components/NewSection.jsx`):

```jsx
import { motion } from 'framer-motion';

const NewSection = () => {
  return (
    <section id="newsection" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-8">
          <span className="text-gradient">New Section</span>
        </h2>
        {/* Your content */}
      </div>
    </section>
  );
};

export default NewSection;
```

2. **Import in App.jsx**:

```jsx
import NewSection from './components/NewSection'

function App() {
  return (
    <div>
      <Navigation />
      <main>
        <Hero />
        {/* ... other sections */}
        <NewSection />  {/* Add here */}
      </main>
      <Footer />
    </div>
  )
}
```

3. **Add to Navigation** (`src/components/Navigation.jsx`):

```jsx
const navItems = [
  // ... existing items
  { id: 'newsection', label: 'New Section' },
];
```

### 9. Animation Customization

#### Adjust Animation Speed
**Any component with animations**:

```jsx
transition={{ duration: 0.6 }}  // Change duration (in seconds)
```

#### Change Animation Style
```jsx
transition={{ ease: 'easeOut' }}  // Options: easeIn, easeOut, easeInOut, linear
```

#### Disable Animations
Remove or comment out `framer-motion` imports and `motion.*` components:

```jsx
// Before
<motion.div animate={{ ... }}>

// After
<div>
```

### 10. Favicon

Replace `/vite.svg` in the `public` folder with your own icon, or:

**File**: `index.html`

```html
<link rel="icon" type="image/png" href="/your-icon.png" />
```

### 11. Meta Tags (SEO)

**File**: `index.html`

```html
<meta name="description" content="Your custom description" />
<meta name="keywords" content="your, keywords, here" />
<meta property="og:title" content="Your Portfolio" />
<meta property="og:description" content="Your description" />
<meta property="og:image" content="https://your-domain.com/og-image.jpg" />
<meta name="twitter:card" content="summary_large_image" />
```

### 12. Loading States

Customize spinners and loading messages in:
- `src/components/Experiences.jsx`
- `src/components/Skills.jsx`
- `src/components/Projects.jsx`
- `src/components/Certificates.jsx`

```jsx
if (loading) {
  return (
    <div className="flex items-center justify-center h-64">
      <FaSpinner className="text-4xl text-cyan-400 animate-spin" />
      <p>Custom loading message...</p>
    </div>
  );
}
```

### 13. Error Messages

Customize error handling:

```jsx
if (error) {
  return (
    <div className="text-center text-red-400">
      <p>Custom error message: {error}</p>
    </div>
  );
}
```

## Advanced Customization

### Add Dark/Light Mode Toggle

1. Install a theme package or use React Context
2. Update Tailwind config with light mode colors
3. Add toggle button in Navigation

### Add Animations to Scroll

```jsx
<motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
>
```

### Add Form (Contact Section)

1. Create `src/components/Contact.jsx`
2. Use form library like React Hook Form
3. Connect to backend API

## Testing Changes

1. Save your changes
2. Check browser (HMR will auto-refresh)
3. Test on different screen sizes
4. Check browser console for errors

## Need Help?

- Check component comments in code
- Review the React documentation
- Check Tailwind CSS docs for styling
- Review Framer Motion docs for animations

---

Happy customizing! 🎨
