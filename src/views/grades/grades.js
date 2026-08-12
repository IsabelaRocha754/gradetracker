// src/views/grades/grades.js

import "./grades.css"
import { getCourses, getCourseAverage, addCourse, removeCourse, getNextColor, addGrade, removeGrade} from "../../data/courses.js";
import { parse, format, parseISO } from "date-fns";
import { initDatePicker } from "../../utils/datepicker.js";
import Chart from "chart.js/auto"
import "chartjs-adapter-date-fns"

let selectedCourseId = getCourses()[0]?.id ?? null;

function renderCourseList() {
    const list = document.querySelector(".course-list");
    if (!list) return;

    const courses = getCourses();

    list.innerHTML = courses.map((course) => {
        const avg = getCourseAverage(course);
        const isSelected = course.id === selectedCourseId;
        return `
        <li class="course-item ${isSelected ? "course-item--selected" : ""}" data-course-id="${course.id}">
            <div>
                <p class="course-name">${course.name}</p>
                <p class="course-average">avg ${avg !== null ? avg.toFixed(1) : "-"}</p>
            </div>
            <button class="remove-course-btn" data-course-id="${course.id}">x</button>
        </li>
        `;
    }).join("");

    list.querySelectorAll(".course-item").forEach((item) => {
        item.addEventListener("click", (e) => {
            if (e.target.closest(".remove-course-btn")) return;
            selectedCourseId = item.dataset.courseId;
            renderCourseList();
        });
    });

    list.querySelectorAll(".remove-course-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.courseId;
            removeCourse(id);
            if (selectedCourseId === id) {
                selectedCourseId = getCourses()[0]?.id ?? null;
            }
            renderCourseList();
        });
    });

    renderGradeList();
    renderChartLegend();
    renderChart();
}

function renderGradeList() {
    const list = document.querySelector(".grade-list");
    if (!list) return;

    const course = getCourses().find((c) => c.id === selectedCourseId);
    if (!course) {
        list.innerHTML = "";
        return;
    }

    list.innerHTML = course.grades.map((g, index) => `
        <li class="grade-item" data-index="${index}">
            <span>${format(parseISO(g.date), "d MMM yyyy")}</span>
            <span>${g.value.toFixed(2)}</span>
        </li>
    `).join("");

    list.querySelectorAll(".grade-item").forEach((item) => {
        item.addEventListener("click", () => {
            const index = Number(item.dataset.index);
            removeGrade(selectedCourseId, index);
            renderCourseList();
        });
    });
}

let chartInstance = null;

function buildDatasets(){
    return getCourses().map((course) => ({
        label: course.name,
        borderColor: course.color,
        backgroundColor: course.color,
        data: course.grades.map((g) => ({x: g.date, y: g.value})),
        tension: 0.3,
    }));
}

function renderChartLegend(){
    const legend = document.querySelector(".chart-legend");
    if (!legend) return;

    legend.innerHTML = getCourses().map((course) => `
        <label class="legend-item">
            <input type="checkbox" class="legend-checkbox data-course-id="${course.id}" checked>
            <span style="color:${course.color}">${course.name}"</span>
        </label>
    `).join("");

    legend.querySelectorAll(".legend-checkbox").forEach((checkbox) => {
        checkbox.addEventListener("change", updateChartVisibility);
    });
}

function renderChart(){
    const canvas = document.querySelector("#grades-chart");
    if (!canvas) return;

    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(canvas, {
        type: "line",
        data: {datasets: buildDatasets()},
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {type: "time", time: {unit: "month"}},
                y: {min: 0, max: 10},
            },
        },
    });
}

function updateChartVisibility() {
    if (!chartInstance) return;

    document.querySelectorAll(".legend-checkbox").forEach((checkbox, index) => {
        chartInstance.getDatasetMeta(index).hidden = !checkbox.checked;
    });
    chartInstance.update();
}

export function renderGrades(root, navigate) {
    root.innerHTML = `
    <div class="grades">
        <h1>Grades</h1>

        <div class="grades-layout">
            <section class="chart-panel">
                <div class="chart-panel-header">
                    <p class="chart-panel-label">Grades over time</p>
                    <div class="chart-legend"></div>
                </div>
                <div class="chart-container">
                    <canvas id="grades-chart"></canvas>
                </div>
            </section>

            <div class="grades-sidebar">
                <section class="course-panel">
                    <div class="course-panel-header">
                        <h2>Courses</h2>
                        <button id="add-course-btn">+ Add course</button>
                    </div>

                    <ul class="course-list"></ul>

                    <div class="grade-actions">
                        <div class="grade-actions-header>
                            <span class="grade-actions-label">Grades for selected course</span>
                            <button id="add-grade-btn">+</button>
                        </div>
                        <ul class="grade-list"></ul>
                    </div>
                </section>

                <section class="progress-panel">
                    <svg id="progress-ring" width="120" height="120" viewBox="0 0 120 120"></svg>
                    <p class="progress-label">overall progress</p>
                </section>
            </div>
        </div>
    </div>
    `;

    renderCourseList();

    document.querySelector("#add-course-btn").addEventListener("click", () => {
        const name = prompt("Course name: ");
        if (!name) return null;

        const color = getNextColor();
        const newId = addCourse(name,color);

        selectedCourseId = newId;
        renderCourseList();
    });

    document.querySelector("#add-grade-btn").addEventListener("click", openGradeModal);

    root.querySelectorAll("[data-route]").forEach((btn) => {
        btn.addEventListener("click", () => navigate(btn.dataset.route));
    });
}

function openGradeModal() {
    if (!selectedCourseId) {
        alert("Select a course first.");
        return;
    }

    const backdrop = document.createElement("div");
    backdrop.className = "grade-modal-backdrop";
    backdrop.innerHTML = `
        <form class="grade-modal">
            <h3>Add grade</h3>
            <label>
                Date
                <input type="text" name="date" class="date-input" required>
            </label>
            <label>
                Grade
                <input type="number" name="value" step="0.1" min="0" max="10" required>
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
        const rawDate = formData.get("date");
        const parsedate = parse(rawDate, "d/M/yyyy", new Date());
        const isoDate = format(parsedate, "yyyy-MM-dd");
        const value = parseFloat(formData.get("value"));

        addGrade(selectedCourseId, isoDate, value);
        backdrop.remove();
        renderCourseList();
    });
}