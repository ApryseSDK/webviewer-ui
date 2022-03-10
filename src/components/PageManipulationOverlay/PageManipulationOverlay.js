import React from 'react';
import PageInsertionControls from './PageInsertionControls';
import PageRotationControls from './PageRotationControls';
import PageManipulationControls from './PageManipulationControls';
import PageAdditionalControls from "components/PageManipulationOverlay/PageAdditionalControls";
import CustomPageManipulationOperations from './CustomPageManipulationOperations';

function InitialPageManipulationOverlay({ children, pageNumbers, pageManipulationOverlayItems }) {

  const childrenArray = React.Children.toArray(children);

  return pageManipulationOverlayItems.map((item, index) => {
    const { dataElement, type } = item;
    let component = childrenArray.find(child => child.props.dataElement === dataElement);
    const key = dataElement || `${type}-${index}`;

    if (!component) {
      if (type === 'divider') {
        component = <div className="divider" />;
      }

      if (type === 'customPageOperation') {
        component = <CustomPageManipulationOperations key={dataElement} pageNumbers={pageNumbers} {...item} />;
      }
    }

    return component
      ? React.cloneElement(component, {
        key,
      })
      : null;
  });

}


function PageManipulationOverlay(props) {
  const { pageNumbers, pageManipulationOverlayItems } = props;

  return (
    <InitialPageManipulationOverlay pageNumbers={pageNumbers} pageManipulationOverlayItems={pageManipulationOverlayItems}>
      <PageAdditionalControls pageNumbers={pageNumbers} dataElement="pageAdditionalControls" />
      <PageRotationControls pageNumbers={pageNumbers} dataElement="pageRotationControls" />
      <PageInsertionControls dataElement="pageInsertionControls" pageNumbers={pageNumbers} />
      <PageManipulationControls pageNumbers={pageNumbers} dataElement="pageManipulationControls" />
    </InitialPageManipulationOverlay>
  );
}

export default PageManipulationOverlay;