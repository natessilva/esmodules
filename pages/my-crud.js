import {
  computed,
  writable,
  subEventListener,
  subscribeMany,
} from "../observable/index.js";

const template = document.createElement("template");
template.innerHTML = `
<style>
* {
    font-family: inherit;
    font-size: inherit;
}

input {
    display: block;
    margin: 0 0 0.5em 0;
}

select {
    float: left;
    margin: 0 1em 1em 0;
    width: 14em;
}

.buttons {
    clear: both;
}
</style>
<input placeholder="filter prefix" id="prefix" />

<select size=5>
</select>

<label><input placeholder="first" id="first"/></label>
<label><input placeholder="last" id="last"/></label>

<div class="buttons">
	<button id="create">create</button>
	<button id="update">update</button>
	<button id="remove">delete</button>
</div>
`;

class MyCrud extends HTMLElement {
  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(template.content.cloneNode(true));

    const people = writable({
      people: [
        { first: "Hans", last: "Emil" },
        { first: "Max", last: "Mustermann" },
        { first: "Roman", last: "Tisch" },
      ],
    });
    const i = writable(0);
    const prefix = writable("");
    const first = writable("");
    const last = writable("");
    const filteredPeople = computed([prefix, people], ([prefix, { people }]) =>
      prefix
        ? people.filter((person) => {
            const name = `${person.last}, ${person.first}`;
            return name.toLowerCase().startsWith(prefix.toLowerCase());
          })
        : people.slice()
    );
    const selected = computed([i, filteredPeople], ([i, filteredPeople]) =>
      filteredPeople[i] ? filteredPeople[i] : null
    );

    let prefixEl = shadowRoot.querySelector("#prefix");
    const firstEl = shadowRoot.querySelector("#first");
    const lastEl = shadowRoot.querySelector("#last");
    const selectEl = shadowRoot.querySelector("select");
    const createEl = shadowRoot.querySelector("#create");
    const updateEl = shadowRoot.querySelector("#update");
    const removeEl = shadowRoot.querySelector("#remove");

    this.subs = [
      // listen for DOM interaction. Update variables
      subEventListener(prefixEl, "input", () => prefix.set(prefixEl.value)),
      subEventListener(firstEl, "input", () => first.set(firstEl.value)),
      subEventListener(lastEl, "input", () => last.set(lastEl.value)),
      subEventListener(selectEl, "input", () => i.set(selectEl.value)),
      subEventListener(createEl, "click", () => {
        people.update(({ people }) => {
          people.push({ first: first.get(), last: last.get() });
          return { people };
        });
        i.set(people.get().people.length - 1);
      }),
      subEventListener(updateEl, "click", () =>
        people.update(({ people }) => {
          const person = selected.get();
          person.first = first.get();
          person.last = last.get();
          return { people };
        })
      ),
      subEventListener(removeEl, "click", () => {
        people.update(({ people }) => {
          const index = people.indexOf(selected.get());
          people.splice(index, 1);
          return { people };
        });
        i.update((i) => Math.min(i, filteredPeople.get().length - 1));
      }),
      // listen for variable changes. Update DOM
      selected.subscribe((selected) => {
        first.set(selected?.first ?? "");
        last.set(selected?.last ?? "");
      }),
      filteredPeople.subscribe((filteredPeople) => {
        selectEl.innerHTML = "";
        filteredPeople.forEach(({ first, last }, i) => {
          const o = document.createElement("option");
          o.value = i;
          o.textContent = `${last}, ${first}`;
          selectEl.appendChild(o);
        });
        selectEl.value = i.get();
      }),
      i.subscribe((i) => (selectEl.value = i)),
      first.subscribe((first) => (firstEl.value = first)),
      last.subscribe((last) => (lastEl.value = last)),
      subscribeMany(
        [first, last],
        ([first, last]) => (createEl.disabled = !first || !last)
      ),
      subscribeMany(
        [first, last, selected],
        ([first, last, selected]) =>
          (updateEl.disabled = !first || !last || !selected)
      ),
      selected.subscribe((selected) => (removeEl.disabled = !selected)),
    ];
  }

  disconnectedCallback() {
    this.subs.forEach((sub) => sub());
  }
}

customElements.define("my-crud", MyCrud);
