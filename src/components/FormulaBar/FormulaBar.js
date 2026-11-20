import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import Icon from 'components/Icon';
import DataElements from 'constants/dataElement';
import DataElementWrapper from 'components/DataElementWrapper';
import FormulaOverlay from 'components/FormulaOverlay/FormulaOverlay';
import useCore from 'hooks/useCore';
import './FormulaBar.scss';
import { css } from '@emotion/react';

const CLIPBOARD_DISABLED_MESSAGE = 'Clipboard operations are disabled in the formula bar.';

const shouldPreventMultilineEnter = (multiline, key, altKey) => multiline && key === 'Enter' && !altKey;

const FormulaBar = (props) => {
  const {
    isReadOnly,
    activeCellRange,
    cellFormula,
    stringCellValue,
    multiline,
    onRangeInputChange,
    onRangeInputKeyDown,
  } = props;

  const { t } = useTranslation();
  const { core } = useCore();
  const formulaBarValue = cellFormula || stringCellValue || '';
  const [inputValue, setInputValue] = useState(formulaBarValue);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [selectedFormula, setSelectedFormula] = useState(null);
  const [formulaSearchResults, setFormulaSearchResults] = useState([]);
  const [formulaSegments, setFormulaSegments] = useState([]);
  const [isFormulaFocused, setIsFormulaFocused] = useState(false);

  const formulaInputRef = useRef(null);
  const formulaInputMaskRef = useRef(null);
  const formulaBarProviderRef = useRef(null);
  const pendingCursorPositionRef = useRef(null);
  const lastCellRef = useRef();
  const lastFormulaBarValueRef = useRef(formulaBarValue);

  const spreadsheetEditorManager = core.getDocumentViewer().getSpreadsheetEditorManager();

  useEffect(() => {
    function setProvider() {
      formulaBarProviderRef.current = spreadsheetEditorManager.getFormulaBarProvider();
    }

    core.addEventListener('spreadsheetEditorReady', setProvider);

    return () => {
      core.removeEventListener('spreadsheetEditorReady', setProvider);
    };
  }, [spreadsheetEditorManager]);

  useEffect(() => {
    const handleFormulaSearchEvent = (event) => {
      if (!isFormulaFocused) {
        return;
      }

      const items = event.getFormulaInfoItems?.() ?? [];
      setFormulaSearchResults(items);
      setHighlightedIndex(0);
    };

    core.addEventListener('formulaSearchEvent', handleFormulaSearchEvent);

    return () => {
      core.removeEventListener('formulaSearchEvent', handleFormulaSearchEvent);
    };
  }, [isFormulaFocused]);

  useEffect(() => {
    const handleFormulaBarTextChanged = (event) => {
      const segments = event.getInfo();
      setFormulaSegments(segments);

      const updatedText = segments.map((segment) => segment.text).join('');
      setInputValue(updatedText);
    };

    const handleFormulaBarSelectionChangedEvent = (event) => {
      formulaInputRef.current?.focus();
      const inputPosition = event.getSelectionPosition();
      formulaInputRef.current?.setSelectionRange(inputPosition, inputPosition);
    };

    const handleFormulaHelpEvent = (event) => {
      setSelectedFormula(event.getFormulaInfo());
    };

    core.addEventListener('formulaBarTextChangedEvent', handleFormulaBarTextChanged);
    core.addEventListener('formulaBarSelectionChangedEvent', handleFormulaBarSelectionChangedEvent);
    core.addEventListener('formulaHelpEvent', handleFormulaHelpEvent);

    return () => {
      core.removeEventListener('formulaBarTextChangedEvent', handleFormulaBarTextChanged);
      core.removeEventListener('formulaBarSelectionChangedEvent', handleFormulaBarSelectionChangedEvent);
      core.removeEventListener('formulaHelpEvent', handleFormulaHelpEvent);
    };
  }, []);

  useEffect(() => {
    const currentCell = activeCellRange;
    if (lastCellRef.current !== currentCell) {
      setInputValue(formulaBarValue);
      setIsExpanded(false);
      lastCellRef.current = currentCell;
      lastFormulaBarValueRef.current = formulaBarValue;
    } else if (formulaBarValue !== lastFormulaBarValueRef.current) {
      setInputValue(formulaBarValue);
      lastFormulaBarValueRef.current = formulaBarValue;
    }
  }, [activeCellRange, formulaBarValue]);

  useEffect(() => {
    if (!multiline) {
      setIsExpanded(false);
    }
  }, [multiline]);

  useLayoutEffect(() => {
    if (pendingCursorPositionRef.current !== null && formulaInputRef.current) {
      const cursorPosition = pendingCursorPositionRef.current;
      formulaInputRef.current.setSelectionRange(cursorPosition, cursorPosition);
      pendingCursorPositionRef.current = null;
    }
  }, [inputValue]);

  const handleOptionSelect = useCallback((option) => {
    if (formulaBarProviderRef.current) {
      formulaBarProviderRef.current.onFormulaBarSelectFormula(option.name);
      formulaBarProviderRef.current.onFormulaBarTextChange(option.name);
    }
  }, []);

  const handleOverlayClose = useCallback(() => {
    setShowOverlay(false);
  }, []);

  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setInputValue(value);
    setFormulaSegments([]);
    if (formulaBarProviderRef.current) {
      formulaBarProviderRef.current.onFormulaBarSelectionChanged(formulaInputRef.current.selectionStart);
      formulaBarProviderRef.current.onFormulaBarTextChange(value);
    }
  }, []);

  useEffect(() => {
    if (formulaSearchResults.length === 0 && !selectedFormula || !isFormulaFocused) {
      setShowOverlay(false);
    } else {
      setShowOverlay(true);
    }
  }, [formulaSearchResults, selectedFormula]);

  const handleInputFocus = useCallback(() => {
    setIsFormulaFocused(true);
    if (formulaBarProviderRef.current) {
      formulaBarProviderRef.current.onFormulaBarFocus();
    }
  }, []);

  const overlayID = `formula-overlay-${DataElements.FORMULA_BAR}`;

  const handleInputBlur = (e) => {
    if (showOverlay && !e.relatedTarget?.closest(`#${overlayID}`)) {
      handleOverlayClose();
    }
    setIsFormulaFocused(false);
  };

  const handleClipboardEvent = (event) => {
    if (!spreadsheetEditorManager.isClipboardEnabled()) {
      event.preventDefault();
      event.stopPropagation();
      console.warn(CLIPBOARD_DISABLED_MESSAGE);
    }
  };

  const handleContextMenu = (event) => {
    if (!spreadsheetEditorManager.isClipboardEnabled()) {
      event.preventDefault();
    }
  };

  const selectHighlightedOption = useCallback(() => {
    const selectedOption = formulaSearchResults[highlightedIndex];
    if (!selectedOption) {
      return false;
    }

    handleOptionSelect(selectedOption);
    return true;
  }, [formulaSearchResults, highlightedIndex, handleOptionSelect]);

  const handleOverlayKeyDown = useCallback((e) => {
    switch (e.key) {
      case 'ArrowDown':
        if (formulaSearchResults.length === 0) {
          return false;
        }
        e.preventDefault();
        setHighlightedIndex((previousIndex) => (previousIndex + 1) % formulaSearchResults.length);
        return true;
      case 'ArrowUp':
        if (formulaSearchResults.length === 0) {
          return false;
        }
        e.preventDefault();
        setHighlightedIndex((previousIndex) => (previousIndex - 1 + formulaSearchResults.length) % formulaSearchResults.length);
        return true;
      case 'Enter':
        if (selectHighlightedOption()) {
          e.preventDefault();
          return true;
        }
        return false;
      case 'Tab':
        if (!e.shiftKey) {
          e.preventDefault();
          selectHighlightedOption();
          return true;
        }
        return false;
      case 'Escape':
        e.stopPropagation();
        handleOverlayClose();
        return true;
      default:
        return false;
    }
  }, [formulaSearchResults, handleOverlayClose, selectHighlightedOption]);

  const handleKeyDown = useCallback((e) => {
    const key = e.key.toLowerCase();
    const isClipboardShortcut = ((e.ctrlKey || e.metaKey) && (key === 'c' || key === 'x' || key === 'v' || key === 'insert')) ||
      (e.shiftKey && (key === 'delete' || key === 'insert'));
    if (isClipboardShortcut && !spreadsheetEditorManager.isClipboardEnabled()) {
      e.preventDefault();
      e.stopPropagation();
      console.warn(CLIPBOARD_DISABLED_MESSAGE);
      return;
    }
    if (multiline && e.key === 'Enter' && e.altKey) {
      e.preventDefault();
      const { selectionStart, selectionEnd, value } = e.currentTarget;
      const updatedValue = `${value.slice(0, selectionStart)}\n${value.slice(selectionEnd)}`;
      const cursorPosition = selectionStart + 1;
      pendingCursorPositionRef.current = cursorPosition;
      setInputValue(updatedValue);
      setFormulaSegments([]);
      if (formulaBarProviderRef.current) {
        formulaBarProviderRef.current.onFormulaBarSelectionChanged(cursorPosition);
        formulaBarProviderRef.current.onFormulaBarTextChange(updatedValue);
      }
      return;
    }
    if (showOverlay && !isReadOnly && handleOverlayKeyDown(e)) {
      return;
    }
    if (formulaBarProviderRef.current) {
      formulaBarProviderRef.current.onFormulaBarSelectionChanged(formulaInputRef.current.selectionStart);
      formulaBarProviderRef.current.onFormulaBarKeyDown(e);
    }
    if (shouldPreventMultilineEnter(multiline, e.key, e.altKey)) {
      e.preventDefault();
    }
  }, [showOverlay, isReadOnly, multiline, handleOverlayKeyDown, spreadsheetEditorManager]);

  const FormulaInputElement = multiline ? 'textarea' : 'input';
  const isMultilineExpanded = multiline && isExpanded;
  const inputRows = isMultilineExpanded ? 4 : 1;
  const inputWrap = isMultilineExpanded ? 'soft' : undefined;

  return (
    <DataElementWrapper className='FormulaBar' dataElement={DataElements.FORMULA_BAR}>
      <input
        type="text"
        className='RangeInput'
        value={activeCellRange}
        onChange={(e) => onRangeInputChange(e.target.value)}
        onKeyDown={onRangeInputKeyDown}
        aria-label={t('formulaBar.range')}
      />
      <div className={classNames('Formula', { readOnly: isReadOnly, multiline, expanded: isMultilineExpanded })}>
        <Icon glyph="function" className={classNames('FormulaIcon', { readOnly: isReadOnly })} />
        <div className={classNames('FormulaInputMask', { hidden: multiline })} ref={formulaInputMaskRef}>
          {
            formulaSegments.map((item, index) => {
              return (<span key={`${item.text}-${index}`} css={css({ color: item.color })}>{item.text}</span>);
            })
          }
        </div>
        <FormulaInputElement
          onFocus={handleInputFocus}
          id={DataElements.FORMULA_BAR}
          ref={formulaInputRef}
          type={multiline ? undefined : 'text'}
          rows={multiline ? inputRows : undefined}
          wrap={multiline ? inputWrap : undefined}
          role={multiline ? 'textbox' : 'combobox'}
          aria-autocomplete="list"
          aria-expanded={showOverlay && !isReadOnly}
          aria-controls={showOverlay && !isReadOnly ? overlayID : undefined}
          className={classNames({
            'FormulaInput': true,
            hasFormula: !multiline && formulaSegments.length > 0,
            multilineInput: multiline,
            expandedInput: isMultilineExpanded,
          })}
          aria-activedescendant={showOverlay && highlightedIndex !== -1 ? `option-${highlightedIndex}` : undefined}
          value={inputValue}
          onScroll={(e) => {
            if (formulaInputMaskRef.current) {
              formulaInputMaskRef.current.scrollLeft = e.target.scrollLeft;
            }
          }}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          onCopy={handleClipboardEvent}
          onCut={handleClipboardEvent}
          onPaste={handleClipboardEvent}
          onDragStart={handleClipboardEvent}
          onContextMenu={handleContextMenu}
          readOnly={isReadOnly}
          aria-label={t('formulaBar.label')}
        />
        {multiline && (
          <button
            type="button"
            className="FormulaExpandButton"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setIsExpanded((expanded) => !expanded)}
            aria-label={`${t(isMultilineExpanded ? 'action.collapse' : 'action.expand')} ${t('formulaBar.label')}`}
            aria-expanded={isMultilineExpanded}
          >
            <Icon glyph={isExpanded ? 'icon-chevron-up' : 'icon-chevron-down'} ariaHidden={true} />
          </button>
        )}
        {showOverlay && !isReadOnly && (
          <FormulaOverlay
            isOpen={showOverlay}
            options={formulaSearchResults}
            onSelect={handleOptionSelect}
            onClose={handleOverlayClose}
            triggerElement={formulaInputRef.current}
            highlightedIndex={highlightedIndex}
            setHighlightedIndex={setHighlightedIndex}
            selectedFormula={selectedFormula}
            id={overlayID}
          />
        )}
      </div>
    </DataElementWrapper>
  );
};

FormulaBar.propTypes = {
  isReadOnly: PropTypes.bool,
  activeCellRange: PropTypes.string,
  cellFormula: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  stringCellValue: PropTypes.string,
  multiline: PropTypes.bool,
  onRangeInputChange: PropTypes.func,
  onRangeInputKeyDown: PropTypes.func,
};

export default FormulaBar;
