import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { StepCard } from './StepCard';
import { CodeDisplay } from './CodeDisplay';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

interface Section {
  id: string;
  title: string;
  description: string;
  contentBlocks?: ContentBlock[];
  stepNumber?: number;
}

interface ContentBlock {
  type: 'text' | 'code';
  content: string;
  language?: string;
  showLineNumbers?: boolean;
}

export default function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  // Parse the markdown content to extract sections with ordered content blocks
  const parseSections = (markdown: string): Section[] => {
    const sections: Section[] = [];
    const lines = markdown.split('\n');
    let currentSection: Partial<Section> = {};
    let currentContentBlocks: ContentBlock[] = [];
    let currentTextContent: string[] = [];
    let currentCodeBlock: string[] = [];
    let inCodeBlock = false;
    let codeLanguage = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Check for section markers (only ## for StepCards)
      if (line.startsWith('## ') && !line.startsWith('### ')) {
        // Save previous section if exists
        if (currentSection.title) {
          // Add any remaining text content
          if (currentTextContent.length > 0) {
            currentContentBlocks.push({
              type: 'text',
              content: currentTextContent.join('\n').trim()
            });
          }
          // Add any remaining code block
          if (currentCodeBlock.length > 0) {
            currentContentBlocks.push({
              type: 'code',
              content: currentCodeBlock.join('\n'),
              language: codeLanguage || 'javascript',
              showLineNumbers: true
            });
          }
          
          // Store content blocks directly
          currentSection.contentBlocks = [...currentContentBlocks];
          sections.push(currentSection as Section);
        }

        // Start new section
        const title = line.replace(/^#+\s*/, '');
        const stepMatch = title.match(/^(\d+)\.\s*(.+)$/);
        
        currentSection = {
          id: `section-${sections.length + 1}`,
          title: stepMatch ? stepMatch[2] : title,
          stepNumber: stepMatch ? parseInt(stepMatch[1]) : sections.length + 1
        };
        currentContentBlocks = [];
        currentTextContent = [];
        currentCodeBlock = [];
        inCodeBlock = false;
        codeLanguage = '';
      }
      // Check for code block start
      else if (line.startsWith('```')) {
        if (!inCodeBlock) {
          // Save any accumulated text content before starting code block
          if (currentTextContent.length > 0) {
            currentContentBlocks.push({
              type: 'text',
              content: currentTextContent.join('\n').trim()
            });
            currentTextContent = [];
          }
          inCodeBlock = true;
          codeLanguage = line.replace('```', '').trim() || 'javascript';
        } else {
          inCodeBlock = false;
          if (currentCodeBlock.length > 0) {
            currentContentBlocks.push({
              type: 'code',
              content: currentCodeBlock.join('\n'),
              language: codeLanguage,
              showLineNumbers: true
            });
          }
          currentCodeBlock = [];
        }
      }
      // Add to code block
      else if (inCodeBlock) {
        currentCodeBlock.push(line);
      }
      // Add to regular content
      else {
        currentTextContent.push(line);
      }
    }

    // Add the last section
    if (currentSection.title) {
      // Add any remaining text content
      if (currentTextContent.length > 0) {
        currentContentBlocks.push({
          type: 'text',
          content: currentTextContent.join('\n').trim()
        });
      }
      // Add any remaining code block
      if (currentCodeBlock.length > 0) {
        currentContentBlocks.push({
          type: 'code',
          content: currentCodeBlock.join('\n'),
          language: codeLanguage || 'javascript',
          showLineNumbers: true
        });
      }
      
      // Store content blocks directly
      currentSection.contentBlocks = [...currentContentBlocks];
      sections.push(currentSection as Section);
    }

    return sections;
  };

  const sections = parseSections(content);

  // If we have sections, render them as StepCards
  if (sections.length > 0 && sections.some(section => section.title)) {
    return (
      <div className={`space-y-8 ${className}`}>
        {sections.map((section) => (
          <StepCard
            key={section.id}
            stepNumber={section.stepNumber || 1}
            title={section.title}
            description={section.description || ''}
            additionalContent={
              <div className="space-y-4">
                {section.contentBlocks && section.contentBlocks.map((block, index) => (
                  <div key={index}>
                    {block.type === 'text' ? (
                      <div className="prose prose-invert max-w-none">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeHighlight]}
                          components={{
                            h1: ({ children }) => (
                              <h1 className="text-2xl font-bold text-tactical-text-primary mb-4">{children}</h1>
                            ),
                            h2: ({ children }) => (
                              <h2 className="text-xl font-semibold text-tactical-text-primary mb-3">{children}</h2>
                            ),
                            h3: ({ children }) => (
                              <h3 className="text-lg font-medium text-tactical-text-primary mb-2">{children}</h3>
                            ),
                            p: ({ children }) => (
                              <p className="text-tactical-text-secondary mb-3 leading-relaxed">{children}</p>
                            ),
                            ul: ({ children }) => (
                              <ul className="list-disc list-inside space-y-1 text-tactical-text-secondary mb-3">{children}</ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="list-decimal list-inside space-y-1 text-tactical-text-secondary mb-3">{children}</ol>
                            ),
                            li: ({ children }) => (
                              <li className="text-tactical-text-secondary">{children}</li>
                            ),
                            strong: ({ children }) => (
                              <strong className="font-semibold text-tactical-text-primary">{children}</strong>
                            ),
                            em: ({ children }) => (
                              <em className="italic text-tactical-text-secondary">{children}</em>
                            ),
                            code: ({ children, className }) => {
                              const language = className?.replace('language-', '') || 'text';
                              return (
                                <code className="bg-tactical-surface px-2 py-1 rounded text-sm font-mono text-tactical-primary border border-tactical-border-primary">
                                  {children}
                                </code>
                              );
                            },
                            pre: ({ children, className }) => {
                              const language = className?.replace('language-', '') || 'javascript';
                              
                              // Debug: log what we're receiving
                              console.log('pre children:', children);
                              console.log('pre children type:', typeof children);
                              console.log('pre children isArray:', Array.isArray(children));
                              if (children && typeof children === 'object') {
                                console.log('pre children keys:', Object.keys(children));
                                if ('props' in children) {
                                  console.log('pre children.props:', children.props);
                                  console.log('pre children.props.children:', children.props.children);
                                }
                              }
                              
                              // Extract code content safely
                              let codeContent = '';
                              
                              // Handle different types of children
                              if (Array.isArray(children)) {
                                codeContent = children.map(child => {
                                  console.log('child:', child, 'type:', typeof child);
                                  if (typeof child === 'string') return child;
                                  if (child && typeof child === 'object' && 'props' in child) {
                                    console.log('child props:', child.props);
                                    return String(child.props?.children || '');
                                  }
                                  return String(child || '');
                                }).join('');
                              } else if (children && typeof children === 'object' && 'props' in children) {
                                console.log('Extracting from props.children:', children.props.children);
                                if (Array.isArray(children.props.children)) {
                                  codeContent = children.props.children.map(child => {
                                    console.log('props child:', child, 'type:', typeof child);
                                    if (typeof child === 'string') return child;
                                    if (child && typeof child === 'object' && 'props' in child) {
                                      return String(child.props?.children || '');
                                    }
                                    return String(child || '');
                                  }).join('');
                                } else {
                                  codeContent = String(children.props.children || '');
                                }
                              } else if (typeof children === 'string') {
                                codeContent = children;
                              } else {
                                codeContent = String(children || '');
                              }
                              
                              console.log('final codeContent:', codeContent);
                              
                              return (
                                <CodeDisplay
                                  code={codeContent}
                                  language={language}
                                  showLineNumbers={true}
                                />
                              );
                            },
                            blockquote: ({ children }) => (
                              <blockquote className="border-l-4 border-tactical-primary pl-4 italic text-tactical-text-secondary bg-tactical-surface/50 py-2 rounded-r">
                                {children}
                              </blockquote>
                            ),
                          }}
                        >
                          {block.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <CodeDisplay
                        code={block.content}
                        language={block.language || 'javascript'}
                        showLineNumbers={block.showLineNumbers}
                      />
                    )}
                  </div>
                ))}
              </div>
            }
          />
        ))}
      </div>
    );
  }

  // If no sections found, render as regular markdown
  return (
    <div className={`prose prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
      components={{
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold text-tactical-text-primary mb-6">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold text-tactical-text-primary mb-4">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-medium text-tactical-text-primary mb-3">{children}</h3>
          ),
        p: ({ children }) => (
            <p className="text-tactical-text-secondary mb-4 leading-relaxed">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-2 text-tactical-text-secondary mb-4">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-2 text-tactical-text-secondary mb-4">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-tactical-text-secondary">{children}</li>
        ),
        strong: ({ children }) => (
            <strong className="font-semibold text-tactical-text-primary">{children}</strong>
        ),
        em: ({ children }) => (
            <em className="italic text-tactical-text-secondary">{children}</em>
        ),
                  code: ({ children, className }) => {
            const language = className?.replace('language-', '') || 'text';
            return (
              <code className="bg-tactical-surface px-2 py-1 rounded text-sm font-mono text-tactical-primary border border-tactical-border-primary">
                {children}
              </code>
            );
          },
          pre: ({ children, className }) => {
            const language = className?.replace('language-', '') || 'javascript';
            
            // Debug: log what we're receiving
            console.log('fallback pre children:', children);
            console.log('fallback pre children type:', typeof children);
            console.log('fallback pre children isArray:', Array.isArray(children));
            
            // Extract code content safely
            let codeContent = '';
            
            // Handle different types of children
            if (Array.isArray(children)) {
              codeContent = children.map(child => {
                console.log('fallback child:', child, 'type:', typeof child);
                if (typeof child === 'string') return child;
                if (child && typeof child === 'object' && 'props' in child) {
                  console.log('fallback child props:', child.props);
                  return String(child.props?.children || '');
                }
                return String(child || '');
              }).join('');
            } else if (children && typeof children === 'object' && 'props' in children) {
              codeContent = String(children.props?.children || '');
            } else if (typeof children === 'string') {
              codeContent = children;
            } else {
              codeContent = String(children || '');
            }
            
            console.log('fallback final codeContent:', codeContent);
            
            return (
              <CodeDisplay
                code={codeContent}
                language={language}
                showLineNumbers={true}
              />
            );
          },
        blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-tactical-primary pl-4 italic text-tactical-text-secondary bg-tactical-surface/50 py-3 rounded-r mb-4">
            {children}
          </blockquote>
        ),
      }}
    >
              {content}
      </ReactMarkdown>
    </div>
  );
}
