import { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import PropTypes from 'prop-types';

const AdditionalTabsFlyout = (props) => {
  const {
    id = '',
    additionalTabs,
    tabsForReference,
    onClick,
    activeItem,
  } = props;
  const dispatch = useDispatch();

  const currentFlyout = useSelector((state) => selectors.getFlyout(state, id));

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
    if (!currentFlyout) {
      dispatch(actions.addFlyout(noteStateFlyout));
    } else {
      dispatch(actions.updateFlyout(noteStateFlyout.dataElement, noteStateFlyout));
    }
  }, [tabsForReference, activeItem]);

  return null;
};

AdditionalTabsFlyout.propTypes = {
  id: PropTypes.string,
  additionalTabs: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    sheetIndex: PropTypes.number,
    disabled: PropTypes.bool,
  })),
  tabsForReference: PropTypes.array,
  onClick: PropTypes.func,
  activeItem: PropTypes.string,
};

export default AdditionalTabsFlyout;


