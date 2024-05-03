import React, { useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import './RightHeader.scss';
import ModularHeader from 'components/ModularComponents/ModularHeader';
import FloatingHeaderContainer from '../FloatingHeader';
import useResizeObserver from 'hooks/useResizeObserver';
import { PLACEMENT } from 'constants/customizationVariables';

function RightHeaderContainer() {
  const [
    featureFlags,
    rightHeaders,
    bottomHeadersHeight,
  ] = useSelector(
    (state) => [
      selectors.getFeatureFlags(state),
      selectors.getRightHeader(state),
      selectors.getBottomHeadersHeight(state),
    ]);
  const dispatch = useDispatch();
  const { customizableUI } = featureFlags;
  const floatingHeaders = rightHeaders.filter((header) => header.float);
  const fullLengthHeaders = rightHeaders.filter((header) => !header.float);
  if (fullLengthHeaders.length > 1) {
    console.warn(`Right headers only support one full length header but ${fullLengthHeaders.length} were added. Only the first one will be rendered.`);
  }

  const rightHeader = fullLengthHeaders[0];
  const userDefinedStyle = rightHeader ? rightHeader.style : {};
  const [elementRef, dimensions] = useResizeObserver();
  useEffect(() => {
    if (dimensions.width !== null) {
      dispatch(actions.setRightHeaderWidth(dimensions.width));
    }
  }, [dimensions]);

  // Memoize this since the ModularHeader is memoized, and we only want to re-render if the style actually changes
  let style = useMemo(() => {
    const styleObject = {};
    if (bottomHeadersHeight !== 0) {
      styleObject['height'] = `calc(100% - ${bottomHeadersHeight}px)`;
    }
    return styleObject;
  }, [bottomHeadersHeight]);
  style = Object.assign({}, style, userDefinedStyle);

  if (customizableUI) {
    const renderRightHeader = () => {
      if (rightHeader) {
        const { dataElement } = rightHeader;
        return (<ModularHeader ref={elementRef} {...rightHeader} key={dataElement} style={style} />);
      }
    };
    return (
      <div>
        <FloatingHeaderContainer floatingHeaders={floatingHeaders} placement={PLACEMENT.RIGHT} />
        {renderRightHeader()}
      </div>
    );
  }
  return null;
}

export default RightHeaderContainer;