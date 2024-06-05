import { navigateTo, resource, router } from "../app.js";
import { template } from "./my-new.js";

export class MyItemEdit extends HTMLElement {
  connectedCallback() {
    const route = router.currentRoute();
    if (route == null) {
      return;
    }
    this.innerHTML = template;

    const id = route.params.id;
    const item = resource.get(id);

    const form = this.querySelector("form");

    const nameInput = this.querySelector("#name");
    nameInput.focus();
    nameInput.value = item.name;

    this.querySelector("button").textContent = "Save";

    const submit = (e) => {
      e.preventDefault();

      resource.update({
        id,
        name: nameInput.value,
      });
      navigateTo(`/list/${id}`);
    };
    form.addEventListener("submit", submit);

    this.cleanup = () => {
      form.removeEventListener("submit", submit);
    };
  }

  disconnectedCallback() {
    if (this.cleanup != null) {
      this.cleanup();
    }
  }
}
customElements.define("my-item-edit", MyItemEdit);
