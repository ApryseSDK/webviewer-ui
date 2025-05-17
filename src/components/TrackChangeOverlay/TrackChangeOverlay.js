import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import actions from 'actions';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import selectors from 'selectors';
import Dropdown from 'components/Dropdown';
import DataElements from 'constants/dataElement';
import core from 'core';
import { OfficeEditorEditMode, OFFICE_EDITOR_TRANSLATION_PREFIX } from 'constants/officeEditor';

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
    <div className='Dropdown__item-vertical'>
      <div className='Dropdown__item-label'>{t(`${OFFICE_EDITOR_TRANSLATION_PREFIX}${item.key}`)}</div>
      <div className='Dropdown__item-description'>{t(`${OFFICE_EDITOR_TRANSLATION_PREFIX}${item.description}`)}</div>
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
        dataElement={DataElements.TRACK_CHANGE_DROPDOWN}
        items={items}
        width={144}
        getCustomItemStyle={() => ({ height: '48px' })}
        applyCustomStyleToButton={false}
        currentSelectionKey={(editMode === OfficeEditorEditMode.PREVIEW) ? OfficeEditorEditMode.REVIEWING : editMode}
        onClickItem={onClickItem}
        getDisplayValue={(item) => t(`${OFFICE_EDITOR_TRANSLATION_PREFIX}${item.key}`)}
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
