import { sanitizeMarkdown, validateMarkdown } from './markdownSanitizer';

describe('Markdown Sanitizer', () => {
  describe('sanitizeMarkdown', () => {
    it('should remove script tags', () => {
      const maliciousContent = `
# Test Content
<script>alert('xss')</script>
<p>Normal content</p>
      `;
      
      const sanitized = sanitizeMarkdown(maliciousContent);
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('alert(\'xss\')');
      expect(sanitized).toContain('Test Content');
      expect(sanitized).toContain('Normal content');
    });

    it('should remove style tags', () => {
      const maliciousContent = `
# Test Content
<style>body { background: red; }</style>
<p>Normal content</p>
      `;
      
      const sanitized = sanitizeMarkdown(maliciousContent);
      expect(sanitized).not.toContain('<style>');
      expect(sanitized).not.toContain('background: red');
      expect(sanitized).toContain('Test Content');
      expect(sanitized).toContain('Normal content');
    });

    it('should remove iframe tags', () => {
      const maliciousContent = `
# Test Content
<iframe src="http://malicious.com"></iframe>
<p>Normal content</p>
      `;
      
      const sanitized = sanitizeMarkdown(maliciousContent);
      expect(sanitized).not.toContain('<iframe>');
      expect(sanitized).not.toContain('http://malicious.com');
      expect(sanitized).toContain('Test Content');
      expect(sanitized).toContain('Normal content');
    });

    it('should remove event handlers', () => {
      const maliciousContent = `
# Test Content
<p onclick="alert('xss')">Click me</p>
<img onload="alert('xss')" src="test.jpg" />
      `;
      
      const sanitized = sanitizeMarkdown(maliciousContent);
      expect(sanitized).not.toContain('onclick=');
      expect(sanitized).not.toContain('onload=');
      expect(sanitized).not.toContain('alert(\'xss\')');
      expect(sanitized).toContain('Test Content');
      expect(sanitized).toContain('Click me');
    });

    it('should remove javascript: protocols', () => {
      const maliciousContent = `
# Test Content
<a href="javascript:alert('xss')">Click me</a>
<img src="javascript:alert('xss')" />
      `;
      
      const sanitized = sanitizeMarkdown(maliciousContent);
      expect(sanitized).not.toContain('javascript:');
      expect(sanitized).not.toContain('alert(\'xss\')');
      expect(sanitized).toContain('Test Content');
      expect(sanitized).toContain('Click me');
    });

    it('should remove data: protocols (except text/plain)', () => {
      const maliciousContent = `
# Test Content
<a href="data:text/html,<script>alert('xss')</script>">Click me</a>
<a href="data:text/plain,Hello World">Safe link</a>
      `;
      
      const sanitized = sanitizeMarkdown(maliciousContent);
      expect(sanitized).not.toContain('data:text/html');
      expect(sanitized).not.toContain('alert(\'xss\')');
      expect(sanitized).toContain('data:text/plain,Hello World');
      expect(sanitized).toContain('Test Content');
      expect(sanitized).toContain('Safe link');
    });

    it('should remove vbscript: protocols', () => {
      const maliciousContent = `
# Test Content
<a href="vbscript:MsgBox('xss')">Click me</a>
      `;
      
      const sanitized = sanitizeMarkdown(maliciousContent);
      expect(sanitized).not.toContain('vbscript:');
      expect(sanitized).not.toContain('MsgBox(\'xss\')');
      expect(sanitized).toContain('Test Content');
      expect(sanitized).toContain('Click me');
    });

    it('should remove file: protocols', () => {
      const maliciousContent = `
# Test Content
<a href="file:///etc/passwd">Click me</a>
      `;
      
      const sanitized = sanitizeMarkdown(maliciousContent);
      expect(sanitized).not.toContain('file://');
      expect(sanitized).not.toContain('/etc/passwd');
      expect(sanitized).toContain('Test Content');
      expect(sanitized).toContain('Click me');
    });

    it('should preserve safe content', () => {
      const safeContent = `
# Test Content
## Subsection
This is **bold** and *italic* text.

\`\`\`javascript
console.log('Hello World');
\`\`\`

- List item 1
- List item 2

[Safe link](https://example.com)
      `;
      
      const sanitized = sanitizeMarkdown(safeContent);
      expect(sanitized).toBe(safeContent);
    });

    it('should handle empty content', () => {
      expect(sanitizeMarkdown('')).toBe('');
      expect(sanitizeMarkdown(null as any)).toBe('');
      expect(sanitizeMarkdown(undefined as any)).toBe('');
    });
  });

  describe('validateMarkdown', () => {
    it('should detect script tags', () => {
      const maliciousContent = '<script>alert("xss")</script>';
      const validation = validateMarkdown(maliciousContent);
      
      expect(validation.isValid).toBe(false);
      expect(validation.warnings).toContain('Script tags detected and will be removed');
    });

    it('should detect style tags', () => {
      const maliciousContent = '<style>body { color: red; }</style>';
      const validation = validateMarkdown(maliciousContent);
      
      expect(validation.isValid).toBe(false);
      expect(validation.warnings).toContain('Style tags detected and will be removed');
    });

    it('should detect iframe tags', () => {
      const maliciousContent = '<iframe src="http://malicious.com"></iframe>';
      const validation = validateMarkdown(maliciousContent);
      
      expect(validation.isValid).toBe(false);
      expect(validation.warnings).toContain('Iframe tags detected and will be removed');
    });

    it('should detect event handlers', () => {
      const maliciousContent = '<p onclick="alert(\'xss\')">Click me</p>';
      const validation = validateMarkdown(maliciousContent);
      
      expect(validation.isValid).toBe(false);
      expect(validation.warnings).toContain('Event handlers detected and will be removed');
    });

    it('should detect javascript: protocols', () => {
      const maliciousContent = '<a href="javascript:alert(\'xss\')">Click me</a>';
      const validation = validateMarkdown(maliciousContent);
      
      expect(validation.isValid).toBe(false);
      expect(validation.warnings).toContain('JavaScript protocols detected and will be removed');
    });

    it('should detect data: protocols (except text/plain)', () => {
      const maliciousContent = '<a href="data:text/html,<script>alert(\'xss\')</script>">Click me</a>';
      const validation = validateMarkdown(maliciousContent);
      
      expect(validation.isValid).toBe(false);
      expect(validation.warnings).toContain('Data protocols detected and will be removed');
    });

    it('should validate safe content', () => {
      const safeContent = `
# Test Content
This is safe markdown content.

\`\`\`javascript
console.log('Hello World');
\`\`\`
      `;
      
      const validation = validateMarkdown(safeContent);
      expect(validation.isValid).toBe(true);
      expect(validation.warnings).toHaveLength(0);
    });

    it('should handle invalid input', () => {
      const validation = validateMarkdown(null as any);
      expect(validation.isValid).toBe(false);
      expect(validation.warnings).toContain('Invalid markdown content');
    });
  });
});


