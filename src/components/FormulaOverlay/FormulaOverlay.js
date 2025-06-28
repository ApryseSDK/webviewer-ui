import React, { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import useOnClickOutside from 'hooks/useOnClickOutside';
import { useTranslation } from 'react-i18next';
import './FormulaOverlay.scss';
import FormulaHelperOverlay from '../FormulaHelperOverlay';
import DataElementWrapper from '../DataElementWrapper';
import DataElements from 'constants/dataElement';

const FormulaOverlay = ({
  isOpen,
  options,
  onSelect,
  onClose,
  triggerElement,
  highlightedIndex,
  setHighlightedIndex,
  selectedFormula,
  id,
}) => {
  const { t } = useTranslation();
  const overlayRef = useRef(null);
  const optionRefs = useRef([]);

  useEffect(() => {
    if (optionRefs.current[highlightedIndex]) {
      optionRefs.current[highlightedIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [highlightedIndex]);

  const handleClickOutside = useCallback((e) => {
    if (isOpen && !triggerElement?.contains(e.target)) {
      onClose();
    }
  }, [isOpen, onClose, triggerElement]);

  useOnClickOutside(overlayRef, handleClickOutside);

  if (!isOpen) {
    return null;
  }

  return (
    <DataElementWrapper dataElement={DataElements.FORMULA_OVERLAY} className="FormulaOverlay">
      <span id='formula-overlay-label' className='formula-label'>
        {t('formulaBar.formulas')}
      </span>
      {!selectedFormula && (
        <ul
          ref={overlayRef}
          className="formula-overlay-list"
          role="listbox"
          aria-labelledby="formula-overlay-label"
          id={id}
        >
          {options.map((option, index) => (
            <li
              key={`${option.name}-${index}`}
              ref={(el) => (optionRefs.current[index] = el)}
              className={classNames('formula-option', {
                'highlighted': highlightedIndex === index,
              })}
              onClick={() => onSelect(option)}
              onMouseEnter={() => setHighlightedIndex(index)}
              id={`option-${index}`}
              role="option"
              aria-labelledby={`formula-name-${index} formula-desc-${index}`}
              aria-selected={highlightedIndex === index}
              tabIndex={0}
            >
              <div id={`formula-name-${index}`} className="formula-name">{option.name}</div>
              {highlightedIndex === index && (
                <div id={`formula-desc-${index}`} className="formula-description">
                  {t(`formulas.${option.name}.description`, option.description)}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      {selectedFormula && (
        <FormulaHelperOverlay
          selectedFormula={selectedFormula}
          labelId="formula-overlay-label"
        />
      )}
    </DataElementWrapper>
  );
};

FormulaOverlay.propTypes = {
  id: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
  onSelect: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  triggerElement: PropTypes.instanceOf(Element),
  highlightedIndex: PropTypes.number.isRequired,
  setHighlightedIndex: PropTypes.func.isRequired,
  selectedFormula: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string.isRequired,
    parameters: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
      })
    ),
  }),
};

export default FormulaOverlay;
