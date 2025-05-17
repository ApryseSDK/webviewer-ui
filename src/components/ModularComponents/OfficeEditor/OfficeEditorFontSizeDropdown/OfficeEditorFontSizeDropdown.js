import React from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'components/Dropdown';
import core from 'core';
import { DEFAULT_POINT_SIZE, FONT_SIZE, AVAILABLE_POINT_SIZES } from 'constants/officeEditor';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import classNames from 'classnames';
import selectors from 'selectors';
import actions from 'actions';

import './OfficeEditorFontSizeDropdown.scss';

const propTypes = {
  isFlyoutItem: PropTypes.bool,
  activeFlyout: PropTypes.string,
  onKeyDownHandler: PropTypes.func,
};

const OfficeEditorFontSizeDropdown = (props) => {
  const { isFlyoutItem, activeFlyout, onKeyDownHandler } = props;
  const dispatch = useDispatch();
  const [
    pointSizeSelectionKey,
    customizableUI,
  ] = useSelector(
    (state) => [
      selectors.getPointSizeSelectionKey(state),
      selectors.getFeatureFlags(state)?.customizableUI,
    ],
    shallowEqual
  );

  return (
    <Dropdown
      id="office-editor-font-size-dropdown"
      className={classNames({
        'OfficeEditorFontSizeDropdown': true,
        'text-left': true,
        'flyout-item': isFlyoutItem,
        'modular-ui': customizableUI,
      })}
      items={AVAILABLE_POINT_SIZES}
      onClickItem={async (pointSize) => {
        let fontPointSize = parseInt(pointSize, 10);

        if (isNaN(fontPointSize)) {
          fontPointSize = DEFAULT_POINT_SIZE;
        }

        if (fontPointSize > FONT_SIZE.MAX) {
          fontPointSize = FONT_SIZE.MAX;
        } else if (fontPointSize < FONT_SIZE.MIN) {
          fontPointSize = FONT_SIZE.MIN;
        }
        await core.getOfficeEditor().updateSelectionAndCursorStyle({ pointSize: fontPointSize });
        if (activeFlyout) {
          dispatch(actions.closeElement(activeFlyout));
        }
      }}
      currentSelectionKey={pointSizeSelectionKey}
      width={100}
      dataElement="office-editor-font-size"
      hasInput
      isSearchEnabled={false}
      showLabelInList={true}
      translationPrefix="officeEditor.fontSize"
      isFlyoutItem={isFlyoutItem}
      onKeyDownHandler={onKeyDownHandler}
    />
  );
};

OfficeEditorFontSizeDropdown.propTypes = propTypes;

export default OfficeEditorFontSizeDropdown;