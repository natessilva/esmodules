import { navigateTo, resource } from "../app.js";
import { subEl } from "../observable/index.js";

export const template = `
  <form>
    <input type="text" name="name" id="name" autofocus required/>
    <button type="submit">Create</button>
  </form>
`;

export class MyNew extends HTMLElement {
  connectedCallback() {
    this.innerHTML = template;

    const nameInput = this.querySelector("#name");
    nameInput.focus();

    this.cleanup = subEl(this.querySelector("form"), "submit", (e) => {
      e.preventDefault();

      const name = nameInput.value;
      resource.add(name);
      navigateTo(`/list`);
    });
  }

  disconnectedCallback() {
    if (this.cleanup != null) {
      this.cleanup();
    }
  }
}

customElements.define("my-new", MyNew);
