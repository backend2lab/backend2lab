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
        // Look for numbered sections with or without emojis
        const stepMatch = title.match(/^(\d+)\.\s*(.+)$/);
        // Also look for sections that start with numbers followed by emoji and text
        const emojiStepMatch = title.match(/^(\d+)\.\s*[^\w\s]+\s*(.+)$/);
        
        const matchedStep = stepMatch || emojiStepMatch;
        
        currentSection = {
          id: `section-${sections.length + 1}`,
          title: matchedStep ? matchedStep[2] : title,
          stepNumber: matchedStep ? parseInt(matchedStep[1]) : sections.length + 1
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
              <div className="space-y-6">
                {section.contentBlocks && section.contentBlocks.map((block, index) => (
                  <div key={index} className="first:mt-0">
                    {block.type === 'text' ? (
                      <div className="prose prose-invert max-w-none">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeHighlight]}
                          components={{
                            h1: ({ children }) => (
                              <h1 className="text-2xl font-bold text-tactical-text-primary mb-6 mt-8 first:mt-0">{children}</h1>
                            ),
                            h2: ({ children }) => (
                              <h2 className="text-xl font-semibold text-tactical-text-primary mb-4 mt-6 first:mt-0">{children}</h2>
                            ),
                            h3: ({ children }) => {
                              const text = String(children);
                              // Check if this is a test case heading
                              if (text.includes('Test Case')) {
                                return (
                                  <h3 className="text-lg font-semibold text-tactical-accent mb-4 mt-6 first:mt-0 border-l-4 border-tactical-accent pl-4 bg-tactical-surface/30 py-2 rounded-r">
                                    {children}
                                  </h3>
                                );
                              }
                              return (
                                <h3 className="text-lg font-medium text-tactical-text-primary mb-3 mt-4 first:mt-0">{children}</h3>
                              );
                            },
                            p: ({ children }) => (
                              <p className="text-tactical-text-secondary mb-3 leading-relaxed">{children}</p>
                            ),
                            ul: ({ children }) => {
                              // Check if this is a test cases list by looking at the parent context
                              return (
                                <ul className="list-disc list-inside space-y-3 text-tactical-text-secondary mb-6 bg-tactical-surface/20 p-4 rounded-lg border border-tactical-border-primary/30">
                                  {children}
                                </ul>
                              );
                            },
                            ol: ({ children }) => (
                              <ol className="list-decimal list-inside space-y-2 text-tactical-text-secondary mb-4">{children}</ol>
                            ),
                            li: ({ children }) => {
                              const text = String(children);
                              // Check if this list item contains test case details
                              if (text.includes('Request:') || text.includes('Expected Response:') || text.includes('Status Code:') || text.includes('Headers:')) {
                                return (
                                  <li className="text-tactical-text-secondary mb-3 leading-relaxed">
                                    <div className="flex flex-col space-y-1">
                                      {children}
                                    </div>
                                  </li>
                                );
                              }
                              return (
                                <li className="text-tactical-text-secondary mb-2">{children}</li>
                              );
                            },
                            strong: ({ children }) => (
                              <strong className="font-semibold text-tactical-text-primary">{children}</strong>
                            ),
                            em: ({ children }) => (
                              <em className="italic text-tactical-text-secondary">{children}</em>
                            ),
                            code: ({ children }) => {
                              const text = String(children);
                              
                              // Special styling for test case details
                              if (text.includes('GET') || text.includes('POST') || text.includes('localhost:3000') || text.includes('application/json')) {
                                return (
                                  <code className="bg-tactical-accent/20 px-2 py-1 rounded text-sm font-mono text-tactical-accent border border-tactical-accent/30 font-semibold">
                                    {children}
                                  </code>
                                );
                              }
                              
                              return (
                                <code className="bg-tactical-surface px-2 py-1 rounded text-sm font-mono text-tactical-highlight border border-tactical-border-primary">
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
                                  const props = children.props as { children?: unknown };
                                  console.log('pre children.props.children:', props.children);
                                }
                              }
                              
                              // Extract code content safely
                              let codeContent = '';
                              
                              // Handle different types of children
                              if (Array.isArray(children)) {
                                codeContent = children.map((child: unknown) => {
                                  console.log('child:', child, 'type:', typeof child);
                                  if (typeof child === 'string') return child;
                                  if (child && typeof child === 'object' && 'props' in child) {
                                    const childProps = child.props as { children?: unknown };
                                    console.log('child props:', childProps);
                                    return String(childProps?.children || '');
                                  }
                                  return String(child || '');
                                }).join('');
                              } else if (children && typeof children === 'object' && 'props' in children) {
                                const props = children.props as { children?: unknown };
                                console.log('Extracting from props.children:', props.children);
                                if (Array.isArray(props.children)) {
                                  codeContent = props.children.map((child: unknown) => {
                                    console.log('props child:', child, 'type:', typeof child);
                                    if (typeof child === 'string') return child;
                                    if (child && typeof child === 'object' && 'props' in child) {
                                      const childProps = child.props as { children?: unknown };
                                      return String(childProps?.children || '');
                                    }
                                    return String(child || '');
                                  }).join('');
                                } else {
                                  codeContent = String(props.children || '');
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
                              <blockquote className="border-l-4 border-tactical-highlight pl-4 italic text-tactical-text-secondary bg-tactical-surface/50 py-2 rounded-r">
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
            <h1 className="text-3xl font-bold text-tactical-text-primary mb-6 mt-8 first:mt-0">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold text-tactical-text-primary mb-4 mt-6 first:mt-0">{children}</h2>
          ),
          h3: ({ children }) => {
            const text = String(children);
            // Check if this is a test case heading
            if (text.includes('Test Case')) {
              return (
                <h3 className="text-xl font-semibold text-tactical-accent mb-4 mt-6 first:mt-0 border-l-4 border-tactical-accent pl-4 bg-tactical-surface/30 py-2 rounded-r">
                  {children}
                </h3>
              );
            }
            return (
              <h3 className="text-xl font-medium text-tactical-text-primary mb-3 mt-4 first:mt-0">{children}</h3>
            );
          },
        p: ({ children }) => (
            <p className="text-tactical-text-secondary mb-4 leading-relaxed">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-3 text-tactical-text-secondary mb-5">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-3 text-tactical-text-secondary mb-5">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-tactical-text-secondary mb-5">{children}</li>
        ),
        strong: ({ children }) => (
            <strong className="font-semibold text-tactical-text-primary">{children}</strong>
        ),
        em: ({ children }) => (
            <em className="italic text-tactical-text-secondary">{children}</em>
        ),
                  code: ({ children }) => {
            const text = String(children);
            
            // Special styling for test case details
            if (text.includes('GET') || text.includes('POST') || text.includes('localhost:3000') || text.includes('application/json')) {
              return (
                <code className="bg-tactical-accent/20 px-2 py-1 rounded text-sm font-mono text-tactical-accent border border-tactical-accent/30 font-semibold">
                  {children}
                </code>
              );
            }
            
            return (
              <code className="bg-tactical-surface px-2 py-1 rounded text-sm font-mono text-tactical-highlight border border-tactical-border-primary">
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
              codeContent = children.map((child: unknown) => {
                console.log('fallback child:', child, 'type:', typeof child);
                if (typeof child === 'string') return child;
                if (child && typeof child === 'object' && 'props' in child) {
                  const childProps = child.props as { children?: unknown };
                  console.log('fallback child props:', childProps);
                  return String(childProps?.children || '');
                }
                return String(child || '');
              }).join('');
            } else if (children && typeof children === 'object' && 'props' in children) {
              const props = children.props as { children?: unknown };
              codeContent = String(props?.children || '');
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
            <blockquote className="border-l-4 border-tactical-highlight pl-4 italic text-tactical-text-secondary bg-tactical-surface/50 py-3 rounded-r mb-4">
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
