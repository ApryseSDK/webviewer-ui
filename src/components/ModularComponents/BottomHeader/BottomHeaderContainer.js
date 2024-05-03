import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import selectors from 'selectors';
import './BottomHeader.scss';
import ModularHeader from 'components/ModularComponents/ModularHeader';
import FloatingHeaderContainer from '../FloatingHeader';
import DataElementWrapper from '../../DataElementWrapper';
import { PLACEMENT } from 'constants/customizationVariables';
import useResizeObserver from 'hooks/useResizeObserver';
import actions from 'actions';

const BottomHeaderContainer = () => {
  const [
    featureFlags,
    bottomHeaders
  ] = useSelector(
    (state) => [
      selectors.getFeatureFlags(state),
      selectors.getBottomHeaders(state)
    ]);
  const dispatch = useDispatch();
  const { customizableUI } = featureFlags;

  const floatingHeaders = bottomHeaders.filter((header) => header.float);
  const fullLengthHeader = bottomHeaders.filter((header) => !header.float);

  const [elementRef, dimensions] = useResizeObserver();
  useEffect(() => {
    if (dimensions.height !== null && floatingHeaders.length > 0) {
      dispatch(actions.setBottomFloatingContainerHeight(dimensions.height));
    }
  }, [dimensions, floatingHeaders.length]);

  if (customizableUI) {
    const modularHeaders = fullLengthHeader.map((header) => {
      const { dataElement } = header;
      return (
        <ModularHeader {...header} key={dataElement} />
      );
    });
    return (
      <DataElementWrapper dataElement="bottom-headers" className="bottom-headers-wrapper">
        <FloatingHeaderContainer floatingHeaders={floatingHeaders} placement={PLACEMENT.BOTTOM} ref={elementRef} />
        {modularHeaders}
      </DataElementWrapper>
    );
  }
  return null;
};

export default BottomHeaderContainer;