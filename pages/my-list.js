import { resource } from "../app.js";

const template = `
  <ul>
  </ul>

  <a href="/new" data-link>Create new!</a>
`;

const itemTemplate = document.createElement("template");
itemTemplate.innerHTML = `
  <li>
      <a data-link></a>
  </li>
`;

export class MyList extends HTMLElement {
  connectedCallback() {
    this.innerHTML = template;
    const ul = this.querySelector("ul");

    const items = resource.list();

    items.forEach((i) => {
      const instance = document.importNode(itemTemplate.content, true);
      const a = instance.querySelector("a");
      a.innerText = i.name;
      a.href = `/list/${i.id}`;
      ul.appendChild(instance);
    });
  }
}
customElements.define("my-list", MyList);
