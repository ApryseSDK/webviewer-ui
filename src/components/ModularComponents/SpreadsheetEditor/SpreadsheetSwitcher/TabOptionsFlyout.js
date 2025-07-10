import { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import DataElements from 'src/constants/dataElement';
import actions from 'actions';
import selectors from 'selectors';
import useFocusHandler from 'hooks/useFocusHandler';

const TabOptionsFlyout = (props) => {
  const {
    sheetId,
    handleClick,
    sheetCount,
    disabled,
  } = props;

  const dispatch = useDispatch();
  const flyoutSelector = `${DataElements.SHEET_TAB_OPTIONS_FLYOUT}-${sheetId}`;
  const currentFlyout = useSelector((state) => selectors.getFlyout(state, flyoutSelector));

  const handleRenameWithFocus = useFocusHandler((e) => handleClick('Rename', e));
  const handleDeleteWithFocus = useFocusHandler((e) => handleClick('Delete', e));

  useLayoutEffect(() => {
    const noteStateFlyout = {
      dataElement: flyoutSelector,
      className: 'TabOptionsFlyout',
      items: [
        {
          label: 'action.rename',
          title: 'action.rename',
          option: 'Rename',
          dataElement: 'sheetTabRenameOption',
          onClick: handleRenameWithFocus,
        },
        {
          label: 'action.delete',
          title: 'action.delete',
          option: 'Delete',
          dataElement: 'sheetTabDeleteOption',
          onClick: handleDeleteWithFocus,
          disabled: (sheetCount === 1 || disabled),
        }
      ]
    };

    if (!currentFlyout) {
      dispatch(actions.addFlyout(noteStateFlyout));
    } else {
      dispatch(actions.updateFlyout(noteStateFlyout.dataElement, noteStateFlyout));
    }
  }, [sheetCount, disabled, handleClick]);

  return null;
};

TabOptionsFlyout.propTypes  = {
  sheetId: PropTypes.string,
  handleClick: PropTypes.func,
  sheetCount: PropTypes.number,
  disabled: PropTypes.bool,
};

export default TabOptionsFlyout;