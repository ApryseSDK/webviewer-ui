# WebViewer UI 

WebViewer UI sits on top of [WebViewer](https://www.pdftron.com/webviewer), a powerful JavaScript-based PDF Library that's part of the [PDFTron PDF SDK](https://www.pdftron.com). Built in React, WebViewer UI provides a slick out-of-the-box responsive UI that interacts with the core library to view, annotate and manipulate PDFs that can be embedded into any web project.

![WebViewer UI](https://www.pdftron.com/downloads/pl/webviewer-ui.png)

This repo is specifically designed for any users interested in advanced customizations. With the source code access, it gives developers full control to customize & style the UI, build custom controls & logic, integrate into workflows, or build a UI from scratch.

Any approved pull requests made to this repository are merged into WebViewer's internal builds, and can be accessed through the nightly builds. 
Any approved pull requests to the master branch will go to WebViewer's [nightly experimental builds](https://www.pdftron.com/nightly/#experimental/) and pull requests to version number branches will go to that version's [nightly stable](https://www.pdftron.com/nightly/#stable/).

Nightly stable and experimental builds can also be downloaded from [WebViewer's NPM package](https://www.pdftron.com/documentation/web/faq/webviewer-nightly-build/#npm).

## Install

```
npm install
```

### Install WebViewer Core Dependencies

The preferred method to install the Core dependencies is to use the [WebViewer NPM package](https://www.pdftron.com/documentation/web/get-started/npm/#1-install-via-npm).

Once installed, copy the Core folder into the path being used by the viewer for its dependencies (/lib by default).

## Run

```
npm start
```

## Build

```
npm run build
```

## Troubleshooting

If you are using NPM version 7 or higher, you may get an error indicating an issue with the dependency tree. There are two possible solutions for this:
- Downgrade your version of Node to v14, which uses NPM version 6. 
- When running `npm install` add the flag `--legacy-peer-deps`. You can read more about this flag in this [Stack Overflow post](https://stackoverflow.com/questions/66239691/what-does-npm-install-legacy-peer-deps-do-exactly-when-is-it-recommended-wh).

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
