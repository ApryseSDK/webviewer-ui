import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import actions from 'actions';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import selectors from 'selectors';
import Dropdown from 'components/Dropdown';
import core from 'core';
import { OfficeEditorEditMode } from 'constants/officeEditor';

import './TrackChangeOverlay.scss';

const propTypes = {
  isFlyoutItem: PropTypes.bool,
  activeFlyout: PropTypes.string,
  onKeyDownHandler: PropTypes.func,
};

const items = [
  {
    key: OfficeEditorEditMode.EDITING,
    description: 'editingDescription',
  },
  {
    key: OfficeEditorEditMode.REVIEWING,
    description: 'reviewingDescription',
  },
  {
    key: OfficeEditorEditMode.VIEW_ONLY,
    description: 'viewOnlyDescription',
  }
];
const translationPrefix = 'officeEditor.';

const TrackChangeOverlay = ({
  isFlyoutItem = false,
  onKeyDownHandler = null,
  activeFlyout = null,
}) => {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const [
    editMode,
    customizableUI,
  ] = useSelector(
    (state) => [
      selectors.getOfficeEditorEditMode(state),
      selectors.getFeatureFlags(state)?.customizableUI,
    ],
    shallowEqual
  );

  const renderDropdownItem = (item) => (
    <div className='Dropdown__item-TrackChange'>
      <div className='Dropdown__item-mode'>{t(`${translationPrefix}${item.key}`)}</div>
      <div className='Dropdown__item-description'>{t(`${translationPrefix}${item.description}`)}</div>
    </div>
  );

  const onClickItem = (mode) => {
    core.getOfficeEditor().setEditMode(mode);

    if (isFlyoutItem && activeFlyout) {
      dispatch(actions.closeElement(activeFlyout));
    }
  };

  return (
    <div className={classNames({
      'track-change-overlay': true,
      'modular-ui': customizableUI,
      'flyout-item': isFlyoutItem,
    })}>
      <Dropdown
        id='track-change-overlay'
        items={items}
        width={144}
        getCustomItemStyle={() => ({ width: '144px', height: '48px' })}
        applyCustomStyleToButton={false}
        currentSelectionKey={(editMode === OfficeEditorEditMode.PREVIEW) ? OfficeEditorEditMode.REVIEWING : editMode}
        onClickItem={onClickItem}
        getDisplayValue={(item) => t(`${translationPrefix}${item.key}`)}
        getKey={(item) => item.key}
        renderItem={renderDropdownItem}
        className="text-left"
        isFlyoutItem={isFlyoutItem}
        onKeyDownHandler={onKeyDownHandler}
      />
    </div>
  );
};

TrackChangeOverlay.propTypes = propTypes;

export default TrackChangeOverlay;
