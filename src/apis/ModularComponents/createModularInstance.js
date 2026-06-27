import createGroupedItemsFactory from './groupedItems';
import createCustomButtonFactory from './customButton';
import createRibbonGroupFactory from './ribbonGroup';
import createRibbonItemFactory from './ribbonItem';
import PageControls from './pageControls';
import createPresetButtonFactory from './presetButton';
import createStatefulButtonFactory from './statefulButton';
import createToggleElementButtonFactory from './toggleElementButton';
import createToolButtonFactory from './toolButton';
import ViewControls from './viewControls';
import TabPanel from './tabPanel';
import Zoom from './zoom';
import createLabelFactory from './label';
import createDividerFactory from './divider';
import createCustomElementFactory from './customElement';
import { ITEM_TYPE } from 'constants/customizationVariables';

const storeBoundFactories = new WeakMap();

function getStoreBoundFactories(store) {
  let factories = storeBoundFactories.get(store);

  if (!factories) {
    factories = {
      createGroupedItems: createGroupedItemsFactory(store),
      createCustomButton: createCustomButtonFactory(store),
      createRibbonGroup: createRibbonGroupFactory(store),
      createRibbonItem: createRibbonItemFactory(store),
      createPresetButton: createPresetButtonFactory(store),
      createStatefulButton: createStatefulButtonFactory(store),
      createToggleElementButton: createToggleElementButtonFactory(store),
      createToolButton: createToolButtonFactory(store),
      createLabel: createLabelFactory(store),
      createDivider: createDividerFactory(store),
      createCustomElement: createCustomElementFactory(store),
    };
    storeBoundFactories.set(store, factories);
  }

  return factories;
}

export default function createModularInstance(item, store) {
  const factories = getStoreBoundFactories(store);

  return createModularInstanceWithFactories(item, factories);
}

function createModularInstanceWithFactories(item, factories) {
  const { type } = item;
  switch (type) {
    case ITEM_TYPE.GROUPED_ITEMS: {
      const nestedItems = item.items.map((nestedItem) => createModularInstanceWithFactories(nestedItem, factories));
      return factories.createGroupedItems({ ...item, items: nestedItems });
    }
    case ITEM_TYPE.BUTTON:
      return factories.createCustomButton(item);
    case ITEM_TYPE.RIBBON_GROUP: {
      const ribbonItems = item.items.map((nestedItem) => createModularInstanceWithFactories(nestedItem, factories));
      return factories.createRibbonGroup({ ...item, items: ribbonItems });
    }
    case ITEM_TYPE.RIBBON_ITEM:
      return factories.createRibbonItem(item);
    case ITEM_TYPE.PAGE_CONTROLS:
      return new PageControls(item);
    case ITEM_TYPE.PRESET_BUTTON:
      return factories.createPresetButton(item);
    case ITEM_TYPE.STATEFUL_BUTTON:
      return factories.createStatefulButton(item);
    case ITEM_TYPE.TOGGLE_BUTTON:
      return factories.createToggleElementButton(item);
    case ITEM_TYPE.TOOL_BUTTON:
      return factories.createToolButton(item);
    case ITEM_TYPE.VIEW_CONTROLS:
      return new ViewControls(item);
    case ITEM_TYPE.ZOOM:
      return new Zoom(item);
    case ITEM_TYPE.TABS_PANEL:
      return new TabPanel(item);
    case ITEM_TYPE.LABEL:
      return factories.createLabel(item);
    case ITEM_TYPE.DIVIDER:
      return factories.createDivider(item);
    case ITEM_TYPE.CUSTOM_ELEMENT:
      return factories.createCustomElement(item);
    default:
      // By default the items has all relevant info, so we just return it if for some reason no class exists
      // The benefit of returning an instance of a class is that that has
      // some extra methods that can be used to manipulate the item and refresh the UI
      return item;
  }
}
