import React from 'react';
import { ITEM_TYPE } from 'constants/customizationVariables';
import CustomButton from '../CustomButton';
import StatefulButton from '../StatefulButton';
import GroupedItems from '../GroupedItems/GroupedItems';
import Divider from '../Divider';
import RibbonGroup from '../RibbonGroup';
import ToolGroupButton from '../ToolGroupButton';
import ToggleElementButton from '../ToggleElementButton';
import ZoomControls from '../ZoomControls';
import ToolButton from '../ToolButton';
import PageControls from '../PageControls';
import PresetButton from '../PresetButton';
import ViewControls from '../ViewControls';

const InnerItem = (props) => {
  const { type, dataElement, headerDirection, headerPlacement } = props;
  const key = `${type}-${dataElement}-${headerPlacement}`;

  switch (type) {
    case ITEM_TYPE.BUTTON:
      return <CustomButton key={key} {...props} />;
    case ITEM_TYPE.STATEFUL_BUTTON:
      return <StatefulButton key={key} {...props} />;
    case ITEM_TYPE.GROUPED_ITEMS:
      return <GroupedItems key={key} {...props} headerDirection={headerDirection} />;
    case ITEM_TYPE.RIBBON_ITEM:
      console.warn(`${ITEM_TYPE.RIBBON_ITEM} needs to be added to a ${ITEM_TYPE.RIBBON_GROUP}`);
    case ITEM_TYPE.DIVIDER:
      return <Divider headerDirection={headerDirection} {...props} />;
    case ITEM_TYPE.TOGGLE_BUTTON:
      return <ToggleElementButton key={key} {...props} />;
    case ITEM_TYPE.RIBBON_GROUP:
      return <RibbonGroup key={key} {...props} />;
    case ITEM_TYPE.TOOL_GROUP_BUTTON:
      return <ToolGroupButton key={key} {...props} />;
    case ITEM_TYPE.ZOOM:
      return <ZoomControls {...props} />;
    case ITEM_TYPE.TOOL_BUTTON:
      return <ToolButton key={key} {...props} />;
    case ITEM_TYPE.PAGE_CONTROLS:
      return <PageControls {...props} headerDirection={headerDirection} />;
    case ITEM_TYPE.PRESET_BUTTON:
      return <PresetButton key={key} {...props} />;
    case ITEM_TYPE.VIEW_CONTROLS:
      return <ViewControls key={key} {...props} />;
    default:
      console.warn(`${type} is not a valid item type.`);
      return null;
  }
};

export default InnerItem;