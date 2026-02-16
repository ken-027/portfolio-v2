# Tooltips and Custom Cursor Guide

## Overview
This portfolio now features elegant tooltips and a custom animated cursor effect to enhance the user experience and provide contextual information throughout the interface.

## Custom Cursor Effect

### Features
The custom cursor consists of three animated layers that follow the mouse pointer:

1. **Main Cursor Dot**
   - Small cyan dot (12px × 12px)
   - Fast, responsive movement with spring physics
   - Scales down slightly when hovering over interactive elements

2. **Outer Cursor Ring**
   - Larger ring (32px × 32px) with a cyan border
   - Follows with slight delay for smooth trailing effect
   - Expands when hovering over interactive elements
   - Semi-transparent with screen blend mode

3. **Trailing Glow Effect**
   - Subtle gradient glow (48px × 48px)
   - Creates a smooth, blurred trail behind the cursor
   - Adds depth and elegance to cursor movement

### Technical Implementation
- **Component**: `src/components/CustomCursor.jsx`
- **Technology**: Framer Motion for smooth spring animations
- **Responsive**: Only active on desktop (hidden on mobile via CSS)
- **Detection**: Automatically detects and reacts to interactive elements (links, buttons, inputs, elements with tooltips)

### Customization
To customize the cursor appearance, edit `src/components/CustomCursor.jsx`:

```jsx
// Change cursor colors
className="... bg-cyan-400 ..." // Main dot color
className="... border-cyan-400/50 ..." // Ring color
className="... from-cyan-400/20 to-blue-500/20 ..." // Glow gradient

// Adjust cursor sizes
className="... w-3 h-3 ..." // Main dot size (12px)
className="... w-8 h-8 ..." // Ring size (32px)
className="... w-12 h-12 ..." // Glow size (48px)

// Modify animation physics
stiffness: 500, // Higher = faster response
damping: 28,    // Higher = less bounce
mass: 0.5       // Lower = lighter feel
```

## Elegant Tooltips

### Features
- **Modern Design**: Dark theme with cyan accent border
- **Smooth Animations**: 200ms delay before showing
- **Context-Aware**: Positioned intelligently to avoid viewport edges
- **Backdrop Blur**: Semi-transparent with blur effect for depth
- **Consistent Styling**: Matches portfolio color scheme

### Visual Style
- Background: Slate-800 (`rgb(30 41 59)`)
- Text: White with medium font weight
- Border: Cyan with 30% opacity
- Shadow: Cyan glow effect
- Border Radius: 0.5rem (rounded)
- Padding: 0.5rem × 0.75rem

### Implementation Locations

#### 1. **Skills Section**
Each skill card displays:
- Skill name
- Proficiency level (e.g., "intermediate")
- Level rating (e.g., "Level 7/10")

```jsx
data-tooltip-content={`${skill.name} - ${skill.proficiency} (Level ${skill.level}/10)`}
```

#### 2. **Experiences Section**

**Company Links**:
```jsx
data-tooltip-content={`Visit ${experience.company} website`}
```

**Technology Badges**:
```jsx
data-tooltip-content={`${tech.name} - ${tech.proficiency || 'Level ' + tech.level}`}
```

**Project Expand Button**:
```jsx
data-tooltip-content={expandedProjects[index] ? 'Hide projects' : 'View projects'}
```

#### 3. **Projects Section**

**GitHub Links**:
```jsx
data-tooltip-content="View source code on GitHub"
```

**Live Demo Links**:
```jsx
data-tooltip-content="View live project demo"
```

#### 4. **Certificates Section**

**Filter Buttons**:
```jsx
data-tooltip-content={platform === 'all' ? 'Show all certificates' : `Filter by ${platform}`}
```

**Certificate Links**:
```jsx
data-tooltip-content="View and verify certificate"
```

#### 5. **Hero Section**

**Social Links**:
- GitHub: "View my GitHub profile"
- LinkedIn: "Connect on LinkedIn"
- Email: "Send me an email"

#### 6. **Navigation**

**Logo**:
```jsx
data-tooltip-content="Back to top"
```

**Menu Items**:
```jsx
data-tooltip-content={`Navigate to ${item.label} section`}
```

## Usage

### Adding Tooltips to New Elements

To add a tooltip to any element, include these attributes:

```jsx
<element
  data-tooltip-id="portfolio-tooltip"
  data-tooltip-content="Your tooltip text here"
  data-tooltip-place="top" // Optional: top, right, bottom, left
/>
```

### Available Tooltip Positions
- `top` (default)
- `right`
- `bottom`
- `left`

The tooltip will automatically adjust position if there's not enough space.

## Browser Compatibility

### Custom Cursor
- **Desktop**: Chrome, Firefox, Safari, Edge (modern versions)
- **Mobile**: Automatically disabled (default cursor shown)
- **Tablet**: Automatically disabled

### Tooltips
- Works on all modern browsers
- Touch devices: Tooltip appears on tap and persists until user taps elsewhere
- Keyboard navigation: Tooltips appear on focus

## Performance Considerations

### Custom Cursor
- Uses `requestAnimationFrame` for smooth 60fps animations
- Minimal DOM manipulation (only 3 elements)
- CSS `will-change` for GPU acceleration
- Event listeners properly cleaned up on unmount

### Tooltips
- Lazy rendering (only shown when needed)
- Single shared tooltip instance for entire app
- Minimal re-renders with proper memoization

## Accessibility

### Custom Cursor
- Does not interfere with screen readers
- Disabled on mobile for better touch interaction
- Respects user's motion preferences (can be enhanced)

### Tooltips
- `aria-label` attributes maintained for screen readers
- Keyboard accessible (appear on focus)
- Sufficient color contrast (WCAG AA compliant)
- Clear, concise messaging

## Customizing Tooltip Styles

### Global Styles
Edit `src/components/Tooltip.jsx`:

```jsx
style={{
  backgroundColor: 'rgb(30 41 59)', // Background color
  color: 'rgb(241 245 249)',        // Text color
  borderRadius: '0.5rem',           // Corner rounding
  padding: '0.5rem 0.75rem',        // Internal spacing
  fontSize: '0.875rem',             // Text size
  boxShadow: '...',                 // Glow effect
  fontWeight: '500',                // Text weight
  backdropFilter: 'blur(8px)',      // Blur effect
}}
```

### Animation Timing
```jsx
delayShow={200}  // Delay before showing (ms)
delayHide={0}    // Delay before hiding (ms)
```

## Disabling Features

### Disable Custom Cursor
Remove or comment out in `src/App.jsx`:
```jsx
// <CustomCursor />
```

And remove the CSS in `src/index.css`:
```css
/* Remove or comment out */
.custom-cursor,
.custom-cursor * {
  cursor: none !important;
}
```

### Disable Tooltips
Remove or comment out in `src/App.jsx`:
```jsx
// <Tooltip />
```

And remove `data-tooltip-*` attributes from components.

## Dependencies

```json
{
  "react-tooltip": "^5.x",
  "framer-motion": "^11.x"
}
```

## Future Enhancements

Potential improvements:
- [ ] Respect `prefers-reduced-motion` for cursor animations
- [ ] Add cursor color theming options
- [ ] Rich tooltip content (HTML, images)
- [ ] Tooltip keyboard shortcuts
- [ ] Custom cursor shapes for different contexts
- [ ] Cursor particle effects
- [ ] Tooltip sound effects (optional)

## Troubleshooting

### Cursor not appearing
1. Check if you're on desktop (mobile is disabled by default)
2. Ensure `CustomCursor` component is rendered in `App.jsx`
3. Verify CSS `.custom-cursor` class is applied to root element
4. Check browser console for errors

### Tooltips not showing
1. Verify `Tooltip` component is rendered in `App.jsx`
2. Ensure element has `data-tooltip-id="portfolio-tooltip"`
3. Check if `data-tooltip-content` is not empty
4. Verify `react-tooltip` is installed: `npm list react-tooltip`

### Cursor lagging
1. Reduce cursor size or glow blur amount
2. Simplify spring physics (higher damping, lower stiffness)
3. Check for other performance issues in browser DevTools

### Tooltips position wrong
1. Try different `data-tooltip-place` values
2. Check if parent elements have `overflow: hidden`
3. Ensure tooltip container has proper `z-index`

## Support

For issues or questions:
1. Check browser console for errors
2. Verify all dependencies are installed
3. Review component code in `src/components/`
4. Test in different browsers/devices
