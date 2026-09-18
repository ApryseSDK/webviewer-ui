import { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import DataElements from 'src/constants/dataElement';
import actions from 'actions';
import selectors from 'selectors';
import { noteStateFlyoutItems } from 'constants/flyoutConstants';

const noop = () => {};

const NoteStateFlyout = (props) => {
  const {
    noteId,
    handleStateChange = noop,
    isMultiSelectMode = false,
    items = noteStateFlyoutItems,
  } = props;

  const dispatch = useDispatch();

  const selectorSuffix = isMultiSelectMode ? '' : `-${noteId}`;
  const flyoutSelector = `${DataElements.NOTE_STATE_FLYOUT}${selectorSuffix}`;
  const currentFlyout = useSelector((state) => selectors.getFlyout(state, flyoutSelector));
  const statusList = useSelector((state) => selectors.getStatusList(state));

  const handleClick = (noteState) => {
    handleStateChange(noteState);
  };

  useLayoutEffect(() => {
    const filteredItems = items === noteStateFlyoutItems && statusList
      ? items.filter((item) => statusList.includes(item.option))
      : items;

    const noteStateFlyout = {
      dataElement: flyoutSelector,
      className: 'NoteStateFlyout',
      items: filteredItems.map((item) => {
        return {
          ...item,
          onClick: () => handleClick(item.option),
        };
      }),
    };

    if (!currentFlyout) {
      dispatch(actions.addFlyout(noteStateFlyout));
    } else {
      dispatch(actions.updateFlyout(noteStateFlyout.dataElement, noteStateFlyout));
    }
  }, [handleStateChange, items, statusList]);

  return null;
};

NoteStateFlyout.propTypes = {
  noteId: PropTypes.string,
  handleStateChange: PropTypes.func,
  isMultiSelectMode: PropTypes.bool,
  items: PropTypes.arrayOf(PropTypes.object),
};

export default NoteStateFlyout;