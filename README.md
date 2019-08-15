# WebViewer UI - v5.2

WebViewer UI sits on top of [WebViewer](https://www.pdftron.com/webviewer), a powerful JavaScript-based PDF Library that's part of the [PDFTron PDF SDK](https://www.pdftron.com). Built in React, WebViewer UI provides a slick out-of-the-box responsive UI that interacts with the core library to view, annotate and manipulate PDFs that can be embedded into any web project.

![WebViewer UI](https://www.pdftron.com/downloads/pl/webviewer-ui.png)

This repo is specifically designed for any users interested in advanced customizations. With the source code access, it gives developers full control to customize & style the UI, build custom controls & logic, integrate into workflows, or build a UI from scratch.

## Install

```
npm install
npm run download-webviewer
```

## Run

```
npm start
```

## Build

```
npm run build
```

## Project structure

```
src/
  apis/            - APIs exposed in myWebViewer.getInstance()
  components/      - React components
  constants/       - JavaScript or CSS constants
  core/            - APIs from the Core
  event-listeners/ - Listeners for the Core events
  helpers/         - Reused functions
  redux/           - Redux files for state managing
  lib/             - Lib folder created upon npm install, used for dev testing only
```

## API documentation

See [API documentation](https://www.pdftron.com/documentation/web/guides/ui/apis).

## Contributing

See [contributing](./CONTRIBUTING.md).

## License

See [license](./LICENSE).
![](https://onepixel.pdftron.com/webviewer-ui)
