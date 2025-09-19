/**
 * Service for managing user progress persistence in localStorage
 */

export interface UserProgress {
  [moduleId: string]: {
    code: string;
    lastModified: number;
  };
}

const STORAGE_KEY = 'backend2lab-user-progress';

export class ProgressService {
  /**
   * Save user code for a specific module
   */
  static saveCode(moduleId: string, code: string): void {
    try {
      const existingProgress = this.getProgress();
      existingProgress[moduleId] = {
        code,
        lastModified: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existingProgress));
    } catch (error) {
      console.warn('Failed to save progress to localStorage:', error);
    }
  }

  /**
   * Get saved code for a specific module
   */
  static getCode(moduleId: string): string | null {
    try {
      const progress = this.getProgress();
      return progress[moduleId]?.code || null;
    } catch (error) {
      console.warn('Failed to load progress from localStorage:', error);
      return null;
    }
  }

  /**
   * Get all user progress
   */
  static getProgress(): UserProgress {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.warn('Failed to parse progress from localStorage:', error);
      return {};
    }
  }

  /**
   * Clear progress for a specific module
   */
  static clearModuleProgress(moduleId: string): void {
    try {
      const progress = this.getProgress();
      delete progress[moduleId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.warn('Failed to clear module progress:', error);
    }
  }

  /**
   * Clear all user progress
   */
  static clearAllProgress(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear all progress:', error);
    }
  }

  /**
   * Check if there's saved progress for a module
   */
  static hasProgress(moduleId: string): boolean {
    try {
      const progress = this.getProgress();
      return moduleId in progress;
    } catch (error) {
      console.warn('Failed to check progress:', error);
      return false;
    }
  }

  /**
   * Get the last modified timestamp for a module
   */
  static getLastModified(moduleId: string): number | null {
    try {
      const progress = this.getProgress();
      return progress[moduleId]?.lastModified || null;
    } catch (error) {
      console.warn('Failed to get last modified timestamp:', error);
      return null;
    }
  }
}
