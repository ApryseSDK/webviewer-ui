import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import Icon from 'components/Icon';
import DataElements from 'constants/dataElement';
import DataElementWrapper from 'components/DataElementWrapper';
import FormulaOverlay from 'components/FormulaOverlay/FormulaOverlay';
import core from 'core';
import './FormulaBar.scss';

const FormulaBar = (props) => {
  const {
    isReadOnly,
    activeCellRange,
    cellFormula,
    stringCellValue,
    onRangeInputChange,
    onRangeInputKeyDown,
  } = props;

  const { t } = useTranslation();
  const formulaBarValue = cellFormula || stringCellValue || '';

  const [inputValue, setInputValue] = useState(formulaBarValue);
  const [showOverlay, setShowOverlay] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [selectedFormula, setSelectedFormula] = useState(null);
  const [formulaSearchResults, setFormulaSearchResults] = useState([]);
  const [formulaSegments, setFormulaSegments] = useState([]);
  const [isFormulaFocused, setIsFormulaFocused] = useState(false);

  const formulaInputRef = useRef(null);
  const formulaBarProviderRef = useRef(null);
  const lastCellRef = useRef();

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

      const updatedText = segments.map((segment) => segment._text).join('');
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
      lastCellRef.current = currentCell;
    }
  }, [activeCellRange, formulaBarValue]);

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

  const handleKeyDown = useCallback((e) => {
    if (showOverlay && !isReadOnly) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex((prev) => (prev + 1) % formulaSearchResults.length);
          return;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex((prev) => (prev - 1 + formulaSearchResults.length) % formulaSearchResults.length);
          return;
        case 'Enter':
          if (formulaSearchResults[highlightedIndex]) {
            handleOptionSelect(formulaSearchResults[highlightedIndex]);
            return;
          }
          break;
        case 'Tab':
          if (!e.shiftKey) {
            e.preventDefault();
            if (formulaSearchResults[highlightedIndex]) {
              handleOptionSelect(formulaSearchResults[highlightedIndex]);
            }
            return;
          }
          break;
        case 'Escape':
          e.stopPropagation();
          handleOverlayClose();
          return;
        default:
          break;
      }
    }
    if (formulaBarProviderRef.current) {
      formulaBarProviderRef.current.onFormulaBarSelectionChanged(formulaInputRef.current.selectionStart);
      formulaBarProviderRef.current.onFormulaBarKeyDown(e);
    }
  }, [showOverlay, isReadOnly, formulaSearchResults, highlightedIndex, handleOptionSelect, handleOverlayClose]);

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
      <div className={classNames('Formula', { readOnly: isReadOnly })}>
        <Icon glyph="function" className={classNames('FormulaIcon', { readOnly: isReadOnly })} />
        <div className='FormulaInputMask'>
          {
            formulaSegments.map((item, index) => {
              return (<span key={`${item.text}-${index}`} style={{ color: item.color }}>{item.text}</span>);
            })
          }
        </div>
        <input
          onFocus={handleInputFocus}
          id={DataElements.FORMULA_BAR}
          ref={formulaInputRef}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={formulaSearchResults.length > 0}
          aria-controls={overlayID}
          className={classNames({
            'FormulaInput': true,
            hasFormula: formulaSegments.length > 0,
          })}
          aria-activedescendant={showOverlay && highlightedIndex !== -1 ? `option-${highlightedIndex}` : undefined}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          readOnly={isReadOnly}
          aria-label={t('formulaBar.label')}
        />
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
  onRangeInputChange: PropTypes.func,
  onRangeInputKeyDown: PropTypes.func,
};

export default FormulaBar;
