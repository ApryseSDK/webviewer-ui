import React, { useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import selectors from 'selectors';
import './BottomHeader.scss';
import ModularHeader from 'components/ModularComponents/ModularHeader';
import FloatingHeaderContainer from '../FloatingHeader';
import { PLACEMENT } from 'constants/customizationVariables';
import useResizeObserver from 'hooks/useResizeObserver';
import actions from 'actions';
import { useTranslation } from 'react-i18next';
import  debounce from 'lodash/debounce';

const BottomHeaderContainer = () => {
  //* Selectors *//
  const featureFlags = useSelector(selectors.getFeatureFlags, shallowEqual);
  const bottomHeaders = useSelector(selectors.getBottomHeaders, shallowEqual);
  const dispatch = useDispatch();
  const { customizableUI } = featureFlags;
  const { t } = useTranslation();

  const floatingHeaders = bottomHeaders.filter((header) => header.float);
  const fullLengthHeader = bottomHeaders.filter((header) => !header.float);

  const [elementRef, dimensions] = useResizeObserver();

  // Debounced function to set the bottom floating container height
  const setBottomFloatingContainerHeight = debounce((height) => {
    dispatch(actions.setBottomFloatingContainerHeight(height));
  }, 200);

  useEffect(() => {
    if (dimensions.height !== null && floatingHeaders.length > 0) {
      setBottomFloatingContainerHeight(dimensions.height);
    }
  }, [dimensions, floatingHeaders.length]);

  if (!customizableUI || !bottomHeaders.length) {
    return null;
  }

  const modularHeaders = fullLengthHeader.map((header) => {
    const { dataElement } = header;
    return (
      <ModularHeader {...header} key={dataElement} />
    );
  });

  return (
    <nav className="bottom-headers-wrapper" aria-label={t('accessibility.landmarks.bottomHeader')}>
      <FloatingHeaderContainer floatingHeaders={floatingHeaders} placement={PLACEMENT.BOTTOM} ref={elementRef} />
      {modularHeaders}
    </nav>
  );
};

export default BottomHeaderContainer;
