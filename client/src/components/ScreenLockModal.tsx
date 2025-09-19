import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDesktop, faMobile, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

interface ScreenLockModalProps {
  isOpen: boolean;
}

export function ScreenLockModal({ isOpen }: ScreenLockModalProps) {
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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isVisible ? 'opacity-80' : 'opacity-0'
        }`}
      />
      
      {/* Modal */}
      <div 
        className={`relative w-full max-w-md bg-theme-surface border-2 border-theme-primary rounded-2xl shadow-b2l-lg transform transition-all duration-300 ${
          isVisible 
            ? 'scale-100 opacity-100 translate-y-0' 
            : 'scale-95 opacity-0 translate-y-4'
        }`}
      >
        {/* Header */}
        <div className="p-6 text-center border-b-2 border-theme-primary">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-white text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-theme-primary font-b2l mb-2">
            Screen Size Not Supported
          </h2>
          <p className="text-theme-secondary">
            This application requires a larger screen for the best experience
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            {/* Desktop Icon */}
            <div className="flex items-center justify-center space-x-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border-2 border-green-200 dark:border-green-800">
              <FontAwesomeIcon icon={faDesktop} className="text-green-600 text-2xl" />
              <div className="text-left">
                <h3 className="font-semibold text-green-700 dark:text-green-300">Recommended</h3>
                <p className="text-sm text-green-600 dark:text-green-400">Desktop or laptop with 1024px+ width</p>
              </div>
            </div>

            {/* Mobile Icon */}
            <div className="flex items-center justify-center space-x-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border-2 border-red-200 dark:border-red-800">
              <FontAwesomeIcon icon={faMobile} className="text-red-600 text-2xl" />
              <div className="text-left">
                <h3 className="font-semibold text-red-700 dark:text-red-300">Not Supported</h3>
                <p className="text-sm text-red-600 dark:text-red-400">Mobile devices and small screens</p>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="mt-6 p-4 bg-theme-background rounded-xl border-2 border-theme-primary">
            <p className="text-theme-secondary text-center leading-relaxed">
              <strong className="text-theme-primary">Backend2Lab</strong> is designed for desktop and laptop computers 
              to provide the optimal coding experience with side-by-side content and editor panels.
            </p>
          </div>

          {/* Instructions */}
          <div className="mt-4 text-center">
            <p className="text-sm text-theme-secondary">
              Please use a desktop computer, laptop, or tablet in landscape mode for the best experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
