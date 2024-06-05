import { subEventListener, writable } from "../observable/index.js";

const template = document.createElement("template");
template.innerHTML = `
  <h1>Home</h1>
  <p>Welcome to the home page!</p>
  <button></button>
`;
const clicked = writable(0);

export class MyHome extends HTMLElement {
  connectedCallback() {
    this.appendChild(template.content.cloneNode(true));
    const button = this.querySelector("button");
    this.subs = [
      subEventListener(button, "click", () => {
        clicked.update((clicked) => clicked + 1);
      }),
      clicked.subscribe((clicked) => {
        button.textContent = `Clicked ${clicked} time${
          clicked == 1 ? "" : "s"
        }`;
      }),
    ];
  }

  disconnectedCallback() {
    this.subs.forEach((sub) => sub());
  }
}
customElements.define("my-home", MyHome);
