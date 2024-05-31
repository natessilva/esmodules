import { navigateTo, resource, router } from "../app.js";
import { subEl } from "../observable/index.js";

export const template = `
  <p></p>
  <a data-link id="edit">Edit</a>
  <button id="delete">Delete</button>
`;

export class MyItem extends HTMLElement {
  connectedCallback() {
    const route = router.currentRoute();
    if (route == null) {
      return;
    }

    this.innerHTML = template;
    const p = this.querySelector("p");

    const id = route.params.id;
    const item = resource.get(id);
    p.innerText = item.name;

    this.querySelector("#edit").href = `/list/${id}/edit`;

    this.cleanup = subEl(this.querySelector("#delete"), "click", () => {
      resource.delete(id);
      navigateTo("/list");
    });
  }

  disconnectedCallback() {
    if (this.cleanup != null) {
      this.cleanup();
    }
  }
}
customElements.define("my-item", MyItem);
