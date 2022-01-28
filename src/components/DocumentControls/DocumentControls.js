import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import Button from 'components/Button';
import './DocumentControls.scss';
import getPageArrayFromString from 'helpers/getPageArrayFromString';

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

  const [selectedPageIndexes, isDisabled, pageLabels, isThumbnailSelectingPages] = useSelector(state => [
    selectors.getSelectedThumbnailPageIndexes(state),
    selectors.isElementDisabled(state, 'documentControl'),
    selectors.getPageLabels(state),
    selectors.isThumbnailSelectingPages(state),
  ]);

  const initialPagesString = getPageString(selectedPageIndexes, pageLabels);

  const [pageString, setPageString] = useState(initialPagesString);
  const [previousPageString, setPreviousPageString] = useState(initialPagesString);

  useEffect(() => {
    setPageString(getPageString(selectedPageIndexes, pageLabels));
  }, [setPageString, selectedPageIndexes, shouldShowControls, pageLabels]);

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

  const disableThumbnailSelectingPages = () => {
    dispatch(actions.setSelectedPageThumbnails([]));
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
              {!isThumbnailSelectingPages ?
                <Button
                  img={"icon-tool-select-pages"}
                  title={"option.documentControls.selectTooltip"}
                  onClick={enableThumbnailSelectingPages}
                  dataElement={"thumbMultiSelect"}
                />
                :
                <Button
                  img={"icon-close"}
                  title={"option.documentControls.closeTooltip"}
                  onClick={disableThumbnailSelectingPages}
                  dataElement={"thumbCloseMultiSelect"}
                />
              }
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
