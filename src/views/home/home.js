// src/views/home/home.js
export function renderHome(root, navigate){
    root.innerHTML = `
    <div class="home">
        <h1>Stats</h1>
        <button data-route="/projects">Projects</button>
        <button data-route="/planner">Planner</button>
        <button data-route="/grades">Grades</button>
    </div>
    `;

    root.querySelectorAll("[data-route]").forEach((btn) => {
        btn.addEventListener("click", () => navigate(btn.dataset.route));
    });
}