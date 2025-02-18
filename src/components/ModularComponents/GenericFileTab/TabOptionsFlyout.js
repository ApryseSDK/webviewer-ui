import { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import DataElements from 'src/constants/dataElement';
import actions from 'actions';
import selectors from 'selectors';

const createFlyoutItem = (option, dataElement) => ({
  label: `action.${option.toLowerCase()}`,
  title: `action.${option.toLowerCase()}`,
  option,
  dataElement,
});

export const sheetTabOptionsFlyoutItems = [
  createFlyoutItem('Rename', 'sheetTabRenameOption'),
  createFlyoutItem('Delete', 'sheetTabDeleteOption'),
];

const TabOptionsFlyout = (props) => {
  const {
    sheetId,
    handleClick,
    tabs,
  } = props;

  const dispatch = useDispatch();
  const flyoutSelector = `${DataElements.SHEET_TAB_OPTIONS_FLYOUT}-${sheetId}`;
  const currentFlyout = useSelector((state) => selectors.getFlyout(state, flyoutSelector));

  const update = () => {
    const noteStateFlyout = {
      dataElement: flyoutSelector,
      className: 'TabOptionsFlyout',
      items: sheetTabOptionsFlyoutItems.map((item) => {
        let isDisabled = (item.option === 'Delete' && tabs.length === 1);

        return {
          ...item,
          onClick: () => handleClick(item.option),
          disabled: isDisabled,
        };
      }),
    };

    if (!currentFlyout) {
      dispatch(actions.addFlyout(noteStateFlyout));
    } else {
      dispatch(actions.updateFlyout(noteStateFlyout.dataElement, noteStateFlyout));
    }
  };

  useLayoutEffect(update, [tabs]);

  return null;
};

TabOptionsFlyout.propTypes  = {
  sheetId: PropTypes.string,
  handleClick: PropTypes.func,
  tabs: PropTypes.array,
};

export default TabOptionsFlyout;