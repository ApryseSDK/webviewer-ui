import React from 'react';
import selectors from 'selectors';
import { useSelector, useDispatch } from 'react-redux';
import actions from 'actions';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import './RibbonItem.scss';


const RibbonItem = (props) => {
  const { dataElement, title, disabled, img, label, toolbarGroup } = props;
  const [currentToolbarGroup] = useSelector((state) => [
    selectors.getCurrentToolbarGroup(state),
  ]);

  const dispatch = useDispatch();

  const isActive = currentToolbarGroup === toolbarGroup;

  const onClick = () => {
    if (!isActive) {
      dispatch(actions.setToolbarGroup(toolbarGroup));
    }
  };

  return (
    <div className="RibbonItem">
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

RibbonItem.propTypes = {
  dataElement: PropTypes.string,
  title: PropTypes.string,
  disabled: PropTypes.bool,
  img: PropTypes.string,
  label: PropTypes.string,
  getCurrentToolbarGroup: PropTypes.func,
  toolbarGroup: PropTypes.string,
};

export default RibbonItem;
