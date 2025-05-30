import GroupedItems from './groupedItems';
import CustomButton from './customButton';
import RibbonGroup from './ribbonGroup';
import RibbonItem from './ribbonItem';
import PageControls from './pageControls';
import PresetButton from './presetButton';
import StatefulButton from './statefulButton';
import ToggleElementButton from './toggleElementButton';
import ToolButton from './toolButton';
import ViewControls from './viewControls';
import TabPanel from './tabPanel';
import Zoom from './zoom';
import Label from './label';
import Divider from './divider';
import CustomElement from './customElement';
import { ITEM_TYPE } from 'constants/customizationVariables';


export default function createModularInstance(item, store) {
  const { type } = item;
  switch (type) {
    case ITEM_TYPE.GROUPED_ITEMS:
      const nestedItems = item.items.map((nestedItem) => createModularInstance(nestedItem, store));
      return new GroupedItems(store)({ ...item, items: nestedItems });
    case ITEM_TYPE.BUTTON:
      return new CustomButton(store)(item);
    case ITEM_TYPE.RIBBON_GROUP:
      const ribbonItems = item.items.map((nestedItem) => createModularInstance(nestedItem, store));
      return new RibbonGroup(store)({ ...item, items: ribbonItems });
    case ITEM_TYPE.RIBBON_ITEM:
      return new RibbonItem(store)(item);
    case ITEM_TYPE.PAGE_CONTROLS:
      return new PageControls(item);
    case ITEM_TYPE.PRESET_BUTTON:
      return new PresetButton(store)(item);
    case ITEM_TYPE.STATEFUL_BUTTON:
      return new StatefulButton(store)(item);
    case ITEM_TYPE.TOGGLE_BUTTON:
      return new ToggleElementButton(store)(item);
    case ITEM_TYPE.TOOL_BUTTON:
      return new ToolButton(store)(item);
    case ITEM_TYPE.VIEW_CONTROLS:
      return new ViewControls(item);
    case ITEM_TYPE.ZOOM:
      return new Zoom(item);
    case ITEM_TYPE.TABS_PANEL:
      return new TabPanel(item);
    case ITEM_TYPE.LABEL:
      return new Label(store)(item);
    case ITEM_TYPE.DIVIDER:
      return new Divider(store)(item);
    case ITEM_TYPE.CUSTOM_ELEMENT:
      return new CustomElement(store)(item);
    default:
      // By default the items has all relevant info, so we just return it if for some reason no class exists
      // The benefit of returning an instance of a class is that that has
      // some extra methods that can be used to manipulate the item and refresh the UI
      return item;
  }
}