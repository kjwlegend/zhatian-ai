import {
  Platform,
  Project,
  ProjectMember,
  ProjectStatus,
} from '@/app/workspace/projects/types/project';
import { db } from './index';

export async function getProject(id: string): Promise<Project | undefined> {
  const database = await db;
  return database.get('projects', id);
}

export async function getAllProjects(): Promise<Project[]> {
  const database = await db;
  return database.getAll('projects');
}

export async function addProject(project: Project): Promise<void> {
  const database = await db;
  await database.add('projects', project);
}

export async function updateProject(project: Project): Promise<void> {
  const database = await db;
  await database.put('projects', project);
}

export async function deleteProject(id: string): Promise<void> {
  const database = await db;
  await database.delete('projects', id);
}

export async function getProjectsByCreator(creator: string): Promise<Project[]> {
  const database = await db;
  return database.getAllFromIndex('projects', 'by-creator', creator);
}

export async function updateProjectComponents(
  projectId: string,
  components: string[]
): Promise<void> {
  const database = await db;
  const project = await getProject(projectId);
  if (project) {
    await updateProject({
      ...project,
      components,
      updatedAt: new Date().toISOString(),
    });
  }
}

export async function updateProjectPages(projectId: string, pages: string[]): Promise<void> {
  const database = await db;
  const project = await getProject(projectId);
  if (project) {
    await updateProject({
      ...project,
      pages,
      updatedAt: new Date().toISOString(),
    });
  }
}

export async function updateProjectMembers(
  projectId: string,
  members: ProjectMember[]
): Promise<void> {
  const database = await db;
  const project = await getProject(projectId);
  if (project) {
    await updateProject({
      ...project,
      members,
      updatedAt: new Date().toISOString(),
    });
  }
}
