// src/components/nav.js

import "./nav.css"

export function renderNav(navEl, navigate){
    navEl.innerHTML = `
        <div class="nav__left">
        <button class="nav__logo" data-route="/">
            <span class="nav__logo-mark"></span>
            <span class="nav__logo-text">gradetrack</span>
        </button>
        <button data-route="/projects">Projects</button>
        <button data-route="/planner">Planner</button>
        <button data-route="/grades">Grades</button>
        </div>
        <div class="nav__right">
        <span class="nav__username">Isa</span>
        <div class="nav__avatar">I</div>
        </div>
    `;

    navEl.querySelectorAll("[data-route]").forEach((btn) => {
        btn.addEventListener("click", () => navigate(btn.dataset.route));
    });
}