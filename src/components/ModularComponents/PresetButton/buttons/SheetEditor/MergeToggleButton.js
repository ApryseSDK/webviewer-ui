import React, { forwardRef, useState } from 'react';
import ActionButton from 'components/ActionButton';
import PropTypes from 'prop-types';
import FlyoutItemContainer from '../../../FlyoutItemContainer';
import { menuItems } from '../../../Helpers/menuItems';

const propTypes = {
  type: PropTypes.string,
  isFlyoutItem: PropTypes.bool,
  style: PropTypes.object,
  className: PropTypes.string,
};

const MergeToggleButton = forwardRef((props, ref) => {
  const { isFlyoutItem, type, style, className } = props;
  const isActive = false;
  const [isMerged, setIsMerged] = useState(false);

  const { dataElement, icon, title } = menuItems[isMerged ? 'cellUnmergeToggle' : 'cellMergeToggle'];

  const handleClick = () => {
    // handle button click
    setIsMerged(!isMerged);
  };

  return (
    isFlyoutItem ?
      <FlyoutItemContainer
        {...props}
        ref={ref}
        onClick={handleClick}
        additionalClass={isActive ? 'active' : ''}
      />
      : (
        <ActionButton
          key={type}
          isActive={isActive}
          onClick={handleClick}
          dataElement={dataElement}
          title={title}
          img={icon}
          ariaPressed={isActive}
          style={style}
          className={className}
        />
      )
  );
});

MergeToggleButton.propTypes = propTypes;
MergeToggleButton.displayName = 'MergeToggleButton';

export default MergeToggleButton;