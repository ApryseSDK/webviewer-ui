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
  dataElement: PropTypes.string,
  buttonStyle: PropTypes.object,
  /** @deprecated Use buttonStyle instead. */
  style: PropTypes.object,
  className: PropTypes.string,
  img: PropTypes.string,
  title: PropTypes.string,
};

const MergeToggleButton = forwardRef((props, ref) => {
  const isMerged = useSelector((state) => selectors.getIsCellRangeMerged(state));
  const isCellRangeMergeDisabled = useSelector((state) => selectors.getIsSingleCell(state));
  const menuItem = menuItems[isMerged ? 'cellUnmergeToggle' : 'cellMergeToggle'];

  const {
    isFlyoutItem,
    type,
    buttonStyle,
    className,
    dataElement = menuItem.dataElement,
    img: icon = menuItem.icon,
    title = menuItem.title,
  } = props;
  const resolvedButtonStyle = buttonStyle ?? props.style;

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
        disabled={isCellRangeMergeDisabled}
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
          buttonStyle={resolvedButtonStyle}
          className={className}
          disabled={isCellRangeMergeDisabled}
        />
      )
  );
});

MergeToggleButton.propTypes = propTypes;
MergeToggleButton.displayName = 'MergeToggleButton';

export default MergeToggleButton;