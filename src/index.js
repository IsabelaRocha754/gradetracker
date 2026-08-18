import {initRouter} from "./router.js";
import "./global.css"
import "./components/modal.css"

document.addEventListener("DOMContentLoaded", () => {
    const contentEl = document.getElementById("content");
    const navEl = document.querySelector(".main-navigation");
    initRouter(contentEl, navEl);
})