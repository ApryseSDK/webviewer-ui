import { useLayoutEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import DataElements from 'src/constants/dataElement';
import actions from 'actions';
import selectors from 'selectors';
import { getLineSpacingFlyoutItems } from 'helpers/officeEditor';

const lineSpacingFlyoutItems = getLineSpacingFlyoutItems();

const LineSpacingFlyout = () => {
  const [
    lineSpacing,
    currentFlyout,
  ] = useSelector(
    (state) => [
      selectors.getLineSpacing(state),
      selectors.getFlyout(state, DataElements.LINE_SPACING_FLYOUT),
    ],
    shallowEqual
  );

  const dispatch = useDispatch();

  useLayoutEffect(() => {
    const lineSpacingFlyout = {
      dataElement: 'lineSpacingFlyout',
      className: 'LineSpacingFlyout',
      items: lineSpacingFlyoutItems, // FLYOUT_ITEM_TYPES.LINE_SPACING_OPTIONS_BUTTON is handled in FlyoutItem.js
    };

    if (!currentFlyout) {
      dispatch(actions.addFlyout(lineSpacingFlyout));
    } else {
      dispatch(actions.updateFlyout(lineSpacingFlyout.dataElement, lineSpacingFlyout));
    }
  }, [lineSpacing]);

  return null;
};

LineSpacingFlyout.propTypes = {

};

export default LineSpacingFlyout;