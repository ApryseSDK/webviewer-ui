import React, { useEffect } from 'react';
import selectors from 'selectors';
import { useSelector, useDispatch } from 'react-redux';
import actions from 'actions';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import './RibbonItem.scss';


const RibbonItem = (props) => {
  const dispatch = useDispatch();
  const { dataElement, title, disabled, img, label, toolbarGroup, groupedItems = [] } = props;
  const [currentToolbarGroup] = useSelector((state) => [
    selectors.getCurrentToolbarGroup(state),
  ]);

  useEffect(() => {
    if (currentToolbarGroup === toolbarGroup) {
      const activeGroups = groupedItems.map((item) => item?.props?.dataElement);
      dispatch(actions.setCurrentGroupedItem(activeGroups));
    }
  }, []);

  const isActive = currentToolbarGroup === toolbarGroup;

  const onClick = () => {
    if (!isActive) {
      dispatch(actions.setToolbarGroup(toolbarGroup));
      const activeGroups = groupedItems.map((item) => item?.props?.dataElement);
      dispatch(actions.setCurrentGroupedItem(activeGroups));
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
