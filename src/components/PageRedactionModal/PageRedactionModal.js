import React, { useEffect, useState, useRef } from 'react';
import './PageRedactionModal.scss';
import DataElements from 'constants/dataElement';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import Button from 'components/Button';
import Choice from 'components/Choice';
import { Swipeable } from 'react-swipeable';
import PropTypes from 'prop-types';
import { FocusTrap } from '@pdftron/webviewer-react-toolkit';
import PageNumberInput from 'components/PageReplacementModal/PageNumberInput';

const propTypes = {
  closeModal: PropTypes.func,
  currentPage: PropTypes.number,
  pageLabels: PropTypes.array,
  selectedPages: PropTypes.array,
  markPages: PropTypes.func,
  redactPages: PropTypes.func,
  evenDisabled: PropTypes.bool,
  renderCanvases: PropTypes.func,
  isOpen: PropTypes.bool,
};

const SelectionTypes = {
  CURRENT: 'current',
  SPECIFY: 'specify',
  ODD: 'odd',
  EVEN: 'even',
};

const PageRedactionModal = ({
  closeModal,
  pageLabels,
  selectedPages,
  currentPage,
  markPages,
  redactPages,
  evenDisabled,
  renderCanvases,
  isOpen,
}) => {
  const { t } = useTranslation();

  const [selectionType, setSelectionType] = useState(SelectionTypes.CURRENT);
  const [pages, setPages] = useState();
  useEffect(() => {
    setPages(selectedPages);
  }, [selectedPages]);

  const getSelectedPages = () => {
    const pageNumbers = [];
    if (selectionType === SelectionTypes.CURRENT) {
      return [currentPage];
    } else if (selectionType === SelectionTypes.SPECIFY) {
      return pages;
    } else if (selectionType === SelectionTypes.ODD) {
      for (let i = 1; pageLabels.length >= i; i += 2) {
        pageNumbers.push(i);
      }
    } else if (selectionType === SelectionTypes.EVEN) {
      for (let i = 2; pageLabels.length >= i; i += 2) {
        pageNumbers.push(i);
      }
    }
    return pageNumbers;
  };

  const onMark = () => markPages(getSelectedPages());
  const onRedact = () => redactPages(getSelectedPages());

  const canvasContainer = useRef();
  useEffect(() => {
    if (isOpen) {
      renderCanvases(canvasContainer, getSelectedPages());
    }
  }, [selectionType, isOpen, pages, renderCanvases, getSelectedPages]);

  const onSwipe = e => {
    const eventTarget = e.event.target;
    const containerHasScroll =
      canvasContainer.current.clientHeight < canvasContainer.current.scrollHeight ||
      canvasContainer.current.clientWidth < canvasContainer.current.scrollWidth;
    if (
      containerHasScroll &&
      (eventTarget === canvasContainer.current || canvasContainer.current.contains(eventTarget))
    ) {
      e.event.stopPropagation();
    } else {
      closeModal();
    }
  };

  const onSelectionChange = e => {
    if (!e.target.classList.contains('page-number-input')) {
      setSelectionType(e.target.value);
    }
    e.preventDefault();
  };
  const onPagesChanged = pages => setPages(pages);

  return (
    <Swipeable onSwipedUp={onSwipe} onSwipedDown={onSwipe} preventDefaultTouchmoveEvent focus>
      <FocusTrap locked={isOpen}>
        <div
          className={classNames({
            Modal: true,
            PageRedactionModal: true,
            open: isOpen,
            closed: !isOpen,
          })}
          data-element={DataElements.PAGE_REDACT_MODAL}
        >
          <div className="container">
            <div className="swipe-indicator" />
            <div className="header">
              <div className="header-text">{t('option.pageRedactModal.header')}</div>
              <Button onClick={closeModal} img="icon-close" />
            </div>
            <div className="body">
              <div className="canvas-container" ref={canvasContainer} />
              <form className="selection-options" onChange={onSelectionChange} onSubmit={e => e.preventDefault()}>
                <strong>{t('option.pageRedactModal.pageSelection')}</strong>
                <Choice
                  checked={selectionType === SelectionTypes.CURRENT}
                  radio
                  name="page-redaction-option"
                  label={t('option.pageRedactModal.current')}
                  value={SelectionTypes.CURRENT}
                />
                <Choice
                  checked={selectionType === SelectionTypes.SPECIFY}
                  radio
                  name="page-redaction-option"
                  label={t('option.pageRedactModal.specify')}
                  value={SelectionTypes.SPECIFY}
                />
                {selectionType === 'specify' && (
                  <PageNumberInput
                    selectedPageNumbers={pages}
                    pageCount={pageLabels.length}
                    onBlurHandler={onPagesChanged}
                    placeholder={t('option.pageRedactModal.specifyPlaceholder')}
                  />
                )}
                <Choice
                  checked={selectionType === SelectionTypes.ODD}
                  radio
                  name="page-redaction-option"
                  label={t('option.pageRedactModal.odd')}
                  value={SelectionTypes.ODD}
                />
                <Choice
                  checked={selectionType === SelectionTypes.EVEN}
                  radio
                  name="page-redaction-option"
                  label={t('option.pageRedactModal.even')}
                  value={SelectionTypes.EVEN}
                  disabled={evenDisabled}
                />
              </form>
            </div>
            <div className="footer">
              <Button
                className="cancel modal-button"
                dataElement="modalRedactButton"
                label="annotation.redact"
                onClick={onRedact}
              />
              <Button
                className="confirm modal-button"
                dataElement="modalMarkRedactButton"
                label="option.pageRedactModal.addMark"
                onClick={onMark}
              />
            </div>
          </div>
        </div>
      </FocusTrap>
    </Swipeable>
  );
};

PageRedactionModal.propTypes = propTypes;

export default PageRedactionModal;
