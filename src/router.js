// src/router.js
import {renderHome} from "./views/home/home.js"
import {renderProjects} from "./views/projects/projects.js"
import {renderPlanner} from "./views/planner/planner.js"
import {renderGrades} from "./views/grades/grades.js"
import {renderNav} from "./components/nav.js"

const routes = {
    "/": renderHome,
    "/projects": renderProjects,
    "/planner": renderPlanner,
    "/grades": renderGrades,
};

let contentEl = null;

export function initRouter(contentElement, navElement){
    contentEl = contentElement;
    renderNav(navElement, navigate);
    window.addEventListener("popstate", () => render(location.pathname));
    render(location.pathname);
}

export function navigate(path){
    history.pushState({}, "", path);
    render(path);
}

function render(path){
    const view = routes[path] || routes["/"];
    contentEl.innerHTML = "";
    view(contentEl, navigate);
}