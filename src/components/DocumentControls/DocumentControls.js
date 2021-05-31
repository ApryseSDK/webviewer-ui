import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { saveAs } from 'file-saver';
import { useTranslation } from 'react-i18next';

import Button from 'components/Button';
import './DocumentControls.scss';
import getPageArrayFromString from 'helpers/getPageArrayFromString';
import core from 'core';
import extractPagesWithAnnotations from '../../helpers/extractPagesWithAnnotations';

import selectors from 'selectors';
import actions from 'actions';

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

const DocumentControls = props => {
  const { shouldShowControls } = props;

  const [t] = useTranslation();
  const dispatch = useDispatch();

  const [selectedPageIndexes, isDisabled, pageLabels] = useSelector(state => [
    selectors.getSelectedThumbnailPageIndexes(state),
    selectors.isElementDisabled(state, 'documentControl'),
    selectors.getPageLabels(state),
  ]);

  const initialPagesString = getPageString(selectedPageIndexes, pageLabels);

  const [pageString, setPageString] = useState(initialPagesString);
  const [previousPageString, setPreviousPageString] = useState(initialPagesString);

  useEffect(() => {
    setPageString(getPageString(selectedPageIndexes, pageLabels));
  }, [setPageString, selectedPageIndexes, shouldShowControls, pageLabels]);

  const noPagesSelectedWarning = () => {
    const title = t('warning.selectPage.selectTitle');
    const message = t('warning.selectPage.selectMessage');
    const confirmBtnText = t('action.ok');

    const warning = {
      message,
      title,
      confirmBtnText,
      onConfirm: () => Promise.resolve(),
      keepOpen: ['leftPanel'],
    };

    dispatch(actions.showWarningMessage(warning));
  };

  const rotateClockwise = () => {
    if (selectedPageIndexes.length === 0) {
      noPagesSelectedWarning();
      return;
    }

    const pageNumbersToRotate = selectedPageIndexes.map(p => p + 1);
    pageNumbersToRotate.forEach(index => {
      core.rotatePages([index], window.Core.PageRotation.e_90);
    });
  };

  const onDeletePages = () => {
    if (selectedPageIndexes.length === 0) {
      noPagesSelectedWarning();
      return;
    }

    let message = t('warning.deletePage.deleteMessage');
    const title = t('warning.deletePage.deleteTitle');
    const confirmBtnText = t('action.ok');
    const pageNumbersToDelete = selectedPageIndexes.map(p => p + 1);

    let warning = {
      message,
      title,
      confirmBtnText,
      onConfirm: () =>
        core.removePages(pageNumbersToDelete).then(() => {
          dispatch(actions.setSelectedPageThumbnails([]));
        }),
    };

    if (core.getDocumentViewer().getPageCount() === pageNumbersToDelete.length) {
      message = t('warning.deletePage.deleteLastPageMessage');

      warning = {
        message,
        title,
        confirmBtnText,
        onConfirm: () => Promise.resolve(),
      };
    }

    dispatch(actions.showWarningMessage(warning));
  };

  const extractPages = () => {
    if (selectedPageIndexes.length === 0) {
      noPagesSelectedWarning();
      return;
    }

    const message = t('warning.extractPage.message');
    const title = t('warning.extractPage.title');
    const confirmBtnText = t('warning.extractPage.confirmBtn');
    const pageNumbersToDelete = selectedPageIndexes.map(p => p + 1);
    const secondaryBtnText = t('warning.extractPage.secondaryBtn');

    let warning = {
      message,
      title,
      confirmBtnText,
      onConfirm: () =>
        extractPagesWithAnnotations(selectedPageIndexes.map(index => index + 1)).then(file => {
          saveAs(file, 'extractedDocument.pdf');
        }),
      secondaryBtnText,
      onSecondary: () => {
        extractPagesWithAnnotations(selectedPageIndexes.map(index => index + 1)).then(file => {
          saveAs(file, 'extractedDocument.pdf');
          core.removePages(pageNumbersToDelete).then(() => {
            dispatch(actions.setSelectedPageThumbnails([]));
          });
        });
      },
    };

    dispatch(actions.showWarningMessage(warning));
  };

  const onBlur = e => {
    const selectedPagesString = e.target.value.replace(/ /g, '');
    const pages = !selectedPagesString ? [] : getPageArrayFromString(selectedPagesString, pageLabels);
    const pageIndexes = pages.map(page => page - 1);

    if (pages.length || !selectedPagesString) {
      dispatch(actions.setSelectedPageThumbnails(pageIndexes));

      const updatedString = getPageString(selectedPageIndexes, pageLabels);

      setPageString(updatedString);
      setPreviousPageString(updatedString);
    } else {
      setPageString(previousPageString);
    }
  };

  const pageStringUpdate = e => {
    setPageString(e.target.value);
  };

  return isDisabled ? null : (
    <div className={'documentControlsContainer'} data-element={'documentControl'}>
      {shouldShowControls ? (
        <div className={'documentControls'}>
          <div className={'divider'}></div>
          <div className={'documentControlsInput'}>
            <input
              onBlur={onBlur}
              onChange={pageStringUpdate}
              value={pageString}
              placeholder={t('option.documentControls.placeholder')}
              aria-label={t('option.documentControls.placeholder')}
              className="pagesInput"
              type="text"
            />
            <div className={'documentControlsButton'}>
              <Button
                img="icon-delete-line"
                onClick={onDeletePages}
                title="option.thumbnailPanel.delete"
                dataElement="thumbMultiDelete"
              />
              <Button
                img="icon-header-page-manipulation-page-rotation-clockwise-line"
                onClick={rotateClockwise}
                title="option.thumbnailPanel.rotateClockwise"
                dataElement="thumbMultiRotate"
              />
              <Button
                img="ic-operation-export-line"
                title="action.extract"
                onClick={extractPages}
                dataElement="thumbExtract"
              />
            </div>
          </div>
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
