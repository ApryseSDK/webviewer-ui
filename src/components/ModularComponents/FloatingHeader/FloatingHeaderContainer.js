import React, { useMemo } from 'react';
import useFloatingHeaderSelectors from 'hooks/useFloatingHeaderSelectors';
import FloatingHeader from './FloatingHeader';
import './FloatingHeader.scss';
import classNames from 'classnames';
import { PLACEMENT, POSITION, DEFAULT_GAP } from 'constants/customizationVariables';
import useIsRTL from 'hooks/useIsRTL';

const FloatSection = ({ position, isVertical, children, gap = DEFAULT_GAP }) => {
  const className = classNames('FloatSection', position, { 'vertical': isVertical });
  return (
    <div className={className} style={{ gap: `${gap}px` }}>
      {children}
    </div>
  );
};

const FloatingHeaderContainer = React.forwardRef((props, ref) => {
  const { floatingHeaders, placement } = props;
  const isHorizontalHeader = [PLACEMENT.TOP, PLACEMENT.BOTTOM].includes(placement);
  const selectors = useFloatingHeaderSelectors();
  const isRTL = useIsRTL();

  const style = useMemo(() => computeFloatContainerStyle({
    ...selectors,
    isHorizontalHeader,
    placement,
    isRTL
  }), [selectors, isHorizontalHeader, placement]);

  const renderHeaders = (headers, positionPrefix) => (
    <FloatSection position={`${positionPrefix}__${placement}`} isVertical={!isHorizontalHeader}>
      {headers.map((header) => <FloatingHeader {...header} key={header.dataElement} />)}
    </FloatSection>
  );

  if (!floatingHeaders.length) {
    return null;
  }
  return (
    <div
      className={classNames('FloatingHeaderContainer', placement, { 'vertical': !isHorizontalHeader })}
      style={style}
      ref={ref}
    >
      {renderHeaders(floatingHeaders.filter((h) => h.position === POSITION.START), POSITION.START)}
      {renderHeaders(floatingHeaders.filter((h) => h.position === POSITION.CENTER), POSITION.CENTER)}
      {renderHeaders(floatingHeaders.filter((h) => h.position === POSITION.END), POSITION.END)}
    </div>
  );
});

FloatingHeaderContainer.displayName = 'FloatingHeaderContainer';

function computeFloatContainerStyle(params) {
  const {
    isLeftPanelOpen,
    leftPanelWidth,
    isRightPanelOpen,
    rightPanelWidth,
    leftHeaderWidth,
    rightHeaderWidth,
    isHorizontalHeader,
    topFloatingContainerHeight,
    bottomFloatingContainerHeight,
    topStartFloatingHeaders,
    bottomStartFloatingHeaders,
    topHeadersHeight,
    bottomHeadersHeight,
    bottomEndFloatingHeaders,
    topEndFloatingHeaders,
    placement,
    bottomHeadersWidth,
    isRTL
  } = params;

  const styles = {};
  const verticalHeaderWidth = rightHeaderWidth + leftHeaderWidth;
  const horizontalHeaderWidth = bottomHeadersWidth;
  const isStartPanelOpen = isRTL ? isRightPanelOpen : isLeftPanelOpen;
  const isEndPanelOpen = isRTL ? isLeftPanelOpen : isRightPanelOpen;
  const startPanelWidth = isRTL ? rightPanelWidth : leftPanelWidth;
  const endPanelWidth = isRTL ? leftPanelWidth : rightPanelWidth;
  let panelsWidth = 0;
  let startOffset = isRTL ? rightHeaderWidth : leftHeaderWidth;

  if (isStartPanelOpen) {
    panelsWidth += startPanelWidth;
    startOffset += startPanelWidth;
  }
  if (isEndPanelOpen) {
    panelsWidth += endPanelWidth;
  }

  if (startOffset !== 0) {
    const windowWidth = window.innerWidth;
    const remainingWidthForStart = windowWidth - endPanelWidth;
    const startExceedsRemainingWidth = startPanelWidth > remainingWidthForStart;
    const xOffset = startExceedsRemainingWidth ? remainingWidthForStart - horizontalHeaderWidth : startOffset;
    styles.transform = `translate(${isRTL ? -xOffset : xOffset}px, 0px)`;
  }
  if (placement === PLACEMENT.RIGHT) {
    styles.right = `${rightHeaderWidth}px`;
  }
  if (isHorizontalHeader && (panelsWidth || verticalHeaderWidth)) {
    styles.width = `calc(100% - ${panelsWidth + verticalHeaderWidth}px)`;
  }
  if (!isHorizontalHeader) {
    // if it is the left float header, and there are no top start floating headers, then we can take the full height
    // otherwise the height must accotun for the floating header container
    let topFloatingHeaderOffset = 0;
    let bottomFloatingHeaderOffset = 0;

    if (placement === PLACEMENT.LEFT) {
      topFloatingHeaderOffset = topStartFloatingHeaders.length === 0 ? 0 : topFloatingContainerHeight;
      bottomFloatingHeaderOffset = bottomStartFloatingHeaders.length === 0 ? 0 : bottomFloatingContainerHeight;
    }

    if (placement === PLACEMENT.RIGHT) {
      topFloatingHeaderOffset = topEndFloatingHeaders.length === 0 ? 0 : topFloatingContainerHeight;
      bottomFloatingHeaderOffset = bottomEndFloatingHeaders.length === 0 ? 0 : bottomFloatingContainerHeight;
    }

    styles.height = `calc(100% - ${topHeadersHeight + bottomHeadersHeight + topFloatingHeaderOffset + bottomFloatingHeaderOffset}px)`;
    if (topFloatingHeaderOffset) {
      styles.marginTop = `${topFloatingContainerHeight}px`;
      styles.paddingTop = '0px';
    }
    if (bottomFloatingHeaderOffset) {
      styles.paddingBottom = '0px';
    }
  }

  return styles;
}

export default FloatingHeaderContainer;