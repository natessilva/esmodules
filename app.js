import { Crud } from "./crud.js";
import { Router } from "./router.js";

export const router = new Router({
  "/": "my-home",
  "/list": "my-list",
  "/list/:id": "my-item",
  "/list/:id/edit": "my-item-edit",
  "/new": "my-new",
  "/bind": "my-bind",
});

export const resource = new Crud();

export let navigateTo = () => {};

document.addEventListener("DOMContentLoaded", async () => {
  const app = document.getElementById("app");

  navigateTo = (path) => {
    history.pushState(null, null, path);
    render(path);
  };

  async function render(path) {
    const route = router.findRoute(path) ?? router.findRoute("/");
    if (route != null) {
      await import(`/pages/${route.tag}.js`);
      app.innerHTML = `<${route.tag}></${route.tag}>`;
    } else {
      console.error("path not found", path);
    }
  }

  window.addEventListener("popstate", () => {
    render(location.pathname);
  });

  document.body.addEventListener("click", (e) => {
    if (e.target.matches("[data-link]")) {
      e.preventDefault();

      const path = new URL(e.target.href).pathname;
      navigateTo(path);
    }
  });

  render(location.pathname);
});
