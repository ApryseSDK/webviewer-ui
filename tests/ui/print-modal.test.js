import { setupWebViewerInstance, waitFor } from '../../utils/TestingUtils';
import { expect } from 'chai';

/* eslint-disable no-unused-expressions */
describe('Test Print Modal', function() {
  this.timeout(20000);

  let viewerDiv;
  let instance;

  beforeEach(async () => {
    // Create a new div with an ID and add it to the body before each test
    viewerDiv = document.createElement('div');
    viewerDiv.id = 'viewerDiv';
    document.body.appendChild(viewerDiv);
  });

  afterEach(async () => {
    // Clean up the div after each test
    document.body.removeChild(viewerDiv);
    await instance.UI.dispose();
  });


  it('ensure that disabling options in Pages to Print doesn\'t crash', async () => {
    const options = {
      initialDoc: '/base/test/fixtures/pdfs/blank.pdf',
    };
    instance = await setupWebViewerInstance(options);
    await waitFor(300);
    instance.UI.disableElements(['allPagesPrintOption', 'currentPagePrintOption']);
    instance.UI.openElements(['printModal']);
    await waitFor(100);
    const element = instance.UI.iframeWindow.document.querySelector('[data-element="printModal"]');
    expect(element).to.not.be.null;
  });
});