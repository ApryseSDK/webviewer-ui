import { expect } from 'chai';
import { setupWebViewerInstance, simulateMouse, waitFor } from '../../../utils/TestingUtils';

describe('Test Modular UI Panels on mobiles', function() {
  this.timeout(10000);
  let viewerDiv;
  let instance;
  let originalResizeObserver;

  beforeEach(async () => {
    // Create a new div with an ID and add it to the body before each test
    viewerDiv = document.createElement('div');
    viewerDiv.id = 'viewerDiv';
    document.body.appendChild(viewerDiv);
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

  describe('Mobile Panels basic features', () => {
    it('should open the panel in the correct size according to the selected tool', async () => {
      instance = await setupWebViewerInstance({ ui: 'beta' });
      instance.UI.disableFeatures([instance.UI.Feature.LocalStorage]);

      const getElementByDataElement = (elementSelector) => {
        return iframe.contentDocument.querySelector(`[data-element="${elementSelector}"]`);
      };
      const iframe = document.querySelector('#viewerDiv iframe');
      iframe.style.width = '430px';
      iframe.style.height = '932px';

      // Adding a timeout to wait for the iframe to be resized
      setTimeout(async () => {
        // Assertions or further actions after the iframe width change
        const ribbonGroupDropdown = iframe.contentDocument.querySelector('[data-element="default-ribbon-groupDropdown"] button');
        ribbonGroupDropdown.click();
        await waitFor(500);
        const insertRibbonItem = getElementByDataElement('dropdown-item-toolbarGroup-Insert');
        insertRibbonItem.click();
        await waitFor(500);
        expect(instance.UI.getToolMode().name).to.equal('AnnotationCreateRubberStamp');
        const mobilePanelWrapperForRubberStamp = iframe.contentDocument.querySelector('[data-element="MobilePanelWrapper"]');
        // The default size of the rubber stamp mobile panel is 'half-size'
        expect(mobilePanelWrapperForRubberStamp.classList.contains('half-size')).to.equal(true);
        // The default size of the signature mobile panel is 'small-size'
        instance.UI.setToolMode('AnnotationCreateSignature');
        await waitFor(500);
        const mobilePanelWrapperForSignature = iframe.contentDocument.querySelector('[data-element="MobilePanelWrapper"]');
        expect(mobilePanelWrapperForSignature.classList.contains('small-size')).to.equal(true);
        instance.UI.setToolMode('AnnotationCreateRectangle');
        await waitFor(500);
        const stylePanelToggleButton = iframe.contentDocument.querySelector('[data-element="stylePanelToggle"]');
        stylePanelToggleButton.click();
        await waitFor(1000);
        const mobilePanelWrapperForRectangle = iframe.contentDocument.querySelector('[data-element="MobilePanelWrapper"]');
        expect(mobilePanelWrapperForRectangle.classList.contains('half-size')).to.equal(true);
      }, 1000);
    });

    it('should have a tool set when selecting a ribbon from the dropdown', async () => {
      instance = await setupWebViewerInstance({ ui: 'beta' });
      instance.UI.disableFeatures([instance.UI.Feature.LocalStorage]);
      const iframe = document.querySelector('#viewerDiv iframe');
      iframe.style.width = '430px';
      iframe.style.height = '932px';

      // Adding a timeout to wait for the iframe to be resized
      setTimeout(async () => {
        const ribbonGroupDropdown = iframe.contentDocument.querySelector('[data-element="default-ribbon-groupDropdown"] button');
        ribbonGroupDropdown.click();
        await waitFor(500);
        const insertRibbonItem = iframe.contentDocument.querySelector('[data-element="dropdown-item-toolbarGroup-Insert"]');
        insertRibbonItem.click();
        await waitFor(500);
        expect(instance.UI.getToolMode().name).to.equal('AnnotationCreateRubberStamp');
        await waitFor(500);
        const annotateRibbonItem = iframe.contentDocument.querySelector('[data-element="dropdown-item-toolbarGroup-Annotate"]');
        annotateRibbonItem.click();
        await waitFor(500);
        expect(instance.UI.getToolMode().name).to.equal('AnnotationCreateTextHighlight');
        insertRibbonItem.click();
        await waitFor(500);
        expect(instance.UI.getToolMode().name).to.equal('AnnotationCreateRubberStamp');
      });
    });
  });

  describe('Test Rubber Stamp Panel', () => {
    it('should keep the tools header open after place a rubber stamp in the document', async () => {
      instance = await setupWebViewerInstance({ fullAPI: true, ui: 'beta' });
      instance.UI.disableFeatures([instance.UI.Feature.LocalStorage]);
      const iframe = document.querySelector('#viewerDiv iframe');
      const docViewer = instance.Core.documentViewer;
      iframe.style.width = '430px';
      iframe.style.height = '932px';

      // Adding a timeout to wait for the iframe to be resized
      setTimeout(async () => {
        const ribbonGroupDropdown = iframe.contentDocument.querySelector('[data-element="default-ribbon-groupDropdown"]');
        ribbonGroupDropdown.click();
        await waitFor(500);
        const insertRibbonItem = iframe.contentDocument.querySelector('[data-element="dropdown-item-toolbarGroup-Insert"]');
        insertRibbonItem.click();
        await waitFor(500);
        expect(instance.UI.getToolMode().name).to.equal('AnnotationCreateRubberStamp');
        await waitFor(1000);
        expect(iframe.contentDocument.querySelector('[data-element="rubberStampPanel"]')).to.not.be.null;

        const mobilePanelWrapper = iframe.contentDocument.querySelector('.MobilePanelWrapper');
        // The default size of the rubber stamp mobile panel is 'half-size'
        expect(mobilePanelWrapper.classList.contains('half-size')).to.equal(true);

        const firstStamp = iframe.contentDocument.querySelectorAll('.rubber-stamp')[0];
        firstStamp.click();
        await waitFor(500);
        // When a stamp is selected, the panel should be collapsed to 'small-size'
        expect(mobilePanelWrapper.classList.contains('small-size')).to.equal(true);
        const viewerElement = docViewer.getViewerElement();
        const { mouseMove, mouseDown, mouseUp } = simulateMouse(viewerElement);

        mouseMove({ x: 100, y: 200 });
        mouseDown({ x: 100, y: 200 });
        mouseUp({ x: 100, y: 200 });

        await waitFor(1000);
        const toolsHeader = iframe.contentDocument.querySelector('[data-element="tools-header"]');
        expect(toolsHeader.classList.contains('closed')).to.equal(false);
      });
    });
  });
});