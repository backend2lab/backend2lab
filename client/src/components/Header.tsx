import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { ThemeToggle } from "./ThemeToggle";
import type { Module, ModuleContent } from "../services/moduleService";

interface HeaderProps {
  loading: boolean;
  moduleContent: ModuleContent | null;
  availableModules: Module[];
  currentModuleId: string;
  showModuleDropdown: boolean;
  onModuleDropdownToggle: () => void;
  onModuleChange: (moduleId: string) => void;
  getDifficultyColor: (difficulty: string) => string;
}

export function Header({
  loading,
  moduleContent,
  availableModules,
  currentModuleId,
  showModuleDropdown,
  onModuleDropdownToggle,
  onModuleChange,
  getDifficultyColor,
}: HeaderProps) {
  return (
    <header className="bg-theme-surface border-b border-theme-primary shadow-sm">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-b2l-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm font-b2l">B2L</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-theme-primary font-b2l">Backend2Lab</span>
              <span className="text-xs text-theme-secondary font-b2l">Learn Backend Development</span>
            </div>
          </div>

          {/* Module Info */}
          <div className="flex-1 flex justify-center max-w-2xl">
            <div className="text-center flex items-center" id="moduleTitle">
              <h1 className="text-lg font-semibold text-theme-primary font-b2l">
                {loading && moduleContent ? (
                  <div className="flex items-center space-x-2">
                    <span>{moduleContent.module.title}</span>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-b2l-primary"></div>
                  </div>
                ) : (
                  moduleContent?.module.title || 'Loading...'
                )}
              </h1>
              {moduleContent && (
                <div className="flex items-center justify-center space-x-3 ml-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(moduleContent.module.difficulty)}`}>
                    {moduleContent.module.difficulty}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Top Right:- Module Selector + GitHub Link */}
          <div className="flex items-center space-x-3">
            <div className="relative module-dropdown">
              <button 
                onClick={onModuleDropdownToggle}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-theme-surface border border-theme-primary rounded-lg text-theme-primary hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                id="moduleSelector"
              >
                <span className="text-sm font-medium font-b2l">
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <span>{availableModules.find(m => m.id === currentModuleId)?.title || 'Select Module'}</span>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-b2l-primary"></div>
                    </div>
                  ) : (
                    availableModules.find(m => m.id === currentModuleId)?.title || 'Select Module'
                  )}
                </span>
                <FontAwesomeIcon 
                  icon={faChevronDown} 
                  className={`text-xs transition-transform ${showModuleDropdown ? 'rotate-180' : ''}`}
                />
              </button>
              
              {showModuleDropdown && (
                <div className="absolute right-0 mt-2 bg-theme-surface border border-theme-primary rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto module-dropdown">
                  {availableModules.map((module) => (
                    <button
                      key={module.id}
                      onClick={() => onModuleChange(module.id)}
                      className={`w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors border-b border-theme-primary last:border-b-0 ${
                        module.id === currentModuleId 
                          ? 'bg-b2l-primary text-white' 
                          : 'text-theme-primary'
                      }`}
                    >
                      <span className="text-sm font-medium">
                        <span className="mr-2">{module.id}:</span>
                        {module.title}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <ThemeToggle />
            {/* GitHub Link Icon */}
            <a
              href="https://github.com/backend2lab/backend2lab"
              target="_blank"
              rel="noopener noreferrer"
              className="text-b2l-text-secondary hover:text-b2l-primary transition-colors"
              title="View on GitHub"
            >
              <FontAwesomeIcon icon={faGithub} size="2x" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
