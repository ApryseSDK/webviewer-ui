import React, { createRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import ModularHeader from 'components/ModularComponents/ModularHeader';
import DataElements from 'constants/dataElement';
import { RESIZE_BAR_WIDTH } from 'constants/panel';
import { PLACEMENT } from 'constants/customizationVariables';
import { getModularHeaders, getElementHeightBasedOnBottomHeaders } from 'helpers/headers';
import './LeftHeader.scss';

function LeftHeaderContainer() {
  const [
    featureFlags,
    isLeftPanelOpen,
    leftPanelWidth
  ] = useSelector(
    (state) => [
      selectors.getFeatureFlags(state),
      selectors.isElementOpen(state, DataElements.LEFT_PANEL),
      selectors.getLeftPanelWidth(state),
    ]);

  const headerRef = createRef();
  const [leftHeaderWidth, setLeftHeaderWidth] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    const headerWidth = headerRef.current ? headerRef.current?.offsetWidth : 0;
    if (leftHeaderWidth !== headerWidth) {
      dispatch(actions.setLeftHeaderWidth(headerWidth));
      setLeftHeaderWidth(headerWidth);
    }
  }, [leftHeaderWidth, headerRef]);

  const { modularHeader } = featureFlags;

  const leftHeader = getModularHeaders().find((header) => header.options.placement === PLACEMENT.LEFT);
  const style = isLeftPanelOpen ? { transform: `translateX(${leftPanelWidth + RESIZE_BAR_WIDTH}px)` } : {};
  // Calculating its height according to the existing horizontal modular headers
  if (modularHeader) {
    style['height'] = getElementHeightBasedOnBottomHeaders();
  }

  if (modularHeader && leftHeader) {
    const { options } = leftHeader;

    return (
      <ModularHeader ref={headerRef} {...options} key={options.dataElement} style={style}/>
    );
  }
  return null;
}

export default LeftHeaderContainer;