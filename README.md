=======

## Diligent Install Notes

After making any changes to the viewer code run

npm run build

Then copy the files from the /build folder to boards-web/Client/libs/assets/WebViewer.6.0.3-1/lib/ui/build in the Boards Web Repo
Increment the '-1' each time new changes are made, and change any references to the web viewer location to point to the new version and delete the old version.

Note: when merging in changes from the official PDFTron webviewer-ui repo you should also update the core version by copying the files from the official version avaliable here:
https://www.pdftron.com/documentation/web/get-started/manually
into the boards web repo.

Note: Be careful to ensure that the core version matches the UI version and also that any changes made in the Client\libs\assets\WebViewer.version directory are redone after replacing the code

Also ensure that the the fonts in boards-web/Client/libs/assets/pdf-fonts are up todate (don't forget to reapply any bug fixes)

## Current Diligent PDFtron patches (as of 6.0.3-1 on Jan 8 2020)

- AnnotationPopup.scss - force the notes popup to be hidden using css
- ErrorModal.js - disable pdftron error reporting to hide the 'network error' message that can display in book-admin due to pdf caching issues
- TouchEventManager.js & enableMomentumScroll.js - add an 'enableMomentumScroll' method so that swipe navigation in director-web doesn't scroll the page navigated to

## Patching new Webviewer versions

I'd recommend that you don't merge this branch into new webviewer branches, because when I tried to merge the 5.x branch into the 6.x branch it broke the pdftron build completely; instead I'd recommend you cherry pick any diligent patches to the new webviewer version (and test each of the diligent patches still function)

# WebViewer UI - v8.1

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
