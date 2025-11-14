import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import selectors from 'selectors';
import './Accessibility.scss';
import classNames from 'classnames';
import actions from 'actions';
import getRootNode from 'helpers/getRootNode';
import core from 'core';
import { workerTypes } from 'constants/types';
import { useTranslation } from 'react-i18next';

function Accessibility() {
  const dispatch = useDispatch();
  const [t] = useTranslation();
  const pageNumber = useSelector(selectors.getCurrentPage);
  const shouldAddA11yContentToDOM = useSelector(selectors.shouldAddA11yContentToDOM);
  const isNotesPanelOpen = useSelector((state) => selectors.isElementOpen(state, 'notesPanel'));
  const isNotesPanelDisabled = useSelector((state) => selectors.isElementDisabled(state, 'notesPanel'));
  const isSearchPanelOpen = useSelector((state) => selectors.isElementOpen(state, 'searchPanel'));
  const isSearchPanelDisabled = useSelector((state) => selectors.isElementDisabled(state, 'searchPanel'));

  const accessibleReadingOrderManager = core.getDocumentViewer()?.getAccessibleReadingOrderManager();

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleModeStarted = () => {
      dispatch(actions.setShouldAddA11yContentToDOM(true));
    };

    const handleModeEnded = () => {
      dispatch(actions.setShouldAddA11yContentToDOM(false));
    };

    accessibleReadingOrderManager.addEventListener('accessibleReadingOrderModeStarted', handleModeStarted);
    accessibleReadingOrderManager.addEventListener('accessibleReadingOrderModeEnded', handleModeEnded);

    return () => {
      accessibleReadingOrderManager.removeEventListener('accessibleReadingOrderModeStarted', handleModeStarted);
      accessibleReadingOrderManager.removeEventListener('accessibleReadingOrderModeEnded', handleModeEnded);
    };
  }, []);

  useEffect(() => {
    const onDocumentLoaded = () => {
      if (!shouldAddA11yContentToDOM) {
        return;
      }
      const type = core.getDocument()?.getType();
      if (type === workerTypes.PDF) {
        const isInAROMode = accessibleReadingOrderManager.isInAccessibleReadingOrderMode();
        !isInAROMode && accessibleReadingOrderManager?.startAccessibleReadingOrderMode();
      }
    };
    core.addEventListener('documentLoaded', onDocumentLoaded);
    return () => {
      core.removeEventListener('documentLoaded', onDocumentLoaded);
    };
  }, [shouldAddA11yContentToDOM]);

  useEffect(() => {
    const onPageComplete = (pageNumber) => {
      if (!shouldAddA11yContentToDOM) {
        return;
      }
      const pageContainerElement = core.getViewerElement().querySelector(`#pageContainer${pageNumber}`);
      pageContainerElement.ariaLabel = `${t('message.pageNum')} ${pageNumber}`;
    };
    core.addEventListener('pageComplete', onPageComplete);
    return () => {
      core.removeEventListener('pageComplete', onPageComplete);
    };
  }, [shouldAddA11yContentToDOM]);

  const onFocus = () => setIsVisible(true);
  const onBlur = () => setIsVisible(false);

  const onSkipToDocument = () => {
    // The 'pageText' selector is added only for the legacy accessibleMode, if the selector doesn't exist, we focus on the 'pageContainer'
    const pageContainer = getRootNode().querySelector(`#pageText${pageNumber}`) || getRootNode().querySelector(`#pageContainer${pageNumber}`);
    pageContainer.focus();
  };

  const onSkipToSearch = () => {
    if (isSearchPanelOpen) {
      const searchEl = getRootNode().querySelector('#SearchPanel__input');
      searchEl && searchEl.focus();
    } else {
      dispatch(actions.openElement('searchPanel'));
    }
  };

  const onSkipToNotes = () => {
    if (isNotesPanelOpen) {
      const noteEl = getRootNode().querySelector('#NotesPanel__input');
      noteEl && noteEl.focus();
    } else {
      dispatch(actions.openElement('notesPanel'));
    }
  };

  if (!shouldAddA11yContentToDOM) {
    return null;
  }

  const a11yClass = classNames('Accessibility', isVisible ? 'visible' : 'hidden');

  return (
    <fieldset className={a11yClass} data-element="accessibility" onFocus={onFocus} onBlur={onBlur}>
      <legend>{t('accessibility.skipTo')}</legend>
      <button onClick={onSkipToDocument} role="link">{t('accessibility.document')}</button>
      {isSearchPanelDisabled ? null :
        <button onClick={onSkipToSearch} role="link">{t('component.searchOverlay')}</button>}
      {isNotesPanelDisabled ? null : <button onClick={onSkipToNotes} role="link">{t('accessibility.notes')}</button>}
    </fieldset>
  );
}

export default Accessibility;
