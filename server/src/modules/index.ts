import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

export interface ModuleFile {
  readme?: string;
  server?: string;
  test?: string;
  solution?: string;
  package?: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  tags: string[];
  files: {
    lab: ModuleFile;
    exercise: ModuleFile;
  };
  learningObjectives: string[];
  prerequisites: string[];
}

export interface ModuleContent {
  module: Module;
  labContent: string;
  exerciseContent: {
    readme: string;
    editorFiles: {
      server: string;
      test: string;
      package: string;
    };
    solution: string;
  };
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const modulesPath = join(__dirname, '.');

export function getAllModules(): Module[] {
  const modules: Module[] = [];
  
  try {
    const moduleDirs = readdirSync(modulesPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory() && dirent.name.startsWith('module-'))
      .sort((a, b) => a.name.localeCompare(b.name));

    for (const moduleDir of moduleDirs) {
      const moduleConfigPath = join(modulesPath, moduleDir.name, 'module.json');
      try {
        const moduleConfig = JSON.parse(readFileSync(moduleConfigPath, 'utf-8'));
        modules.push(moduleConfig);
      } catch (error) {
        console.error(`Error loading module ${moduleDir.name}:`, error);
      }
    }
  } catch (error) {
    console.error('Error reading modules directory:', error);
  }

  return modules;
}

export function getModuleById(moduleId: string): Module | null {
  const modules = getAllModules();
  return modules.find(module => module.id === moduleId) || null;
}

export function getModuleContent(moduleId: string): ModuleContent | null {
  const module = getModuleById(moduleId);
  if (!module) return null;

  try {
    const modulePath = join(modulesPath, moduleId);
    
    // Read lab content
    const labReadmePath = join(modulePath, module.files.lab.readme || '');
    const labContent = readFileSync(labReadmePath, 'utf-8');

    // Read exercise content
    const exerciseReadmePath = join(modulePath, module.files.exercise.readme || '');
    const exerciseServerPath = join(modulePath, module.files.exercise.server || '');
    const exerciseTestPath = join(modulePath, module.files.exercise.test || '');
    const exerciseSolutionPath = join(modulePath, module.files.exercise.solution || '');
    const exercisePackagePath = join(modulePath, module.files.exercise.package || '');

    const exerciseContent = {
      readme: readFileSync(exerciseReadmePath, 'utf-8'),
      editorFiles: {
        server: readFileSync(exerciseServerPath, 'utf-8'),
        test: readFileSync(exerciseTestPath, 'utf-8'),
        package: readFileSync(exercisePackagePath, 'utf-8')
      },
      solution: readFileSync(exerciseSolutionPath, 'utf-8')
    };

    return {
      module,
      labContent,
      exerciseContent
    };
  } catch (error) {
    console.error(`Error loading module content for ${moduleId}:`, error);
    return null;
  }
}

export function getAvailableModules(): { id: string; title: string; difficulty: string }[] {
  const modules = getAllModules();
  return modules.map(module => ({
    id: module.id,
    title: module.title,
    difficulty: module.difficulty
  }));
}
