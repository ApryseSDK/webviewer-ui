import actions from 'actions';
import React, { useEffect, useCallback } from 'react';
import PageRotationControls from './PageRotationControls';
import PageManipulationControls from './PageManipulationControls';
import PageAdditionalControls from 'components/PageManipulationOverlay/PageAdditionalControls';
import CustomPageManipulationOperations from './CustomPageManipulationOperations';
import { workerTypes } from 'constants/types';
import core from 'core';

import { useDispatch } from 'react-redux';
import DataElements from 'src/constants/dataElement';

function InitialPageManipulationOverlay({ children, pageNumbers, pageManipulationOverlayItems }) {
  const childrenArray = React.Children.toArray(children);

  return pageManipulationOverlayItems.map((item, index) => {
    const { dataElement, type } = item;
    let component = childrenArray.find((child) => child.props.dataElement === dataElement);
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

  const dispatch = useDispatch();

  const closeOverlay = useCallback(() => {
    dispatch(actions.setPageManipulationOverlayAlternativePosition(null));
    dispatch(actions.closeElements([DataElements.PAGE_MANIPULATION_OVERLAY]));
  }, [dispatch]);

  const document = core.getDocument();
  const documentType = document?.type;
  const isXod = documentType === workerTypes.XOD;
  const isOffice = documentType === workerTypes.OFFICE || documentType === workerTypes.LEGACY_OFFICE;
  let filteredPageManipulationOverlayItems = pageManipulationOverlayItems;
  if (isXod || isOffice) {
    const removedIndices = filteredPageManipulationOverlayItems.reduce((acc, { dataElement }, index) => {
      if (dataElement === 'pageAdditionalControls') {
        acc.push(index);
        if (filteredPageManipulationOverlayItems[index + 1]?.type === 'divider') {
          acc.push(index + 1);
        }
      }
      if (dataElement === 'pageManipulationControls') {
        acc.push(index);
        if (filteredPageManipulationOverlayItems[index - 1]?.type === 'divider') {
          acc.push(index - 1);
        }
      }
      return acc;
    }, []);
    filteredPageManipulationOverlayItems = filteredPageManipulationOverlayItems.filter((_, index) => !removedIndices.includes(index));
  }

  useEffect(() => {
    core.addEventListener('documentLoaded', closeOverlay);
    return () => {
      core.removeEventListener('documentLoaded', closeOverlay);
    };
  }, []);

  return (
    <InitialPageManipulationOverlay pageNumbers={pageNumbers} pageManipulationOverlayItems={filteredPageManipulationOverlayItems}>
      { !isXod && !isOffice && <PageAdditionalControls pageNumbers={pageNumbers} dataElement="pageAdditionalControls" /> }
      <PageRotationControls pageNumbers={pageNumbers} dataElement="pageRotationControls" />
      { !isXod && !isOffice && <PageManipulationControls pageNumbers={pageNumbers} dataElement="pageManipulationControls" /> }
    </InitialPageManipulationOverlay>
  );
}

export default PageManipulationOverlay;