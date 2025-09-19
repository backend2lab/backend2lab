import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faArrowRight, faRocket, faTimes } from '@fortawesome/free-solid-svg-icons';

interface LabCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNextLab: () => void;
  currentModuleTitle: string;
  nextModuleTitle?: string;
  hasNextModule: boolean;
}

export function LabCompletionModal({ 
  isOpen, 
  onClose, 
  onNextLab, 
  currentModuleTitle, 
  hasNextModule 
}: LabCompletionModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure smooth animation
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleContinue = () => {
    if (hasNextModule) {
      onNextLab();
    } else {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isVisible ? 'opacity-60' : 'opacity-0'
        }`}
      />
      
      {/* Modal */}
      <div 
        className={`relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl bg-theme-surface border-2 border-theme-primary rounded-2xl shadow-b2l-lg transform transition-all duration-300 ${
          isVisible 
            ? 'scale-100 opacity-100 translate-y-0' 
            : 'scale-95 opacity-0 translate-y-4'
        }`}
      >
        {/* Close button */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
          <button
            onClick={onClose}
            className="w-7 h-7 sm:w-8 sm:h-8 bg-theme-surface border border-theme-primary rounded-full flex items-center justify-center text-theme-secondary hover:text-theme-primary hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="text-xs sm:text-sm" />
          </button>
        </div>

        {/* Header with celebration */}
        <div className="p-6 sm:p-8 lg:p-10 text-center">
          {/* Success icon */}
          <div className="mb-4 sm:mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <FontAwesomeIcon icon={faCheckCircle} className="text-white text-2xl sm:text-3xl" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-theme-primary mb-2 font-b2l">
            Lab Complete!
          </h2>
          
          {/* Module title */}
          <p className="text-sm sm:text-base lg:text-lg text-theme-secondary mb-4 sm:mb-6">
            You've successfully completed <strong className="text-theme-primary">{currentModuleTitle}</strong>
          </p>

          {/* Achievement message */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-3 sm:p-4 lg:p-5 mb-4 sm:mb-6 border border-green-200 dark:border-green-700">
            <p className="text-green-700 dark:text-green-300 text-xs sm:text-sm lg:text-base font-medium">
              🎉 Excellent work! You've mastered this concept and are ready for the next challenge.
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="px-6 sm:px-8 lg:px-10 pb-6 sm:pb-8 lg:pb-10">
          {hasNextModule ? (
            <button
              onClick={handleContinue}
              className="w-full bg-gradient-to-r from-b2l-primary to-blue-600 text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-b2l-primary transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              <FontAwesomeIcon icon={faRocket} className="text-sm sm:text-base" />
              <span>Continue to Next Lab</span>
              <FontAwesomeIcon icon={faArrowRight} className="text-sm sm:text-base" />
            </button>
          ) : (
            <>
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-3 sm:p-4 lg:p-5 mb-4 sm:mb-6 border border-purple-200 dark:border-purple-700">
                <p className="text-purple-700 dark:text-purple-300 text-xs sm:text-sm lg:text-base font-medium text-center">
                  🏆 Congratulations! You've completed all available modules. More content coming soon!
                </p>
              </div>
              
              <button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-b2l-primary to-blue-600 text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-b2l-primary transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <FontAwesomeIcon icon={faCheckCircle} className="text-sm sm:text-base" />
                <span>Awesome! Close</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
