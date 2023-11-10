import React from 'react';
import '../LeftPanelPageTabs/LeftPanelPageTabsContainer.scss';
import LeftPanelPageTabsMoreSmall from '../LeftPanelPageTabsMoreSmall/LeftPanelPageTabsMoreSmall';
import LeftPanelPageTabsInsertSmall from '../LeftPanelPageTabsInsertSmall/LeftPanelPageTabsInsertSmall';
import CustomLeftPanelOperations from '../CustomLeftPanelOperations/CustomLeftPanelOperations';
import LeftPanelPageTabsRotate from '../LeftPanelPageTabsRotate/LeftPanelPageTabsRotate';

function InitialLeftPanelPageTabsSmall({ children, pageNumbers, multiPageManipulationControlsItems }) {
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


function LeftPanelPageTabsSmall(props) {
  const { pageNumbers, multiPageManipulationControlsItemsSmall, onRotateClockwise, onRotateCounterClockwise } = props;
  return (
    <div className={'PageControlContainer root small'}>
      <InitialLeftPanelPageTabsSmall pageNumbers={pageNumbers} multiPageManipulationControlsItems={multiPageManipulationControlsItemsSmall}>
        <LeftPanelPageTabsRotate onRotateClockwise={onRotateClockwise}
          onRotateCounterClockwise={onRotateCounterClockwise}
          dataElement="leftPanelPageTabsRotate"/>
        <LeftPanelPageTabsInsertSmall dataElement="leftPanelPageTabsInsertSmall" />
        <LeftPanelPageTabsMoreSmall dataElement="leftPanelPageTabsMoreSmall" />
      </InitialLeftPanelPageTabsSmall>
    </div>
  );
}

export default LeftPanelPageTabsSmall;
