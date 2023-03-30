import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { ALIGNMENT, PLACEMENT } from 'constants/customizationVariables';
import ModularHeaderItems from '../../ModularHeaderItems';
import './ModularHeader.scss';

const ModularHeader = React.forwardRef((props, ref) => {
  const { dataElement,
    placement,
    position = '', // This is to be used for floating headers
    items = [],
    gap = 16,
    alignment = ALIGNMENT.START,
    style,
    autohide = true,
  } = props;
  const [loadedFirstTime, setLoadedFirstTime] = useState(true);

  useEffect(() => {
    setLoadedFirstTime(false);
  }, []);

  const [canRemoveItems, setCanRemoveItems] = useState(items.length);
  const [canApplyAnimation, setApplyAnimation] = useState(false);
  const key = `${dataElement}-${placement}`;

  let isClosed = false;
  if (!autohide) {
    isClosed = false;
  } else if (!items.length) {
    isClosed = true;
  }

  let originalItems = [];
  if (canRemoveItems) {
    originalItems = items;
  }
  // Why is this here? This needs to be in the right header not the generic one
  let headerStyle = style;
  if (placement === PLACEMENT.RIGHT && (canApplyAnimation || (isClosed && !loadedFirstTime))) {
    headerStyle = Object.assign({}, style, { position: 'fixed', right: 0 });
  }

  return (
    <div
      className={classNames({
        'ModularHeader': true,
        'closed': isClosed,
        'TopHeader': placement === PLACEMENT.TOP,
        'BottomHeader': placement === PLACEMENT.BOTTOM,
        'LeftHeader': placement === PLACEMENT.LEFT,
        'RightHeader': placement === PLACEMENT.RIGHT,
      }, `${position}`)}
      data-element={dataElement}
      key={key}
      style={headerStyle}
      ref={ref}
      onTransitionEnd={() => {
        setCanRemoveItems(!isClosed);
        setApplyAnimation(isClosed);
      }}
    >
      <ModularHeaderItems
        className={classNames({ 'closed': isClosed })}
        items={originalItems}
        headerId={dataElement}
        gap={gap}
        placement={placement}
        alignment={alignment}
      />
    </div>
  );
});

ModularHeader.propTypes = {
  dataElement: PropTypes.string,
  placement: PropTypes.string,
  position: PropTypes.string,
  items: PropTypes.array,
  gap: PropTypes.number,
  alignment: PropTypes.string,
};

ModularHeader.displayName = 'ModularHeader';

export default React.memo(ModularHeader);
