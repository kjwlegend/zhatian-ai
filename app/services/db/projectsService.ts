import { initDB } from './index';
import { Project } from './schema';

export async function getProject(id: string): Promise<Project | undefined> {
  const db = await initDB();
  return db.get('projects', id);
}

export async function addProject(project: Project): Promise<void> {
  const db = await initDB();
  await db.put('projects', project);
}

export async function updateProject(project: Project): Promise<void> {
  const db = await initDB();
  await db.put('projects', project);
}

export async function deleteProject(id: string): Promise<void> {
  const db = await initDB();
  await db.delete('projects', id);
}

export async function getAllProjects(): Promise<Project[]> {
  const db = await initDB();
  return db.getAll('projects');
}

// export async function getProjectPages(projectId: string): Promise<string[]> {
//   const db = await initDB();
//   const pages = await db.getAllFromIndex('pages', 'by-project', projectId);
//   return pages.map((page) => page.id);
// }
