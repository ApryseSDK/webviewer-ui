import React, { useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import ModularHeader from 'components/ModularComponents/ModularHeader';
import DataElements from 'constants/dataElement';
import { RESIZE_BAR_WIDTH } from 'constants/panel';
import './LeftHeader.scss';

function LeftHeaderContainer() {
  const [
    featureFlags,
    isLeftPanelOpen,
    leftPanelWidth,
    leftHeader,
    bottomHeadersHeight,
  ] = useSelector(
    (state) => [
      selectors.getFeatureFlags(state),
      selectors.isElementOpen(state, DataElements.LEFT_PANEL),
      selectors.getLeftPanelWidth(state),
      selectors.getLeftHeader(state),
      selectors.getBottomHeadersHeight(state),
    ]);

  const dispatch = useDispatch();
  const { modularHeader } = featureFlags;

  // TODO: can we extract this into a custom hook?
  const measuredHeaderRef = useCallback((node) => {
    if (node !== null) {
      dispatch(actions.setLeftHeaderWidth(node.offsetWidth));
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.borderBoxSize[0].inlineSize;
        dispatch(actions.setLeftHeaderWidth(width));
      }
    });

    observer.observe(node);
  }, []);

  const style = useMemo(() => {
    const styleObject = {};
    if (isLeftPanelOpen) {
      styleObject['transform'] = `translateX(${leftPanelWidth + RESIZE_BAR_WIDTH}px)`;
    }
    if (bottomHeadersHeight !== 0) {
      styleObject['height'] = `calc(100% - ${bottomHeadersHeight}px)`;
    }
    return styleObject;
  }, [isLeftPanelOpen, leftPanelWidth, bottomHeadersHeight]);

  if (modularHeader && leftHeader) {
    const { dataElement } = leftHeader;
    return (
      <ModularHeader ref={measuredHeaderRef} {...leftHeader} key={dataElement} style={style} />
    );
  }
  return null;
}

export default LeftHeaderContainer;