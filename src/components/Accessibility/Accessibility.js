import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import selectors from 'selectors';
import './Accessibility.scss';
import classNames from 'classnames';
import actions from 'actions';
import getRootNode from 'helpers/getRootNode';

function Accessibility() {
  const dispatch = useDispatch();
  const [
    pageNumber,
    isAccessibleMode,
    isNotesPanelOpen,
    isNotesPanelDisabled,
    isSearchPanelOpen,
    isSearchPanelDisabled,
  ] = useSelector((state) => [
    selectors.getCurrentPage(state),
    selectors.isAccessibleMode(state),
    selectors.isElementOpen(state, 'notesPanel'),
    selectors.isElementDisabled(state, 'notesPanel'),
    selectors.isElementOpen(state, 'searchPanel'),
    selectors.isElementDisabled(state, 'searchPanel'),
  ]);
  const [isVisible, setIsVisible] = useState(false);

  const onFocus = () => setIsVisible(true);
  const onBlur = () => setIsVisible(false);

  const onSkipToDocument = () => {
    getRootNode().querySelector(`#pageText${pageNumber}`).focus();
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

  if (!isAccessibleMode) {
    return null;
  }

  const a11yClass = classNames('Accessibility', isVisible ? 'visible' : 'hidden');

  return (
    <div className={a11yClass} data-element="accessibility" onFocus={onFocus} onBlur={onBlur}>
      <div>Skip to: </div>

      <button onClick={onSkipToDocument}>Document</button>
      {isSearchPanelDisabled ? null : <button onClick={onSkipToSearch}>Search</button>}
      {isNotesPanelDisabled ? null : <button onClick={onSkipToNotes}>Notes</button>}
    </div>
  );
}

export default Accessibility;
