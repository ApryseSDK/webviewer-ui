import { expect } from 'chai';
import { setupWebViewerInstance, delay } from '../../utils/TestingUtils';

describe('Tab Manager UI Tests', function() {
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

  it('Test closing tab with enabled warning modal', async () => {
    const options = {
      initialDoc: ['https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf', '/base/test/fixtures/pdfs/large-number-annotations.pdf'],
      fullAPI: true,
    };
    const instance = await setupWebViewerInstance(options);
    const { annotationManager } = instance.Core;

    const documentLoadedPromise = new Promise((resolve) => {
      instance.UI.addEventListener('documentLoaded', resolve);
    });
    await documentLoadedPromise;

    const annot = new instance.Core.Annotations.RectangleAnnotation({
      PageNumber: 1,
      X: 50,
      Y: 100,
      Width: 150,
      Height: 100,
    });

    annotationManager.addAnnotation(annot);
    annotationManager.redrawAnnotation(annot);

    instance.UI.TabManager.deleteTab(0);

    await delay(1000);
    const iframeWindow = instance.UI.iframeWindow;  

    const warningModal = iframeWindow.document.querySelector('[aria-label="Close without downloading?"]');
    expect(warningModal, 'Expecting a Warning Modal').to.not.be.null;
  });

  it('Test closing tab with disabled warning modal', async () => {
    const options = {
      initialDoc: ['https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf', '/base/test/fixtures/pdfs/large-number-annotations.pdf'],
      fullAPI: true,
    };
    const instance = await setupWebViewerInstance(options);
    const { annotationManager } = instance.Core;
	instance.UI.disableFeatures([instance.UI.Feature.Download]);
    const documentLoadedPromise = new Promise((resolve) => {
      instance.UI.addEventListener('documentLoaded', resolve);
    });
    await documentLoadedPromise;

    const annot = new instance.Core.Annotations.RectangleAnnotation({
      PageNumber: 1,
      X: 50,
      Y: 100,
      Width: 150,
      Height: 100,
    });

    annotationManager.addAnnotation(annot);
    annotationManager.redrawAnnotation(annot);

    instance.UI.TabManager.deleteTab(0);

    await delay(1000);
    const iframeWindow = instance.UI.iframeWindow;  

    const warningModal = iframeWindow.document.querySelector('[aria-label="Close without downloading?"]');
    expect(warningModal, 'Expecting no Warning Modal should appear').to.be.null;
  });

  it('Export XFDF on beforeTabChanged event', async () => {
    const options = {
      initialDoc: ['/base/test/fixtures/pdfs/VirtualizedAnnotTest.pdf', 'https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf'],
      fullAPI: true,
    };
    const instance = await setupWebViewerInstance(options);
    const { UI } = instance;
    let resultXFDF;
    const documentLoadedPromise = new Promise((resolve) => {
      UI.addEventListener('documentLoaded', resolve);
    });
    await documentLoadedPromise;

    UI.addEventListener('beforeTabChanged', async () => {
      resultXFDF = await instance.Core.documentViewer.getAnnotationManager().exportAnnotations();
    });

    await UI.TabManager.setActiveTab(1);
    await delay(1000);
    expect(resultXFDF).to.not.be.undefined;
  });

  it('Switching between tabs with a big file won\'t cause lag', async () => {
    const options = {
      initialDoc: ['/base/test/fixtures/pdfs/semi-big-file.pdf', 'https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf'],
      fullAPI: true,
    };
    const instance = await setupWebViewerInstance(options);
    const { UI } = instance;

    const documentLoadedPromise = new Promise((resolve) => {
      UI.addEventListener('documentLoaded', resolve);
    });
    await documentLoadedPromise;

    await UI.TabManager.setActiveTab(1);

    await delay(2000);
    const activeTab = UI.TabManager.getActiveTab();
    expect(activeTab.options.filename).to.equal('demo-annotated.pdf');
  });
})
