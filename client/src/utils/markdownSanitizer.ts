import DOMPurify from 'dompurify';

// Configuration for allowed HTML tags and attributes
const ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'br', 'hr',
  'ul', 'ol', 'li',
  'strong', 'em', 'b', 'i',
  'code', 'pre',
  'blockquote',
  'a',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'div', 'span'
];

const ALLOWED_ATTRS = [
  'href',
  'target',
  'rel',
  'class',
  'id',
  'style'
];

// Configuration for DOMPurify
const PURIFY_CONFIG = {
  ALLOWED_TAGS,
  ALLOWED_ATTR: ALLOWED_ATTRS,
  ALLOW_DATA_ATTR: false,
  ALLOW_UNKNOWN_PROTOCOLS: false,
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'select', 'textarea'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur', 'onchange', 'onsubmit', 'onreset', 'onselect', 'onunload', 'onresize', 'onscroll'],
  KEEP_CONTENT: true,
  RETURN_DOM: false,
  RETURN_DOM_FRAGMENT: false,
  RETURN_DOM_IMPORT: false,
  RETURN_TRUSTED_TYPE: false,
  SANITIZE_DOM: true,
  WHOLE_DOCUMENT: false,
  SANITIZE_NAMED_PROPS: true,
  USE_PROFILES: {
    html: true
  }
};

/**
 * Sanitizes markdown content to prevent XSS and code injection attacks
 * @param markdown - The raw markdown content
 * @returns Sanitized markdown content
 */
export function sanitizeMarkdown(markdown: string): string {
  if (!markdown || typeof markdown !== 'string') {
    return '';
  }

  // First, sanitize any HTML that might be embedded in the markdown
  const sanitizedHtml = DOMPurify.sanitize(markdown, PURIFY_CONFIG);
  
  // Additional markdown-specific sanitization
  let sanitizedMarkdown = sanitizedHtml;
  
  // Remove any script tags that might have been missed
  sanitizedMarkdown = sanitizedMarkdown.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove any style tags
  sanitizedMarkdown = sanitizedMarkdown.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  
  // Remove any iframe tags
  sanitizedMarkdown = sanitizedMarkdown.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  
  // Remove any object tags
  sanitizedMarkdown = sanitizedMarkdown.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
  
  // Remove any embed tags
  sanitizedMarkdown = sanitizedMarkdown.replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');
  
  // Remove any form tags
  sanitizedMarkdown = sanitizedMarkdown.replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '');
  
  // Remove any input tags
  sanitizedMarkdown = sanitizedMarkdown.replace(/<input\b[^>]*>/gi, '');
  
  // Remove any button tags
  sanitizedMarkdown = sanitizedMarkdown.replace(/<button\b[^<]*(?:(?!<\/button>)<[^<]*)*<\/button>/gi, '');
  
  // Remove any select tags
  sanitizedMarkdown = sanitizedMarkdown.replace(/<select\b[^<]*(?:(?!<\/select>)<[^<]*)*<\/select>/gi, '');
  
  // Remove any textarea tags
  sanitizedMarkdown = sanitizedMarkdown.replace(/<textarea\b[^<]*(?:(?!<\/textarea>)<[^<]*)*<\/textarea>/gi, '');
  
  // Remove any event handlers from remaining tags
  sanitizedMarkdown = sanitizedMarkdown.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  
  // Remove any javascript: protocols from links
  sanitizedMarkdown = sanitizedMarkdown.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, 'href="#"');
  
  // Remove any data: protocols from links (except data:text/plain)
  sanitizedMarkdown = sanitizedMarkdown.replace(/href\s*=\s*["']data:(?!text\/plain)[^"']*["']/gi, 'href="#"');
  
  // Remove any vbscript: protocols
  sanitizedMarkdown = sanitizedMarkdown.replace(/href\s*=\s*["']vbscript:[^"']*["']/gi, 'href="#"');
  
  // Remove any file: protocols
  sanitizedMarkdown = sanitizedMarkdown.replace(/href\s*=\s*["']file:[^"']*["']/gi, 'href="#"');
  
  return sanitizedMarkdown;
}

/**
 * Validates if markdown content contains potentially dangerous content
 * @param markdown - The markdown content to validate
 * @returns Object with isValid boolean and any warnings
 */
export function validateMarkdown(markdown: string): { isValid: boolean; warnings: string[] } {
  const warnings: string[] = [];
  
  if (!markdown || typeof markdown !== 'string') {
    return { isValid: false, warnings: ['Invalid markdown content'] };
  }
  
  // Check for script tags
  if (/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(markdown)) {
    warnings.push('Script tags detected and will be removed');
  }
  
  // Check for style tags
  if (/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi.test(markdown)) {
    warnings.push('Style tags detected and will be removed');
  }
  
  // Check for iframe tags
  if (/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi.test(markdown)) {
    warnings.push('Iframe tags detected and will be removed');
  }
  
  // Check for event handlers
  if (/\s*on\w+\s*=\s*["'][^"']*["']/gi.test(markdown)) {
    warnings.push('Event handlers detected and will be removed');
  }
  
  // Check for javascript: protocols
  if (/javascript:/gi.test(markdown)) {
    warnings.push('JavaScript protocols detected and will be removed');
  }
  
  // Check for data: protocols (except text/plain)
  if (/data:(?!text\/plain)/gi.test(markdown)) {
    warnings.push('Data protocols detected and will be removed');
  }
  
  return {
    isValid: warnings.length === 0,
    warnings
  };
}

/**
 * Creates a safe markdown renderer configuration
 * @returns Configuration object for ReactMarkdown
 */
export function getSafeMarkdownConfig() {
  return {
    // Disable HTML parsing to prevent XSS
    skipHtml: true,
    // Only allow safe markdown features
    allowedElements: ALLOWED_TAGS,
    // Disable dangerous features
    disallowedElements: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'select', 'textarea']
  };
}
