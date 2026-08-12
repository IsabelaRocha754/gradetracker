// src/views/projects/projects.js
export function renderProjects(root, navigate){
    root.innerHTML = `
    <div class="Projects">
        <h1>Projects</h1>
    </div>
    `;

    root.querySelectorAll("[data-route]").forEach((btn) => {
        btn.addEventListener("click", () => navigate(btn.dataset.route));
    });
}