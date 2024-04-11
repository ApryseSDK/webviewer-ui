import { expect } from 'chai';
import { setupWebViewerInstance, waitFor, triggerKeyboardEvent, triggerKeyboardFocus } from '../../../utils/TestingUtils';

describe('Test Modular UI Tools', function() {
  this.timeout(10000);
  let viewerDiv;
  let instance;
  let originalResizeObserver;

  beforeEach(async () => {
    // Create a new div with an ID and add it to the body before each test
    viewerDiv = document.createElement('div');
    viewerDiv.id = 'viewerDiv';
    document.body.appendChild(viewerDiv);

    originalResizeObserver = window.ResizeObserver;
    window.ResizeObserver = class MockResizeObserver {
      constructor(callback) {
        this.callback = callback;
        this.observations = [];
      }

      observe(target) {
        // Optionally store the target or simulate an observation
        this.observations.push(target);
        // You could invoke the callback here if you want to simulate a resize event
      }

      unobserve(target) {
        // Remove target from observations
        this.observations = this.observations.filter((obs) => obs !== target);
      }

      disconnect() {
        // Clear all observations
        this.observations = [];
      }
    };
  });

  afterEach(async () => {
    // Clean up the div after each test
    document.body.removeChild(viewerDiv);
    await instance.UI.dispose();
    window.ResizeObserver = originalResizeObserver;
  });

  it('should activate the select tool when we select a tool and then press escape', async function() {
    instance = await setupWebViewerInstance({ ui: 'beta' });
    instance.UI.disableFeatures([instance.UI.Feature.LocalStorage]);

    const iframe = document.querySelector('#viewerDiv iframe');
    const annotateRibbonItem = iframe.contentDocument.querySelector('[data-element="toolbarGroup-Annotate"]');
    annotateRibbonItem.click();
    await waitFor(500);
    expect(instance.UI.getToolMode().name).to.equal('AnnotationCreateTextHighlight');
    triggerKeyboardFocus(window);

    // 27 is the key code for ESC
    triggerKeyboardEvent(iframe.contentDocument.body, 27);
    await waitFor(500);
    expect(instance.UI.getToolMode().name).to.equal('AnnotationEdit');
  });

  it('should update the ribbon when we use a hotkey to select a tool placed on a different ribbon', async function() {
    instance = await setupWebViewerInstance({ ui: 'beta' });
    instance.UI.disableFeatures([instance.UI.Feature.LocalStorage]);
    const iframe = document.querySelector('#viewerDiv iframe');
    const annotateRibbonItem = iframe.contentDocument.querySelector('[data-element="toolbarGroup-Annotate"]');
    const shapesRibbonItem = iframe.contentDocument.querySelector('[data-element="toolbarGroup-Shapes"]');

    annotateRibbonItem.click();
    await waitFor(500);

    expect(annotateRibbonItem.classList.contains('active')).to.equal(true);

    triggerKeyboardFocus(window);

    // 79 is the key code for 'o'
    triggerKeyboardEvent(iframe.contentDocument.body, 79);
    await waitFor(500);
    expect(instance.UI.getToolMode().name).to.equal('AnnotationCreateEllipse');
    expect(shapesRibbonItem.classList.contains('active')).to.equal(true);
  });

  it('when the signature and rubber stamp panels are open and we press ESC, the panel gets closed and we set the edit tool', async function() {
    instance = await setupWebViewerInstance({ ui: 'beta' });
    instance.UI.disableFeatures([instance.UI.Feature.LocalStorage]);

    const iframe = document.querySelector('#viewerDiv iframe');
    instance.UI.setToolMode('AnnotationCreateSignature');
    expect(instance.UI.isElementOpen('signatureListPanel')).to.equal(true);
    const insertRibbonItem = iframe.contentDocument.querySelector('[data-element="toolbarGroup-Insert"]');
    expect(insertRibbonItem.classList.contains('active')).to.equal(true);

    triggerKeyboardFocus(window);

    // 27 is the key code for ESC
    triggerKeyboardEvent(iframe.contentDocument.body, 27);
    await waitFor(500);
    expect(instance.UI.getToolMode().name).to.equal('AnnotationEdit');
    expect(instance.UI.isElementOpen('signatureListPanel')).to.equal(false);

    instance.UI.setToolMode('AnnotationCreateRubberStamp');
    expect(instance.UI.isElementOpen('rubberStampPanel')).to.equal(true);

    triggerKeyboardFocus(window);
    triggerKeyboardEvent(iframe.contentDocument.body, 27);
    await waitFor(500);
    expect(instance.UI.getToolMode().name).to.equal('AnnotationEdit');
    expect(instance.UI.isElementOpen('rubberStampPanel')).to.equal(false);
  });

  it('does not close the tools header when pressing E to activate the eraser tool', async function() {
    instance = await setupWebViewerInstance({ ui: 'beta' });
    instance.UI.disableFeatures([instance.UI.Feature.LocalStorage]);

    const iframe = document.querySelector('#viewerDiv iframe');
    const annotateRibbonItem = iframe.contentDocument.querySelector('[data-element="toolbarGroup-Annotate"]');
    annotateRibbonItem.click();
    await waitFor(500);
    expect(instance.UI.getToolMode().name).to.equal('AnnotationCreateTextHighlight');
    triggerKeyboardFocus(window);

    const toolsHeader = iframe.contentDocument.querySelector('[data-element="tools-header"]');
    expect(toolsHeader.classList.contains('closed')).to.equal(false);

    // 69 is the key code for E which is the eraser tool
    triggerKeyboardEvent(iframe.contentDocument.body, 69);
    await waitFor(500);
    expect(instance.UI.getToolMode().name).to.equal('AnnotationEraserTool');

    expect(toolsHeader.classList.contains('closed')).to.equal(false);
  });

  it('should be able to add tool buttons directly into a header without a grouped item', async () => {
    instance = await setupWebViewerInstance({ ui: 'beta' });
    instance.UI.disableFeatures([instance.UI.Feature.LocalStorage]);
    const iframe = document.querySelector('#viewerDiv iframe');
    const viewRibbonItem = iframe.contentDocument.querySelector('[data-element="toolbarGroup-Annotate"]');

    const toolButton = new instance.UI.Components.ToolButton({
      label: 'Rectangle',
      title: 'Rectangle',
      img: 'icon-tool-shape-rectangle',
      toolName: 'AnnotationCreateRectangle',
    });
    const topHeader = instance.UI.getModularHeader('default-top-header');
    topHeader.setItems([...topHeader.getItems(), toolButton]);

    expect(topHeader.getItems().length).to.equal(5);
    expect(topHeader.getItems()[4].label).to.equal('Rectangle');
    viewRibbonItem.click();
    const rectangleButton = iframe.contentDocument.querySelector('[aria-label="Rectangle"]');
    rectangleButton.click();
    expect(instance.Core.documentViewer.getToolMode().name).to.equal('AnnotationCreateRectangle');
  });

  it('should not enabled all tool when Form tool is selected', async () => {
    instance = await setupWebViewerInstance({ ui: 'beta' });

    const iframe = document.querySelector('#viewerDiv iframe');
    iframe.style.width = '1500px';
    iframe.contentDocument.querySelector('.RibbonGroup__moreButton .Button').click();

    await waitFor(500);
    const annotateRibbonItem = iframe.contentDocument.querySelector('[data-element="toolbarGroup-Forms"]');
    annotateRibbonItem.click();

    await waitFor(500);
    iframe.contentDocument.querySelector('.RibbonGroup__moreButton .Button').click();

    const toolsHeader = iframe.contentDocument.querySelectorAll('.RibbonGroup .RibbonItem');
    expect(toolsHeader.length).to.equal(7);

    const reductBtn = iframe.contentDocument.querySelector('[data-element="toolbarGroup-Redact"]');
    expect(reductBtn).to.equal(null);
  });
});