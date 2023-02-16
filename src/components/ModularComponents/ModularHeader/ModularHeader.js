import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { PLACEMENT } from 'constants/customizationVariables';
import ModularHeaderItems from '../../ModularHeaderItems';
import './ModularHeader.scss';

const ModularHeader = React.forwardRef((props, ref) => {
  const { dataElement,
    placement,
    // position, // This is to be used for floating headers
    items = [],
    gap = 16,
    alignment = 'start',
    style
  } = props;
  const key = `${dataElement}-${placement}`;

  return (
    <div className={classNames({
      'ModularHeader': true,
      'TopHeader': placement === PLACEMENT.TOP,
      'BottomHeader': placement === PLACEMENT.BOTTOM,
      'LeftHeader': placement === PLACEMENT.LEFT,
      'RightHeader': placement === PLACEMENT.RIGHT,
    })}
    data-element={dataElement}
    key={key}
    style={style}
    ref={ref}
    >
      <ModularHeaderItems items={items} headerId={dataElement} gap={gap} placement={placement} alignment={alignment} />
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

export default ModularHeader;
