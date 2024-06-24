import { expect } from 'chai';
import { setupWebViewerInstance, waitFor } from '../../utils/TestingUtils';
import { createPages, extractXFDF } from '../../../../src/ui/src/helpers/embeddedPrint';

describe('Embedded Print Test', function() {
  this.timeout(25000);
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

  const waitForAnnotationsDrawn = async (annotationManager, annotationsToBeAdded) => {
    const result = await new Promise((resolve) => {
      const onAnnotationsDrawn = (annotations) => {
        annotationManager.removeEventListener('annotationsDrawn', onAnnotationsDrawn);
        resolve(annotations);
      };
      annotationManager.addEventListener('annotationsDrawn', onAnnotationsDrawn);
      annotationManager.addAnnotations(annotationsToBeAdded);
    });
    return result;
  };

  class MyAnnot extends Core.Annotations.CustomAnnotation {
    constructor() {
      super('myannot');
      this.Subject = 'MyAnnot';
      this._myValue = 0;
    }
    get MyValue() {
      return this._myValue;
    }
    set MyValue(val) {
      this._myValue = val;
    }
    draw(ctx) {
      ctx.save();
      ctx.fillStyle = '#FF0000';
      ctx.fillRect(this.X, this.Y, this.Width, this.Height);
      ctx.restore();
    }
    serialize() {
      this.setCustomData('myValue', this._myValue);
      return super.serialize.apply(this, arguments);
    }
    deserialize() {
      super.deserialize.apply(this, arguments);
      this._myValue = this.getCustomData('myValue');
    }
  }

  it('embedded print should return document object with specified pages', async () => {
    const options = {
      initialDoc: '/base/test/fixtures/pdfs/PDFTRON_about.pdf'
    };
    instance = await setupWebViewerInstance(options);
    const { documentViewer, annotationManager } = instance.Core;
    const documentLoadedPromise = new Promise((resolve) => {
      instance.UI.addEventListener('documentLoaded', resolve);
    });
    await documentLoadedPromise;

    const currentView = false;
    const pagesToPrint = [2, 3, 4, 5];
    const includeAnnotations = false;

    const printingOptions = {
      isCurrentView: currentView,
      includeAnnotations: includeAnnotations,
      shouldFlatten: false
    };
    const document = await createPages(documentViewer.getDocument(), annotationManager, pagesToPrint, printingOptions);
    expect(document.getPageCount()).to.equal(4);
  });

  it('embedded print for office doc should return a PDF', async () => {
    const options = {
      initialDoc: '/base/test/fixtures/office/long-template.docx'
    };
    instance = await setupWebViewerInstance(options);
    const { documentViewer, annotationManager } = instance.Core;
    const documentLoadedPromise = new Promise((resolve) => {
      instance.UI.addEventListener('documentLoaded', resolve);
    });
    await documentLoadedPromise;

    const currentView = false;
    const pagesToPrint = [2, 3, 4, 5];
    const includeAnnotations = false;

    const printingOptions = {
      isCurrentView: currentView,
      includeAnnotations: includeAnnotations,
      shouldFlatten: false
    };
    const document = await createPages(documentViewer.getDocument(), annotationManager, pagesToPrint, printingOptions);
    expect(document.getPageCount()).to.equal(4);
	expect(document.getType()).to.equal('pdf');
  });

  it('embedded print should return document object with specified pages and annotations', async () => {
    const options = {
      initialDoc: '/base/test/fixtures/pdfs/multiple-blank.pdf'
    };
    instance = await setupWebViewerInstance(options);
    const { annotationManager, Annotations } = instance.Core;
    const documentLoadedPromise = new Promise((resolve) => {
      instance.UI.addEventListener('documentLoaded', resolve);
    });
    await documentLoadedPromise;

    const annot = new Annotations.RectangleAnnotation({
      PageNumber: 2,
      X: 50,
      Y: 100,
      Width: 150,
      Height: 100,
    });
    waitForAnnotationsDrawn(annotationManager, [annot]);

    const pagesToPrint = [2];
    const includeAnnotations = true;

    const xfdfString = await extractXFDF(annotationManager, pagesToPrint, includeAnnotations);
    expect(xfdfString).to.contain('subject="Rectangle"');
  });

  it('embedded print should return document object with specified pages and custom annotations', async () => {
    const options = {
      initialDoc: '/base/test/fixtures/pdfs/multiple-blank.pdf'
    };
    instance = await setupWebViewerInstance(options);
    const { annotationManager } = instance.Core;
    const documentLoadedPromise = new Promise((resolve) => {
      instance.UI.addEventListener('documentLoaded', resolve);
    });
    await documentLoadedPromise;

    const myAnnot = new MyAnnot();
    myAnnot.X = 50;
    myAnnot.Y = 50;
    myAnnot.PageNumber = 2;
    myAnnot.Width = 100;
    myAnnot.Height = 25;
    myAnnot.MyValue = 5;

    waitForAnnotationsDrawn(annotationManager, [myAnnot]);
    const pagesToPrint = [2];
    const includeAnnotations = true;

    const xfdfString = await extractXFDF(annotationManager, pagesToPrint, includeAnnotations);
    expect(xfdfString).to.contain('subject="MyAnnot"');
  });

  it('Embedded print enabled, ensure xod files fallback to raster print options', async () => {
    const options = {
      initialDoc: '/base/test/fixtures/xods/1.5/webviewer-demo-annotated.xod',
    };
    instance = await setupWebViewerInstance(options);
    await waitFor(300);
    instance.UI.useEmbeddedPrint();
    await waitFor(200);
    instance.UI.openElements(['printModal']);
    await waitFor(200);
    const element = instance.UI.iframeWindow.document.querySelector('[data-element="printQuality"]');
    expect(element).to.not.be.null;
  });
});