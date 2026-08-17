// src/router.js
import { renderHome } from "./views/home/home.js";
import { renderProjects } from "./views/projects/projects.js";
import { renderPlanner } from "./views/planner/planner.js";
import { renderGrades } from "./views/grades/grades.js";
import { renderNav } from "./components/nav.js";

const routes = {
  "/": renderHome,
  "/projects": renderProjects,
  "/planner": renderPlanner,
  "/grades": renderGrades,
};

// temporary, until the real detail view is built in views/projects/detail.js
function renderProjectDetail(contentEl, navigate, params) {
  contentEl.innerHTML = `<p>Project detail placeholder — id: ${params.id}</p>`;
}

const paramRoutes = [
  { pattern: /^\/projects\/([^/]+)$/, view: renderProjectDetail, paramNames: ["id"] },
];

let contentEl = null;

export function initRouter(contentElement, navElement) {
  contentEl = contentElement;
  renderNav(navElement, navigate);
  window.addEventListener("popstate", () => render(location.pathname));
  render(location.pathname);
}

export function navigate(path) {
  history.pushState({}, "", path);
  render(path);
}

function render(path) {
  contentEl.innerHTML = "";

  if (routes[path]) {
    routes[path](contentEl, navigate);
    return;
  }

  for (const { pattern, view, paramNames } of paramRoutes) {
    const match = path.match(pattern);
    if (match) {
      const params = Object.fromEntries(paramNames.map((name, i) => [name, match[i + 1]]));
      view(contentEl, navigate, params);
      return;
    }
  }

  routes["/"](contentEl, navigate); // fallback
}