import React from 'react';

import LeftPanelPageTabsMore from '../LeftPanelPageTabsMore/LeftPanelPageTabsMore';
import LeftPanelPageTabsRotate from '../LeftPanelPageTabsRotate/LeftPanelPageTabsRotate';
import CustomLeftPanelOperations from '../CustomLeftPanelOperations/CustomLeftPanelOperations';
import LeftPanelPageTabsMove from 'components/LeftPanelPageTabs/LeftPanelPageTabsMove/LeftPanelPageTabsMove';


function InitialLeftPanelPageTabs({ children, pageNumbers, multiPageManipulationControlsItems }) {
  const childrenArray = React.Children.toArray(children);
  if (!multiPageManipulationControlsItems) {
    return childrenArray;
  }
  return multiPageManipulationControlsItems.map((item, index) => {
    const { dataElement, type } = item;
    let component = childrenArray.find((child) => child.props.dataElement === dataElement);
    const key = dataElement || `${type}-${index}`;

    if (!component) {
      if (type === 'divider') {
        component = <div className="divider" />;
      }

      if (type === 'customPageOperation') {
        component = <CustomLeftPanelOperations key={dataElement} pageNumbers={pageNumbers} {...item} />;
      }
    }
    return component
      ? React.cloneElement(component, {
        key,
      })
      : null;
  });
}


function LeftPanelPageTabs(props) {
  const {
    pageNumbers,
    onRotateClockwise,
    onRotateCounterClockwise,
    multiPageManipulationControlsItems,
    moveToTop,
    moveToBottom
  } = props;
  return (
    <div className={'PageControlContainer root'}>
      <InitialLeftPanelPageTabs pageNumbers={pageNumbers} multiPageManipulationControlsItems={multiPageManipulationControlsItems} >
        <LeftPanelPageTabsRotate onRotateClockwise={onRotateClockwise} onRotateCounterClockwise={onRotateCounterClockwise} dataElement="leftPanelPageTabsRotate" />
        <LeftPanelPageTabsMove moveToTop={moveToTop} moveToBottom={moveToBottom} dataElement="leftPanelPageTabsMove"/>
        <LeftPanelPageTabsMore dataElement="leftPanelPageTabsMore" />
      </InitialLeftPanelPageTabs>
    </div>
  );
}


export default LeftPanelPageTabs;
