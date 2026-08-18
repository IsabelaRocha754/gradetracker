// src/data/projects.js
// Single source of truth for project data, mirroring courses.js

let projects = [
  {
    id: crypto.randomUUID(),
    name: "Portfolio website",
    status: "in-progress", // "not-started" | "in-progress" | "blocked" | "done"
    dueDate: "2026-08-20",
    links: [],
    tasks: [
      { id: crypto.randomUUID(), text: "Set up routing", done: true, dueDate: "2026-08-10" },
      { id: crypto.randomUUID(), text: "Build home page", done: true, dueDate: "2026-08-12" },
    ],
  },
];

export function getProjects() {
  return projects;
}

export function getProject(id) {
  return projects.find((p) => p.id === id);
}

export function addProject({ name, status = "not-started", dueDate = "", links = [] }) {
  const project = { id: crypto.randomUUID(), name, status, dueDate, links, tasks: [] };
  projects.push(project);
  return project;
}

export function removeProject(id) {
  projects = projects.filter((p) => p.id !== id);
}

export function updateProjectStatus(id, status) {
  const project = getProject(id);
  if (project) project.status = status;
}

export function getTaskProgress(project) {
  const total = project.tasks.length;
  const done = project.tasks.filter((t) => t.done).length;
  return { done, total };
}

export function addTask(projectId, text, dueDate = "") {
  const project = getProject(projectId);
  if (!project) return;
  project.tasks.push({ id: crypto.randomUUID(), text, done: false, dueDate });
}

export function toggleTask(projectId, taskId) {
  const project = getProject(projectId);
  if (!project) return;
  const task = project.tasks.find((t) => t.id === taskId);
  if (task) task.done = !task.done;
}

export function removeTask(projectId, taskId) {
  const project = getProject(projectId);
  if (!project) return;
  project.tasks = project.tasks.filter((t) => t.id !== taskId);
}

export function addLink(projectId, label, url) {
  const project = getProject(projectId);
  if (!project) return;
  project.links.push({ id: crypto.randomUUID(), label, url });
}

export function removeLink(projectId, linkId) {
  const project = getProject(projectId);
  if (!project) return;
  project.links = project.links.filter((l) => l.id !== linkId);
}