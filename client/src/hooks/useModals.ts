import { useState, useEffect } from "react";

export function useModals() {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showLabCompletionModal, setShowLabCompletionModal] = useState(false);
  const [showScreenLockModal, setShowScreenLockModal] = useState(false);
  const [triggerConfetti, setTriggerConfetti] = useState(false);

  // Reset confetti trigger after it's been used
  useEffect(() => {
    if (triggerConfetti) {
      const timer = setTimeout(() => {
        setTriggerConfetti(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [triggerConfetti]);

  const checkWelcomeModal = () => {
    try {
      const hasSeenWelcome = localStorage.getItem('backend2lab-welcome-seen');
      if (!hasSeenWelcome) {
        setTimeout(() => setShowWelcomeModal(true), 500);
      }
    } catch {
      setTimeout(() => setShowWelcomeModal(true), 500);
    }
  };

  const handleCloseWelcomeModal = () => {
    setShowWelcomeModal(false);
    try {
      localStorage.setItem('backend2lab-welcome-seen', 'true');
    } catch {
      // Ignore localStorage errors
    }
  };

  const handleCloseLabCompletionModal = () => {
    setShowLabCompletionModal(false);
  };

  const triggerSuccess = () => {
    setTriggerConfetti(true);
    setShowLabCompletionModal(true);
  };

  return {
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
  };
}
