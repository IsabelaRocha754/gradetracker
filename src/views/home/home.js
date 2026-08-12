// src/views/home/home.js

import "./home.css"
import {Chart} from "chart.js/auto"
import "chartjs-adapter-date-fns"

export function renderHome(root, navigate){
    root.innerHTML = `
    <div class="home">
        <section class="stats-overview">
            <div class="grid">
                <div class="grid-box">
                    <div class="grid-box-title">Average</div>
                    <div class="grid-box-info">7.8</div>
                </div>
                <div class="grid-box">
                    <div class="gird-box-title">Courses</div>
                    <div class="grid-box-info">5</div>
                </div>
                <div class="grid-box">
                    <div class="grid-box-title">Next test</div>
                    <div class="grid-box-info">12/03</div>
                </div>
            </div>
            <div class="chart">Chart Placeholder</div>
        </section>

        <section class="links">
            <div class="nav-card">Projects</div>
            <div class="nav-card">Planner</div>
            <div class="nav-card">Grades</div>
        </section>
    </div>
    `;

    //CHART

    root.querySelectorAll("[data-route]").forEach((btn) => {
        btn.addEventListener("click", () => navigate(btn.dataset.route));
    });
}