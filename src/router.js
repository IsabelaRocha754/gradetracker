// src/router.js
import {renderHome} from "./views/home/home.js"
//import {renderProjects} from "./views/projects/projects.js"
//import {renderPlanner} from "./views/planner/planner.js"
//import {renderGrades} from "./views/grades/grades.js"

const routes = {
    "/": renderHome,
    //"/projects": renderProjects,
    //"/planner": renderPlanner,
    //"/grades": renderGrades,
};

let rootEl = null;

export function initRouter(el){
    rootEl = el;
    window.addEventListener("popstate", () => render(location.pathname));
    render(location.pathname);
}

export function navigate(path){
    history.pushState({}, "", path);
    render(path);
}

function render(path){
    const view = routes[path] || routes["/"];
    rootEl.innerHTML = "";
    view(rootEl, navigate);
}