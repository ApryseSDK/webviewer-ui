import { expect } from 'chai';
import sinon from 'sinon';
import { setupWebViewerInstance, waitFor, isModularUI } from '../../../utils/TestingUtils';
import { createModularHeader, createGroupedItems, createPresetButton, createFlyout } from './utils';
import { testUI, invalidUI, uiWithButtons } from './modular-components';
// eslint-disable-next-line import/no-relative-packages
import { getCurrentFreeSpace } from '../../../../../src/ui/src/helpers/responsivenessHelper';

describe('Test Custom UI APIs', function() {
  this.timeout(20000);
  let viewerDiv;
  let instance;
  let originalResizeObserver;
  let originalMutationObserver;

  beforeEach(async () => {
    // Create a new div with an ID and add it to the body before each test
    viewerDiv = document.createElement('div');
    viewerDiv.id = 'viewerDiv';
    document.body.appendChild(viewerDiv);
    originalResizeObserver = window.ResizeObserver;
    originalMutationObserver = window.MutationObserver;

    class MockObserver {
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
    }

    window.ResizeObserver = MockObserver;
    window.MutationObserver = MockObserver;
  });

  afterEach(async () => {
    // Clean up the div after each test
    document.body.removeChild(viewerDiv);
    await instance?.UI.dispose();
    window.ResizeObserver = originalResizeObserver;
    window.MutationObserver = originalMutationObserver;
  });

  describe('Test Modular Headers', () => {
    it('It should create a Modular Header and get Modular Headers list', async () => {
      instance = await setupWebViewerInstance({ ui: 'default' }, true);
      const topHeader = createModularHeader(instance, 'top');
      const leftHeader = createModularHeader(instance, 'left');
      const rightHeader = createModularHeader(instance, 'right');
      instance.UI.setModularHeaders([topHeader, leftHeader, rightHeader]);
      const headerList = instance.UI.getModularHeaderList();
      expect(headerList.length).to.equal(3);
    });

    it('Calling UI.setModularHeaders should set the UI to the new component list', async () => {
      instance = await setupWebViewerInstance({ ui: 'default' }, true);
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
      instance = await setupWebViewerInstance({ ui: 'default' }, true);
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

    it('Calling UI.addModularHeaders should accept a single Modular Header', async () => {
      instance = await setupWebViewerInstance({ ui: 'default' }, true);
      const rightHeader = createModularHeader(instance, 'right');
      const headersListBefore = instance.UI.getModularHeaderList().length;
      instance.UI.addModularHeaders(rightHeader);
      const headerList = instance.UI.getModularHeaderList();
      expect(headerList.length).to.equal(headersListBefore + 1);
    });

    it('It should set items of a Modular Header', async () => {
      instance = await setupWebViewerInstance({ ui: 'default' }, true);
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
      instance = await setupWebViewerInstance({ ui: 'default' }, true);
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
      instance = await setupWebViewerInstance({ ui: 'default' }, true);
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
      instance = await setupWebViewerInstance({ ui: 'default' }, true);
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
      instance = await setupWebViewerInstance({ ui: 'default' }, true);
      const undoButton = createPresetButton(instance, 'undoButton');
      const redoButton = createPresetButton(instance, 'redoButton');
      const groupedItem = createGroupedItems(instance, [undoButton, redoButton]);
      const leftHeader = createModularHeader(instance, 'left', [groupedItem, undoButton]);
      const groupedItems = leftHeader.getGroupedItems();
      expect(groupedItems.length).to.equal(1);
      const headerItems = leftHeader.getItems();
      expect(headerItems.length).to.equal(2);
    });

    it('It should be able select ribbon items and update its grouped items when the Ribbon Group is in dropdown format', async () => {
      if (isModularUI()) return; // Test doesn't work with Web components

      instance = await setupWebViewerInstance({ ui: 'default' });
      instance.UI.disableFeatures([instance.UI.Feature.LocalStorage]);
      const iframe = document.querySelector('#viewerDiv iframe');
      const getElementByDataElement = (elementSelector) => {
        return iframe.contentDocument.querySelector(`[data-element="${elementSelector}"]`);
      };

      const ribbonGroupDropdown = iframe.contentDocument.querySelector('.RibbonGroup__dropdown');
      // setting the container width so we can see the dropdown
      iframe.style.width = '500px';
      await waitFor(3000);
      expect(ribbonGroupDropdown.classList.contains('hidden')).to.equal(false);

      let insertGroupedItems = getElementByDataElement('insertGroupedItems');
      expect(insertGroupedItems).to.be.null;
      ribbonGroupDropdown.click();

      const insertRibbonItem = getElementByDataElement('dropdown-item-toolbarGroup-Insert');
      insertRibbonItem.click();
      await waitFor(100);
      let editGroupedItems = getElementByDataElement('editGroupedItems');
      insertGroupedItems = getElementByDataElement('insertGroupedItems');
      expect(insertGroupedItems).to.not.be.null;
      expect(editGroupedItems).to.be.null;

      ribbonGroupDropdown.click();
      await waitFor(100);
      const editRibbonItem = getElementByDataElement('dropdown-item-toolbarGroup-Edit');
      editRibbonItem.click();
      await waitFor(100);

      editGroupedItems = getElementByDataElement('editGroupedItems');
      expect(editGroupedItems).to.not.be.null;
      insertGroupedItems = getElementByDataElement('insertGroupedItems');
      expect(insertGroupedItems).to.be.null;
    });

    it('It should update header items and cleanup orphan items', async () => {
      if (isModularUI()) return; // Test doesn't work with Web components
      instance = await setupWebViewerInstance({ ui: 'default' });

      const iframe = document.querySelector('#viewerDiv iframe');
      await waitFor(500);
      iframe.style.width = '1500px';

      instance.UI.setLanguage('en');
      const toggleButton = new instance.UI.Components.ToggleElementButton({
        dataElement: 'newPortfolioPanelToggle',
        toggleElement: 'newPortfolioPanel',
        img: 'icon-pdf-portfolio',
        title: 'component.portfolioPanel',
      });
      const topHeader = instance.UI.getModularHeader('default-top-header');
      const items = topHeader.getItems();
      topHeader.setItems([...items, toggleButton]);

      instance.UI.setLanguage('en');
      // Test case 1
      await waitFor(500);
      const ToggleElementButtons = iframe.contentDocument.querySelectorAll('.ModularHeaderItems>.ToggleElementButton');
      const toggleButtonElement = ToggleElementButtons[2].querySelector('.Button');
      expect(toggleButtonElement.dataset.element).to.equal('newPortfolioPanelToggle');
      const RibbonItem0 = iframe.contentDocument.querySelectorAll('.RibbonItem');
      expect(RibbonItem0[0].innerText).to.equal('View');

      // Test case 2 remove "View" ribbonItem, & check that first item is "Annotate"
      const itemsNewArray = items.concat();
      const removedItem = itemsNewArray[1].items.shift();
      topHeader.setItems([...itemsNewArray]);
      await waitFor(200);
      const RibbonItem = iframe.contentDocument.querySelectorAll('.RibbonItem');
      expect(RibbonItem[0].innerText).to.equal('Annotate');


      // Test case 3 add "View" ribbonItem back again, so that the first item is "View" again
      itemsNewArray[1].items.unshift(removedItem);
      topHeader.setItems([...itemsNewArray]);
      await waitFor(200);
      const RibbonItem2 = iframe.contentDocument.querySelectorAll('.RibbonItem');
      expect(RibbonItem2[0].innerText).to.equal('View');
    });

    it('It should show warning logs for existing item, no warning log for new item', async () => {
      instance = await setupWebViewerInstance({ ui: 'default' }, true);

      // Test case 1: warning log for "menuButton"
      console.warn = sinon.spy();
      await waitFor(200);
      const toggleButton = new instance.UI.Components.ToggleElementButton({
        dataElement: 'newPortfolioPanelToggle',
        toggleElement: 'newPortfolioPanel',
        img: 'icon-pdf-portfolio',
        title: 'component.portfolioPanel',
      });
      const topHeader = instance.UI.getModularHeader('default-top-header');
      const items = topHeader.getItems();
      topHeader.setItems([...items, toggleButton]);
      expect(console.warn.getCall(0).args[0]).to.equal(
        "Modular component with dataElement menuButton already exists. Existing component's properties have been updated."
      );

      // Test case 2: no warning log for "menuButton", but warning log for the next item
      console.warn = sinon.spy();
      const removedItem = items.shift();
      topHeader.setItems([...items]);
      expect(console.warn.getCall(0).args[0]).to.equal(
        "Modular component with dataElement toolbarGroup-View already exists. Existing component's properties have been updated."
      );


      // Test case 3: warning log for "menuButton" displayed again
      console.warn = sinon.spy();
      items.unshift(removedItem);
      topHeader.setItems([...items]);
      expect(console.warn.getCall(0).args[0]).to.equal(
        "Modular component with dataElement menuButton already exists. Existing component's properties have been updated."
      );
    });

    it('It should show warning log when existing modular items dataElement gets renamed', async () => {
      instance = await setupWebViewerInstance({ ui: 'default' }, true);

      // Test case: warning log for modifying dataElement for existing item
      console.warn = sinon.spy();
      await waitFor(200);

      const topHeader = instance.UI.getModularHeader('default-top-header');
      const items = topHeader.getItems();
      const tempVar = 'foobar';
      const originalName = items[3].dataElement;
      items[3].dataElement = tempVar;
      expect(console.warn.getCall(0).args[0]).to.equal(
        `Modular Item's "${originalName}" dataElement property cannot be changed to "${tempVar}"`
      );
    });
  });

  describe('Test Grouped Items', () => {
    it('It should set the grouped items properties, gap, grow and justify content', async () => {
      instance = await setupWebViewerInstance({ ui: 'default' }, true);
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
      instance = await setupWebViewerInstance({ ui: 'default' }, true);
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
    it('It should add items to the flyout using setItems', async () => {
      instance = await setupWebViewerInstance({ ui: 'default' }, true);
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

      simpleFlyout.setItems([flyoutItem]);
      expect(simpleFlyout.items.length).to.equal(1);
    });

    it('It should remove items from the flyout using setItems', async () => {
      instance = await setupWebViewerInstance({ ui: 'default' }, true);
      const mockItem1 = {
        dataElement: 'item-1',
        label: 'Item 1',
        onClick: () => console.log('Item 1 clicked'),
        icon: 'icon-first'
      };

      const mockItem2 = {
        dataElement: 'item-2',
        label: 'Item 2',
        onClick: () => console.log('Item 2 clicked'),
        icon: 'icon-second'
      };
      const simpleFlyout = createFlyout(instance, [mockItem1, mockItem2]);
      expect(simpleFlyout.items.length).to.equal(2);


      simpleFlyout.setItems([mockItem1]);
      expect(simpleFlyout.items.length).to.equal(1);
      expect(simpleFlyout.items[0].dataElement).to.equal('item-1');
    });

    it('It should add items to the flyout using the items property', async () => {
      instance = await setupWebViewerInstance({ ui: 'default' }, true);
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

      simpleFlyout.items = [flyoutItem];
      expect(simpleFlyout.items.length).to.equal(1);
    });

    it('It should remove items from the flyout using the items property', async () => {
      instance = await setupWebViewerInstance({ ui: 'default' }, true);
      const mockItem1 = {
        dataElement: 'item-1',
        label: 'Item 1',
        onClick: () => console.log('Item 1 clicked'),
        icon: 'icon-first'
      };

      const mockItem2 = {
        dataElement: 'item-2',
        label: 'Item 2',
        onClick: () => console.log('Item 2 clicked'),
        icon: 'icon-second'
      };
      const simpleFlyout = createFlyout(instance, [mockItem1, mockItem2]);
      expect(simpleFlyout.items.length).to.equal(2);


      simpleFlyout.items = [mockItem1];
      expect(simpleFlyout.items.length).to.equal(1);
      expect(simpleFlyout.items[0].dataElement).to.equal('item-1');
    });

    it('It should add a flyout to the UI with addFlyout', async () => {
      instance = await setupWebViewerInstance({ ui: 'default' }, true);
      const flyoutItem = {
        dataElement: 'newTestButton',
        icon: 'icon-plus-sign',
        label: 'newTestButton',
        onClick: () => {
          console.log('test');
        }
      };
      const simpleFlyout = createFlyout(instance, [flyoutItem]);

      instance.UI.Flyouts.addFlyouts([simpleFlyout]);

      const myFlyout = instance.UI.Flyouts.getFlyout(simpleFlyout.dataElement);
      expect(myFlyout.dataElement).to.equal(simpleFlyout.dataElement);
      expect(myFlyout.items.length).to.equal(1);
    });

    it('It should allow you to add extra items to the default Menu Overlay flyout', async () => {
      instance = await setupWebViewerInstance({ ui: 'default' }, true);
      const additionalItems = [{
        dataElement: 'newTestButton',
        icon: 'icon-plus-sign',
        label: 'newTestButton',
        onClick: () => {
          console.log('test');
        }
      }];

      const mainMenu = new instance.UI.Components.MainMenu({ additionalItems });
      // 11 default items + 1 additional item
      expect(mainMenu.items.length).to.equal(12);
    });

    it('It should return all flyouts when calling the API getAllFlyouts', async () => {
      instance = await setupWebViewerInstance({ ui: 'default' }, true);
      const allFlyouts = instance.UI.Flyouts.getAllFlyouts();

      // 9 flyouts are added by default with the default ui.
      expect(allFlyouts.length).to.equal(10);
    });


    // flaky: https://app.circleci.com/pipelines/github/XodoDocs/webviewer/112795/workflows/4ed8ea3a-2681-4fff-855e-08ea997ec070/jobs/132628
    it.skip('It should have the Page Controls flyout when the screen is small', async () => {
      const options = {
        initialDoc: 'https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf',
        ui: 'default'
      };
      instance = await setupWebViewerInstance(options, false);

      // create a promise that resolves when the document loaded event fires
      await new Promise((resolve) => {
        instance.Core.documentViewer.addEventListener('documentLoaded', resolve);
      });

      const pageNavigationTool = {
        dataElement: 'page-controls-container',
        type: 'pageControls',
      };
      const header = instance.UI.getModularHeader('default-top-header');
      const headerItems = header.getItems();
      expect(header.getItems().length).to.equal(4);
      header.setItems([...headerItems, pageNavigationTool]);
      expect(header.getItems().length).to.equal(5);

      const iframe = document.querySelector('#viewerDiv iframe');
      iframe.style.width = '500px';
      await waitFor(500);

      const pageControlsFlyoutToggleButton = iframe.contentDocument.querySelector('[data-element="pageNav-toggle-button"]');
      expect(pageControlsFlyoutToggleButton).to.not.be.null;
      // Opening the flyout
      pageControlsFlyoutToggleButton.click();

      const pageControlsFlyout = iframe.contentDocument.querySelector('[data-element="pageControlsFlyout"]');
      expect(pageControlsFlyout).to.not.be.null;

      // Checking if the previous page button is disabled at the first page
      const previousPageButton = iframe.contentDocument.querySelector('[data-element="previousPageButton"]');
      expect(previousPageButton.disabled).to.be.true;

      const nextPageButton = iframe.contentDocument.querySelector('[data-element="nextPageButton"]');
      expect(nextPageButton.disabled).to.be.false;

      nextPageButton.click();
      const previousPageButtonAfterChangeToSecondPage = iframe.contentDocument.querySelector('[data-element="previousPageButton"]');
      expect(previousPageButtonAfterChangeToSecondPage.disabled).to.be.false;

      // Going to the last page
      for (let i = 0; i < 7; i++) {
        nextPageButton.click();
      }

      // Checking if the next page button is disabled at the last page
      const nextButtonAfterChangeToLastPage = iframe.contentDocument.querySelector('[data-element="nextPageButton"]');
      expect(nextButtonAfterChangeToLastPage.disabled).to.be.true;
    });

    it('should be able to pass validation for a nested flyout', async () => {
      instance = await setupWebViewerInstance({ ui: 'default ' }, true);
      const flyout = new instance.UI.Components.Flyout({
        dataElement: 'myCustomFlyout',
        items: [{
          dataElement: 'customFlyoutItem',
          label: 'Custom Flyout Item',
          onClick: () => console.log('Custom Flyout Item Clicked'),
          icon: 'icon-save',
          children: [{
            dataElement: 'customFlyoutItem2',
            label: 'Custom Flyout Item 2',
            onClick: () => console.log('Custom Flyout Item 2 Clicked'),
            icon: 'icon-save',
            children: [{
              dataElement: 'printButton',
              buttonType: 'printButton',
              type: 'presetButton',
            }],
          }],
        }],
      });
      // Add your flyout to the UI
      instance.UI.Flyouts.addFlyouts([flyout]);
      const allFlyouts = instance.UI.Flyouts.getAllFlyouts();
      let found = false;
      for (const item of allFlyouts) {
        if (flyout.dataElement === item.dataElement) {
          found = true;
          break;
        }
      }
      expect(found).to.equal(true);
    });
  });

  describe('Test Custom Button', () => {
    it('it should throw an error if the dataElement is not provided', async () => {
      instance = await setupWebViewerInstance({ ui: 'default' }, true);
      expect(() => {
        new instance.UI.Components.CustomButton({
          label: 'test',
          title: 'this is a test button',
          onClick: () => console.log('button clicked!'),
          img: 'icon-save',
        });
      }).to.throw('Object at argument 1 has invalid key: \'dataElement\', in Custom Button Constructor. Expected string');
    });

    it('should allow users to add labels with colons in them', async()=> {
      instance = await setupWebViewerInstance({ ui: 'default' }, true);
      const { UI } = instance;

      const leftGroup = new instance.UI.Components.GroupedItems({
        alwaysVisible: true,
        dataElement: 'left-Group',
        items: [
          new UI.Components.CustomButton({
            dataElement: 'published-at-date',
            disabled: true,
            label: 'Published on 07/31/24, 11:46 AM',
          }),
        ],
      });

      const topHeader = new UI.Components.ModularHeader({
        dataElement: 'default-bottom-header',
        placement: 'top',
        grow: 0,
        gap: 12,
        position: 'start',
        justifyContent: 'space-between',
        style: {
          borderTopColor: '#e5e7eb',
        },
        items: [leftGroup],
      });

      UI.setModularHeaders([topHeader]);

      const button = document.querySelector('apryse-webviewer').shadowRoot.querySelector('[data-element="published-at-date"]');
      expect(button).to.not.be.null;
      expect(button.textContent).to.equal('Published on 07/31/24, 11:46 AM');

    });
  });

  describe('Test i18n translation feature in custom ui', () => {
    it.skip('should correctly apply i18n translation to menu items', async () => {
      const options = {
        initialDoc: 'https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf',
        ui: 'default'
      };
      instance = await setupWebViewerInstance(options);
      // create a promise that resolves when the document loaded event fires
      await new Promise((resolve) => {
        instance.UI.setLanguage('ja');
        instance.Core.documentViewer.addEventListener('documentLoaded', resolve);
      });
      const iframe = document.querySelector('#viewerDiv iframe');

      iframe.style.height = '1000px';
      iframe.style.width = '1000px';

      // These CSS classes are only available in new custom UI so we are testing those
      iframe.contentDocument.querySelector('.RibbonGroup__moreButton .Button').click();
      const menuList = iframe.contentDocument.querySelectorAll('#FlyoutContainer .flyout-item-container');

      expect(menuList.length).to.equal(7);
      expect(menuList[0].innerText).to.equal('挿入');
      expect(menuList[6].innerText).to.equal('フォーム');

      // Making sure that Dropdown items are translated
      const Dropdown__item = iframe.contentDocument.querySelectorAll('.Dropdown__item-object');
      expect(Dropdown__item[0].innerText).to.equal('閲覧');
      expect(Dropdown__item[1].innerText).to.equal('注釈');
      expect(Dropdown__item[3].innerText).to.equal('挿入');

      instance.UI.setLanguage('en');
    });
  });

  describe('Should correctly enable and disable elements from features API', () => {
    it('should disable notes panel button', async () => {
      if (isModularUI()) return; // Test doesn't work with Web components

      instance = await setupWebViewerInstance({ ui: 'default' });
      const { document } = instance.UI.iframeWindow;
      instance.UI.disableFeatures([instance.UI.Feature.NotesPanel]);
      expect(document.querySelector('[data-element="notesPanelToggle"]')).to.be.null;
      instance.UI.enableFeatures([instance.UI.Feature.NotesPanel]);
      expect(document.querySelector('[data-element="notesPanelToggle"]')).to.not.be.null;
    });
    it('should disable annotation features', async () => {
      if (isModularUI()) return; // Test doesn't work with Web components

      instance = await setupWebViewerInstance({ ui: 'default' });
      const { document } = instance.UI.iframeWindow;
      instance.UI.disableFeatures([instance.UI.Feature.Annotations]);
      expect(document.querySelector('[data-element="tools-header"]')).to.be.null;
      expect(document.querySelector('[data-element="notesPanelToggle"]')).to.be.null;
      expect(document.querySelector('[data-element="default-ribbon-group"]')).to.be.null;
      instance.UI.enableFeatures([instance.UI.Feature.Annotations]);
      expect(document.querySelector('[data-element="tools-header"]')).to.not.be.null;
      expect(document.querySelector('[data-element="notesPanelToggle"]')).to.not.be.null;
      expect(document.querySelector('[data-element="default-ribbon-group"]')).to.not.be.null;
    });
    it('should enable/disable multi-tab', async () => {
      if (isModularUI()) return; // Test doesn't work with Web components
      instance = await setupWebViewerInstance({ ui: 'default' });
      const { document } = instance.UI.iframeWindow;
      instance.UI.disableFeatures([instance.UI.Feature.MultiTab]);
      expect(document.querySelector('.TabsHeader')).to.be.null;
      instance.UI.enableFeatures([instance.UI.Feature.MultiTab]);
      expect(document.querySelector('.TabsHeader')).to.not.be.null;
    });

    it('should enable/disable search button', async () => {
      if (isModularUI()) return; // Test doesn't work with Web components
      instance = await setupWebViewerInstance({ ui: 'default' });
      const { document } = instance.UI.iframeWindow;
      instance.UI.disableFeatures([instance.UI.Feature.Search]);
      expect(document.querySelector('[data-element="searchPanelToggle"]')).to.be.null;
      instance.UI.enableFeatures([instance.UI.Feature.Search]);
      expect(document.querySelector('[data-element="searchPanelToggle"]')).to.not.be.null;
    });

    it('Should have the file picker button in the main menu when the enableFilePicker flag is used in the WV constructor', async () => {
      if (isModularUI()) return; // Test doesn't work with Web components
      const options = {
        initialDoc: 'https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf',
        enableFilePicker: true,
        ui: 'default'
      };
      instance = await setupWebViewerInstance(options, false);

      await new Promise((resolve) => {
        instance.Core.documentViewer.addEventListener('documentLoaded', resolve);
      });

      const iframe = document.querySelector('#viewerDiv iframe');
      const mainMenuButton = iframe.contentDocument.querySelector('[data-element="menuButton"]');
      mainMenuButton.click();

      const filePickerButton = iframe.contentDocument.querySelector('[data-element="filePickerButton"]');
      expect(filePickerButton).to.not.be.null;
    });

    it('Can enable and disable the file picker in the main menu using APIs', async () => {
      if (isModularUI()) return; // Test doesn't work with Web components
      const options = {
        initialDoc: 'https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf',
        ui: 'default'
      };
      instance = await setupWebViewerInstance(options, false);

      await new Promise((resolve) => {
        instance.Core.documentViewer.addEventListener('documentLoaded', resolve);
      });

      const iframe = document.querySelector('#viewerDiv iframe');
      const mainMenuButton = iframe.contentDocument.querySelector('[data-element="menuButton"]');
      mainMenuButton.click();

      expect(iframe.contentDocument.querySelector('[data-element="filePickerButton"]')).to.be.null;

      instance.UI.enableFeatures([instance.UI.Feature.FilePicker]);

      expect(iframe.contentDocument.querySelector('[data-element="filePickerButton"]')).not.to.be.null;

      instance.UI.disableFeatures([instance.UI.Feature.FilePicker]);

      expect(iframe.contentDocument.querySelector('[data-element="filePickerButton"]')).to.be.null;
    });
  });

  describe('Modular UI Import/Export tests', () => {
    it('should import modular components from a JSON', async () => {
      instance = await setupWebViewerInstance({ ui: 'default' });
      const ui = JSON.parse(JSON.stringify(testUI));
      instance.UI.importModularComponents(ui);

      const headerList = instance.UI.getModularHeaderList();
      expect(headerList.length).to.equal(3);
      expect(headerList[0].items.length).to.equal(5);

      const panelList = instance.UI.getPanels();
      expect(panelList.length).to.equal(18);

      const flyoutList = instance.UI.Flyouts.getAllFlyouts();
      // only MainMenuFlyout is imported, but viewControlsFlyout and zoom-containerFlyout get added by default
      expect(flyoutList.length).to.equal(4);

      const mainMenuFlyout = instance.UI.Flyouts.getFlyout('MainMenuFlyout');
      expect(mainMenuFlyout.items.length).to.equal(11);
    });

    it('should throw an error if the imported JSON is invalid', async () => {
      instance = await setupWebViewerInstance({ ui: 'default' });
      await expect(instance.UI.importModularComponents(invalidUI)).to.be.rejected;
    });

    it('should export modular components to a JSON', async () => {
      const exportedUI = instance.UI.exportModularComponents();
      const ui = JSON.parse(JSON.stringify(testUI));
      instance.UI.importModularComponents(ui);
      expect(exportedUI).to.deep.equal(testUI);
    });

    it('should remove functions from components in export JSON', async () => {
      instance = await setupWebViewerInstance({ ui: 'default' });
      const testButton = new instance.UI.Components.CustomButton({
        dataElement: 'testButton',
        label: 'test',
        title: 'this is a test button',
        onClick: () => console.log('button clicked!'),
        img: 'icon-save',
      });

      // this button has no data element and should not get exported
      const testButton2 = new instance.UI.Components.CustomButton({
        dataElement: 'testButton2',
        label: 'test2',
        title: 'this is also test button',
        img: 'icon-save',
      });

      const defaultHeader = instance.UI.getModularHeader('default-top-header');
      defaultHeader.setItems([testButton, testButton2]);

      const exportedUI = instance.UI.exportModularComponents();

      expect(exportedUI.modularComponents.testButton.onclick).to.be.undefined;
      expect(exportedUI.modularHeaders['default-top-header'].items.length).to.equal(2);
    });

    it('can add functions to buttons using a function map', async () => {
      instance = await setupWebViewerInstance({ ui: 'default' });
      const functionMap = {
        'alertClick': () => alert('Alert triggered!'),
        'singlePageOnClick': (update) => {
          update('DoublePage');
        },
        'doublePageOnClick': (update) => {
          update('SinglePage');
        },
        'statefulButtonMount': () => {},
        'statefulButtonUnmount': () => {},
      };

      const ui = JSON.parse(JSON.stringify(uiWithButtons));
      instance.UI.importModularComponents(ui, functionMap);

      const defaultHeader = instance.UI.getModularHeader('default-top-header');
      const items = defaultHeader.items;

      // check custom button
      expect(items[0].onClick).to.equal(functionMap['alertClick']);

      // check stateful button
      expect(items[1].states.DoublePage.onClick).to.equal(functionMap['doublePageOnClick']);
      expect(items[1].states.SinglePage.onClick).to.equal(functionMap['singlePageOnClick']);
      // stateful button mount and unmount should be empty functions by default
      expect(items[1].mount).to.be.a('function');
      expect(items[1].unmount).to.be.a('function');

      // exported components should match imported ones
      const exportedUI = instance.UI.exportModularComponents();
      expect(exportedUI.modularComponents).to.deep.equal(uiWithButtons.modularComponents);
    });

    it('should load config without flashing when using uiConfig option', async () => {
      instance = await setupWebViewerInstance({
        ui: 'default',
        uiConfig: '/base/test/fixtures/pdfs/modular_components.json'
      }, true);
      const document = window.document.querySelector('apryse-webviewer').shadowRoot;
      const header = document.querySelector('[data-element="default-top-header"]');
      expect(header.style.backgroundColor).to.equal('red');
    });

    it('should import a config with disabled elements and they should not appear in the UI', async () => {
      instance = await setupWebViewerInstance({ ui: 'default' }, true);
      let document = window.document.querySelector('apryse-webviewer').shadowRoot
      const panToolButton = document.querySelector('[data-element="panToolButton"]');
      expect(panToolButton).to.not.be.null;
      const menuButton = document.querySelector('[data-element="menuButton"]');
      expect(menuButton).to.not.be.null;

      // Config with panToolButton and menuButton disabled to be imported
      const configWithDisabledElements = {
        ...testUI,
        'modularComponents': {
          ...testUI.modularComponents,
          'panToolButton': {
            ...testUI.modularComponents['panToolButton'],
            disabled: true
          },
          'menuButton': {
            ...testUI.modularComponents['menuButton'],
            disabled: true
          }
        }
      };

      instance.UI.importModularComponents(configWithDisabledElements);
      const panToolButtonAfterImport = document.querySelector('[data-element="panToolButton"]');
      expect(panToolButtonAfterImport).to.be.null;
      const menuButtonAfterImport = document.querySelector('[data-element="menuButton"]');
      expect(menuButtonAfterImport).to.be.null;
    });

    it('disabled elements in the export config should have the "disabled" flag set to "true"', async () => {
      instance = await setupWebViewerInstance({ ui: 'default' }, true);
      let document = window.document.querySelector('apryse-webviewer').shadowRoot
      const exportedConfig = instance.UI.exportModularComponents();
      // Verify that disabled flags are not present in the exported configuration at first
      expect(exportedConfig.flyouts['MainMenuFlyout'].disabled).to.be.undefined;
      expect(exportedConfig.panels['tabPanel'].disabled).to.be.undefined;
      expect(exportedConfig.modularHeaders['tools-header'].disabled).to.be.undefined;
      expect(exportedConfig.modularComponents['annotationEditToolButton'].disabled).to.be.undefined;
      expect(exportedConfig.modularComponents['panToolButton'].disabled).to.be.undefined;
      expect(document.querySelector('[data-element="panToolButton"]')).to.not.be.null;
      
      instance.UI.disableElements(['MainMenuFlyout', 'annotationEditToolButton', 'tabPanel', 'tools-header', 'panToolButton']);
      
      const exportedConfigAfterDisabling = instance.UI.exportModularComponents();
      // Check if disabled flags are present in exported configuration after disabling elements
      expect(exportedConfigAfterDisabling.flyouts['MainMenuFlyout'].disabled).to.be.true;
      expect(exportedConfigAfterDisabling.panels['tabPanel'].disabled).to.be.true;
      expect(exportedConfigAfterDisabling.modularHeaders['tools-header'].disabled).to.be.true;
      expect(exportedConfigAfterDisabling.modularComponents['annotationEditToolButton'].disabled).to.be.true;
      expect(exportedConfigAfterDisabling.modularComponents['panToolButton'].disabled).to.be.true;
      expect(document.querySelector('[data-element="panToolButton"]')).to.be.null;
    });

    it('should enable previously disabled components when importing a configuration that has those components enabled', async () => {
      instance = await setupWebViewerInstance({ ui: 'default' }, true);
      let document = window.document.querySelector('apryse-webviewer').shadowRoot
      
      instance.UI.disableElement('panToolButton');
      const exportedConfig = instance.UI.exportModularComponents();
      expect(exportedConfig.modularComponents['panToolButton'].disabled).to.be.true;
      expect(document.querySelector('[data-element="panToolButton"]')).to.be.null;
      // This ribbon is disabled by default
      expect(exportedConfig.modularComponents['toolbarGroup-Measure'].disabled).to.be.true;
      expect(document.querySelector('[data-element="toolbarGroup-Measure"]')).to.be.null;

      // Deleting the disabled flag from the panToolButton and toolbarGroup-Measure
      const panTool = exportedConfig.modularComponents['panToolButton'];
      delete panTool.disabled;
      const measureEnabledRibbon = exportedConfig.modularComponents['toolbarGroup-Measure'];
      delete measureEnabledRibbon.disabled;

      const configWithPanToolAndMeasureEnabled = {
        ...exportedConfig,
        'modularComponents': {
          ...exportedConfig.modularComponents,
          'panToolButton': {
            ...panTool,
          },
          'toolbarGroup-Measure': {
            ...measureEnabledRibbon,
          }
        }
      }
      instance.UI.importModularComponents(configWithPanToolAndMeasureEnabled);
      expect(document.querySelector('[data-element="panToolButton"]')).to.not.be.null;
      expect(document.querySelector('[data-element="toolbarGroup-Measure"]')).to.not.be.null;
    });
  });

  describe('Test responsiveness algorithm', () => {
    it('should correctly add new elements to a header when there is no free space', async () => {
      if (isModularUI()) return; // Test doesn't work with Web components
      instance = await setupWebViewerInstance({ ui: 'default' });
      const iframe = window.document.querySelector('#viewerDiv iframe');
      iframe.style.height = '930px';
      iframe.style.width = '398px';

      const topHeaderDom = iframe.contentDocument.querySelector('[data-element="default-top-header"]');
      const currentFreeSpace = getCurrentFreeSpace('row', topHeaderDom);
      // 32 is the pattern size of a button that we are agoing to add
      expect(currentFreeSpace).to.lessThan(32);

      const topHeader = instance.UI.getModularHeader('default-top-header');
      const topHeaderItems = topHeader.getItems();
      const undoButton = createPresetButton(instance, 'undoButton');
      topHeader.setItems([...topHeader.getItems(), undoButton]);
      await waitFor(200);
      const topHeaderItemsAfterAddingTwoItems = topHeader.getItems();
      expect(topHeaderItemsAfterAddingTwoItems.length).to.equal(topHeaderItems.length + 1);
    });

    // https://apryse.atlassian.net/browse/WVR-7088
    it.skip('should close any open flyout when the screen is resized and elements are rearranged in the header', async () => {
      instance = await setupWebViewerInstance({ ui: 'default' });
      const iframe = document.querySelector('#viewerDiv iframe');
      iframe.style.width = '440px';
      await waitFor(1000);
      expect(iframe.contentDocument.querySelector('[data-element="groupedLeftHeaderButtonsFlyoutToggle"]')).to.not.be.null;

      instance.UI.toggleElementVisibility('groupedLeftHeaderButtonsFlyout');
      const isFlyoutOpen = instance.UI.isElementOpen('groupedLeftHeaderButtonsFlyout');
      expect(isFlyoutOpen).to.be.true;

      // resizing the screen to rearrange elements and close the flyout
      iframe.style.width = '470px';
      await waitFor(1000);
      const isFlyoutOpenAfterResize = instance.UI.isElementOpen('groupedLeftHeaderButtonsFlyout');
      expect(isFlyoutOpenAfterResize).to.be.false;
    });
  });

  describe('Test Panels', () => {
    it('should be able to add existing and new panels to a TabPanel', async () => {
      instance = await setupWebViewerInstance({ ui: 'default' }, true);
      let allPanels = instance.UI.getPanels();
      let tabPanel = allPanels.find((panel) => panel.dataElement === 'tabPanel');
      const stylePanel = allPanels.find((panel) => panel.dataElement === 'stylePanel');
      const newPanel = { render: 'searchPanel', dataElement: 'searchPanel' };
      const newTabPanels = tabPanel.panelsList;
      newTabPanels.push(newPanel);
      newTabPanels.push(stylePanel);
      tabPanel.panelsList = newTabPanels;
      allPanels = instance.UI.getPanels();
      tabPanel = allPanels.find((panel) => panel.dataElement === 'tabPanel');
      expect(tabPanel.panelsList.find((panel) => panel.dataElement === 'searchPanel')).to.not.be.undefined;
      expect(tabPanel.panelsList.find((panel) => panel.dataElement === 'stylePanel')).to.not.be.undefined;
    });
  });

  describe('API Tests', () => {
    it('can set the active ribbon item using the setActiveRibbonItem API', async () => {
      if (isModularUI()) return; // Test doesn't work with Web components
      instance = await setupWebViewerInstance({ ui: 'default' });
      const { document } = instance.UI.iframeWindow;
      // ensure that we start from View
      instance.UI.setActiveRibbonItem('toolbarGroup-View');
      await waitFor(1000);
      expect(instance.UI.getActiveRibbonItem()).to.equal('toolbarGroup-View');
      const ribbonItem = document.querySelector('[data-element="toolbarGroup-Shapes"]');
      expect(ribbonItem.classList.contains('active')).to.be.false;
      instance.UI.setActiveRibbonItem('toolbarGroup-Shapes');
      await waitFor(500);
      expect(instance.UI.getActiveRibbonItem()).to.equal('toolbarGroup-Shapes');
      expect(ribbonItem.classList.contains('active')).to.be.true;
      const ribbonItem2 = document.querySelector('[data-element="toolbarGroup-View"]');
      expect(ribbonItem2.classList.contains('active')).to.be.false;
      instance.UI.setActiveRibbonItem('toolbarGroup-View');
      await waitFor(500);
      expect(instance.UI.getActiveRibbonItem()).to.equal('toolbarGroup-View');
      expect(ribbonItem2.classList.contains('active')).to.be.true;
      // ensure that we switched out of Shapes
      expect(ribbonItem.classList.contains('active')).to.be.false;
    });
  });

  describe('Modular UI in ReadOnly mode', () => {
    it('When going into read only mode only the view ribbon is enabled', async ()=> {
      instance = await setupWebViewerInstance({ ui: 'default' }, true);
      instance.Core.annotationManager.enableReadOnlyMode();

      const ribbonItems = document.querySelector('apryse-webviewer').shadowRoot.querySelectorAll('.RibbonItem');
      expect(ribbonItems.length).to.be.equal(1);
      expect(ribbonItems[0].innerText).to.be.equal('View');
    });

    it('when going out read only mode, I should have the same number of ribbons enabled as before', async ()=> {
      instance = await setupWebViewerInstance({ ui: 'default' }, true);
      const shadowRoot = document.querySelector('apryse-webviewer').shadowRoot;
      const originalRibbonItems = shadowRoot.querySelectorAll('.RibbonItem');
      let ribbonItemsWhileInReadOnly;
      // View, Annotate, Shapes, Insert, Edit, Fill & Sign, Form
      expect(originalRibbonItems.length).to.be.equal(7);
      instance.Core.annotationManager.enableReadOnlyMode();
      ribbonItemsWhileInReadOnly = shadowRoot.querySelectorAll('.RibbonItem');
      expect(ribbonItemsWhileInReadOnly.length).to.be.equal(1);
      instance.Core.annotationManager.disableReadOnlyMode();
      const ribbonItemsAfter = shadowRoot.querySelectorAll('.RibbonItem');
      expect(ribbonItemsAfter.length).to.be.equal(7);
    });

    it('If I enable measurements and go in and out of readOnly, it is still enabled after going out of readOnly', async ()=> {
      instance = await setupWebViewerInstance({ ui: 'default', enableMeasurement: true }, true);
      const shadowRoot = document.querySelector('apryse-webviewer').shadowRoot;

      let ribbonItemsAfterMeasurements = shadowRoot.querySelectorAll('.RibbonItem');
      expect(ribbonItemsAfterMeasurements.length).to.be.equal(8);
      instance.Core.annotationManager.enableReadOnlyMode();
      const ribbonItemsWhileInReadOnly = shadowRoot.querySelectorAll('.RibbonItem');
      expect(ribbonItemsWhileInReadOnly.length).to.be.equal(1);
      instance.Core.annotationManager.disableReadOnlyMode();
      ribbonItemsAfterMeasurements = shadowRoot.querySelectorAll('.RibbonItem');
      expect(ribbonItemsAfterMeasurements.length).to.be.equal(8);
    });
  });
});