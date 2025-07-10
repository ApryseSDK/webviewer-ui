import React, { forwardRef } from 'react';
import ActionButton from 'components/ActionButton';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import selectors from 'selectors';
import FlyoutItemContainer from '../../../FlyoutItemContainer';
import { menuItems } from '../../../Helpers/menuItems';
import mergeCellRange from 'src/helpers/mergeCellRange';

const propTypes = {
  type: PropTypes.string,
  isFlyoutItem: PropTypes.bool,
  style: PropTypes.object,
  className: PropTypes.string,
};

const MergeToggleButton = forwardRef((props, ref) => {
  const { isFlyoutItem, type, style, className } = props;
  const isMerged = useSelector((state) => selectors.getIsCellRangeMerged(state));
  const isCellRangeMergeDisabled = useSelector((state) => selectors.getIsSingleCell(state));
  const { dataElement, icon, title } = menuItems[isMerged ? 'cellUnmergeToggle' : 'cellMergeToggle'];

  const handleClick = () => {
    mergeCellRange(!isMerged);
  };

  return (
    isFlyoutItem ?
      <FlyoutItemContainer
        {...props}
        ref={ref}
        onClick={handleClick}
        additionalClass={isMerged ? 'active' : ''}
      />
      : (
        <ActionButton
          key={type}
          isActive={isMerged}
          onClick={handleClick}
          dataElement={dataElement}
          title={title}
          img={icon}
          ariaPressed={isMerged}
          style={style}
          className={className}
          disabled={isCellRangeMergeDisabled}
        />
      )
  );
});

MergeToggleButton.propTypes = propTypes;
MergeToggleButton.displayName = 'MergeToggleButton';

export default MergeToggleButton;