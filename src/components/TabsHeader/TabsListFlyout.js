import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import PropTypes from 'prop-types';

const TabsListFlyout = (props) => {
  const {
    id = '',
    additionalTabs,
  } = props;
  const dispatch = useDispatch();

  const currentFlyout = useSelector((state) => selectors.getFlyout(state, id));

  useEffect(() => {
    const noteStateFlyout = {
      dataElement: id,
      className: 'TabsListFlyout',
      items: additionalTabs.map((item) => {
        const { id, tab } = item.props;
        const filename = tab.options.filename;

        return {
          label: filename,
          title: filename,
          option: filename,
          dataElement: id,
          onClick: item.props.setActive,
          draggable: true,
          onDragStart: (e) => item.props.onDragStart(e),
          onDragEnd: () => item.props.onDragEnd(),
          closeTab: item.props.closeTab,
        };
      })
    };
    if (!currentFlyout) {
      dispatch(actions.addFlyout(noteStateFlyout));
    } else {
      dispatch(actions.updateFlyout(noteStateFlyout.dataElement, noteStateFlyout));
    }
  }, [additionalTabs]);

  return null;
};

TabsListFlyout.propTypes = {
  id: PropTypes.string,
  additionalTabs: PropTypes.array,
};

export default TabsListFlyout;