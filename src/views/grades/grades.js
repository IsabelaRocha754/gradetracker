// src/views/grades/grades.js

export function renderGrades(root, navigate){
    root.innerHTML = `
    <div class="grades">
        <h1>Grades</h1>
    </div>
    `;

    root.querySelectorAll("[data-route]").forEach((btn) => {
        btn.addEventListener("click", () => navigate(btn.dataset.route));
    });
}