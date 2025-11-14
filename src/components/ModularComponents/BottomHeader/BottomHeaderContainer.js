import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import selectors from 'selectors';
import './BottomHeader.scss';
import ModularHeader from 'components/ModularComponents/ModularHeader';
import FloatingHeaderContainer from '../FloatingHeader';
import { PLACEMENT } from 'constants/customizationVariables';
import useResizeObserver from 'hooks/useResizeObserver';
import actions from 'actions';
import { useTranslation } from 'react-i18next';
import debounce from 'lodash/debounce';
import LazyLoadWrapper, { LazyLoadComponents } from 'components/LazyLoadWrapper';
import DataElements from 'constants/dataElement';

const BottomHeaderContainer = () => {
  //* Selectors *//
  const featureFlags = useSelector(selectors.getFeatureFlags, shallowEqual);
  const bottomHeaders = useSelector(selectors.getBottomHeaders, shallowEqual);
  const isSpreadsheetEditorModeEnabled = useSelector(selectors.isSpreadsheetEditorModeEnabled);
  const dispatch = useDispatch();
  const { customizableUI } = featureFlags;
  const { t } = useTranslation();

  const [floatingHeaders, fullLengthHeaders] = useMemo(() => {
    const floatingHeaders = [];
    const fullLengthHeaders = [];
    for (let header of bottomHeaders) {
      header.float ? floatingHeaders.push(header) : fullLengthHeaders.push(header);
    }
    return [floatingHeaders, fullLengthHeaders];
  }, [bottomHeaders]);

  const [elementRef, dimensions] = useResizeObserver();

  // Debounced function to set the bottom floating container height
  const setBottomFloatingContainerHeight = debounce((height) => {
    dispatch(actions.setBottomFloatingContainerHeight(height));
  }, 200);

  const setBottomFloatingContainerWidth = debounce((width) => {
    dispatch(actions.setHeaderWidth('bottomHeaders', width));
  }, 200);

  useEffect(() => {
    if (dimensions.height !== null && floatingHeaders.length > 0) {
      setBottomFloatingContainerHeight(dimensions.height);
      setBottomFloatingContainerWidth(dimensions.width);
    }
  }, [dimensions, floatingHeaders.length]);

  const modularHeaders = useMemo(() => fullLengthHeaders.map((header) => {
    const { dataElement } = header;
    return (
      <ModularHeader {...header} key={dataElement}/>
    );
  }), [fullLengthHeaders]);

  if (!customizableUI || (!bottomHeaders.length && !isSpreadsheetEditorModeEnabled)) {
    return null;
  }

  return (
    <nav className="bottom-headers-wrapper" aria-label={t('accessibility.landmarks.bottomHeader')}>
      {isSpreadsheetEditorModeEnabled &&
        <LazyLoadWrapper Component={LazyLoadComponents.SpreadsheetSwitcher}
          dataElement={DataElements.SPREADSHEET_SWITCHER}/>}
      <FloatingHeaderContainer floatingHeaders={floatingHeaders} placement={PLACEMENT.BOTTOM} ref={elementRef} />
      {modularHeaders}
    </nav>
  );
};

export default BottomHeaderContainer;
