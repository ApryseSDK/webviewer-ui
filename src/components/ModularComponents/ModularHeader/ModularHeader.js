import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { JUSTIFY_CONTENT, PLACEMENT, DEFAULT_GAP } from 'constants/customizationVariables';
import ModularHeaderItems from '../../ModularHeaderItems';
import './ModularHeader.scss';
import DataElementWrapper from 'src/components/DataElementWrapper';
import { useSelector } from 'react-redux';
import selectors from 'selectors';

const ModularHeader = React.forwardRef((props, ref) => {
  const { dataElement,
    placement,
    position = '', // This is to be used for floating headers
    items = [],
    gap = DEFAULT_GAP,
    justifyContent = JUSTIFY_CONTENT.START,
    style,
    autoHide = true,
    stroke,
  } = props;

  const [
    isDisabled,
  ] = useSelector((state) => [
    selectors.isElementDisabled(state, dataElement),
  ]);

  const [canRemoveItems, setCanRemoveItems] = useState(items.length);
  const key = `${dataElement}-${placement}`;

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
        'stroke': stroke
      }, `${position}`)}
      data-element={dataElement}
      style={style}
      key={key}
      ref={ref}
      // onTransitionEnd={() => {
      //   setCanRemoveItems(!isClosed);
      //   setApplyAnimation(isClosed);
      // }}
    >
      <ModularHeaderItems
        className={classNames({ 'closed': isClosed })}
        items={originalItems}
        headerId={dataElement}
        gap={gap}
        placement={placement}
        justifyContent={justifyContent}
        parentRef={ref}
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
};

ModularHeader.displayName = 'ModularHeader';

export default React.memo(ModularHeader);
