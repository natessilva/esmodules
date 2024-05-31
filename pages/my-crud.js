import {
  computed,
  getValue,
  observable,
  subscribeMany,
  subEl,
} from "../observable/index.js";

const template = `
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
    shadowRoot.innerHTML = template;
    const people = observable({
      people: [
        { first: "Hans", last: "Emil" },
        { first: "Max", last: "Mustermann" },
        { first: "Roman", last: "Tisch" },
      ],
    });
    const i = observable(0);
    const prefix = observable("");
    const first = observable("");
    const last = observable("");
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

    let prefixEl = shadowRoot.querySelector("input");
    const firstEl = shadowRoot.querySelector("#first");
    const lastEl = shadowRoot.querySelector("#last");
    const selectEl = shadowRoot.querySelector("select");
    const createEl = shadowRoot.querySelector("#create");
    const updateEl = shadowRoot.querySelector("#update");
    const removeEl = shadowRoot.querySelector("#remove");

    this.subs = [
      subEl(prefixEl, "input", () => prefix.set(prefixEl.value)),
      subEl(firstEl, "input", () => first.set(firstEl.value)),
      subEl(lastEl, "input", () => last.set(lastEl.value)),
      subEl(selectEl, "input", () => i.set(selectEl.value)),
      subEl(createEl, "click", () => {
        people.update(({ people }) => {
          people.push({ first: getValue(first), last: getValue(last) });
          return { people };
        });
        i.set(getValue(people).people.length - 1);
      }),
      subEl(updateEl, "click", () =>
        people.update(({ people }) => {
          const person = getValue(selected);
          person.first = getValue(first);
          person.last = getValue(last);
          return { people };
        })
      ),
      subEl(removeEl, "click", () => {
        people.update(({ people }) => {
          const index = people.indexOf(getValue(selected));
          people.splice(index, 1);
          return { people };
        });
        i.update((i) => Math.min(i, getValue(filteredPeople).length - 1));
      }),
      filteredPeople.subscribe((filteredPeople) => {
        selectEl.innerHTML = "";
        filteredPeople.forEach(({ first, last }, i) => {
          const o = document.createElement("option");
          o.value = i;
          o.innerText = `${last}, ${first}`;
          selectEl.appendChild(o);
        });
        selectEl.value = getValue(i);
      }),
      i.subscribe((i) => (selectEl.value = i)),
      selected.subscribe((selected) => {
        first.set(selected?.first ?? "");
        last.set(selected?.last ?? "");
      }),
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
    this.subs.forEach((sub) => {
      return sub();
    });
  }
}

customElements.define("my-crud", MyCrud);
