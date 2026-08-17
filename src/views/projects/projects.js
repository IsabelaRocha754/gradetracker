// src/views/projects/projects.js
import { getProjects, addProject, removeProject, getTaskProgress } from "../../data/projects.js";
import "./projects.css"

const STATUS_META = {
  "not-started": { label: "Not started", color: "var(--text-muted)" },
  "in-progress": { label: "In progress", color: "var(--color-brand-blue)" },
  "blocked": { label: "Blocked", color: "#F54927" },
  "done": { label: "Done", color: "#27F5B0" },
};

export function renderProjects(root, navigate) {
  root.innerHTML = `
    <div class="projects">
      <h1>Projects</h1>
      <div class="projects-layout">
        <section class="projects-panel">
          <div class="projects-panel-header">
            <h2>Projects</h2>
            <button class="add-project-btn">+ Add project</button>
          </div>
          <div class="project-list"></div>
        </section>
        <aside class="projects-sidebar"><!-- quick stats: parked --></aside>
      </div>
    </div>
  `;

  renderProjectList(root.querySelector(".project-list"), navigate);
  root.querySelector(".add-project-btn").addEventListener("click", () => {
    handleAddProject(root, navigate);
  });
}

function renderProjectList(listEl, navigate) {
  const projects = getProjects();
  listEl.innerHTML = "";

  projects.forEach((project) => {
    const { done, total } = getTaskProgress(project);
    const meta = STATUS_META[project.status];

    const card = document.createElement("div");
    card.className = "project-card";
    card.dataset.id = project.id;
    card.innerHTML = `
      <div>
        <p class="project-name">${project.name}</p>
        <p class="project-progress">${done}/${total} tasks done</p>
      </div>
      <div class="project-card-right">
        <span class="project-status" style="color:${meta.color}">
          <span class="status-dot" style="background:${meta.color}"></span>${meta.label}
        </span>
        <button class="remove-project-btn" data-id="${project.id}">×</button>
      </div>
    `;
    listEl.appendChild(card);
  });

  listEl.querySelectorAll(".remove-project-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation(); // don't trigger card navigation
      removeProject(btn.dataset.id);
      renderProjectList(listEl, navigate);
    });
  });

  listEl.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("click", () => {
      navigate(`/projects/${card.dataset.id}`);
    });
  });
}

function handleAddProject(root, navigate) {
  const name = prompt("Project name:");
  if (!name || !name.trim()) return;
  addProject({ name: name.trim() });
  renderProjectList(root.querySelector(".project-list"), navigate);
}