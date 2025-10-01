import React, { useMemo, useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import './RightHeader.scss';
import ModularHeader from 'components/ModularComponents/ModularHeader';
import FloatingHeaderContainer from '../FloatingHeader';
import useResizeObserver from 'hooks/useResizeObserver';
import { PLACEMENT } from 'constants/customizationVariables';
import { useTranslation } from 'react-i18next';

function RightHeaderContainer() {

  //* Selectors *//
  const featureFlags = useSelector((state) => selectors.getFeatureFlags(state), shallowEqual);
  const rightHeaders = useSelector((state) => selectors.getRightHeader(state), shallowEqual);
  const bottomHeadersHeight = useSelector((state) => selectors.getBottomHeadersHeight(state));
  const rightPanelOpen = useSelector((state) => selectors.getOpenGenericPanel(state, PLACEMENT.RIGHT));
  const rightPanelWidth = useSelector((state) => selectors.getPanelWidth(state, rightPanelOpen));

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { customizableUI } = featureFlags;

  const [floatingHeaders, rightHeader] = useMemo(() => {
    const floatingHeaders = [];
    const fullLengthHeaders = [];
    for (let header of rightHeaders) {
      header.float ? floatingHeaders.push(header) : fullLengthHeaders.push(header);
    }
    if (fullLengthHeaders.length > 1) {
      console.warn(`Right headers only support one full length header but ${fullLengthHeaders.length} were added. Only the first one will be rendered.`);
    }
    return [floatingHeaders, fullLengthHeaders[0]];
  }, [rightHeaders]);

  const userDefinedStyle = rightHeader ? rightHeader.style : {};
  const [elementRef, dimensions] = useResizeObserver();

  useEffect(() => {
    if (dimensions.width !== null) {
      dispatch(actions.setHeaderWidth('rightHeader', dimensions.width));
    }
  }, [dimensions]);

  // Memoize the style calculations
  const style = useMemo(() => {
    const styleObject = {
      ...(rightPanelOpen && { transform: `translateX(-${rightPanelWidth}px)` }),
      ...(bottomHeadersHeight !== 0 && { height: `calc(100% - ${bottomHeadersHeight}px)` }),
      ...userDefinedStyle
    };
    return styleObject;
  }, [bottomHeadersHeight, rightPanelOpen, rightPanelWidth, userDefinedStyle]);

  const renderedHeader = useMemo(() => {
    if (rightHeader) {
      const { dataElement } = rightHeader;
      return (<ModularHeader ref={elementRef} {...rightHeader} key={dataElement} style={style}/>);
    }
  }, [rightHeader, style]);

  if (!customizableUI || !rightHeaders.length) {
    return null;
  }

  return (
    <nav className='RightHeaderNav' aria-label={t('accessibility.landmarks.rightHeader')}>
      <FloatingHeaderContainer floatingHeaders={floatingHeaders} placement={PLACEMENT.RIGHT} />
      {renderedHeader}
    </nav>
  );
}

export default RightHeaderContainer;
