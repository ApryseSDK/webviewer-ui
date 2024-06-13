import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import getPageArrayFromString from 'helpers/getPageArrayFromString';
import selectors from 'selectors';
import actions from 'actions';
import pageNumberPlaceholder from 'constants/pageNumberPlaceholder';
import core from 'src/core';
import { useTranslation } from 'react-i18next';
import LeftPanelPageTabs from 'components/LeftPanelPageTabs';
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
  const dispatch = useDispatch();

  const [
    selectedPageIndexes,
    isDisabled,
    pageLabels,
    isThumbnailSelectingPages,
    featureFlags,
  ] = useSelector((state) => [
    selectors.getSelectedThumbnailPageIndexes(state),
    selectors.isElementDisabled(state, 'documentControl'),
    selectors.getPageLabels(state),
    selectors.isThumbnailSelectingPages(state),
    selectors.getFeatureFlags(state),
  ]);

  const initialPagesString = getPageString(selectedPageIndexes, pageLabels);

  const [pageString, setPageString] = useState(initialPagesString);
  const [previousPageString, setPreviousPageString] = useState(initialPagesString);
  const customizableUI = featureFlags.customizableUI;

  useEffect(() => {
    setPageString(getPageString(selectedPageIndexes, pageLabels));
  }, [setPageString, selectedPageIndexes, shouldShowControls, pageLabels]);

  const onBlur = (e) => {
    const selectedPagesString = e.target.value.replace(/ /g, '');
    const pages = !selectedPagesString ? [] : getPageArrayFromString(selectedPagesString, pageLabels);
    const pageIndexes = pages.map((page) => page - 1);

    if (pages.length || !selectedPagesString) {
      dispatch(actions.setSelectedPageThumbnails(pageIndexes));

      const updatedString = getPageString(selectedPageIndexes, pageLabels);

      setPageString(updatedString);
      setPreviousPageString(updatedString);
    } else {
      setPageString(previousPageString);
    }

    if (selectedPageIndexes.length > 0 && !isThumbnailSelectingPages) {
      // set a short timeout due to race condition caused by onBlur and
      // changing the documentControlsButton based on isThumbnailSelectingPages
      setTimeout(() => {
        enableThumbnailSelectingPages();
      }, 100);
    }
  };

  const pageStringUpdate = (e) => {
    setPageString(e.target.value);
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
          {isThumbnailSelectingPages && <LeftPanelPageTabs parentElement={parentElement} />}
          {customizableUI &&
            <label className={'documentControlsLabel'} htmlFor="pageNumbersInput">
              <span>
                {t('option.thumbnailPanel.multiSelectPages')} -
              </span>
              <span className='multiSelectExampleLabel'>
                {t('option.thumbnailPanel.multiSelectPagesExample')}
              </span>
            </label>
          }
          <div className={'documentControlsInput'}>
            <input
              name="pageNumbersInput"
              onBlur={onBlur}
              onChange={pageStringUpdate}
              value={pageString}
              placeholder={customizableUI ? '' : pageNumberPlaceholder}
              aria-label={t('option.thumbnailPanel.enterPageNumbers')}
              className="pagesInput"
              type="text"
            />
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
