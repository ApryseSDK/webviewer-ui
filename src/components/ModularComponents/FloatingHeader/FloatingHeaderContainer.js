import React, { useMemo } from 'react';
import useFloatingHeaderSelectors from 'hooks/useFloatingHeaderSelectors';
import FloatingHeader from './FloatingHeader';
import './FloatingHeader.scss';
import classNames from 'classnames';
import { PLACEMENT, POSITION, DEFAULT_GAP } from 'src/constants/customizationVariables';

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

  const style = useMemo(() => computeFloatContainerStyle({
    ...selectors,
    isHorizontalHeader,
    placement,
  }), [selectors, isHorizontalHeader, placement]);

  const renderHeaders = (headers, positionPrefix) => (
    <FloatSection position={`${positionPrefix}__${placement}`} isVertical={!isHorizontalHeader}>
      {headers.map((header) => <FloatingHeader {...header} key={header.dataElement} />)}
    </FloatSection>
  );

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
    placement
  } = params;

  const styles = {};
  const verticalHeaderWidth = rightHeaderWidth + leftHeaderWidth;
  let panelsWidth = 0;
  let leftOffset = leftHeaderWidth;

  if (isLeftPanelOpen) {
    panelsWidth += leftPanelWidth;
    leftOffset += leftPanelWidth;
  }
  if (isRightPanelOpen) {
    panelsWidth += rightPanelWidth;
  }

  if (leftOffset !== 0) {
    styles.transform = `translate(${leftOffset}px, 0px)`;
  }
  if (placement === PLACEMENT.RIGHT) {
    styles.transform = 'translate(-48px, 0px)';
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