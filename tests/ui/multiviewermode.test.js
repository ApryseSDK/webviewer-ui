import { setupWebViewerInstance, waitFor, isModularUI } from '../../utils/TestingUtils';
import { expect } from 'chai';

describe('MultiViewerMode UI Tests', function() {
  this.timeout(10000);
  let viewerDiv;

  beforeEach(async () => {
    if (isModularUI() && [
      'Test MultiViewerMode enter/exit APIs',
      'Test MultiViewerMode start/stopTextComparison APIs'
    ].includes(this.ctx.title)) {
      return;
    } // Test doesn't work with Web components
    // Create a new div with an ID and add it to the body before each test
    viewerDiv = document.createElement('div');
    viewerDiv.id = 'viewerDiv';
    document.body.appendChild(viewerDiv);
  });

  afterEach(() => {
    if (isModularUI() && [
      'Test MultiViewerMode enter/exit APIs',
      'Test MultiViewerMode start/stopTextComparison APIs'
    ].includes(this.ctx.title)) {
      return;
    } // Test doesn't work with Web components
    // Clean up the div after each test
    document.body.removeChild(viewerDiv);
  });

  it('Test MultiViewerMode enter/exit APIs', async () => {
    if (isModularUI()) {
      return;
    } // Test doesn't work with Web components
    const options = {
      initialDoc: '/base/test/fixtures/pdfs/demo.pdf',
      fullAPI: true,
    };
    const instance = await setupWebViewerInstance(options);
    const { UI } = instance;
    await new Promise((resolve) => {
      UI.addEventListener('viewerLoaded', resolve);
    });
    const document = UI.iframeWindow.document;
    let documentContainerList = document.querySelectorAll('.DocumentContainer');
    expect(documentContainerList.length).to.equal(1);
    UI.enterMultiViewerMode();
    await new Promise((resolve) => {
      UI.addEventListener('multiViewerReady', resolve);
    });
    documentContainerList = document.querySelectorAll('.DocumentContainer');
    expect(documentContainerList.length).to.equal(2);

    UI.setActiveDocumentViewerKey(2);
    expect(UI.getActiveDocumentViewerKey()).to.equal(2);

    UI.exitMultiViewerMode();
    await waitFor(1000);
    documentContainerList = document.querySelectorAll('.DocumentContainer');
    expect(documentContainerList.length).to.equal(1);

    UI.enterMultiViewerMode();
    await new Promise((resolve) => {
      UI.addEventListener('multiViewerReady', resolve);
    });
    documentContainerList = document.querySelectorAll('.DocumentContainer');
    expect(documentContainerList.length).to.equal(2);
  });

  // FLAKY TEST: https://app.circleci.com/pipelines/github/XodoDocs/webviewer/123258/workflows/d65cdc2d-3e54-40af-af3a-17e31accbb09/jobs/151238/parallel-runs/3?filterBy=FAILED
  // JIRA TICKET: https://apryse.atlassian.net/browse/WVR-7727
  it.skip('Test MultiViewerMode start/stopTextComparison APIs', async () => {
    if (isModularUI()) {
      return;
    } // Test doesn't work with Web components
    const options = {
      initialDoc: '/base/test/fixtures/pdfs/compare-pdfs/compare1.pdf',
      fullAPI: true,
    };
    const instance = await setupWebViewerInstance(options);
    const { UI, Core } = instance;
    await new Promise((resolve) => {
      UI.addEventListener('viewerLoaded', resolve);
    });
    UI.enterMultiViewerMode();
    await new Promise((resolve) => {
      UI.addEventListener('multiViewerReady', resolve);
    });
    const documentViewers = Core.getDocumentViewers();
    documentViewers[1].loadDocument('/base/test/fixtures/pdfs/compare-pdfs/compare2.pdf');
    await new Promise((resolve) => {
      documentViewers[1].addEventListener('documentLoaded', resolve);
    });
    UI.startTextComparison();
    await new Promise((resolve) => {
      UI.addEventListener('compareAnnotationsLoaded', resolve);
    });
    expect(Core.annotationManager.getSemanticDiffAnnotations().length > 0).to.equal(true);
    UI.stopTextComparison();
    expect(Core.annotationManager.getSemanticDiffAnnotations().length).to.equal(0);
  });

  it('Should not crash when notes panel is open before enabling MultiViewerMode', async () => {
    if (isModularUI()) {
      return;
    } // Test doesn't work with Web components
    const instance = await setupWebViewerInstance({});
    instance.UI.openElements(['notesPanel']);
    instance.UI.enterMultiViewerMode();
    await new Promise((resolve) => {
      instance.UI.addEventListener('multiViewerReady', resolve);
    });
    const notesPanelElement = instance.UI.iframeWindow.document.getElementsByClassName('NotesPanel')[0];
    expect(notesPanelElement).to.not.be.null;
  });
});
