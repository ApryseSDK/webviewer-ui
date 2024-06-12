import React, { useEffect, useState } from 'react';
import Wv3dPropertiesPanel from './Wv3dPropertiesPanel';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';

import { isMobileSize } from 'helpers/getDeviceSize';

const Wv3dPropertiesPanelContainer = () => {
  const [isOpen, isDisabled, wv3dPropertiesPanelWidth, isInDesktopOnlyMode, modelData, schema] = useSelector(
    (state) => [
      selectors.isElementOpen(state, 'wv3dPropertiesPanel'),
      selectors.isElementDisabled(state, 'wv3dPropertiesPanel'),
      selectors.getWv3dPropertiesPanelWidth(state),
      selectors.isInDesktopOnlyMode(state),
      selectors.getWv3dPropertiesPanelModelData(state),
      selectors.getWv3dPropertiesPanelSchema(state),
    ],
    shallowEqual,
  );

  const isMobile = isMobileSize();

  const dispatch = useDispatch();

  const closeWv3dPropertiesPanel = () => {
    dispatch(actions.closeElement('wv3dPropertiesPanel'));
  };

  const [renderNull, setRenderNull] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setRenderNull(!isOpen);
    }, 500);
    return () => {
      clearTimeout(timeout);
    };
  }, [isOpen]);

  if (isDisabled || (!isOpen && renderNull)) {
    return null;
  }

  return (
    <Wv3dPropertiesPanel
      isInDesktopOnlyMode={isInDesktopOnlyMode}
      isMobile={isMobile}
      currentWidth={wv3dPropertiesPanelWidth}
      closeWv3dPropertiesPanel={closeWv3dPropertiesPanel}
      modelData={modelData}
      schema={schema}
    />
  );
};

export default Wv3dPropertiesPanelContainer;
