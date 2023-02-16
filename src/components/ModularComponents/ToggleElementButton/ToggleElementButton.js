import React from 'react';
import selectors from 'selectors';
import { useSelector, useDispatch } from 'react-redux';
import actions from 'actions';
import PropTypes from 'prop-types';
import './ToggleElementButton.scss';
import Button from 'components/Button';

const ToggleElementButton = (props) => {
  const { dataElement, title, disabled, img, label, toggleElement } = props;
  const [isActive] = useSelector((state) => [
    selectors.isElementOpen(state, toggleElement),
  ]);

  const dispatch = useDispatch();

  const onClick = () => {
    if (isActive) {
      dispatch(actions.closeElement(toggleElement));
    } else {
      dispatch(actions.openElement(toggleElement));
    }
  };

  return (
    <div className='ToggleElementButton' data-element={dataElement}>
      <Button
        isActive={isActive}
        dataElement={dataElement}
        img={img}
        label={label}
        title={title}
        onClick={onClick}
        disabled={disabled}
      >
      </Button>
    </div>
  );
};

ToggleElementButton.propTypes = {
  isActive: PropTypes.bool,
  closeElement: PropTypes.func,
  openElement: PropTypes.func,
};

export default ToggleElementButton;
