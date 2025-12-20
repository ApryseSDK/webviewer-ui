import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
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
import { OfficeEditorEditMode, NOTES_PANEL_TEXTS } from 'constants/officeEditor';
import useFocusHandler from 'hooks/useFocusHandler';

import './NotesPanelHeader.scss';
import Icon from '../Icon';
import { getEventHandler } from 'helpers/fireEvent';

const propTypes = {
  parentDataElement: PropTypes.string,
  notes: PropTypes.array.isRequired,
  disableFilterAnnotation: PropTypes.bool,
  setSearchInputHandler: PropTypes.func.isRequired,
  isMultiSelectMode: PropTypes.bool,
  toggleMultiSelectMode: PropTypes.func,
  isMultiSelectEnabled: PropTypes.bool,
};

const SORT_CONTAINER_ELEMENT = 'sortContainer';
function NotesPanelHeader({
  parentDataElement = DataElements.NOTES_PANEL,
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
    isOfficeEditorMode,
    officeEditorEditMode,
    customizableUI,
  ] = useSelector(
    (state) => [
      selectors.getSortStrategy(state),
      selectors.isElementDisabled(state, SORT_CONTAINER_ELEMENT),
      selectors.getNotesPanelCustomHeaderOptions(state),
      selectors.getAnnotationFilters(state),
      selectors.getIsOfficeEditorMode(state),
      selectors.getOfficeEditorEditMode(state),
      selectors.getFeatureFlags(state)?.customizableUI,
    ],
    shallowEqual
  );

  const [t] = useTranslation();
  const dispatch = useDispatch();
  const [filterEnabled, setFilterEnabled] = useState(false);
  const [isPreviewingTrackedChanges, setIsPreviewingTrackedChanges] = useState(false);
  const [searchInput, setSearchInput] = useState('');

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

    getEventHandler().addEventListener(Events.ANNOTATION_FILTER_CHANGED, toggleFilterStyle);
    return () => {
      getEventHandler().removeEventListener(Events.ANNOTATION_FILTER_CHANGED, toggleFilterStyle);
    };
  }, []);

  // on oe preview mode, disable and clear the search input
  useEffect(() => {
    if (isOfficeEditorMode && officeEditorEditMode === OfficeEditorEditMode.PREVIEW) {
      setIsPreviewingTrackedChanges(true);
      setSearchInputHandler('');
      setSearchInput('');
    } else {
      setIsPreviewingTrackedChanges(false);
    }
  }, [isOfficeEditorMode, officeEditorEditMode]);

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
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
      <div className="label" id="notesSortLabel">{`${t('message.sort')}:`}</div>
      <Dropdown
        id="notesOrderDropdown"
        labelledById='notesSortLabel'
        dataElement="notesOrderDropdown"
        disabled={notes.length === 0 || isPreviewingTrackedChanges}
        ariaLabel={`${t('message.sortBy')} ${sortStrategy}`}
        items={Object.keys(getSortStrategies())}
        translationPrefix="option.notesOrder"
        currentSelectionKey={sortStrategy}
        onClickItem={(strategy) => {
          dispatch(actions.setNotesPanelSortStrategy(strategy));
        }}
      />
    </div>
  );

  const openFilterModalWithFocusTransfer = useFocusHandler(() => dispatch(actions.openElement('filterModal')));
  const placeholderText = t(NOTES_PANEL_TEXTS[parentDataElement].searchPlaceholder);

  const originalHeaderElement = (
    <DataElementWrapper
      className={
        classNames({
          'header': true,
          'modular-ui-header': customizableUI,
        })}
      dataElement="notesPanelHeader"
    >
      <DataElementWrapper
        className={classNames({
          'input-container': true,
          'modular-ui-input': customizableUI,
        })}
        dataElement={DataElements.NotesPanel.DefaultHeader.INPUT_CONTAINER}
      >
        {customizableUI && <Icon glyph="icon-header-search" />}
        <input
          disabled={isPreviewingTrackedChanges}
          type="text"
          placeholder={customizableUI ? '' : placeholderText}
          aria-label={placeholderText}
          onChange={handleInputChange}
          id="NotesPanel__input"
          value={searchInput}
        />
      </DataElementWrapper>

      <DataElementWrapper
        className="comments-counter"
        dataElement={DataElements.NotesPanel.DefaultHeader.COMMENTS_COUNTER}
      >
        <h2 className='main-comment'>{t(NOTES_PANEL_TEXTS[parentDataElement].title)} {`(${notes.length})`}</h2>
      </DataElementWrapper>

      <DataElementWrapper
        className="sort-row"
        dataElement={DataElements.NotesPanel.DefaultHeader.SORT_ROW}
      >
        {(isSortContainerDisabled) ? <div className="sort-container"></div> : sortContainer}
        <div
          className="buttons-container"
        >
          {isMultiSelectEnabled && !isOfficeEditorMode && (
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
              ariaPressed={isMultiSelectMode}
            />
          )}
          <Button
            dataElement={DataElements.NotesPanel.DefaultHeader.FILTER_ANNOTATION_BUTTON}
            className={classNames({
              active: filterEnabled
            })}
            disabled={disableFilterAnnotation}
            img="icon-comments-filter"
            onClick={openFilterModalWithFocusTransfer}
            title={t('component.filter')}
            ariaPressed={filterEnabled}
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

NotesPanelHeader.propTypes = propTypes;

export default NotesPanelHeader;
