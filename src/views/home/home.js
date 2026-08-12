// src/views/home/home.js

import "./home.css"
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip } from "chart.js";
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip);
import { getCourses, getCourseAverage, getOverallAverage} from "../../data/courses.js";



export function renderHome(root, navigate){
    const courses = getCourses();
    const overallAverage = getOverallAverage();

    root.innerHTML = `
    <div class="home">
        <h1>Dashboard</h1>
        
        <section class="stats-overview">
            <div class="grid">
                <div class="grid-box">
                    <div class="grid-box-title">Average</div>
                    <div class="grid-box-info">${overallAverage !== null ? overallAverage.toFixed(2) : "-"}</div>
                </div>
                <div class="grid-box">
                    <div class="grid-box-title">Courses</div>
                    <div class="grid-box-info">${courses.length}</div>
                </div>
                <div class="grid-box">
                    <div class="grid-box-title">Next test</div>
                    <div class="grid-box-info">12/03</div>
                </div>
            </div>
            <div class="chart-container">
                <canvas id="home-chart"></canvas>
            </div>
        </section>

        <section class="links">
            <div class="nav-card">
                <div class="nav-card-title">Projects</div>
            </div>
            <div class="nav-card">
                <div class="nav-card-title">Planner</div>
            </div>
            <div class="nav-card">
                <div class="nav-card-title">Grades</div>
            </div>
        </section>
    </div>
    `;

    //CHART
    renderBarChart();

    root.querySelectorAll("[data-route]").forEach((btn) => {
        btn.addEventListener("click", () => navigate(btn.dataset.route));
    });
}

function renderBarChart(){
    const courses = getCourses();

    const labels = courses.map((c) => c.name);
    const averages = courses.map((c) => getCourseAverage(c));
    const colors = courses.map((c) => c.color);

    new Chart(document.getElementById("home-chart"), {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Average grade",
                    data: averages,
                    backgroundColor: colors,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    min: 0,
                    max: 10,
                },
            },
        },
    });
}