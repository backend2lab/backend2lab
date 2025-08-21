# Tactical Operations Design System

A comprehensive design system for cyberpunk/tactical themed interfaces with dark aesthetics and high-tech functionality.

## Color Palette

### Primary Colors (3 total)
- **Primary Brand**: `#f97316` (orange-500) - Used for active states, highlights, and primary actions
- **Background**: `#000000` (black) - Main background color
- **Surface**: `#171717` (neutral-900) - Card backgrounds and elevated surfaces

### Neutral Colors (2 total)
- **Text Primary**: `#ffffff` (white) - Primary text and active elements
- **Text Secondary**: `#737373` (neutral-500) - Secondary text and labels

### Semantic Colors
- **Success/Active**: `#ffffff` (white) - Active status indicators
- **Warning/Standby**: `#737373` (neutral-500) - Standby status
- **Error/Compromised**: `#ef4444` (red-500) - Error states and compromised status

### Border Colors
- **Primary Border**: `#404040` (neutral-700) - Card borders and dividers
- **Secondary Border**: `#262626` (neutral-800) - Subtle separators

## Typography

### Font Family
- **Primary**: `Geist Mono` - Monospace font for all text elements
- **Fallback**: System monospace fonts

### Font Weights
- **Regular**: 400 - Body text and standard content
- **Medium**: 500 - Emphasized text
- **Bold**: 700 - Headings and important data

### Text Hierarchy
- **Large Data**: `text-2xl` (24px) - Key metrics and numbers
- **Body**: `text-sm` (14px) - Standard body text
- **Small**: `text-xs` (12px) - Labels, timestamps, and secondary information

### Text Styles
- **Tracking**: `tracking-wider` - Used for section headers and labels
- **Font Variant**: `font-mono` - Applied to data, IDs, and technical information

## Layout System

### Grid Structure
- **Main Layout**: 12-column CSS Grid for responsive layouts
- **Card Grid**: Flexible grid system using `grid-cols-1 lg:grid-cols-12`
- **Content Grid**: 3-column grids for data display

### Spacing Scale
- **xs**: `space-y-1` (4px) - Tight spacing within components
- **sm**: `space-y-2` (8px) - Related elements
- **md**: `space-y-3` (12px) - Component sections
- **lg**: `space-y-6` (24px) - Major sections
- **xl**: `p-6` (24px) - Page padding

### Container Widths
- **Sidebar Collapsed**: `w-16` (64px)
- **Sidebar Expanded**: `w-70` (280px)
- **Content**: `flex-1` - Flexible main content area

## Component Patterns

### Cards
\`\`\`tsx
<Card className="bg-neutral-900 border-neutral-700">
  <CardHeader className="pb-3">
    <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
      SECTION TITLE
    </CardTitle>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
\`\`\`

### Status Indicators
\`\`\`tsx
<div className="w-2 h-2 bg-white rounded-full animate-pulse"></div> // Active
<div className="w-2 h-2 bg-neutral-500 rounded-full"></div> // Standby
<div className="w-2 h-2 bg-red-500 rounded-full"></div> // Error
\`\`\`

### Data Display
\`\`\`tsx
<div className="text-2xl font-bold text-white font-mono">190</div>
<div className="text-xs text-neutral-500">Label</div>
\`\`\`

### Navigation Items
\`\`\`tsx
<button className={`w-full flex items-center gap-3 p-3 rounded transition-colors ${
  active ? "bg-orange-500 text-white" : "text-neutral-400 hover:text-white hover:bg-neutral-800"
}`}>
  <Icon className="w-5 h-5" />
  <span className="text-sm font-medium">LABEL</span>
</button>
\`\`\`

## Interactive States

### Hover Effects
- **Cards**: `hover:bg-neutral-700` - Subtle background change
- **Buttons**: `hover:text-white hover:bg-neutral-800` - Text and background transition
- **Icons**: `hover:text-orange-500` - Color change to primary

### Active States
- **Navigation**: `bg-orange-500 text-white` - Primary color background
- **Status**: `animate-pulse` - Pulsing animation for active elements

### Transitions
- **Standard**: `transition-colors` - Smooth color transitions
- **Layout**: `transition-all duration-300` - Layout changes (sidebar collapse)

## Data Visualization

### Chart Colors
- **Primary Line**: `#f97316` (orange-500) - Main data series
- **Secondary Line**: `#ffffff` (white) with `stroke-dasharray="5,5"` - Comparison data
- **Grid**: `border-neutral-700` with `opacity-20` - Background grid

### Progress Indicators
- **Circular**: Concentric circles with varying opacity
- **Linear**: Border-left accent with `border-orange-500`

## Accessibility

### Contrast Ratios
- **Primary Text**: White on black (21:1 ratio) - Exceeds WCAG AAA
- **Secondary Text**: Neutral-500 on black (4.6:1 ratio) - Meets WCAG AA
- **Interactive Elements**: Orange-500 on black (8.2:1 ratio) - Exceeds WCAG AA

### Focus States
- **Keyboard Navigation**: Maintain visible focus indicators
- **Screen Readers**: Use semantic HTML and ARIA labels

## Animation Guidelines

### Subtle Animations
- **Pulse**: `animate-pulse` for active status indicators
- **Transitions**: 300ms duration for layout changes
- **Hover**: Instant color transitions for immediate feedback

### Performance
- Use CSS transforms for animations
- Limit animations to essential feedback elements
- Prefer opacity and color changes over layout animations

## Usage Guidelines

### Do's
- Use monospace font for all technical data (IDs, timestamps, codes)
- Apply `tracking-wider` to section headers for improved readability
- Maintain consistent spacing using the defined scale
- Use semantic color coding for status indicators

### Don'ts
- Don't mix font families - stick to Geist Mono throughout
- Don't use more than the defined 5 colors without explicit need
- Don't create complex gradients - maintain the stark, technical aesthetic
- Don't use decorative elements that break the tactical theme

## Code Examples

### Complete Card Component
\`\`\`tsx
<Card className="lg:col-span-4 bg-neutral-900 border-neutral-700">
  <CardHeader className="pb-3">
    <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
      AGENT ALLOCATION
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="text-center">
        <div className="text-2xl font-bold text-white font-mono">190</div>
        <div className="text-xs text-neutral-500">Active Field</div>
      </div>
    </div>
  </CardContent>
</Card>
\`\`\`

### Activity Log Entry
\`\`\`tsx
<div className="text-xs border-l-2 border-orange-500 pl-3 hover:bg-neutral-800 p-2 rounded transition-colors">
  <div className="text-neutral-500 font-mono">25/06/2025 09:29</div>
  <div className="text-white">
    Agent <span className="text-orange-500 font-mono">gh0st_Fire</span> completed mission in{" "}
    <span className="text-white font-mono">Berlin</span>
  </div>
</div>
\`\`\`

This design system ensures consistency across the tactical operations interface while maintaining the cyberpunk aesthetic and technical functionality.
