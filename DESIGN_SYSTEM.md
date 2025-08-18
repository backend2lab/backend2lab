# Old Design System Reference

This document preserves the original design system that was used before the tactical operations overhaul. It featured a modern dark theme with blue accents and gradient effects.

## Color Palette

### Primary Colors
- **Primary Blue**: `#0ea5e9` (sky-500) - Main accent color
- **Primary Dark**: `#0369a1` (sky-700) - Darker variant
- **Primary Light**: `#38bdf8` (sky-400) - Lighter variant

### Secondary Colors
- **Secondary Purple**: `#d946ef` (fuchsia-500) - Secondary accent
- **Secondary Dark**: `#a21caf` (fuchsia-700) - Darker variant

### Success Colors
- **Success Green**: `#22c55e` (green-500) - Success states
- **Success Dark**: `#16a34a` (green-600) - Darker variant

### Warning Colors
- **Warning Yellow**: `#f59e0b` (amber-500) - Warning states
- **Warning Dark**: `#d97706` (amber-600) - Darker variant

### Error Colors
- **Error Red**: `#ef4444` (red-500) - Error states
- **Error Dark**: `#dc2626` (red-600) - Darker variant

### Dark Theme Colors
- **Background Primary**: `#0a0a0f` - Main background
- **Background Secondary**: `#1a1a2e` - Secondary background
- **Background Tertiary**: `#16213e` - Card backgrounds
- **Card Background**: `rgba(255, 255, 255, 0.03)` - Card surfaces
- **Card Hover**: `rgba(255, 255, 255, 0.06)` - Card hover states
- **Overlay**: `rgba(0, 0, 0, 0.8)` - Modal overlays

### Border Colors
- **Border Primary**: `rgba(255, 255, 255, 0.08)` - Main borders
- **Border Secondary**: `rgba(255, 255, 255, 0.12)` - Secondary borders
- **Border Accent**: `rgba(14, 165, 233, 0.3)` - Accent borders

### Text Colors
- **Text Primary**: `#ffffff` - Primary text
- **Text Secondary**: `rgba(255, 255, 255, 0.7)` - Secondary text
- **Text Tertiary**: `rgba(255, 255, 255, 0.5)` - Tertiary text
- **Text Muted**: `rgba(255, 255, 255, 0.4)` - Muted text

## Typography

### Font Family
- **Primary**: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`
- **Monospace**: `SF Mono, Monaco, Cascadia Code, Roboto Mono, Consolas, Courier New, monospace`

### Font Weights
- **Regular**: 400 - Body text
- **Medium**: 500 - Emphasized text
- **Semibold**: 600 - Headings
- **Bold**: 700 - Important data

### Text Sizes
- **Large**: `text-lg` (18px) - Headings
- **Body**: `text-sm` (14px) - Standard text
- **Small**: `text-xs` (12px) - Labels and secondary info

## Layout System

### Spacing Scale
- **xs**: `space-y-1` (4px) - Tight spacing
- **sm**: `space-y-2` (8px) - Related elements
- **md**: `space-y-3` (12px) - Component sections
- **lg**: `space-y-4` (16px) - Major sections
- **xl**: `space-y-6` (24px) - Page sections

### Container Widths
- **Sidebar**: `w-80` (320px) - Left sidebar
- **Content**: `flex-1` - Flexible main content
- **Metrics Panel**: `w-80` (320px) - Right metrics panel

### Border Radius
- **Small**: `rounded` (4px) - Buttons and small elements
- **Medium**: `rounded-lg` (8px) - Cards and components
- **Large**: `rounded-xl` (12px) - Large cards
- **Extra Large**: `rounded-2xl` (16px) - Hero sections

## Component Patterns

### Bento Cards
```tsx
<div className="bg-dark-card border border-dark-border-primary rounded-2xl p-6 backdrop-blur-xl transition-all duration-300 relative overflow-hidden cursor-pointer min-h-[160px]">
  {/* Gradient border effect */}
  <div className="absolute inset-0 rounded-2xl opacity-30 bg-gradient-to-br from-primary-500/10 to-secondary-500/5" />
  {/* Content */}
</div>
```

### Workflow Nodes
```tsx
<div className="bg-dark-card border-2 border-dark-border-primary rounded-xl p-4 min-w-[200px] relative transition-all duration-300 cursor-grab backdrop-blur-sm">
  {/* Background gradient */}
  <div className="absolute inset-0 rounded-xl opacity-30 bg-gradient-to-br from-dark-tertiary/80 to-dark-tertiary/60" />
  {/* Node content */}
</div>
```

### Buttons
```tsx
// Primary Button
<button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:-translate-y-0.5">
  Button Text
</button>

// Secondary Button
<button className="bg-dark-card border border-dark-border-primary hover:bg-dark-card-hover hover:border-dark-border-secondary text-dark-text-primary px-4 py-2 rounded-lg font-medium transition-all duration-300">
  Button Text
</button>
```

### Status Indicators
```tsx
// Active/Online
<div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>

// Warning/Standby
<div className="w-2 h-2 bg-warning-500 rounded-full"></div>

// Error/Offline
<div className="w-2 h-2 bg-error-500 rounded-full"></div>
```

## Interactive States

### Hover Effects
- **Cards**: `hover:bg-dark-card-hover hover:border-dark-border-secondary -translate-y-1`
- **Buttons**: `hover:-translate-y-0.5` with shadow effects
- **Nodes**: `hover:border-primary-500` with glow effects

### Active States
- **Navigation**: `bg-primary-600 text-white`
- **Selected**: `border-primary-500` with glow shadow

### Transitions
- **Standard**: `transition-all duration-300`
- **Fast**: `transition-all duration-200`
- **Slow**: `transition-all duration-500`

## Visual Effects

### Shadows
- **Glow**: `box-shadow: 0 0 20px rgba(14, 165, 233, 0.5)`
- **Glow Large**: `box-shadow: 0 0 40px rgba(14, 165, 233, 0.3)`
- **Card**: `box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3)`

### Gradients
- **Primary**: `linear-gradient(135deg, rgba(14, 165, 233, 0.8) 0%, rgba(14, 165, 233, 0.6) 100%)`
- **Secondary**: `linear-gradient(135deg, rgba(217, 70, 239, 0.8) 0%, rgba(217, 70, 239, 0.6) 100%)`
- **Background**: `linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)`

### Animations
```css
@keyframes glow {
  0%, 100% { box-shadow: 0 0 5px rgba(14, 165, 233, 0.5); }
  50% { box-shadow: 0 0 20px rgba(14, 165, 233, 0.8); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}
```

## React Flow Styling

### Node Styling
```css
.workflow-node {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%);
  border: 2px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.workflow-node:hover {
  border-color: #0ea5e9;
  transform: translateY(-1px);
}

.workflow-node.selected {
  border-color: #0ea5e9;
  box-shadow: 0 0 20px rgba(14, 165, 233, 0.3);
}
```

### Edge Styling
```css
.react-flow__edge-path {
  stroke: #0ea5e9;
  stroke-width: 2px;
}

.react-flow__edge-path.animated {
  stroke-dasharray: 5;
  animation: dash 20s linear infinite;
}

.react-flow__edge.selected .react-flow__edge-path {
  stroke: #0ea5e9;
  stroke-width: 3px;
}
```

### Handle Styling
```css
.react-flow__handle {
  background: #0ea5e9 !important;
  border: 2px solid #0f172a !important;
  width: 12px !important;
  height: 12px !important;
}

.react-flow__handle:hover {
  background: #38bdf8 !important;
  transform: scale(1.05);
}
```

## Background Effects

### Canvas Background
```css
.react-flow__pane {
  background: 
    radial-gradient(circle at 25% 25%, rgba(14, 165, 233, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(217, 70, 239, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.02) 0%, transparent 50%);
}
```

### Floating Particles
```css
.react-flow__pane::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(2px 2px at 20px 30px, rgba(14, 165, 233, 0.3), transparent),
    radial-gradient(2px 2px at 40px 70px, rgba(217, 70, 239, 0.3), transparent),
    radial-gradient(1px 1px at 90px 40px, rgba(34, 197, 94, 0.3), transparent);
  background-repeat: repeat;
  background-size: 200px 100px;
  animation: float 20s linear infinite;
  opacity: 0.1;
  pointer-events: none;
}
```

## Data Display

### Metrics Cards
```tsx
<div className="text-2xl font-bold text-primary-500">
  {value.toLocaleString()}
</div>
<div className="text-xs text-dark-text-secondary">
  {label}
</div>
```

### Status Text
```tsx
<span className="text-sm font-semibold text-dark-text-primary">
  {status}
</span>
```

## Navigation Patterns

### Sidebar Items
```tsx
<div className="flex items-center gap-3 p-3 rounded-lg bg-dark-card border border-dark-border-primary cursor-grab transition-all duration-200 hover:bg-dark-card-hover hover:border-dark-border-secondary hover:-translate-y-0.5">
  <div className="w-6 h-6 bg-dark-tertiary rounded-md flex items-center justify-center text-dark-text-secondary">
    {icon}
  </div>
  <div className="flex-1">
    <div className="text-sm font-medium text-dark-text-primary">{name}</div>
    <div className="text-xs text-dark-text-secondary">{description}</div>
  </div>
</div>
```

## Usage Guidelines

### Do's
- Use blue primary color for active states and highlights
- Apply gradient backgrounds for depth and visual interest
- Use backdrop blur for modern glass-morphism effects
- Implement smooth transitions and hover animations
- Use glow effects sparingly for emphasis

### Don'ts
- Don't use too many bright colors simultaneously
- Don't overuse glow effects
- Don't make animations too fast or jarring
- Don't use gradients that don't follow the color palette

## Code Examples

### Complete Card Component
```tsx
<div className="bg-dark-card border border-dark-border-primary rounded-2xl p-6 backdrop-blur-xl transition-all duration-300 relative overflow-hidden cursor-pointer min-h-[160px] group">
  <div className="absolute inset-0 rounded-2xl opacity-30 bg-gradient-to-br from-primary-500/10 to-secondary-500/5" />
  <div className="relative z-10">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-8 bg-dark-tertiary rounded-lg flex items-center justify-center text-lg">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-semibold text-dark-text-primary mb-1">{title}</h3>
        <p className="text-xs text-dark-text-secondary">{description}</p>
      </div>
    </div>
    {children}
  </div>
</div>
```

This design system emphasized modern aesthetics with blue accents, gradient effects, and smooth animations, creating a sophisticated and engaging user interface.
