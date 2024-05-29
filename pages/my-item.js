import { navigateTo, resource, router } from "../app.js";

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

    const del = this.querySelector("#delete");
    const deleteCallback = () => {
      resource.delete(id);
      navigateTo("/list");
    };
    del.addEventListener("click", deleteCallback);

    this.cleanup = () => {
      del.removeEventListener("click", deleteCallback);
    };
  }

  disconnectedCallback() {
    if (this.cleanup != null) {
      this.cleanup();
    }
  }
}
customElements.define("my-item", MyItem);
