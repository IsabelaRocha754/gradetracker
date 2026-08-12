import {initRouter} from "./router.js";

document.addEventListener("DOMContentLoaded", () => {
    const contentEl = document.getElementById("content");
    const navEl = document.querySelector(".main-navigation");
    initRouter(contentEl, navEl);
})