import React, { useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import ModularHeader from 'components/ModularComponents/ModularHeader';
import FloatingHeaderContainer from '../FloatingHeader';
import useResizeObserver from 'hooks/useResizeObserver';
import './LeftHeader.scss';
import { PLACEMENT } from 'constants/customizationVariables';

function LeftHeaderContainer() {
  const [
    featureFlags,
    leftPanelOpen,
    leftPanelWidth,
    leftHeaders,
    bottomHeadersHeight,
  ] = useSelector(
    (state) => {
      const genericLeftPanelOpen = selectors.getOpenGenericPanel(state, PLACEMENT.LEFT);
      return [
        selectors.getFeatureFlags(state),
        genericLeftPanelOpen,
        selectors.getPanelWidth(state, genericLeftPanelOpen),
        selectors.getLeftHeader(state),
        selectors.getBottomHeadersHeight(state),
      ];
    });

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
  }, [dimensions]);

  let style = useMemo(() => {
    const styleObject = {};
    if (leftPanelOpen) {
      styleObject['transform'] = `translateX(${leftPanelWidth}px)`;
    }
    if (bottomHeadersHeight !== 0) {
      styleObject['height'] = `calc(100% - ${bottomHeadersHeight}px)`;
    }
    return styleObject;
  }, [leftPanelOpen, leftPanelWidth, bottomHeadersHeight]);


  style = Object.assign({}, style, userDefinedStyle);

  if (customizableUI) {
    const renderLeftHeader = () => {
      if (leftHeader) {
        const { dataElement } = leftHeader;
        return (<ModularHeader ref={elementRef} {...leftHeader} key={dataElement} style={style} />);
      }
    };

    return (
      <>
        <FloatingHeaderContainer floatingHeaders={floatingHeaders} placement={PLACEMENT.LEFT} />
        {renderLeftHeader()}
      </>
    );
  }
  return null;
}

export default LeftHeaderContainer;