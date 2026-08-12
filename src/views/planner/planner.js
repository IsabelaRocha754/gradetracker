// src/views/planner/planner.js

export function renderPlanner(root, navigate){
    root.innerHTML = `
    <div class="planner">
        <h1>Planner</h1>
    </div>
    `;

    root.querySelectorAll("[data-route]").forEach((btn) => {
        btn.addEventListener("click", () => navigate(btn.dataset.route));
    });
}