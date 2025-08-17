# Backend Playground Design System

A comprehensive design system inspired by LeetCode's clean, educational interface for backend development learning.

## Table of Contents

1. [Brand Identity](#brand-identity)
2. [Color Palette](#color-palette)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Components](#components)
6. [Interactive States](#interactive-states)
7. [Responsive Design](#responsive-design)
8. [Accessibility](#accessibility)

## Brand Identity

### Mission
Backend Playground is an interactive learning platform that makes backend development accessible, engaging, and practical through hands-on coding exercises and real-time feedback.

### Design Principles
- **Clarity First**: Clean, uncluttered interfaces that focus on learning
- **Progressive Disclosure**: Information revealed as needed to avoid cognitive overload
- **Immediate Feedback**: Real-time validation and results
- **Educational Focus**: Every design decision supports learning outcomes
- **Accessibility**: Inclusive design for all learners

## Color Palette

### Primary Colors
```css
/* Primary Blue - Main brand color */
--primary-50: #eff6ff;
--primary-100: #dbeafe;
--primary-500: #3b82f6;
--primary-600: #2563eb;
--primary-700: #1d4ed8;
--primary-900: #1e3a8a;

/* Success Green - For correct solutions */
--success-50: #f0fdf4;
--success-100: #dcfce7;
--success-500: #22c55e;
--success-600: #16a34a;
--success-700: #15803d;

/* Warning Orange - For hints and warnings */
--warning-50: #fffbeb;
--warning-100: #fef3c7;
--warning-500: #f59e0b;
--warning-600: #d97706;
--warning-700: #b45309;

/* Error Red - For errors and failures */
--error-50: #fef2f2;
--error-100: #fee2e2;
--error-500: #ef4444;
--error-600: #dc2626;
--error-700: #b91c1c;
```

### Neutral Colors
```css
/* Grays for text and backgrounds */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-400: #9ca3af;
--gray-500: #6b7280;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-800: #1f2937;
--gray-900: #111827;
```

### Semantic Colors
```css
/* Code-specific colors */
--code-bg: #1e1e1e;
--code-text: #d4d4d4;
--code-comment: #6a9955;
--code-keyword: #569cd6;
--code-string: #ce9178;
--code-number: #b5cea8;
--code-function: #dcdcaa;

/* Status colors */
--status-running: #3b82f6;
--status-success: #22c55e;
--status-error: #ef4444;
--status-warning: #f59e0b;
--status-info: #06b6d4;
```

## Typography

### Font Stack
```css
--font-family-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--font-family-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', monospace;
```

### Type Scale
```css
/* Headings */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */

/* Font Weights */
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Text Styles
```css
/* Heading Styles */
.heading-1 {
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  line-height: 1.2;
  color: var(--gray-900);
}

.heading-2 {
  font-size: var(--text-3xl);
  font-weight: var(--font-semibold);
  line-height: 1.3;
  color: var(--gray-800);
}

.heading-3 {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  line-height: 1.4;
  color: var(--gray-800);
}

/* Body Text */
.body-large {
  font-size: var(--text-lg);
  font-weight: var(--font-normal);
  line-height: 1.6;
  color: var(--gray-700);
}

.body-medium {
  font-size: var(--text-base);
  font-weight: var(--font-normal);
  line-height: 1.5;
  color: var(--gray-700);
}

.body-small {
  font-size: var(--text-sm);
  font-weight: var(--font-normal);
  line-height: 1.5;
  color: var(--gray-600);
}

/* Code Text */
.code-text {
  font-family: var(--font-family-mono);
  font-size: var(--text-sm);
  line-height: 1.6;
  color: var(--code-text);
}
```

## Spacing & Layout

### Spacing Scale
```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

### Layout Grid
```css
/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

/* Grid System */
.grid {
  display: grid;
  gap: var(--space-6);
}

.grid-2 {
  grid-template-columns: repeat(2, 1fr);
}

.grid-3 {
  grid-template-columns: repeat(3, 1fr);
}

/* Flexbox Utilities */
.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

.gap-2 { gap: var(--space-2); }
.gap-4 { gap: var(--space-4); }
.gap-6 { gap: var(--space-6); }
```

## Components

### Buttons

#### Primary Button
```css
.btn-primary {
  background-color: var(--primary-600);
  color: white;
  padding: var(--space-3) var(--space-6);
  border-radius: 8px;
  font-weight: var(--font-medium);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background-color: var(--primary-700);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-primary:active {
  transform: translateY(0);
}
```

#### Secondary Button
```css
.btn-secondary {
  background-color: transparent;
  color: var(--primary-600);
  padding: var(--space-3) var(--space-6);
  border-radius: 8px;
  font-weight: var(--font-medium);
  border: 2px solid var(--primary-600);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background-color: var(--primary-50);
  border-color: var(--primary-700);
}
```

#### Success Button
```css
.btn-success {
  background-color: var(--success-600);
  color: white;
  padding: var(--space-3) var(--space-6);
  border-radius: 8px;
  font-weight: var(--font-medium);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-success:hover {
  background-color: var(--success-700);
}
```

### Code Editor

#### Editor Container
```css
.code-editor {
  border: 1px solid var(--gray-200);
  border-radius: 12px;
  overflow: hidden;
  background-color: var(--code-bg);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.editor-header {
  background-color: var(--gray-50);
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--gray-200);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.editor-content {
  min-height: 400px;
  font-family: var(--font-family-mono);
}
```

### Cards

#### Problem Card
```css
.problem-card {
  background-color: white;
  border: 1px solid var(--gray-200);
  border-radius: 12px;
  padding: var(--space-6);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.problem-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.problem-title {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--gray-900);
  margin-bottom: var(--space-2);
}

.problem-difficulty {
  display: inline-block;
  padding: var(--space-1) var(--space-3);
  border-radius: 16px;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  margin-bottom: var(--space-4);
}

.difficulty-easy { background-color: var(--success-100); color: var(--success-700); }
.difficulty-medium { background-color: var(--warning-100); color: var(--warning-700); }
.difficulty-hard { background-color: var(--error-100); color: var(--error-700); }
```

### Navigation

#### Top Navigation
```css
.navbar {
  background-color: white;
  border-bottom: 1px solid var(--gray-200);
  padding: var(--space-4) 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

.nav-logo {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--primary-600);
}

.nav-menu {
  display: flex;
  gap: var(--space-6);
  align-items: center;
}

.nav-link {
  color: var(--gray-600);
  text-decoration: none;
  font-weight: var(--font-medium);
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: var(--primary-600);
}

.nav-link.active {
  color: var(--primary-600);
}
```

### Status Indicators

#### Status Badge
```css
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-radius: 20px;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
}

.status-running {
  background-color: var(--primary-100);
  color: var(--primary-700);
}

.status-success {
  background-color: var(--success-100);
  color: var(--success-700);
}

.status-error {
  background-color: var(--error-100);
  color: var(--error-700);
}

.status-warning {
  background-color: var(--warning-100);
  color: var(--warning-700);
}
```

### Forms

#### Input Fields
```css
.input-field {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: 2px solid var(--gray-200);
  border-radius: 8px;
  font-size: var(--text-base);
  transition: border-color 0.2s ease;
}

.input-field:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-field.error {
  border-color: var(--error-500);
}

.input-label {
  display: block;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--gray-700);
  margin-bottom: var(--space-2);
}

.input-error {
  font-size: var(--text-sm);
  color: var(--error-600);
  margin-top: var(--space-1);
}
```

## Interactive States

### Loading States
```css
.loading {
  opacity: 0.6;
  pointer-events: none;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--gray-200);
  border-top: 2px solid var(--primary-600);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

### Hover States
```css
.hover-lift {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}
```

### Focus States
```css
.focus-ring {
  transition: box-shadow 0.2s ease;
}

.focus-ring:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}
```

## Responsive Design

### Breakpoints
```css
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;
```

### Responsive Utilities
```css
/* Mobile First */
.container {
  padding: 0 var(--space-4);
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    padding: 0 var(--space-6);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    padding: 0 var(--space-8);
  }
}

/* Responsive Grid */
.grid-responsive {
  display: grid;
  gap: var(--space-4);
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .grid-responsive {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid-responsive {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

## Accessibility

### Color Contrast
- All text meets WCAG AA standards (4.5:1 ratio)
- Interactive elements have sufficient contrast
- Status colors are distinguishable for colorblind users

### Keyboard Navigation
```css
/* Focus indicators */
.focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}

/* Skip links */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--primary-600);
  color: white;
  padding: 8px;
  text-decoration: none;
  border-radius: 4px;
  z-index: 1000;
}

.skip-link:focus {
  top: 6px;
}
```

### Screen Reader Support
```css
/* Visually hidden text */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* ARIA labels */
[aria-label] {
  /* Ensure proper labeling */
}
```

## Implementation Guidelines

### CSS Custom Properties
Use CSS custom properties for consistent theming:
```css
:root {
  /* Define all design tokens here */
}

/* Use in components */
.my-component {
  color: var(--primary-600);
  padding: var(--space-4);
  font-size: var(--text-base);
}
