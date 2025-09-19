import MarkdownRenderer from "./MarkdownRenderer";
import { TabNavigation } from "./TabNavigation";
import type { ModuleContent } from "../services/moduleService";

type Tab = 'Lab' | 'Exercise';

interface ContentPanelProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  moduleContent: ModuleContent;
}

export function ContentPanel({ activeTab, onTabChange, moduleContent }: ContentPanelProps) {
  return (
    <div className="w-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-theme-primary bg-theme-background flex flex-col min-h-0">
      {/* Tab Navigation */}
      <TabNavigation activeTab={activeTab} onTabChange={onTabChange} />

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto bg-theme-background min-h-0">
        {activeTab === 'Lab' && (
          <div className="max-w-4xl mx-auto p-6 space-y-8">
            <MarkdownRenderer content={moduleContent.labContent} />
          </div>
        )}
        {activeTab === 'Exercise' && (
          <div className="max-w-4xl mx-auto p-6 space-y-8">
            <MarkdownRenderer content={moduleContent.exerciseContent.readme} />
          </div>
        )}
      </div>
    </div>
  );
}
