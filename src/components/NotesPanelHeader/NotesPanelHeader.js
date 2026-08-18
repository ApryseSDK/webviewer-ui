import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import selectors from 'selectors';
import actions from 'actions';
import classNames from 'classnames';
import useCore from 'hooks/useCore';

import Dropdown from 'components/Dropdown';
import Button from 'components/Button';
import DataElementWrapper from 'components/DataElementWrapper';
import CustomElement from 'components/CustomElement';

import Events from 'constants/events';
import { BASE_SORT_STRATEGIES, OFFICE_EDITOR_SORT_STRATEGIES, NotesPanelSortStrategy } from 'constants/sortStrategies';
import DataElements from 'constants/dataElement';
import { OfficeEditorEditMode } from 'constants/officeEditor';
import getNotesPanelConfig from 'helpers/getNotesPanelConfig';
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
  const { core } = useCore();
  const [
    sortStrategy,
    isSortContainerDisabled,
    customHeaderOptions,
    annotationFilters,
    isAnnotationNumberingEnabled,
    isOfficeEditorMode,
    officeEditorEditMode,
    isSpreadsheetEditorMode,
  ] = useSelector(
    (state) => [
      selectors.getSortStrategy(state),
      selectors.isElementDisabled(state, SORT_CONTAINER_ELEMENT),
      selectors.getNotesPanelCustomHeaderOptions(state),
      selectors.getAnnotationFilters(state),
      selectors.isAnnotationNumberingEnabled(state),
      selectors.getIsOfficeEditorMode(state),
      selectors.getOfficeEditorEditMode(state),
      selectors.isSpreadsheetEditorModeEnabled(state),
    ],
    shallowEqual
  );
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const [filterEnabled, setFilterEnabled] = useState(false);
  const [isPreviewingTrackedChanges, setIsPreviewingTrackedChanges] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const notesPanelConfig = getNotesPanelConfig(parentDataElement);

  useEffect(() => {
    // check if Redux filter state is enabled on mount and set filterEnabled to true
    const { authorFilter, colorFilter, statusFilter, typeFilter } = annotationFilters;
    if (authorFilter?.length > 0 || colorFilter?.length > 0 || statusFilter?.length > 0 || typeFilter?.length > 0) {
      setFilterEnabled(true);
    }

    const toggleFilterStyle = (types, authors, colors, statuses) => {
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


  const getNotesPanelSortStrategies = ({ isOfficeEditorMode, isAnnotationNumberingEnabled }) => {
    if (isOfficeEditorMode) {
      return OFFICE_EDITOR_SORT_STRATEGIES;
    }

    if (isAnnotationNumberingEnabled) {
      return [...BASE_SORT_STRATEGIES, NotesPanelSortStrategy.NUMBER];
    }

    return BASE_SORT_STRATEGIES;
  };

  const sortStrategyItems = getNotesPanelSortStrategies({ isOfficeEditorMode, isAnnotationNumberingEnabled });

  useEffect(() => {
    if (!sortStrategyItems.includes(sortStrategy)) {
      dispatch(actions.setNotesPanelSortStrategy(sortStrategyItems[0]));
    }
  }, [dispatch, sortStrategy, sortStrategyItems]);

  const sortContainer = (
    <div className="sort-container" data-element={SORT_CONTAINER_ELEMENT}>
      <div className="label" id="notesSortLabel">{`${t('message.sort')}:`}</div>
      <Dropdown
        id="notesOrderDropdown"
        labelledById='notesSortLabel'
        dataElement="notesOrderDropdown"
        disabled={notes.length === 0 || isPreviewingTrackedChanges}
        ariaLabel={`${t('message.sortBy')} ${sortStrategy}`}
        items={sortStrategyItems}
        translationPrefix="option.notesOrder"
        currentSelectionKey={sortStrategy}
        onClickItem={(strategy) => {
          dispatch(actions.setNotesPanelSortStrategy(strategy));
        }}
      />
    </div>
  );

  const openFilterModalWithFocusTransfer = useFocusHandler(() => dispatch(actions.openElement('filterModal')));
  const placeholderText = t(notesPanelConfig.searchPlaceholder);

  const originalHeaderElement = (
    <DataElementWrapper
      className="header"
      dataElement="notesPanelHeader"
    >
      <DataElementWrapper
        className="input-container"
        dataElement={DataElements.NotesPanel.DefaultHeader.INPUT_CONTAINER}
      >
        <Icon glyph="icon-header-search" />
        <input
          disabled={isPreviewingTrackedChanges}
          type="text"
          placeholder={''}
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
        <h2 className='main-comment'>{t(notesPanelConfig.title)} {`(${notes.length})`}</h2>
      </DataElementWrapper>

      {!isSpreadsheetEditorMode && <DataElementWrapper
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
      </DataElementWrapper>}
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
