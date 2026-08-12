// src/views/grades/grades.js

import "./grades.css"
import { getCourses, getCourseAverage, addCourse, removeCourse } from "../../data/courses.js";

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
}

export function renderGrades(root, navigate) {
    root.innerHTML = `
    <div class="grades">
        <h1>Grades</h1>

        <div class="grades-layout">
            <section class="chart-panel">
                <p class="chart-panel-label">Grades over time</p>
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
                        <span class="grade-actions-label">Grades for selected course</span>
                        <div class="grade-actions-buttons">
                            <button id="add-grade-btn">+</button>
                            <button id="remove-grade-btn">-</button>
                        </div>
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

    root.querySelectorAll("[data-route]").forEach((btn) => {
        btn.addEventListener("click", () => navigate(btn.dataset.route));
    });
}
