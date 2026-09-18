import { useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import actions from 'actions';
import PropTypes from 'prop-types';

const AdditionalTabsFlyout = (props) => {
  const {
    id = '',
    additionalTabs,
    onClick,
    activeItem,
  } = props;
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    const noteStateFlyout = {
      dataElement: id,
      className: 'AdditionalTabsFlyout',
      items: additionalTabs.map((item) => {
        const tabLabel = item.name;

        return {
          label: tabLabel,
          title: tabLabel,
          option: tabLabel,
          disabled: item.disabled,
          isActive: tabLabel === activeItem,
          dataElement: Symbol(tabLabel).toString(),
          onClick: () => onClick(tabLabel, item.sheetIndex),
        };
      })
    };
    dispatch(actions.updateFlyout(noteStateFlyout.dataElement, noteStateFlyout));
  }, [additionalTabs, activeItem, dispatch, id, onClick]);

  return null;
};

AdditionalTabsFlyout.propTypes = {
  id: PropTypes.string,
  additionalTabs: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    sheetIndex: PropTypes.number,
    disabled: PropTypes.bool,
  })),
  onClick: PropTypes.func,
  activeItem: PropTypes.string,
};

export default AdditionalTabsFlyout;

