import { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import DataElements from 'src/constants/dataElement';
import actions from 'actions';
import selectors from 'selectors';

const createFlyoutItem = (option, icon, dataElement) => ({
  icon,
  label: `option.state.${option.toLowerCase()}`,
  title: `option.state.${option.toLowerCase()}`,
  option,
  dataElement,
});

export const noteStateFlyoutItems = [
  createFlyoutItem('Accepted', 'icon-annotation-status-accepted', 'noteStateFlyoutAcceptedOption'),
  createFlyoutItem('Rejected', 'icon-annotation-status-rejected', 'noteStateFlyoutRejectedOption'),
  createFlyoutItem('Cancelled', 'icon-annotation-status-cancelled', 'noteStateFlyoutCancelledOption'),
  createFlyoutItem('Completed', 'icon-annotation-status-completed', 'noteStateFlyoutCompletedOption'),
  createFlyoutItem('None', 'icon-annotation-status-none', 'noteStateFlyoutNoneOption'),
  createFlyoutItem('Marked', 'icon-annotation-status-marked', 'noteStateFlyoutMarkedOption'),
  createFlyoutItem('Unmarked', 'icon-annotation-status-unmarked', 'noteStateFlyoutUnmarkedOption'),
];

const NoteStateFlyout = (props) => {
  const {
    noteId,
    handleStateChange = () => {},
    isMultiSelectMode = false,
  } = props;

  const dispatch = useDispatch();

  const selectorSuffix = isMultiSelectMode ? '' : `-${noteId}`;
  const flyoutSelector = `${DataElements.NOTE_STATE_FLYOUT}${selectorSuffix}`;
  const currentFlyout = useSelector((state) => selectors.getFlyout(state, flyoutSelector));

  const handleClick = (noteState) => {
    handleStateChange(noteState);
  };

  useLayoutEffect(() => {
    const noteStateFlyout = {
      dataElement: flyoutSelector,
      className: 'NoteStateFlyout',
      items: noteStateFlyoutItems.map((item) => {
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
  }, [handleStateChange]);

  return null;
};

NoteStateFlyout.propTypes = {
  noteId: PropTypes.string,
  handleStateChange: PropTypes.func,
  isMultiSelectMode: PropTypes.bool,
};

export default NoteStateFlyout;