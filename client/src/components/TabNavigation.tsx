type Tab = 'Lab' | 'Exercise';

interface TabNavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs: Tab[] = ['Lab', 'Exercise'];

  return (
    <div className="border-b border-theme-primary bg-theme-surface flex-shrink-0 h-12">
      <div className="flex h-full">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`flex-1 px-6 text-sm font-medium transition-all duration-200 border-b-2 flex items-center justify-center ${
              activeTab === tab 
                ? 'text-b2l-primary border-b2l-primary bg-theme-background' 
                : 'text-theme-secondary border-transparent hover:text-theme-primary hover:bg-slate-100 dark:hover:bg-neutral-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
