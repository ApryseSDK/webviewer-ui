
# Uniwise

This is a forked repo of the PDFtron webviewer ui with changes that customise the functionality to fit our [Marking tool](https://github.com/UNIwise/assessment-frontend) functionality.

## Deploying
Create a release with the correct semantic versioning. This will publish a new NPM package to `@uniwise/webviewer-ui` with the `.github/workflows/deploy.yaml` workflow.

## Installing
Install package the package and copy static files to the publicly served folder for a react application

```sh 
yarn add @uniwise/webviewer-ui
cp -r node_modules/@uniwise/webviewer-ui public/static/pdftron/ui
```

## Developing
To help with merging, we keep track of changes from PR's in [Wiseflow_PDFtron.docs](https://uniwise1.sharepoint.com/:w:/r/sites/uniwise/_layouts/15/doc.aspx?sourcedoc=%7B31449df0-0514-41ef-adc2-aaedfb35d8e1%7D&action=edit&cid=76807666-6e9a-4a89-a296-9b424fbfece6)

## Translations
We have set up a webhook for POEditor to automatically check for updates to the `i18n/translation-en.json` on the `10.0-wf` branch. When changes are pushed to this branch with changes to the english translation file, changes are automatically updated in POEditor.

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
