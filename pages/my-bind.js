const template = `
  <label for="name">Name:</label>
  <input type="text" id="name" placeholder="Enter a name here"/>
  <hr />
  <h1>Hello !</h1>
`;

export class MyBind extends HTMLElement {
  connectedCallback() {
    this.innerHTML = template;
    const input = this.querySelector("#name");
    const h = this.querySelector("h1");

    const onInput = (e) => {
      h.innerText = `Hello ${e.target.value}!`;
    };
    input.addEventListener("input", onInput);

    this.cleanup = () => {
      input.removeEventListener("input", onInput);
    };
  }

  disconnectedCallback() {
    if (this.cleanup != null) {
      this.cleanup();
    }
  }
}

customElements.define("my-bind", MyBind);
