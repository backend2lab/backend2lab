

### Base Card Styling
```css
/* Container */
.flex items-center gap-3 p-3 rounded-lg

/* Background and Border */
.bg-dark-card border border-dark-border-primary

/* Cursor States */
.cursor-pointer

/* Transitions */
.transition-all duration-200

/* Hover Effects */
.hover:bg-dark-card-hover 
.hover:border-dark-border-secondary 
.hover:-translate-y-0.5
```

### Icon Container
```css
/* Icon wrapper */
.w-6 h-6 bg-dark-tertiary rounded-md flex items-center justify-center text-dark-text-secondary

/* Icon sizing */
.w-4 h-4
```

### Text Content
```css
/* Component name */
.text-sm font-medium text-dark-text-primary

/* Description */
.text-xs text-dark-text-secondary
```

### Action Icon
```css
/* Action indicator icon */
.w-4 h-4 text-dark-text-tertiary
```

## Color Palette

### Background Colors
- **Card Background**: `#334155` (dark-card)
- **Hover Background**: `#475569` (dark-card-hover)
- **Icon Background**: `#64748b` (dark-tertiary)

### Border Colors
- **Default Border**: `#475569` (dark-border-primary)
- **Hover Border**: `#64748b` (dark-border-secondary)

### Text Colors
- **Component Name**: `#ffffff` (dark-text-primary)
- **Description**: `#cbd5e1` (dark-text-secondary)
- **Icon Color**: `#94a3b8` (dark-text-tertiary)

## Interactive States

### Default State
- **Background**: Dark card color
- **Border**: Primary border color
- **Opacity**: 100%
- **Transform**: None
- **Cursor**: Pointer

### Hover State
- **Background**: Hover card color
- **Border**: Secondary border color
- **Opacity**: 100%
- **Transform**: Translate Y -2px (slight lift)
- **Cursor**: Pointer

### Active State (Pressed)
- **Background**: Hover card color
- **Border**: Secondary border color
- **Opacity**: 100%
- **Transform**: Translate Y -1px (reduced lift)
- **Cursor**: Pointer

### Focus State
- **Background**: Hover card color
- **Border**: Secondary border color with focus ring
- **Opacity**: 100%
- **Transform**: None
- **Cursor**: Pointer

## Typography

### Component Name
- **Font Size**: 14px (text-sm)
- **Font Weight**: 500 (font-medium)
- **Color**: White (#ffffff)
- **Line Height**: 1.4

### Description
- **Font Size**: 12px (text-xs)
- **Font Weight**: 400 (normal)
- **Color**: Light gray (#cbd5e1)
- **Line Height**: 1.5

## Spacing & Layout

### Card Dimensions
- **Height**: Auto (content-based)
- **Min Height**: 60px
- **Padding**: 12px (p-3)
- **Border Radius**: 8px (rounded-lg)

### Internal Spacing
- **Icon to Text**: 12px gap (gap-3)
- **Text to Action Icon**: Auto (flex-1)
- **Vertical Padding**: 12px
- **Horizontal Padding**: 12px

### Icon Container
- **Width**: 24px (w-6)
- **Height**: 24px (h-6)
- **Border Radius**: 6px (rounded-md)
- **Padding**: 4px (internal centering)

## Visual Hierarchy

### Primary Elements
1. **Component Icon**: Left-aligned, 24x24px
2. **Component Name**: Bold, 14px, white text
3. **Action Icon**: Right-aligned, subtle icon

### Secondary Elements
1. **Description**: Smaller, lighter text below name
2. **Hover Effects**: Subtle background and border changes

## Animation & Transitions

### Transition Properties
```css
transition: all 0.2s ease-in-out
```

### Animated Properties
- **Background Color**: Smooth transition on hover
- **Border Color**: Smooth transition on hover
- **Transform**: Smooth lift animation on hover
- **Opacity**: Consistent throughout interactions

### Timing
- **Duration**: 200ms
- **Easing**: ease-in-out
- **Delay**: None

## Visual Effects

### Hover Lift Effect
- **Transform**: `translateY(-2px)`
- **Purpose**: Creates subtle depth and interactivity
- **Timing**: Smooth 200ms transition

### Border Highlight Effect
- **Default**: Subtle border color
- **Hover**: Enhanced border color for focus
- **Purpose**: Clear visual feedback for interaction

### Background Transition Effect
- **Default**: Dark card background
- **Hover**: Lighter background for emphasis
- **Purpose**: Indicates interactive state

### Icon Container Effect
- **Background**: Muted tertiary color
- **Purpose**: Provides visual separation for icons
- **Shape**: Rounded rectangle for modern appearance

## Accessibility Considerations

### Visual Focus Indicators
- **Focus Ring**: 2px solid border with primary color
- **Focus Background**: Same as hover state
- **Focus Border**: Enhanced contrast

### Color Contrast
- **Text on Background**: 4.5:1 minimum ratio
- **Border on Background**: 3:1 minimum ratio
- **Icon on Background**: 3:1 minimum ratio

### Screen Reader Support
- **Component Name**: Primary label
- **Description**: Secondary description
- **Interactive State**: Clear state announcements

## Responsive Behavior

### Desktop (Default)
- **Full Layout**: Icon, text, and action icon visible
- **Hover Effects**: All effects enabled
- **Spacing**: Full padding and gaps

### Tablet
- **Reduced Padding**: 8px instead of 12px
- **Smaller Icons**: 20px instead of 24px
- **Condensed Text**: Slightly smaller font sizes

### Mobile
- **Stacked Layout**: Icon above text
- **Minimal Padding**: 6px
- **Touch Targets**: Minimum 44px height
- **Simplified Hover**: Reduced effects

## Design Principles

### Consistency
- **Uniform Spacing**: Consistent gaps and padding
- **Color Harmony**: Cohesive color palette
- **Typography Scale**: Systematic font sizing
- **Interactive Patterns**: Predictable hover states

### Clarity
- **Clear Hierarchy**: Obvious primary and secondary information
- **Readable Text**: Adequate contrast and sizing
- **Distinct States**: Clear visual feedback for interactions
- **Intuitive Icons**: Meaningful and recognizable symbols

### Elegance
- **Subtle Animations**: Smooth, not distracting
- **Refined Colors**: Professional, muted palette
- **Clean Layout**: Uncluttered, organized appearance
- **Balanced Proportions**: Harmonious element sizing

## Card Variations

### Standard Card
- **Layout**: Icon + Text + Action Icon
- **Height**: Content-based with minimum 60px
- **Use Case**: Primary component representation

### Compact Card
- **Layout**: Icon + Text only
- **Height**: Reduced padding and spacing
- **Use Case**: Space-constrained environments

### Expanded Card
- **Layout**: Icon + Text + Action Icon + Additional Info
- **Height**: Larger with more content
- **Use Case**: Detailed component information
