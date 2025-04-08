import React, { forwardRef } from 'react';
import { useDispatch } from 'react-redux';
import DataElements from 'constants/dataElement';
import ActionButton from 'components/ActionButton';
import PropTypes from 'prop-types';
import actions from 'actions';
import FlyoutItemContainer from '../../../FlyoutItemContainer';
import { menuItems } from '../../../Helpers/menuItems';
import setCellAlignment from 'src/helpers/setCellAlignment';
import getSelectedCellsAlignment from 'src/helpers/getSelectedCellsAlignment';

const propTypes = {
  isFlyoutItem: PropTypes.bool,
  alignment: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
  alignmentValue: PropTypes.string,
};

const TextAlignmentButton = forwardRef((props, ref) => {
  const { isFlyoutItem, alignment, style, className, alignmentValue } = props;
  const dispatch = useDispatch();
  let isActive = false;

  const txt = alignment || 'cellTextAlignment';

  const { dataElement, icon, title } = menuItems[txt];
  const { verticalAlignment: currentVerticalAlignment } = getSelectedCellsAlignment();

  if (alignmentValue === currentVerticalAlignment) {
    isActive = true;
  }

  const handleClick = () => {
    setCellAlignment(alignmentValue);
    dispatch(actions.setFlyoutToggleElement(dataElement));
    dispatch(actions.toggleElement(DataElements.CELL_TEXT_ALIGNMENT_FLYOUT));
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
          ariaCurrent={isActive}
          isActive={isActive}
          dataElement={dataElement}
          title={title}
          img={icon}
          onClick={handleClick}
          style={style}
          className={className}
        />
      )
  );
});

TextAlignmentButton.propTypes = propTypes;
TextAlignmentButton.displayName = 'TextAlignmentButton';

export default TextAlignmentButton;