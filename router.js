class Node {
  constructor() {
    this.children = {};
    this.tag = null;
    this.paramChild = null;
    this.paramName = null;
  }
}

export class Router {
  constructor(config) {
    this.root = new Node();

    Object.entries(config).forEach(([path, component]) => {
      this.addRoute(path, component);
    });
  }

  addRoute(path, tag) {
    let node = this.root;
    const segments = path.split("/").filter((segment) => segment.length > 0);

    if (segments.length == 0) {
      node.tag = tag;
      return;
    }

    segments.forEach((segment, index) => {
      if (segment[0] === ":") {
        if (!node.paramChild) {
          node.paramChild = new Node();
          node.paramChild.paramName = segment.slice(1);
        }
        node = node.paramChild;
      } else {
        if (!node.children[segment]) {
          node.children[segment] = new Node();
        }
        node = node.children[segment];
      }

      if (index === segments.length - 1) {
        node.tag = tag;
      }
    });
  }

  findRoute(path) {
    const params = {};
    const segments = path.split("/").filter((segment) => segment.length > 0);
    let node = this.root;

    for (const segment of segments) {
      if (node.children[segment]) {
        node = node.children[segment];
      } else if (node.paramChild) {
        params[node.paramChild.paramName] = segment;
        node = node.paramChild;
      } else {
        return null;
      }
    }

    return node.tag ? { tag: node.tag, params } : null;
  }

  currentRoute() {
    return this.findRoute(location.pathname);
  }
}
