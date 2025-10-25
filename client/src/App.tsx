import { useState, useEffect } from "react";
import CodeEditor from "./components/Editor"; // Editor component with conditional reset button
import { ThemeProvider } from "./contexts/ThemeContext";
import { WelcomeModal } from "./components/WelcomeModal";
import { Confetti } from "./components/Confetti";
import { LabCompletionModal } from "./components/LabCompletionModal";
import { ScreenLockModal } from "./components/ScreenLockModal";
import { Header } from "./components/Header";
import { ContentPanel } from "./components/ContentPanel";
import { OutputPanel } from "./components/OutputPanel";
import { LoadingState } from "./components/LoadingState";
import { ErrorState } from "./components/ErrorState";
import { useModuleManagement } from "./hooks/useModuleManagement";
import { useUrlHandling } from "./hooks/useUrlHandling";
import { useCodeExecution } from "./hooks/useCodeExecution";
import { useModals } from "./hooks/useModals";
import { useScreenSize } from "./hooks/useScreenSize";

type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';
type Tab = 'Lab' | 'Exercise';

function AppContent() {
  const [activeTab, setActiveTab] = useState<Tab>('Lab');
  const [exerciseType, setExerciseType] = useState<'function' | 'server'>('function');
  const [showModuleDropdown, setShowModuleDropdown] = useState(false);

  // Custom hooks
  const {
    moduleContent,
    availableModules,
    groupedModules,
    loading,
    error,
    currentModuleId,
    setCurrentModuleId,
    handleModuleChange,
    loadModuleContent,
    getCurrentBaseModule,
    getCurrentLanguage,
    switchLanguage,
  } = useModuleManagement();

  useUrlHandling(availableModules, currentModuleId, setCurrentModuleId);

  const {
    code,
    setCode,
    output,
    isRunning,
    isSubmitting,
    testResults,
    hasAttemptedSubmit,
    handleRunCode,
    handleSubmit,
    resetState,
    loadSavedCode,
    hasCodeChanged,
  } = useCodeExecution();

  const {
    showWelcomeModal,
    showLabCompletionModal,
    showScreenLockModal,
    triggerConfetti,
    checkWelcomeModal,
    handleCloseWelcomeModal,
    handleCloseLabCompletionModal,
    triggerSuccess,
    setShowLabCompletionModal,
    setShowScreenLockModal,
  } = useModals();

  // Screen size detection
  const { isSmallScreen } = useScreenSize();

  // Initialize welcome modal check
  useEffect(() => {
    checkWelcomeModal();
  }, [checkWelcomeModal]);

  // Handle screen size changes
  useEffect(() => {
    setShowScreenLockModal(isSmallScreen);
  }, [isSmallScreen, setShowScreenLockModal]);

  // Update code when module content changes - load saved progress if available
  useEffect(() => {
    if (moduleContent) {
      const defaultCode = moduleContent.exerciseContent.editorFiles.server;
      loadSavedCode(currentModuleId, defaultCode);
      setExerciseType(currentModuleId === 'module-1-js' || currentModuleId === 'module-1-python' ? 'function' : 'server');
    }
  }, [moduleContent, currentModuleId, loadSavedCode]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.module-dropdown')) {
        setShowModuleDropdown(false);
      }
    };

    if (showModuleDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showModuleDropdown]);

  const handleNextLab = () => {
    const currentModuleIndex = availableModules.findIndex(module => module.id === currentModuleId);
    const nextModule = availableModules[currentModuleIndex + 1];
    
    if (nextModule) {
      handleModuleChange(nextModule.id);
      resetState();
      setActiveTab('Lab');
    }
    
    setShowLabCompletionModal(false);
  };

  const getNextModule = () => {
    const currentModuleIndex = availableModules.findIndex(module => module.id === currentModuleId);
    return availableModules[currentModuleIndex + 1];
  };

  const handleModuleChangeWithReset = (moduleId: string) => {
    if (moduleId === currentModuleId) {
      setShowModuleDropdown(false);
      return;
    }
    
    setShowModuleDropdown(false);
    handleModuleChange(moduleId);
    resetState();
    setActiveTab('Lab');
  };


  const handleResetCode = () => {
    if (moduleContent) {
      setCode(moduleContent.exerciseContent.editorFiles.server);
    }
  };

  const handleRunCodeWrapper = (codeToRun?: string) => {
    handleRunCode(currentModuleId, codeToRun, exerciseType);
  };

  const handleSubmitWrapper = async () => {
    const success = await handleSubmit(currentModuleId);
    if (success) {
      triggerSuccess();
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty as Difficulty) {
      case 'Beginner': return 'bg-success-100 text-success-700';
      case 'Intermediate': return 'bg-warning-100 text-warning-700';
      case 'Advanced': return 'bg-error-100 text-error-700';
      default: return 'bg-success-100 text-success-700';
    }
  };

  if (loading && !moduleContent) {
    return <LoadingState />;
  }

  if (error || !moduleContent) {
    return <ErrorState error={error || 'Module not found'} onRetry={loadModuleContent} />;
  }

  return (
    <div className="min-h-screen bg-theme-background">
      {/* Screen Lock Modal */}
      <ScreenLockModal isOpen={showScreenLockModal} />
      
      {/* Welcome Modal */}
      <WelcomeModal 
        isOpen={showWelcomeModal} 
        onClose={handleCloseWelcomeModal} 
      />
      
      {/* Lab Completion Modal */}
      <LabCompletionModal
        isOpen={showLabCompletionModal}
        onClose={handleCloseLabCompletionModal}
        onNextLab={handleNextLab}
        currentModuleTitle={moduleContent?.module.title || ''}
        nextModuleTitle={getNextModule()?.title}
        hasNextModule={!!getNextModule()}
      />
      
      {/* Confetti Component */}
      <Confetti trigger={triggerConfetti} />
      
      {/* Header */}
      <Header
        loading={loading}
        moduleContent={moduleContent}
        availableModules={availableModules}
        groupedModules={groupedModules}
        currentModuleId={currentModuleId}
        showModuleDropdown={showModuleDropdown}
        onModuleDropdownToggle={() => setShowModuleDropdown(!showModuleDropdown)}
        onModuleChange={handleModuleChangeWithReset}
        onLanguageChange={switchLanguage}
        getCurrentLanguage={getCurrentLanguage}
        getCurrentBaseModule={getCurrentBaseModule}
        getDifficultyColor={getDifficultyColor}
      />

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] bg-theme-background overflow-hidden">
        {/* Left Panel - Learning Content */}
        <ContentPanel
          activeTab={activeTab}
          onTabChange={setActiveTab}
          moduleContent={moduleContent}
        />

        {/* Right Panel - Code Editor */}
        <div className="w-full lg:w-1/2 bg-theme-background flex flex-col min-h-0">
          <div className="flex-1 min-h-0">
            <CodeEditor 
              key={currentModuleId} // force complete component re-render
              code={code} 
              onCodeChange={setCode}
              packageJson={moduleContent.exerciseContent.editorFiles.package}
              solution={moduleContent.exerciseContent.solution}
              runCode={handleRunCodeWrapper}
              hasAttemptedSubmit={hasAttemptedSubmit}
              onResetCode={handleResetCode}
              hasCodeChanged={hasCodeChanged}
              language={getCurrentLanguage()}
            />
          </div>
          
          {/* Output Panel */}
          <OutputPanel
            output={output}
            isRunning={isRunning}
            isSubmitting={isSubmitting}
            testResults={testResults}
            onRunCode={handleRunCodeWrapper}
            onSubmit={handleSubmitWrapper}
          />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
