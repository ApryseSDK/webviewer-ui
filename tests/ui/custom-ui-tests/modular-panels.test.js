import { expect } from 'chai';
import { setupWebViewerInstance, waitFor } from '../../../utils/TestingUtils';

describe('Test Modular UI Panels APIs', function() {
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

  describe('Test Panels APIs', () => {
    it('It should be able to add Panel', async () => {
      instance = await setupWebViewerInstance({}, true);
      instance.UI.addPanel({
        dataElement: 'myNewOutlinesPanel',
        render: instance.UI.Panels.OUTLINE,
        location: 'left',
      });
      const panelList = instance.UI.getPanels();
      expect(panelList.length).to.equal(1);
    });
    it('It should be able to set Panels', async () => {
      instance = await setupWebViewerInstance({}, true);
      instance.UI.addPanel({
        dataElement: 'myNewOutlinesPanel',
        render: instance.UI.Panels.OUTLINE,
        location: 'left',
      });
      const panelList = instance.UI.getPanels();
      expect(panelList.length).to.equal(1);
      instance.UI.setPanels([]);
      const newPanelList = instance.UI.getPanels();
      expect(newPanelList.length).to.equal(0);
    });
    it('It should be able to get Panels', async () => {
      instance = await setupWebViewerInstance({}, true);
      instance.UI.addPanel({
        dataElement: 'myNewOutlinesPanel',
        render: instance.UI.Panels.OUTLINE,
        location: 'left',
      });
      const panelList = instance.UI.getPanels();
      expect(panelList.length).to.equal(1);
    });
    it('It should be able to change the location of a Panel', async () => {
      instance = await setupWebViewerInstance({}, true);
      instance.UI.addPanel({
        dataElement: 'myNewOutlinesPanel',
        render: instance.UI.Panels.OUTLINE,
        location: 'left',
      });
      const panelList = instance.UI.getPanels();
      expect(panelList[0].location).to.equal('left');
      panelList[0].setLocation('right');
      expect(instance.UI.getPanels()[0].location).to.equal('right');
    });
    it('It should be able to change the location of a panel that is shipped by default', async () => {
      instance = await setupWebViewerInstance({ ui: 'beta' }, true);

      let stylePanel = instance.UI.getPanels().find((panel) => panel.dataElement === 'stylePanel');
      expect(stylePanel.location).to.equal('left');
      stylePanel.setLocation('right');
      stylePanel = instance.UI.getPanels().find((panel) => panel.dataElement === 'stylePanel');
      expect(stylePanel.location).to.equal('right');
    });
  });

  describe('Test Style Panel', () => {
    it('It should be able to change the font family when styling the Redaction tool', async () => {
      instance = await setupWebViewerInstance({ enableRedaction: true, fullAPI: true, ui: 'beta' });
      instance.UI.disableFeatures([instance.UI.Feature.LocalStorage]);
      const iframe = document.querySelector('#viewerDiv iframe');

      instance.UI.setToolbarGroup('toolbarGroup-Redact');
      instance.UI.setToolMode('AnnotationCreateRedaction');
      expect(instance.UI.getToolMode().name).to.equal('AnnotationCreateRedaction');
      instance.UI.openElement('stylePanel');
      await waitFor(1000);

      const fontFamilyButton = iframe.contentDocument.querySelector('.RichTextStyleEditor button.Dropdown');
      fontFamilyButton.click();

      const animoFontFamilyOption = iframe.contentDocument.querySelector('.Dropdown__item[data-element="dropdown-item-Arimo"]');
      animoFontFamilyOption.click();
      await waitFor(500);

      const selectedFontFamily = iframe.contentDocument.querySelector('.RichTextStyleEditor button.Dropdown .picked-option-text');
      expect(selectedFontFamily.innerText).to.equal('Arimo');
    });
  });
});