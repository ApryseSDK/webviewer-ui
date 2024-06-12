import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useTranslation } from 'react-i18next';
import debounce from 'lodash/debounce';
import selectors from 'selectors';
import actions from 'actions';
import classNames from 'classnames';
import core from 'core';

import Dropdown from 'components/Dropdown';
import Button from 'components/Button';
import DataElementWrapper from 'components/DataElementWrapper';
import CustomElement from 'components/CustomElement';

import Events from 'constants/events';
import { getSortStrategies } from 'constants/sortStrategies';
import DataElements from 'constants/dataElement';

import './NotesPanelHeader.scss';

const SORT_CONTAINER_ELEMENT = 'sortContainer';

function NotesPanelHeader({
  notes,
  disableFilterAnnotation,
  setSearchInputHandler,
  isMultiSelectMode,
  toggleMultiSelectMode,
  isMultiSelectEnabled,
}) {
  const [
    sortStrategy,
    isSortContainerDisabled,
    customHeaderOptions,
    annotationFilters,
    featureFlags,
    isOfficeEditorMode,
  ] = useSelector(
    (state) => [
      selectors.getSortStrategy(state),
      selectors.isElementDisabled(state, SORT_CONTAINER_ELEMENT),
      selectors.getNotesPanelCustomHeaderOptions(state),
      selectors.getAnnotationFilters(state),
      selectors.getFeatureFlags(state),
      selectors.getIsOfficeEditorMode(state),
    ],
    shallowEqual
  );

  const [t] = useTranslation();
  const dispatch = useDispatch();
  const [filterEnabled, setFilterEnabled] = useState(false);
  const customizableUI = featureFlags.customizableUI;

  useEffect(() => {
    // check if Redux filter state is enabled on mount and set filterEnabled to true
    const { authorFilter, colorFilter, statusFilter, typeFilter } = annotationFilters;
    if (authorFilter?.length > 0 || colorFilter?.length > 0 || statusFilter?.length > 0 || typeFilter?.length > 0) {
      setFilterEnabled(true);
    }

    const toggleFilterStyle = (e) => {
      const { types, authors, colors, statuses } = e.detail;
      if (types.length > 0 || authors.length > 0 || colors.length > 0 || statuses.length > 0) {
        setFilterEnabled(true);
      } else {
        setFilterEnabled(false);
      }
    };

    window.addEventListener(Events.ANNOTATION_FILTER_CHANGED, toggleFilterStyle);
    return () => {
      window.removeEventListener(Events.ANNOTATION_FILTER_CHANGED, toggleFilterStyle);
    };
  }, []);

  const handleInputChange = (e) => {
    _handleInputChange(e.target.value);
  };

  const _handleInputChange = debounce((value) => {
    // this function is used to solve the issue with using synthetic event asynchronously.
    // https://reactjs.org/docs/events.html#event-pooling
    core.deselectAllAnnotations();
    setSearchInputHandler(value);
  }, 500);

  const sortContainer = (
    <div className="sort-container" data-element={SORT_CONTAINER_ELEMENT}>
      <div className="label">{`${t('message.sortBy')}:`}</div>
      <Dropdown
        dataElement="notesOrderDropdown"
        disabled={notes.length === 0}
        items={Object.keys(getSortStrategies())}
        translationPrefix="option.notesOrder"
        currentSelectionKey={sortStrategy}
        onClickItem={(strategy) => {
          dispatch(actions.setNotesPanelSortStrategy(strategy));
        }}
      />
    </div>
  );

  const originalHeaderElement = (
    <DataElementWrapper
      className={
        classNames({
          'header': true,
          'custom-header': customizableUI,
        })}
      dataElement="notesPanelHeader"
    >
      <DataElementWrapper
        className="input-container"
        dataElement={DataElements.NotesPanel.DefaultHeader.INPUT_CONTAINER}
      >
        <input
          type="text"
          placeholder={t('message.searchCommentsPlaceholder')}
          aria-label={t('message.searchCommentsPlaceholder')}
          onChange={handleInputChange}
          id="NotesPanel__input"
        />
      </DataElementWrapper>

      <DataElementWrapper
        className="comments-counter"
        dataElement={DataElements.NotesPanel.DefaultHeader.COMMENTS_COUNTER}
      >
        <span className='main-comment'>{isOfficeEditorMode ? t('officeEditor.reviewing') : t('component.notesPanel')}</span> {`(${notes.length})`}
      </DataElementWrapper>

      <DataElementWrapper
        className="sort-row"
        dataElement={DataElements.NotesPanel.DefaultHeader.SORT_ROW}
      >
        {(isSortContainerDisabled) ? <div className="sort-container"></div> : sortContainer}
        <div
          className="buttons-container"
        >
          {isMultiSelectEnabled && (
            <Button
              dataElement={DataElements.NOTE_MULTI_SELECT_MODE_BUTTON}
              className={classNames({
                active: isMultiSelectMode,
              })}
              disabled={notes.length === 0}
              img="icon-annotation-select-multiple"
              onClick={() => {
                core.deselectAllAnnotations();
                toggleMultiSelectMode();
              }}
              title={t('component.multiSelectButton')}
            />
          )}
          <Button
            dataElement={DataElements.NotesPanel.DefaultHeader.FILTER_ANNOTATION_BUTTON}
            className={classNames({
              active: filterEnabled
            })}
            disabled={disableFilterAnnotation}
            img="icon-comments-filter"
            onClick={() => dispatch(actions.openElement('filterModal'))}
            title={t('component.filter')}
          />
        </div>
      </DataElementWrapper>
    </DataElementWrapper>
  );

  return (
    <>
      {customHeaderOptions &&
        <CustomElement
          render={customHeaderOptions.render}
          renderArguments={[notes]}
        />
      }

      {(!customHeaderOptions || !customHeaderOptions.overwriteDefaultHeader) &&
        originalHeaderElement
      }
    </>
  );
}

export default NotesPanelHeader;
