import { initDB } from './index';
import { Page, Project } from './schema';

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

export async function getProjectsByCreator(creator: string): Promise<Project[]> {
  const db = await initDB();
  return db.getAllFromIndex('projects', 'by-creator', creator);
}

export async function getProjectPages(projectId: string): Promise<Page[]> {
  const db = await initDB();
  const pages = await db.getAllFromIndex('pages', 'by-project', projectId);
  return pages as Page[];
}

export async function getProjectComponents(projectId: string): Promise<number> {
  const db = await initDB();
  const pages = await db.getAllFromIndex('pages', 'by-project', projectId);
  const componentsPromises = pages.map((page) =>
    db.getAllFromIndex('components', 'by-page', page.id)
  );
  const componentsPerPage = await Promise.all(componentsPromises);
  return componentsPerPage.reduce((total, components) => total + components.length, 0);
}
