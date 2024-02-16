import { expect } from 'chai';
import { setupWebViewerInstance, simulateClick, delay } from '../../utils/TestingUtils';


describe('Page Redaction', function() {
  this.timeout(10000);
  let viewerDiv;

  beforeEach(async () => {
    // Create a new div with an ID and add it to the body before each test
    viewerDiv = document.createElement('div');
    viewerDiv.id = 'viewerDiv';
    document.body.appendChild(viewerDiv);
  });

  afterEach(() => {
    // Clean up the div after each test
    document.body.removeChild(viewerDiv);
  });

  it('creates a page redaction annotation with the right width/height for a document with rotation of 90', async () => {
    const options = {
      initialDoc: '/base/test/fixtures/pdfs/scanned_doc.pdf',
      fullAPI: true,
      enableRedaction: true,
    };
    const testOptions = {
      options,
      rotationExpected: 90,
      documentWidthExpected: 612,
      documentHeightExpected: 792,
    };
    await setupAndCreatePageRedaction(testOptions);
  });

  it('creates a page redaction annotation with the right width/height for a document with rotation of 0', async () => {
    const options = {
      initialDoc: '/base/test/fixtures/pdfs/blank.pdf',
      fullAPI: true,
      enableRedaction: true,
    };
    const testOptions = {
      options,
      rotationExpected: 0,
      documentWidthExpected: 612,
      documentHeightExpected: 792,
    };
    await setupAndCreatePageRedaction(testOptions);
  });

  it(`Should be able to apply redaction when UI is loaded`, async function() {
    // on load WV will get file attachments and page labels, these operation can cause problems to other operations (like redaction)
    const options = {
      initialDoc: '/base/test/fixtures/pdfs/demo-redaction.pdf',
      fullAPI: true,
      enableRedaction: true,
    };
    const instance = await setupWebViewerInstance(options);
  
    const documentLoadedPromise = new Promise((resolve) => {
      instance.UI.addEventListener('documentLoaded', resolve);
    });
    await documentLoadedPromise;
  
    const docViewer = instance.Core.documentViewer;
    const annotManager = docViewer.getAnnotationManager();
    const redactionAnnot = annotManager.getAnnotationsList().filter(a => a instanceof instance.Core.Annotations.RedactionAnnotation)    
    await annotManager.applyRedactions(redactionAnnot);

    expect(annotManager.getAnnotationsList().length).to.equal(1);

    // check that the redacted text doesn't exist
    const pageText = await new Promise((resolve) => {
      docViewer.getDocument().loadPageText(1, resolve);
    });
    expect(pageText.includes('powerful document functionality')).to.equal(false);
  });
});

async function setupAndCreatePageRedaction({ options, rotationExpected, documentWidthExpected, documentHeightExpected }) {
  const instance = await setupWebViewerInstance(options);
  const { documentViewer, annotationManager } = instance.Core;

  const documentLoadedPromise = new Promise((resolve) => {
    instance.UI.addEventListener('documentLoaded', resolve);
  });
  await documentLoadedPromise;

  instance.UI.setToolbarGroup('toolbarGroup-Redact');

  const iframe = instance.UI.iframeWindow;
  const pageRedactionButton = iframe.document.querySelector('[data-element="pageRedactionToolGroupButton"]');
  simulateClick(pageRedactionButton);
  await delay(100);

  const addMarkButton = iframe.document.querySelector('[data-element="modalMarkRedactButton"]');
  simulateClick(addMarkButton);
  await delay(100);

  const document = documentViewer.getDocument();
  const pageInfo = document.getPageInfo(1);
  const { width: documentWidth, height: documentHeight } = pageInfo;
  expect(documentWidth).to.equal(documentWidthExpected);
  expect(documentHeight).to.equal(documentHeightExpected);

  const rotation = document.getPageRotation(1);
  expect(rotation).to.equal(rotationExpected);

  const annotations = annotationManager.getAnnotationsList();
  expect(annotations.length).to.equal(1);
  const redactionAnnotation = annotations[0];

  if (rotationExpected === 90) {
    expect(redactionAnnotation.Width).to.equal(documentHeight);
    expect(redactionAnnotation.Height).to.equal(documentWidth);
  } else {
    expect(redactionAnnotation.Width).to.equal(documentWidth);
    expect(redactionAnnotation.Height).to.equal(documentHeight);
  }
}
