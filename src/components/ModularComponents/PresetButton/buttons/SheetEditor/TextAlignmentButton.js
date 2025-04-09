import React, { forwardRef } from 'react';
import { useDispatch } from 'react-redux';
import DataElements from 'constants/dataElement';
import ActionButton from 'components/ActionButton';
import PropTypes from 'prop-types';
import actions from 'actions';
import FlyoutItemContainer from '../../../FlyoutItemContainer';
import { menuItems } from '../../../Helpers/menuItems';

const propTypes = {
  isFlyoutItem: PropTypes.bool,
  alignment: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
};

const TextAlignmentButton = forwardRef((props, ref) => {
  const { isFlyoutItem, alignment, style, className } = props;
  const dispatch = useDispatch();
  const isActive = false;

  let txt = 'cellTextAlignment';
  if (alignment) {
    txt = alignment;
  }
  const { dataElement, icon, title } = menuItems[txt];

  const handleClick = () => {
    // handle button click
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