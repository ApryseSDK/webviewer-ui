import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import { useTranslation } from 'react-i18next';
import touchEventManager from 'helpers/TouchEventManager';
import Choice from 'components/Choice';
import {
  isToolDefaultStyleUpdateFromAnnotationPopupEnabled,
  enableToolDefaultStyleUpdateFromAnnotationPopup,
  disableToolDefaultStyleUpdateFromAnnotationPopup
} from '../../apis/toolDefaultStyleUpdateFromAnnotationPopup';

import './AdvancedTab.scss';

const createItem = (label, description, isChecked, onToggled) => ({ label, description, isChecked, onToggled });

const AdvancedTab = () => {
  const [
    shouldFadePageNavigationComponent,
    isNoteSubmissionWithEnterEnabled,
    isCommentThreadExpansionEnabled,
    isNotesPanelRepliesCollapsingEnabled,
    isNotesPanelTextCollapsingEnabled,
    shouldClearSearchPanelOnClose,
    pageDeletionConfirmationModalEnabled,
    isThumbnailSelectingPages
  ] = useSelector((state) => [
    selectors.shouldFadePageNavigationComponent(state),
    selectors.isNoteSubmissionWithEnterEnabled(state),
    selectors.isCommentThreadExpansionEnabled(state),
    selectors.isNotesPanelRepliesCollapsingEnabled(state),
    selectors.isNotesPanelTextCollapsingEnabled(state),
    selectors.shouldClearSearchPanelOnClose(state),
    selectors.pageDeletionConfirmationModalEnabled(state),
    selectors.isThumbnailSelectingPages(state)
  ]);
  const [t] = useTranslation();
  const dispatch = useDispatch();

  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  const viewingItems = [
    createItem(
      t('option.settings.disableFadePageNavigationComponent'),
      t('option.settings.disableFadePageNavigationComponentDesc'),
      !shouldFadePageNavigationComponent,
      (enable) => {
        enable ? dispatch(actions.disableFadePageNavigationComponent()) : dispatch(actions.enableFadePageNavigationComponent());
      }
    ),
    createItem(
      t('option.settings.disableNativeScrolling'),
      t('option.settings.disableNativeScrollingDesc'),
      !touchEventManager.useNativeScroll,
      (enable) => {
        touchEventManager.useNativeScroll = !enable;
        forceUpdate();
      }
    )
  ];

  const annotationsItems = [
    createItem(
      t('option.settings.disableToolDefaultStyleUpdateFromAnnotationPopup'),
      t('option.settings.disableToolDefaultStyleUpdateFromAnnotationPopupDesc'),
      !isToolDefaultStyleUpdateFromAnnotationPopupEnabled(),
      (enable) => {
        enable ? disableToolDefaultStyleUpdateFromAnnotationPopup() : enableToolDefaultStyleUpdateFromAnnotationPopup();
        forceUpdate();
      }
    )
  ];

  const notesPanelItems = [
    createItem(
      t('option.settings.disableNoteSubmissionWithEnter'),
      t('option.settings.disableNoteSubmissionWithEnterDesc'),
      !isNoteSubmissionWithEnterEnabled,
      (enable) => dispatch(actions.setNoteSubmissionEnabledWithEnter(!enable))
    ),
    createItem(
      t('option.settings.disableAutoExpandCommentThread'),
      t('option.settings.disableAutoExpandCommentThreadDesc'),
      !isCommentThreadExpansionEnabled,
      (enable) => dispatch(actions.setCommentThreadExpansion(!enable))
    ),
    createItem(
      t('option.settings.disableReplyCollapse'),
      t('option.settings.disableReplyCollapseDesc'),
      !isNotesPanelRepliesCollapsingEnabled,
      (enable) => dispatch(actions.setNotesPanelRepliesCollapsing(!enable))
    ),
    createItem(
      t('option.settings.disableTextCollapse'),
      t('option.settings.disableTextCollapseDesc'),
      !isNotesPanelTextCollapsingEnabled,
      (enable) => dispatch(actions.setNotesPanelTextCollapsing(!enable))
    )
  ];

  const searchItems = [
    createItem(
      t('option.settings.disableClearSearchOnPanelClose'),
      t('option.settings.disableClearSearchOnPanelCloseDesc'),
      !shouldClearSearchPanelOnClose,
      (enable) => dispatch(actions.setClearSearchOnPanelClose(!enable))
    )
  ];

  const pageManipulationItems = [
    createItem(
      t('option.settings.disablePageDeletionConfirmationModal'),
      t('option.settings.disablePageDeletionConfirmationModalDesc'),
      !pageDeletionConfirmationModalEnabled,
      (enable) => {
        enable ? dispatch(actions.disablePageDeletionConfirmationModal()) : dispatch(actions.enablePageDeletionConfirmationModal());
      }
    ),
    createItem(
      t('option.settings.disableMultiselect'),
      t('option.settings.disableMultiselectDesc'),
      !isThumbnailSelectingPages,
      (enable) => dispatch(actions.setThumbnailSelectingPages(!enable))
    )
  ];

  const sections = [
    [t('option.settings.viewing'), viewingItems],
    [t('option.settings.annotations'), annotationsItems],
    [t('option.settings.notesPanel'), notesPanelItems],
    [t('option.settings.search'), searchItems],
    [t('option.settings.pageManipulation'), pageManipulationItems]
  ];

  return (
    <>
      {sections.map((section) => (
        <div className="setting-section" key={section[0]}>
          <div className="setting-label">{section[0]}</div>
          {section[1].map((item) => (
            <div className="setting-item" key={item.label}>
              <div className="setting-item-info">
                <div className="setting-item-label">{item.label}</div>
                <div>{item.description}</div>
              </div>
              <Choice
                isSwitch
                checked={item.isChecked}
                onChange={(e) => item.onToggled(e.target.checked)}
              />
            </div>
          ))}
        </div>
      ))}
    </>
  );
};

export default AdvancedTab;
