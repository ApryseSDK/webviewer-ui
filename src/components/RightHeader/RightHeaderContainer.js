import React, { createRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import './RightHeader.scss';
import ModularHeader from 'components/ModularComponents/ModularHeader';
import { PLACEMENT } from 'constants/customizationVariables';
import { getElementHeightBasedOnBottomHeaders, getModularHeaders } from 'helpers/headers';

function RightHeaderContainer() {
  const [
    featureFlags,
  ] = useSelector(
    (state) => [
      selectors.getFeatureFlags(state),
    ]);
  const headerRef = createRef();
  const [rightHeaderWidth, setRightHeaderWidth] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    const headerWidth = headerRef.current ? headerRef.current?.offsetWidth : 0;
    if (rightHeaderWidth !== headerWidth) {
      dispatch(actions.setRightHeaderWidth(headerWidth));
      setRightHeaderWidth(headerWidth);
    }
  }, [rightHeaderWidth, headerRef]);

  const { modularHeader } = featureFlags;
  const headerList = getModularHeaders();

  const rightHeader = headerList.find((header) => header.options.placement === PLACEMENT.RIGHT);
  const style = {};
  // Calculating its height according to the existing horizontal modular headers
  if (modularHeader) {
    style['height'] = getElementHeightBasedOnBottomHeaders();
  }

  if (modularHeader && rightHeader) {
    const { options } = rightHeader;
    return (
      <ModularHeader ref={headerRef} {...options} key={options.dataElement} style={style} />
    );
  }
  return null;
}

export default RightHeaderContainer;