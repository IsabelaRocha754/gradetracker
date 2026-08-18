// src/views/projects/detail.js
import { parse, format, parseISO } from "date-fns";
import {
  getProject,
  updateProjectStatus,
  addTask,
  toggleTask,
  addLink,
  removeLink,
} from "../../data/projects.js";
import { initDatePicker } from "../../utils/datepicker.js";
import "./detail.css";

const STATUS_META = {
  "not-started": { label: "Not started", textColor: "#5F5E5A", bgColor: "#F1EFE8" },
  "in-progress": { label: "In progress", textColor: "#185FA5", bgColor: "#E6F1FB" },
  "blocked": { label: "Blocked", textColor: "#993C1D", bgColor: "#FAECE7" },
  "done": { label: "Done", textColor: "#0F6E56", bgColor: "#E1F5EE" },
};

export function renderProjectDetail(root, navigate, params) {
  const project = getProject(params.id);

  if (!project) {
    root.innerHTML = `<p>Project not found.</p>`;
    return;
  }

  root.innerHTML = `
    <div class="project-detail">
      <h1>${project.name}</h1>

      <div class="status-bar">
        <div class="dot-track"></div>
        <select id="status-select"></select>
      </div>

      <div class="detail-layout">
        <section class="todo-panel">
          <div class="todo-panel-header">
            <h2>To-do list</h2>
            <button id="add-task-btn">+ Add task</button>
          </div>
          <div class="task-list"></div>
        </section>

        <aside class="detail-sidebar">
          <div class="sidebar-card">
            <h2>Documents and links</h2>
            <div class="link-list"></div>
            <button id="add-link-btn">+ Add link</button>
          </div>

          <div class="sidebar-card">
            <h2>Collaborators</h2>
            <div class="collaborator-avatar">I</div>
          </div>
        </aside>
      </div>
    </div>
  `;

  renderDotTrack(root, project);
  renderStatusSelect(root, project);
  renderTaskList(root, project);
  renderLinkList(root, project);

  root.querySelector("#add-task-btn").addEventListener("click", () => {
    openTaskModal(project, root);
  });

  root.querySelector("#add-link-btn").addEventListener("click", () => {
    handleAddLink(project, root);
  });
}

function renderDotTrack(root, project) {
  const track = root.querySelector(".dot-track");
  track.innerHTML = "";

  project.tasks.forEach((task, i) => {
    if (i > 0) {
      const prevDone = project.tasks[i - 1].done;
      const connector = document.createElement("span");
      connector.className = `connector ${prevDone ? "connector--done" : "connector--pending"}`;
      track.appendChild(connector);
    }

    const dot = document.createElement("span");
    dot.className = `dot ${task.done ? "dot--done" : "dot--pending"}`;
    if (task.done) dot.innerHTML = `<i class="ti ti-check" aria-hidden="true"></i>`;
    track.appendChild(dot);
  });
}

function renderStatusSelect(root, project) {
  const select = root.querySelector("#status-select");
  select.innerHTML = Object.entries(STATUS_META)
    .map(([value, meta]) => `<option value="${value}">${meta.label}</option>`)
    .join("");
  select.value = project.status;
  applyStatusColors(select, project.status);

  select.addEventListener("change", () => {
    updateProjectStatus(project.id, select.value);
    applyStatusColors(select, select.value);
  });
}

function applyStatusColors(select, status) {
  const meta = STATUS_META[status];
  select.style.color = meta.textColor;
  select.style.background = meta.bgColor;
}

function renderTaskList(root, project) {
  const listEl = root.querySelector(".task-list");
  listEl.innerHTML = "";

  project.tasks.forEach((task) => {
    const item = document.createElement("div");
    item.className = "task-item";
    item.dataset.id = task.id;

    const dueLabel = task.dueDate ? format(parseISO(task.dueDate), "MMM d") : "";

    item.innerHTML = `
      <span class="task-checkbox ${task.done ? "task-checkbox--done" : "task-checkbox--pending"}"></span>
      <p class="task-text ${task.done ? "task-text--done" : ""}">${task.text}</p>
      <span class="task-due">${dueLabel}</span>
    `;

    item.addEventListener("click", () => {
      toggleTask(project.id, task.id);
      renderDotTrack(root, project);
      renderTaskList(root, project);
    });

    listEl.appendChild(item);
  });
}

function renderLinkList(root, project) {
  const listEl = root.querySelector(".link-list");
  listEl.innerHTML = "";

  project.links.forEach((link) => {
    const item = document.createElement("div");
    item.className = "link-item";

    item.innerHTML = `
      <a href="${link.url}" target="_blank" rel="noopener noreferrer">
        <i class="ti ti-external-link" aria-hidden="true"></i>${link.label}
      </a>
      <button class="remove-link-btn" data-id="${link.id}">×</button>
    `;

    item.querySelector(".remove-link-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      removeLink(project.id, link.id);
      renderLinkList(root, project);
    });

    listEl.appendChild(item);
  });
}

function openTaskModal(project, root) {
  const backdrop = document.createElement("div");
  backdrop.className = "grade-modal-backdrop";
  backdrop.innerHTML = `
    <form class="grade-modal">
      <h3>Add task</h3>
      <label>
        Task name
        <input type="text" name="text" required>
      </label>
      <label>
        Due date
        <input type="text" name="date" class="date-input" required>
      </label>
      <div class="grade-modal-actions">
        <button type="button" class="grade-modal-cancel">Cancel</button>
        <button type="submit">Add</button>
      </div>
    </form>
  `;
  document.body.appendChild(backdrop);

  initDatePicker(backdrop.querySelector(".date-input"));

  backdrop.querySelector(".grade-modal-cancel").addEventListener("click", () => {
    backdrop.remove();
  });

  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) backdrop.remove();
  });

  backdrop.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const text = formData.get("text").trim();
    const rawDate = formData.get("date");

    if (!text) return;

    const parsedDate = parse(rawDate, "d/M/yyyy", new Date());
    const isoDate = format(parsedDate, "yyyy-MM-dd");

    addTask(project.id, text, isoDate);
    backdrop.remove();
    renderDotTrack(root, project);
    renderTaskList(root, project);
  });
}

function handleAddLink(project, root) {
  const label = prompt("Link label (e.g. 'Figma mockups'):");
  if (!label || !label.trim()) return;
  const url = prompt("URL:");
  if (!url || !url.trim()) return;

  addLink(project.id, label.trim(), url.trim());
  renderLinkList(root, project);
}