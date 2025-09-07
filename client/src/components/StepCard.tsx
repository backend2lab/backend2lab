import { CodeDisplay } from "./CodeDisplay";
import { useTheme } from '../contexts/ThemeContext';

interface StepCardProps {
  stepNumber: number;
  title: string;
  description: string;
  codeBlock?: {
    language: string;
    code: string;
    showLineNumbers?: boolean;
  };
  additionalContent?: React.ReactNode;
  links?: Array<{
    text: string;
    href: string;
    external?: boolean;
  }>;
}

export function StepCard({ 
  stepNumber, 
  title, 
  description, 
  codeBlock, 
  additionalContent, 
  links 
}: StepCardProps) {
  const { theme } = useTheme();
  
  return (
    <div className={`${theme === 'dark' ? 'tactical-card' : 'bg-theme-surface border border-theme-primary rounded-lg'} p-6`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-tactical-primary text-white font-semibold text-sm">
          {stepNumber}
        </div>
        <div className="flex-1 space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-theme-primary mb-3 font-tactical">
              {title}
            </h3>
            <p className="text-theme-secondary leading-relaxed font-tactical">
              {description}
            </p>
          </div>

          {additionalContent && (
            <div className="text-theme-secondary mt-6 space-y-4">{additionalContent}</div>
          )}

          {codeBlock && (
            <CodeDisplay
              code={codeBlock.code}
              language={codeBlock.language}
              showLineNumbers={codeBlock.showLineNumbers}
            />
          )}

          {links && links.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {links.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="btn-tactical-secondary bg-theme-surface border border-theme-primary text-theme-primary hover:bg-slate-100 dark:hover:bg-neutral-800 text-sm px-3 py-2 flex items-center gap-1 rounded transition-colors"
                >
                  {link.text}
                  {link.external && (
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  )}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
