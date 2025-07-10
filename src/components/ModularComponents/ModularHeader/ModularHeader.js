import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { JUSTIFY_CONTENT, PLACEMENT, DEFAULT_GAP } from 'constants/customizationVariables';
import ModularHeaderItems from '../../ModularHeaderItems';
import './ModularHeader.scss';
import DataElementWrapper from 'components/DataElementWrapper';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import useArrowNavigation from 'hooks/useArrowNavigation';

const ModularHeader = React.forwardRef((props, ref) => {
  const {
    dataElement,
    placement,
    position = '', // This is to be used for floating headers
    items = [],
    gap = DEFAULT_GAP,
    justifyContent = JUSTIFY_CONTENT.START,
    style,
    autoHide = true,
    stroke,
  } = props;

  const isDisabled = useSelector((state) => selectors.isElementDisabled(state, dataElement));

  const [canRemoveItems, setCanRemoveItems] = useState(items.length > 0);
  const key = `${dataElement}-${placement}`;
  const internalRef = useRef(null);
  // Use passed ref or fallback to internalRef. Passed ref is used by left/right headers
  const headerRef = ref || internalRef;

  const isHorizontal = placement === PLACEMENT.TOP || placement === PLACEMENT.BOTTOM;

  let isClosed = false;
  if (!autoHide) {
    isClosed = false;
  } else if (!items.length) {
    isClosed = true;
  }

  let originalItems = [];
  if (canRemoveItems) {
    originalItems = items;
  }

  useEffect(() => {
    setCanRemoveItems(!isClosed);
  }, [isClosed]);

  useArrowNavigation(headerRef, [items], {
    orientation: isHorizontal ? 'horizontal' : 'vertical',
    manageContainerTabIndex: true,
  });

  if (isDisabled) {
    return null;
  }

  return (
    <DataElementWrapper
      className={classNames({
        'ModularHeader': true,
        'closed': isClosed,
        'TopHeader': placement === PLACEMENT.TOP,
        'BottomHeader': placement === PLACEMENT.BOTTOM,
        'LeftHeader': placement === PLACEMENT.LEFT,
        'RightHeader': placement === PLACEMENT.RIGHT,
        'stroke': stroke,
      }, `${position}`)}
      data-element={dataElement}
      style={style}
      key={key}
      ref={headerRef}
      role="toolbar"
      aria-label={dataElement}
      aria-orientation={isHorizontal ? 'horizontal' : 'vertical'}
      tabIndex={-1}
    >
      <ModularHeaderItems
        className={classNames({ 'closed': isClosed })}
        items={originalItems}
        headerId={dataElement}
        gap={gap}
        placement={placement}
        justifyContent={justifyContent}
        parentRef={headerRef}
      />
    </DataElementWrapper>
  );
});

ModularHeader.propTypes = {
  dataElement: PropTypes.string,
  placement: PropTypes.string,
  position: PropTypes.string,
  items: PropTypes.array,
  gap: PropTypes.number,
  justifyContent: PropTypes.string,
  style: PropTypes.object,
  autoHide: PropTypes.bool,
  stroke: PropTypes.bool,
};

ModularHeader.displayName = 'ModularHeader';

export default React.memo(ModularHeader);
