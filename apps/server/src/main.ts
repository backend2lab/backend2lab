import express, { Request, Response } from 'express';
import { TestRunner } from './utils/testRunner';
import { getAllModules, getModuleContent } from './modules';

const host: string = process.env.HOST ?? 'localhost';
const port: number = process.env.PORT ? Number(process.env.PORT) : 4000;

const app = express();

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Middleware to parse JSON
app.use(express.json());

app.get('/api/modules', (req: Request, res: Response) => {
  try {
    const modules = getAllModules();
    res.json(modules);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load modules' });
  }
});

app.get('/api/modules/:moduleId', (req: Request, res: Response) => {
  try {
    const { moduleId } = req.params;
    const moduleContent = getModuleContent(moduleId);
    
    if (!moduleContent) {
      return res.status(404).json({ error: 'Module not found' });
    }
    
    res.json(moduleContent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load module content' });
  }
});

app.post('/api/test/:moduleId', async (req: Request, res: Response) => {
  try {
    const { moduleId } = req.params;
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }
    
    const testResult = await TestRunner.runTests(moduleId, code);
    res.json(testResult);
  } catch (error) {
    res.status(500).json({ error: 'Test execution failed' });
  }
});

app.listen(port, host, () => {
  console.log(`Backend2Lab Server running at http://${host}:${port}`);
});
