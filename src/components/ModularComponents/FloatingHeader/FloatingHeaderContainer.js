import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import FloatingHeader from './FloatingHeader';
import './FloatingHeader.scss';
import classNames from 'classnames';
import { PLACEMENT, POSITION, DEFAULT_GAP } from 'src/constants/customizationVariables';

const FloatSection = (props) => {
  const { position, isVertical, gap = DEFAULT_GAP } = props;
  const className = classNames('FloatSection', position, { 'vertical': isVertical });
  const style = { gap: `${gap}px` };
  return (
    <div className={className} style={style}>
      {props.children}
    </div>
  );
};


const FloatingHeaderContainer = React.forwardRef((props, ref) => {
  const { floatingHeaders, placement } = props;
  // there are three possible positions for the floating sections: start, center, end
  // here we collect all the headers added and add them into one of these three containers
  const startHeaders = floatingHeaders.filter((header) => header.position === POSITION.START);
  const centerHeaders = floatingHeaders.filter((header) => header.position === POSITION.CENTER);
  const endHeaders = floatingHeaders.filter((header) => header.position === POSITION.END);

  const [
    isLeftPanelOpen,
    isRightPanelOpen,
    leftPanelWidth,
    rightPanelWidth,
    leftHeaderWidth,
    rightHeaderWidth,
    topHeadersHeight,
    bottomHeadersHeight,
  ] = useSelector((state) => [
    selectors.isElementOpen(state, 'leftPanel'),
    selectors.isElementOpen(state, 'notesPanel'),
    selectors.getLeftPanelWidthWithResizeBar(state),
    selectors.getNotesPanelWidthWithResizeBar(state),
    selectors.getActiveLeftHeaderWidth(state),
    selectors.getActiveRightHeaderWidth(state),
    selectors.getTopHeadersHeight(state),
    selectors.getBottomHeadersHeight(state),
  ]);

  const isHorizontalHeader = placement === PLACEMENT.TOP || placement === PLACEMENT.BOTTOM;

  const style = useMemo(() => {
    const styleObject = {};
    let panelsWidth = 0;
    const verticalHeaderWidth = rightHeaderWidth + leftHeaderWidth;
    let leftOffset = leftHeaderWidth;
    if (isLeftPanelOpen) {
      panelsWidth += leftPanelWidth;
      leftOffset += leftPanelWidth;
    }

    if (isRightPanelOpen) {
      panelsWidth += rightPanelWidth;
    }

    if (leftOffset !== 0) {
      styleObject['transform'] = `translate(${leftOffset}px, 0px)`;
    }

    // For the right floatie the translate X is always the default width of itself
    // panel state doesnt affect it because of the positioning of the divs
    // Hardcoded for now; we can make this dynamic later if we find issues
    if (placement === PLACEMENT.RIGHT) {
      styleObject['transform'] = 'translate(-41px, 0px)';
    }

    if (isHorizontalHeader && (panelsWidth !== 0 || verticalHeaderWidth !== 0)) {
      styleObject['width'] = `calc(100% - ${panelsWidth + verticalHeaderWidth}px)`;
    }

    if (!isHorizontalHeader) {
      // We also need to know the height of the floaties for this calculation
      styleObject['height'] = `calc(100% - ${topHeadersHeight + bottomHeadersHeight}px)`;
    }

    return styleObject;
  }, [isLeftPanelOpen, leftPanelWidth, isRightPanelOpen, rightPanelWidth, leftHeaderWidth, rightHeaderWidth, topHeadersHeight, bottomHeadersHeight, isHorizontalHeader]);

  const className = classNames('FloatingHeaderContainer', `${placement}`, { 'vertical': !isHorizontalHeader });

  const renderStartHeaders = () => {
    if (startHeaders.length === 0) {
      return null;
    }
    return (
      <FloatSection position={`start__${placement}`} isVertical={!isHorizontalHeader}>
        {startHeaders.map((header) => <FloatingHeader {...header} key={header.dataElement} />)}
      </FloatSection>
    );
  };

  const renderCenterHeaders = () => {
    if (centerHeaders.length === 0) {
      return null;
    }
    return (
      <FloatSection position={`center__${placement}`} isVertical={!isHorizontalHeader}>
        {centerHeaders.map((header) => <FloatingHeader {...header} key={header.dataElement} />)}
      </FloatSection>
    );
  };

  const renderEndHeaders = () => {
    if (endHeaders.length === 0) {
      return null;
    }
    return (
      <FloatSection position={`end__${placement}`} isVertical={!isHorizontalHeader}>
        {endHeaders.map((header) => <FloatingHeader {...header} key={header.dataElement} />)}
      </FloatSection>
    );
  };

  return (
    <div className={className} style={style} ref={ref}>
      {renderStartHeaders()}
      {renderCenterHeaders()}
      {renderEndHeaders()}
    </div>
  );
});

FloatingHeaderContainer.displayName = 'FloatingHeaderContainer';

export default FloatingHeaderContainer;