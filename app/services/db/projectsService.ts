import { db } from './index';
import { Project } from './schema';

export async function getProject(id: string): Promise<Project | undefined> {
  const database = await db;
  return database.get('projects', id);
}

export async function addProject(project: Project): Promise<void> {
  const database = await db;
  await database.put('projects', project);
}

export async function updateProject(project: Project): Promise<void> {
  const database = await db;
  await database.put('projects', project);
}

export async function deleteProject(id: string): Promise<void> {
  const database = await db;
  await database.delete('projects', id);
}

export async function getAllProjects(): Promise<Project[]> {
  const database = await db;
  return database.getAll('projects');
}

export async function getProjectsByCreator(creator: string): Promise<Project[]> {
  const database = await db;
  return database.getAllFromIndex('projects', 'by-creator', creator);
}
