# esmodules

This repo is an example of building a web application in with vanilla JS, ES Modules, and Web Components. A live demo can be found at [esmodules.netlify.app](https://esmodules.netlify.app).

## SPA Routing

A very simple example SPA router is implemented in router.js. A singleton is exported from app.js. All a tags with a `data-link` attribute set will have their clicks hijacked and will use `navigateTo` to navigate to one of those routes.

## Web Components

Each of the pages is a Web Component and gets lazily imported and rendered on navigation. Therein lies several examples of lifecylcle hooks, DOM manipulation and event listeners.

## CRUD example

An example of common CRUD operations and shared state management is implemented in crud.js. A singleton is exported from app.js. Several of the pages will use this singleton to render and manipulate the shared state

## Is this a good idea?

TBD lol. It's amazing what you can build on the web these days with little or even no external dependancies 🤩
