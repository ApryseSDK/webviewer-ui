import React, { useMemo, useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import ModularHeader from 'components/ModularComponents/ModularHeader';
import FloatingHeaderContainer from '../FloatingHeader';
import useResizeObserver from 'hooks/useResizeObserver';
import './LeftHeader.scss';
import { PLACEMENT } from 'constants/customizationVariables';
import { useTranslation } from 'react-i18next';

function LeftHeaderContainer() {

  const featureFlags = useSelector(selectors.getFeatureFlags, shallowEqual);
  const leftPanelOpen = useSelector((state) => selectors.getOpenGenericPanel(state, PLACEMENT.LEFT));
  const leftPanelWidth = useSelector((state) => selectors.getPanelWidth(state, leftPanelOpen));
  const leftHeaders = useSelector(selectors.getLeftHeader, shallowEqual);
  const bottomHeadersHeight = useSelector(selectors.getBottomHeadersHeight);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { customizableUI } = featureFlags;
  const floatingHeaders = leftHeaders.filter((header) => header.float);
  const fullLengthHeaders = leftHeaders.filter((header) => !header.float);
  if (fullLengthHeaders.length > 1) {
    console.warn(`Left headers only support one full length header but ${fullLengthHeaders.length} were added. Only the first one will be rendered.`);
  }

  const leftHeader = fullLengthHeaders[0];
  const userDefinedStyle = leftHeader ? leftHeader.style : {};
  const [elementRef, dimensions] = useResizeObserver();
  useEffect(() => {
    if (dimensions.width !== null) {
      dispatch(actions.setLeftHeaderWidth(dimensions.width));
    }
  }, [dimensions.width]);

  const style = useMemo(() => ({
    ...(leftPanelOpen && { transform: `translateX(${leftPanelWidth}px)` }),
    ...(bottomHeadersHeight !== 0 && { height: `calc(100% - ${bottomHeadersHeight}px)` }),
    ...userDefinedStyle
  }), [leftPanelOpen, leftPanelWidth, bottomHeadersHeight, userDefinedStyle]);

  if (!customizableUI || !leftHeaders.length) {
    return null;
  }

  const renderLeftHeader = () => {
    if (leftHeader) {
      const { dataElement } = leftHeader;
      return (<ModularHeader ref={elementRef} {...leftHeader} key={dataElement} style={style} />);
    }
  };

  return (
    <nav aria-label={t('accessibility.landmarks.leftHeader')}>
      <FloatingHeaderContainer floatingHeaders={floatingHeaders} placement={PLACEMENT.LEFT} />
      {renderLeftHeader()}
    </nav>
  );
}

export default LeftHeaderContainer;