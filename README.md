# WebViewer UI

WebViewer UI sits on top of [WebViewer](https://apryse.com/products/webviewer), a powerful JavaScript-based PDF Library that's part of the [Apryse PDF SDK](https://www.apryse.com). Built in React, WebViewer UI provides a slick out-of-the-box responsive UI that interacts with the core library to view, annotate and manipulate PDFs that can be embedded into any web project.

![WebViewer UI](https://www.pdftron.com/downloads/pl/webviewer-ui.png)

This repo is specifically designed for any users interested in advanced customizations. With the source code access, it gives developers full control to customize & style the UI, build custom controls & logic, integrate into workflows, or build a UI from scratch.

Any approved pull requests made to this repository are merged into WebViewer's internal builds, and can be accessed through the nightly builds.
Any approved pull requests to the master branch will go to WebViewer's [nightly experimental builds](https://www.pdftron.com/nightly/#experimental/) and pull requests to version number branches will go to that version's [nightly stable](https://www.pdftron.com/nightly/#stable/).

Nightly stable and experimental builds can also be downloaded from [WebViewer's NPM package](https://docs.apryse.com/documentation/web/faq/webviewer-nightly-build/#npm).

## Install

```
npm install
```

### Install WebViewer Core Dependencies

The preferred method to install the Core dependencies is to use the [WebViewer NPM package](https://docs.apryse.com/documentation/web/get-started/npm/#1-install-via-npm).

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

See [API documentation](https://docs.apryse.com/api/web/UI.html).

## Contributing

See [contributing](./CONTRIBUTING.md).

## License

See [license](./LICENSE).
![](https://onepixel.pdftron.com/webviewer-ui)


# Fork Updates

**April 3, 2024**
[Apryse Collaboration - Mentions Fix](https://github.com/the-cybernest/the-cybernest/pull/450)

There is an error in the Quill package being included in Webviewer -
`Uncaught (in promise) TypeError: s.domNode.getBoundingClientRect is not a function - quill.js:3013`

It was necessary to fork the `webviewer-ui` source code, and modify the following file: `node_modules/quill/dist/quill.js:3002`.

Old Line:
`if (node instanceof Text) {`

New Line:
`if (node instanceof Text || node.nodeType === Node.TEXT_NODE) {`

The node being sent in was a Text node, but `instanceof` was not catching it. Explicitly checking the `node.nodeType` properly catches the Text node when typing in an `@` to trigger `quill-mentions` and appropriately position the dropdown list of `userData`.

After modifying the source code, run an `npm run build` and copy the `ui` folder to `/public/WebViewer/VERSION/lib/ui` in [`the-cybernest`](https://github.com/the-cybernest/the-cybernest) project.