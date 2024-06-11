import { expect } from 'chai';

/* eslint-disable no-unused-expressions */
describe('WebViewer Webcomponent', function() {
  this.timeout(40000);

  let viewerDiv;
  let host;

  beforeEach(async () => {
    // Create a shadow DOM to test the web component in
    host = document.createElement('div');
    host.id = 'host';
    const shadowDom = host.attachShadow({ mode: 'open' });

    viewerDiv = document.createElement('div');
    viewerDiv.id = 'viewerDiv';

    shadowDom.appendChild(viewerDiv);
    document.body.appendChild(host);
  });

  afterEach(() => {
    // Clean up the div after each test
    document.body.removeChild(host);
  });


  it('is correctly instantiated inside another shadow DOM ', async () => {
    const Webviewer = window.WebViewer;
    const webviewerOptions = {
      path: '/base/build',
    };
    const instance = await Webviewer.WebComponent(webviewerOptions, viewerDiv);
    // create a promise that resolves when the viewer loaded event fires
    const UIEvents = instance.UI.Events;
    const documentLoadedPromise = new Promise((resolve) => {
      instance.UI.addEventListener(UIEvents.VIEWER_LOADED, () => {
        resolve();
      });
    });
    await documentLoadedPromise;
  });

  // Test that the instance variable is available on the getInstance method for web component
  it('should return the instance variable', async () => {
    const Webviewer = window.WebViewer;
    const webviewerOptions = {
      path: '/base/build',
    };
    const instance = await Webviewer.WebComponent(webviewerOptions, viewerDiv);
    expect(Webviewer.getInstance(viewerDiv)).to.equal(instance);
  });
});