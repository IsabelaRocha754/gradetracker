// src/views/home/home.js

import {Chart} from "chart.js/auto"
import "chartjs-adapter-date-fns"

export function renderHome(root, navigate){
    root.innerHTML = `
    <div class="home">
        <section class="stats-overview">
            <div class="grid">
                <div class="grid-box">Average</div>
                <div class="grid-box">Courses</div>
                <div class="grid-box">Next test</div>
            </div>
            <div class="chart"></div>
        </section>

        <section class="links">
            <div class="nav-card">Projects</div>
            <div class="nav-card">Planner</div>
            <div class="nav-card">Grades</div>
        </section>
    </div>
    `;

    root.querySelectorAll("[data-route]").forEach((btn) => {
        btn.addEventListener("click", () => navigate(btn.dataset.route));
    });
}