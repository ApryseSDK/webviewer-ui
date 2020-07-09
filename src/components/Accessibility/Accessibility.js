import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import selectors from 'selectors';
import './Accessibility.scss';
import classNames from 'classnames';
import actions from 'actions';

function Accessibility() {
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(false);

  const isAccessibleMode = useSelector(selectors.isAccessibleMode);

  const isNotesPanelOpen = useSelector(state => selectors.isElementOpen(state, 'notesPanel'));
  const isNotesPanelDisabled = useSelector(state => selectors.isElementDisabled(state, 'notesPanel'));

  const isSearchPanelOpen = useSelector(state => selectors.isElementOpen(state, 'searchPanel'));
  const isSearchPanelDisabled = useSelector(state => selectors.isElementDisabled(state, 'searchPanel'));

  const onFocus = () => setIsVisible(true);
  const onBlur = () => setIsVisible(false);

  const onSkipToDocument = () => {
    document.getElementById('pageText1').focus();
  };

  const onSkipToSearch = () => {
    if (isSearchPanelOpen) {
      const searchEl = document.getElementById('SearchPanel__input');
      searchEl && searchEl.focus();
    } else {
      dispatch(actions.openElement('searchPanel'));
    }
  };

  const onSkipToNotes = () => {
    if (isNotesPanelOpen) {
      const noteEl = document.getElementById('NotesPanel__input');
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
