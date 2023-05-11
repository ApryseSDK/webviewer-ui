import React from 'react';
import '../LeftPanelPageTabs/LeftPanelPageTabsContainer.scss';
import LeftPanelPageTabsMoreSmall from '../LeftPanelPageTabsMoreSmall/LeftPanelPageTabsMoreSmall';
import LeftPanelPageTabsRotateSmall from '../LeftPanelPageTabsRotateSmall/LeftPanelPageTabsRotateSmall';
import LeftPanelPageTabsInsertSmall from '../LeftPanelPageTabsInsertSmall/LeftPanelPageTabsInsertSmall';
import CustomLeftPanelOperations from '../CustomLeftPanelOperations/CustomLeftPanelOperations';

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
  const { pageNumbers, multiPageManipulationControlsItemsSmall } = props;
  return (
    <div className={'PageControlContainer root small'}>
      <InitialLeftPanelPageTabsSmall pageNumbers={pageNumbers} multiPageManipulationControlsItems={multiPageManipulationControlsItemsSmall}>
        <LeftPanelPageTabsRotateSmall dataElement="leftPanelPageTabsRotateSmall" />
        <LeftPanelPageTabsInsertSmall dataElement="leftPanelPageTabsInsertSmall" />
        <LeftPanelPageTabsMoreSmall dataElement="leftPanelPageTabsMoreSmall" />
      </InitialLeftPanelPageTabsSmall>
    </div>
  );
}

export default LeftPanelPageTabsSmall;
