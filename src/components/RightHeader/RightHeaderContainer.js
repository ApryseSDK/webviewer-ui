import React, { useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import './RightHeader.scss';
import ModularHeader from 'components/ModularComponents/ModularHeader';

function RightHeaderContainer() {
  const [
    featureFlags,
    rightHeader,
    bottomHeadersHeight,
  ] = useSelector(
    (state) => [
      selectors.getFeatureFlags(state),
      selectors.getRightHeader(state),
      selectors.getBottomHeadersHeight(state),
    ]);
  const dispatch = useDispatch();
  const { modularHeader } = featureFlags;

  // TODO: can we extract this into a custom hook?
  const measuredHeaderRef = useCallback((node) => {
    if (node !== null) {
      dispatch(actions.setRightHeaderWidth(node.offsetWidth));
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.borderBoxSize[0].inlineSize;
        dispatch(actions.setRightHeaderWidth(width));
      }
    });

    observer.observe(node);
  }, []);


  // Memoize this since the ModularHeader is memoized, and we only want to re-render if the style actually changes
  const style = useMemo(() => {
    const styleObject = {};
    if (bottomHeadersHeight !== 0) {
      styleObject['height'] = `calc(100% - ${bottomHeadersHeight}px)`;
    }
    return styleObject;
  }, [bottomHeadersHeight]);

  if (modularHeader && rightHeader) {
    const { dataElement } = rightHeader;
    return (
      <ModularHeader ref={measuredHeaderRef} {...rightHeader} key={dataElement} style={style} />
    );
  }
  return null;
}

export default RightHeaderContainer;