# odin-todo-list

## Description

  This project is a simple to do list project. It is part of [The Odin Project](https://www.theodinproject.com/). At the time of writing, link for this particular project is [Project: Todo List](https://www.theodinproject.com/lessons/node-path-javascript-todo-list).

## Working & Structure

This project uses HTML, CSS & JS for front end & JS for backend. webpack package as well as NPM for various NPM packages are required for it to work properly. It consists of a `src` directory containing project source code. `package.json` file contain list of required NPM modules & their versions. This file can also be used to download & install packages elsewhere where this project is cloned. `webpack.common.js`, `webpack.dev.js` & `webpack.prod.js` files contain webpack related configurations. `index.js` is entry point for this project. This project uses `ES6` modules. `index.js` is used for communicating directly with modules. Other than that, `EventBus.js` is used for communicating between modules without the need of `index.js` as a mediator. `index.js` controls the general flow of whole project, `template.html` file contains HTML which does not need to be dynamic. There is a `styles` directory in root which contains CSS related files. Fonts are put up `assets` directory. `projects.js` contains logic for projects & `tasks.js` contains logic for tasks. `projectDispaly.js` & `taskDisplay.js` contain code facilitating in displaying projects & tasks related content as well as for generation of related DOM content. `ui.js` is used to show general UI related content Which is not specific to projects or tasks. `validation.js` is used to various validations on form input, form submission etc.

For debugging of webpack project on live server, webpack dev server package is installed via NPM. it can be started via terminal using:

    npm run dev

For bundling project, use:

    npm run build

Dev dependencies will not be included in final project & can be specified in webpack config file. In same file, dev & production modes can be set. After any change to related webpack config files(not talking about source code files in src directory), webpack dev server needs to be restarted before any changes to take effect if its running already.

## Importing Project

For importing this project, don't copy `node_modules` . This is why `package.json` file is so useful. It keep tracks of required packages & their versions. You just need source code, webpack config files & `package.json` file pre configured. Though change it according to your needs like switching between dev & production modes. To install all dependencies specified in `package.json`, use following in project root where `package.json` is present:

    npm install

## Custom NPM Script commands

- `npm run dev`: Compiles the project in development mode using Webpack.
- `npm run checkout-and-merge`: to change branch and sync your changes from main so that you’re ready to deploy.
- `npm run build`: Compiles the project in production mode using Webpack.
- `npm run commit` Add output directory & commit changes to git.
- `npm run deploy`: Deploy the project on github pages.

## Thoughts

This project introduced two new concepts by their sheer need. One was `EventBus` npm package. It is already included in webpack. In Node.js, an event bus is an implementation of the publisher/subscriber (pub/sub) pattern used for inter-component communication and decoupling. It allows different parts of an application to communicate with each other without having direct dependencies, promoting a more modular and maintainable architecture.
 This was extremely helpful as only relying on `index.html` for getting data to & from modules was not cutting it in this project. Other quite useful concept was [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController). It allowed to remove previous listeners if they needed to be create again any time during program. Thus no need to create listeners on start of program necessarily.

## Third-Party Licenses

This project uses third party components. For details, see [licenses/README.md](licenses/README.md).
