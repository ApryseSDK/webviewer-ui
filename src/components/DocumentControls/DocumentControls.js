import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from 'components/Button';
import Icon from 'components/Icon';
import getPageArrayFromString from 'helpers/getPageArrayFromString';
import selectors from 'selectors';
import actions from 'actions';
import { useTranslation } from 'react-i18next';
import ThumbnailControlsMulti from 'src/components/ThumbnailControlsMulti';
import useCore from 'hooks/useCore';
import './DocumentControls.scss';

function getPageString(selectedPageArray, pageLabels) {
  let pagesToPrint = '';
  const sortedPages = selectedPageArray.sort((a, b) => a - b);
  let prevIndex = null;

  for (let i = 0; sortedPages.length > i; i++) {
    if (sortedPages[i + 1] === sortedPages[i] + 1) {
      prevIndex = prevIndex !== null ? prevIndex : sortedPages[i];
    } else if (prevIndex !== null) {
      pagesToPrint = `${pagesToPrint}${pageLabels[prevIndex]}-${pageLabels[sortedPages[i]]}, `;
      prevIndex = null;
    } else {
      pagesToPrint = `${pagesToPrint}${pageLabels[sortedPages[i]]}, `;
    }
  }

  return pagesToPrint.slice(0, -2);
}

const DocumentControls = ({ shouldShowControls, parentElement }) => {
  const [t] = useTranslation();
  const { core } = useCore();
  const dispatch = useDispatch();
  const activeDocumentViewerKey = useSelector(selectors.getActiveDocumentViewerKey);

  const [
    selectedPageIndexes,
    isDisabled,
    pageLabels,
    isThumbnailSelectingPages,
    isCustomPageLabelsEnabled,
  ] = useSelector((state) => [
    selectors.getSelectedThumbnailPageIndexes(state),
    selectors.isElementDisabled(state, 'documentControl'),
    selectors.getPageLabels(state, activeDocumentViewerKey),
    selectors.isThumbnailSelectingPages(state),
    selectors.isCustomPageLabelsEnabled(state, activeDocumentViewerKey),
  ]);

  const initialPagesString = getPageString(selectedPageIndexes, pageLabels);

  const [pageString, setPageString] = useState(initialPagesString);
  const [previousPageString, setPreviousPageString] = useState(initialPagesString);
  const [hasPageNumberError, setHasPageNumberError] = useState(false);
  // Skips the error reset below when the selection change itself came from an invalid-blur clear.
  const clearingAfterErrorRef = useRef(false);

  useEffect(() => {
    setPageString(getPageString(selectedPageIndexes, pageLabels));
    if (clearingAfterErrorRef.current) {
      clearingAfterErrorRef.current = false;
    } else {
      setHasPageNumberError(false);
    }
  }, [setPageString, selectedPageIndexes, shouldShowControls, pageLabels]);

  const onBlur = (e) => {
    const selectedPagesString = e.target.value.replaceAll(' ', '');
    const pages = !selectedPagesString ? [] : getPageArrayFromString(selectedPagesString, pageLabels, core.getTotalPages());
    const pageIndexes = pages.map((page) => page - 1);
    const isValidInput = pages.length > 0 || !selectedPagesString;

    if (isValidInput) {
      setHasPageNumberError(false);
      dispatch(actions.setSelectedPageThumbnails(pageIndexes));

      const updatedString = getPageString(selectedPageIndexes, pageLabels);

      setPageString(updatedString);
      setPreviousPageString(updatedString);
    } else {
      setHasPageNumberError(true);
      setPageString('');
      if (selectedPageIndexes.length > 0) {
        clearingAfterErrorRef.current = true;
        dispatch(actions.setSelectedPageThumbnails([]));
      }
    }

    if (isValidInput && selectedPageIndexes.length > 0 && !isThumbnailSelectingPages) {
      // set a short timeout due to race condition caused by onBlur and
      // changing the documentControlsButton based on isThumbnailSelectingPages
      setTimeout(() => {
        if (pageString !== previousPageString) {
          enableThumbnailSelectingPages();
        }
      }, 100);
    }
  };

  const pageStringUpdate = (e) => {
    const inputValue = e.target.value;
    setPageString(inputValue);

    const selectedPagesString = inputValue.replaceAll(' ', '');
    const lastChar = selectedPagesString[selectedPagesString.length - 1];
    if (!selectedPagesString || lastChar === ',' || lastChar === '-') {
      setHasPageNumberError(false);
      return;
    }

    const pages = getPageArrayFromString(selectedPagesString, pageLabels, core.getTotalPages());
    setHasPageNumberError(pages.length === 0);
  };

  const disableThumbnailSelectingPages = () => {
    dispatch(actions.setSelectedPageThumbnails([core.getCurrentPage() - 1]));
    dispatch(actions.setThumbnailSelectingPages(false));
  };

  const enableThumbnailSelectingPages = () => {
    dispatch(actions.setThumbnailSelectingPages(true));
  };

  return isDisabled ? null : (
    <div className={'documentControlsContainer'} data-element={'documentControl'}>
      {shouldShowControls ? (
        <div className={'documentControls'}>
          <div className={'divider'}></div>
          {isThumbnailSelectingPages && <ThumbnailControlsMulti parentElement={parentElement}/>}
          <label className={'documentControlsLabel'} htmlFor="pageNumbersInput">
            <span>
              {t('option.thumbnailPanel.multiSelectPages')} -
            </span>
            <span className='multiSelectExampleLabel'>
              {t('option.thumbnailPanel.multiSelectPagesExample')}
            </span>
          </label>
          <div className={classNames('documentControlsInput', { error: hasPageNumberError })}>
            <div className="pageNumbersInputWrapper">
              <input
                name="pageNumbersInput"
                onBlur={onBlur}
                onChange={pageStringUpdate}
                value={pageString}
                placeholder={''}
                aria-label={t('option.thumbnailPanel.enterPageNumbers')}
                aria-describedby={hasPageNumberError ? 'documentControlsPageNumberError' : undefined}
                className={classNames('pagesInput', { 'pagesInput--error': hasPageNumberError })}
                type="text"
              />
              {hasPageNumberError && <Icon glyph="icon-alert" />}
            </div>
            <div className={'documentControlsButton'}>
              {!isThumbnailSelectingPages ? (
                <Button
                  img={'icon-tool-select-pages'}
                  title={'option.documentControls.selectTooltip'}
                  onClick={enableThumbnailSelectingPages}
                  dataElement={'thumbMultiSelect'}
                />
              ) : (
                <Button
                  img={'icon-close'}
                  title={'option.documentControls.closeTooltip'}
                  onClick={disableThumbnailSelectingPages}
                  dataElement={'thumbCloseMultiSelect'}
                />
              )}
            </div>
          </div>
          {hasPageNumberError && (
            <div id="documentControlsPageNumberError" className="page-number-error">
              <p aria-live="assertive" className="no-margin">
                {t('message.errorPageNumberPart1')}
                {!isCustomPageLabelsEnabled && `${t('message.errorPageNumberPart2')} ${core.getTotalPages()}.`}
              </p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

DocumentControls.propTypes = {
  isDisabled: PropTypes.bool,
  pageLabels: PropTypes.arrayOf(PropTypes.string),
  toggleDocumentControl: PropTypes.func,
  shouldShowControls: PropTypes.bool,
};

export default DocumentControls;
