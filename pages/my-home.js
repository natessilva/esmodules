const template = `
  <h1>Home</h1>
  <p>Welcome to the home page!</p>
`;

export class MyHome extends HTMLElement {
  connectedCallback() {
    this.innerHTML = template;
  }
}
customElements.define("my-home", MyHome);
