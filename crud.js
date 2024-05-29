export class Crud {
  constructor() {}

  items = [
    { id: 1, name: "foo" },
    { id: 2, name: "bar" },
  ];

  list = () => this.items;

  get = (id) => this.items.find((i) => i.id == id);

  add = (name) => {
    const id =
      this.items.length == 0 ? 1 : Math.max(...this.items.map((i) => i.id)) + 1;
    this.items.push({ name, id });
    return id;
  };

  update = (item) => {
    const found = this.get(item.id);
    found.name = item.name;
  };

  delete = (id) => {
    this.items = this.items.filter((i) => i.id != id);
  };
}
