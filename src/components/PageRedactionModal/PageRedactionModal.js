import React, { useEffect, useState, useRef } from 'react';
import DataElements from 'constants/dataElement';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import Button from 'components/Button';
import Choice from 'components/Choice';
import PropTypes from 'prop-types';
import PageNumberInput from 'components/PageReplacementModal/PageNumberInput';
import ModalWrapper from 'components/ModalWrapper';
import useFocusOnClose from 'hooks/useFocusOnClose';

import './PageRedactionModal.scss';

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
  const [pageNumberError, setPageNumberError] = useState('');

  useEffect(() => {
    setPages(selectedPages);
  }, [selectedPages]);

  const getSelectedPages = () => {
    const pageNumbers = [];
    if (selectionType === SelectionTypes.CURRENT) {
      return [currentPage];
    }
    if (selectionType === SelectionTypes.SPECIFY) {
      return pages;
    }
    if (selectionType === SelectionTypes.ODD) {
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
  const onRedactWithFocusTransfer = useFocusOnClose(onRedact);
  const onMarktWithFocusTransfer = useFocusOnClose(onMark);

  const canvasContainer = useRef();
  useEffect(() => {
    if (isOpen) {
      renderCanvases(canvasContainer, getSelectedPages());
    }
  }, [selectionType, isOpen, pages, renderCanvases, getSelectedPages]);

  const onSwipe = (e) => {
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

  const onSelectionChange = (e) => {
    if (!e.target.classList.contains('page-number-input')) {
      setSelectionType(e.target.value);
      setPageNumberError('');
    }
  };
  const onPagesChanged = (pageNumbers) => {
    if (pageNumbers.length > 0) {
      setPageNumberError('');
      setPages(pageNumbers);
    }
  };

  const handlePageNumberError = (pageNumber) => {
    if (pageNumber) {
      setPageNumberError(`${t('message.errorPageNumber')} ${pageLabels.length}`);
    }
  };

  const specifyPagesLabelElement = (
    <>
      <label className="specifyPagesChoiceLabel">
        <span>{t('option.pageRedactModal.specify')}</span>
        {selectionType === 'specify' && (
          <span className="specifyPagesExampleLabel">
            - {t('option.thumbnailPanel.multiSelectPagesExample')}
          </span>
        )}
      </label>
      {selectionType === 'specify' && (
        <div className={classNames('page-number-input-container', { error: !!pageNumberError })}>
          <PageNumberInput
            selectedPageNumbers={pages}
            pageCount={pageLabels.length}
            ariaLabel={t('option.pageRedactModal.specify')}
            onSelectedPageNumbersChange={onPagesChanged}
            onBlurHandler={setPages}
            onError={handlePageNumberError}
            pageNumberError={pageNumberError}
          />
        </div>
      )}
    </>
  );

  return (
    <div
      className={classNames({
        Modal: true,
        PageRedactionModal: true,
        open: isOpen,
        closed: !isOpen,
      })}
      data-element={DataElements.PAGE_REDACT_MODAL}
    >
      <ModalWrapper
        title="action.redactPages"
        isOpen={isOpen}
        onCloseClick={closeModal}
        closeHandler={closeModal}
        onSwipedDown={onSwipe}
        onSwipedUp={onSwipe}
        swipeToClose
      >
        <div className="body">
          <div className="canvas-container" ref={canvasContainer} />
          <form className="selection-options" role="group" aria-labelledby={t('option.pageRedactModal.pageSelection')} onChange={onSelectionChange} onSubmit={(e) => e.preventDefault()}>
            <fieldset>
              <legend>
                <strong>{t('option.pageRedactModal.pageSelection')}</strong>
              </legend>
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
                className="specify-pages-choice"
                label={specifyPagesLabelElement}
                value={SelectionTypes.SPECIFY}
              />
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
            </fieldset>
          </form>
        </div>
        <div className="footer">
          <Button
            className="cancel modal-button secondary-button"
            dataElement="modalRedactButton"
            label="annotation.redact"
            disabled={pageNumberError}
            onClick={onRedactWithFocusTransfer}
          />
          <Button
            className="confirm modal-button"
            dataElement="modalMarkRedactButton"
            label="option.pageRedactModal.addMark"
            disabled={pageNumberError}
            onClick={onMarktWithFocusTransfer}
          />
        </div>
      </ModalWrapper>
    </div>
  );
};

PageRedactionModal.propTypes = propTypes;

export default PageRedactionModal;
