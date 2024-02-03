import { expect } from 'chai';
import sinon from 'sinon';
import { setupWebViewerInstance } from '../../../utils/TestingUtils';
import { createModularHeader, createGroupedItems, createPresetButton, createFlyout } from './utils';


describe('Test Custom UI APIs', function() {
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

  describe('Test Modular Headers', () => {
    it('It should create a Modular Header and get Modular Headers list', async () => {
      const instance = await setupWebViewerInstance({}, true);
      const topHeader = createModularHeader(instance, 'top');
      const leftHeader = createModularHeader(instance, 'left');
      const rightHeader = createModularHeader(instance, 'right');
      instance.UI.setModularHeaders([topHeader, leftHeader, rightHeader]);
      const headerList = instance.UI.getModularHeaderList();
      expect(headerList.length).to.equal(3);
    });

    it('Calling UI.setModularHeaders should set the UI to the new component list', async () => {
      const instance = await setupWebViewerInstance({}, true);
      const topHeader = createModularHeader(instance, 'top');
      const leftHeader = createModularHeader(instance, 'left');
      const rightHeader = createModularHeader(instance, 'right');
      instance.UI.setModularHeaders([topHeader, leftHeader, rightHeader]);
      const headerList = instance.UI.getModularHeaderList();
      expect(headerList.length).to.equal(3);
      const newBottomHeader = createModularHeader(instance, 'bottom');
      instance.UI.setModularHeaders([newBottomHeader]);
      const newHeaderList = instance.UI.getModularHeaderList();
      expect(newHeaderList.length).to.equal(1);
    });

    it('It should get a specific Modular Header', async () => {
      const instance = await setupWebViewerInstance({}, true);
      const { UI } = instance;
      const rightHeader = createModularHeader(instance, 'right');
      const bottomHeader = createModularHeader(instance, 'bottom');
      UI.setModularHeaders([rightHeader, bottomHeader]);
      const header = UI.getModularHeader('rightHeader');
      expect(header.dataElement).to.equal(rightHeader.dataElement);
      expect(header.placement).to.equal(rightHeader.placement);
      expect(header.justifyContent).to.equal(rightHeader.justifyContent);
      expect(header.position).to.equal(rightHeader.position);
    });

    it('It should set items of a Modular Header', async () => {
      const instance = await setupWebViewerInstance({}, true);
      const undoButton = createPresetButton(instance, 'undoButton');
      const redoButton = createPresetButton(instance, 'redoButton');
      const leftHeader = createModularHeader(instance, 'left');
      let leftHeaderItems = leftHeader.getItems();
      expect(leftHeaderItems.length).to.equal(0);
      leftHeader.setItems([undoButton, redoButton]);
      leftHeaderItems = leftHeader.getItems();
      expect(leftHeaderItems.length).to.equal(2);
    });

    it('It should set the style of a Modular Header', async () => {
      const instance = await setupWebViewerInstance({}, true);
      const topHeader = createModularHeader(instance, 'top');
      // Checking the default style before modifying it
      expect(topHeader.style).to.deep.equal({});
      topHeader.setStyle({
        borderColor: 'red',
        borderStyle: 'dotted'
      });
      expect(topHeader.style).to.deep.equal({
        borderColor: 'red',
        borderStyle: 'dotted'
      });
    });

    it('It should set the maxHeight and maxWidth properties of a Modular Header', async () => {
      const instance = await setupWebViewerInstance({}, true);
      const topHeader = createModularHeader(instance, 'top');
      console.warn = sinon.spy();
      // Checking the default values before modifying them
      expect(topHeader.maxWidth).to.be.undefined;
      expect(topHeader.maxHeight).to.be.undefined;
      // Setting wrong values to check the warnings
      topHeader.setMaxHeight(-1);
      expect(console.warn.getCall(0).args[0]).to.equal(
        '-1 is not a valid value for maxHeight. Please use a number, which represents the maximum height of the header in pixels.'
      );
      expect(topHeader.maxHeight).to.be.undefined;
      topHeader.setMaxWidth('wrong value');
      expect(console.warn.getCall(1).args[0]).to.equal(
        'wrong value is not a valid value for maxWidth. Please use a number, which represents the maximum width of the header in pixels.'
      );
      expect(topHeader.maxWidth).to.be.undefined;
      topHeader.setMaxWidth(100);
      topHeader.setMaxHeight(120);
      expect(topHeader.maxWidth).to.equal(100);
      expect(topHeader.maxHeight).to.equal(120);
    });

    it('It should set the properties gap and justify content of a Modular Header', async () => {
      const instance = await setupWebViewerInstance({}, true);
      const leftHeader = createModularHeader(instance, 'left');
      const validJustifications = ['start', 'center', 'end', 'space-between', 'space-around', 'space-evenly'];
      console.warn = sinon.spy();
      // Checking the default values before modifying them
      expect(leftHeader.gap).to.equal(12);
      expect(leftHeader.justifyContent).to.equal('center');
      // Setting wrong values to check the warnings
      leftHeader.setGap(-1);
      expect(console.warn.getCall(0).args[0]).to.equal(
        '-1 is not a valid value for gap. Please use a number, which represents the gap between items in pixels.'
      );
      leftHeader.setJustifyContent('wrong value');
      expect(console.warn.getCall(1).args[0]).to.equal(
        `wrong value is not a valid value for justifyContent. Please use one of the following: ${validJustifications}`
      );
      leftHeader.setGap(10);
      leftHeader.setJustifyContent('end');
      expect(leftHeader.gap).to.equal(10);
      expect(leftHeader.justifyContent).to.equal('end');
    });

    it('It should get the items and Grouped Items of a Modular Header', async () => {
      const instance = await setupWebViewerInstance({}, true);
      const undoButton = createPresetButton(instance, 'undoButton');
      const redoButton = createPresetButton(instance, 'redoButton');
      const groupedItem = createGroupedItems(instance, [undoButton, redoButton]);
      const leftHeader = createModularHeader(instance, 'left', [groupedItem, undoButton]);
      const groupedItems = leftHeader.getGroupedItems();
      expect(groupedItems.length).to.equal(1);
      const headerItems = leftHeader.getItems();
      expect(headerItems.length).to.equal(2);
    });
  });

  describe('Test Grouped Items', () => {
    it('It should set the grouped items properties, gap, grow and justify content', async () => {
      const instance = await setupWebViewerInstance({}, true);
      const { UI } = instance;
      console.warn = sinon.spy();

      const groupedItem = createGroupedItems(instance, []);
      const header = createModularHeader(instance, 'top', [groupedItem]);

      // We should add the modular header in order to see the changes
      UI.setModularHeaders([header]);
      const headerTest = UI.getModularHeader('topHeader');
      const groupOfTopHeader = headerTest.getGroupedItems()[0];

      // Checking the default values before modifying them
      expect(groupOfTopHeader.gap).to.equal(12);
      expect(groupOfTopHeader.grow).to.equal(0);
      expect(groupOfTopHeader.justifyContent).to.be.undefined;

      // Setting the gap with a wrong value to check the warning
      UI.setGroupedItemsGap(-10);
      expect(console.warn.getCall(0).args[0]).to.equal(
        '-10 is not a valid value for gap. Please use a number, which represents the gap between items in pixels.'
      );

      UI.setGroupedItemsGap(30, {
        groupedItem: 'groupedItemsSample',
      });
      expect(groupOfTopHeader.gap).to.equal(30);

      // Setting the justifyContent with a wrong value to check the warning
      UI.setGroupedItemsJustifyContent('wrong justification');
      expect(console.warn.getCall(1).args[0]).to.equal(
        'wrong justification is not a valid value for justifyContent. Please use one of the following: start,center,end,space-between,space-around,space-evenly'
      );

      UI.setGroupedItemsJustifyContent('center');
      expect(groupOfTopHeader.justifyContent).to.equal('center');

      // Setting the grow with a wrong value to check the warning
      UI.setGroupedItemsGrow(-1);
      expect(console.warn.getCall(2).args[0]).to.equal(
        '-1 is not a valid value for grow. Please use a number, which represents the flex-grow property of item.'
      );
    });

    it('It should set the properties of an specific Grouped Items, gap, justifyContent, grow and items', async () => {
      const instance = await setupWebViewerInstance({}, true);
      const groupedItem = createGroupedItems(instance, []);
      const undoButton = createPresetButton(instance, 'undoButton');
      console.warn = sinon.spy();

      // Checking the default values before modifying them
      expect(groupedItem.gap).to.equal(12);
      expect(groupedItem.grow).to.equal(0);
      expect(groupedItem.justifyContent).to.be.undefined;
      expect(groupedItem.items.length).to.equal(0);

      // Setting wrong values to check the warnings
      groupedItem.setGap(-1);
      expect(console.warn.getCall(0).args[0]).to.equal(
        '-1 is not a valid value for gap. Please use a number, which represents the gap between items in pixels.'
      );

      groupedItem.setGap(30);
      groupedItem.setGrow(1);
      groupedItem.setJustifyContent('center');
      groupedItem.setItems([undoButton]);

      expect(groupedItem.gap).to.equal(30);
      expect(groupedItem.grow).to.equal(1);
      expect(groupedItem.justifyContent).to.equal('center');
      expect(groupedItem.items.length).to.equal(1);
    });
  });

  describe('Test Flyout', () => {
    it('It should add items to Flyout', async () => {
      const instance = await setupWebViewerInstance({}, true);
      const simpleFlyout = createFlyout(instance, []);

      expect(simpleFlyout.items.length).to.equal(0);

      const flyoutItem = {
        dataElement: 'newTestButton',
        icon: 'icon-plus-sign',
        label: 'newTestButton',
        onClick: () => {
          console.log('test');
        }
      };

      simpleFlyout.addItems([flyoutItem]);
      expect(simpleFlyout.items.length).to.equal(1);
    });
  });

  describe('Test Panels', () => {
    it('It should be able to add Panel', async () => {
      const instance = await setupWebViewerInstance({}, true);
      instance.UI.addPanel({
        dataElement: 'myNewOutlinesPanel',
        render: instance.UI.Panels.OUTLINE,
        location: 'left',
      });
      const panelList = instance.UI.getPanels();
      expect(panelList.length).to.equal(1);
    });
    it('It should be able to set Panels', async () => {
      const instance = await setupWebViewerInstance({}, true);
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
      const instance = await setupWebViewerInstance({}, true);
      instance.UI.addPanel({
        dataElement: 'myNewOutlinesPanel',
        render: instance.UI.Panels.OUTLINE,
        location: 'left',
      });
      const panelList = instance.UI.getPanels();
      expect(panelList.length).to.equal(1);
    });
    it('It should be able to change the location of a Panel', async () => {
      const instance = await setupWebViewerInstance({}, true);
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
  });
});