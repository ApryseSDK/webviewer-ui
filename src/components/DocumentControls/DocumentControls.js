import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import './DocumentControls.scss';
import getPagesToPrint from 'helpers/getPagesToPrint';
import { saveAs } from 'file-saver';
import i18next from 'i18next';

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
  const {
    deletePagesCallBack,
    selectedPageIndexes,
    pageLabels,
    updateSelectedPage,
    toggleDocumentControl,
    shouldShowControls,
  } = props;

  const initalPagesString = getPageString(selectedPageIndexes, pageLabels);

  // TODO figure out why the inital values is incorrect
  const [pageString, setPageString] = useState(initalPagesString);
  const [previousPageString, setPreviousPageString] = useState(initalPagesString);

  useEffect(() => {
    setPageString(getPageString(selectedPageIndexes, pageLabels));
  }, [setPageString, selectedPageIndexes, shouldShowControls, pageLabels]);
  const deletePages = () => {
    deletePagesCallBack();
  };

  const extractPages = () => {
    if (selectedPageIndexes.length === 0) {
      const warning = {
        message: i18next.t('option.thumbnailPanel.extractZeroPageError'),
        title: i18next.t('action.extract'),
        confirmBtnText: i18next.t('action.ok'),
        onConfirm: () => Promise.resolve(),
        keepOpen: ['leftPanel'],
      };

      window.readerControl.showWarningMessage(warning);
      return;
    }

    window.readerControl.extractPages(selectedPageIndexes.map(index => index + 1)).then(file => {
      saveAs(file, 'extractedDocument.pdf');
    });
  };

  const onBlur = e => {
    const selectedPagesString = e.target.value.replace(/ /g, '');

    // TODO move "getPagesToPrint" to another API
    const pages = !selectedPagesString ? [] : getPagesToPrint(selectedPagesString, pageLabels);
    const pageIndexes = pages.map(page => page - 1);

    if (pages.length || !selectedPagesString) {
      updateSelectedPage(pageIndexes);

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

  const onToggleDocumentControl = () => {
    updateSelectedPage([]);
    toggleDocumentControl(!shouldShowControls);
  };

  const icon = shouldShowControls ? 'ic_arrow_down_black_24px' : 'ic_arrow_up_black_24px';

  return (
    <div className={`documentControlsContainer`}>
      <Button
        className={`documentControlToggle ${shouldShowControls ? 'showing' : ''}`}
        img={icon}
        onClick={onToggleDocumentControl}
      />
      {shouldShowControls ?
        <div className={`documentControls `}>
          <div>
            <input
              onBlur={onBlur}
              onChange={pageStringUpdate}
              value={pageString}
              placeholder={'Enter pages to select i.e. 2, 5-9'}
              className="pagesInput" type="text"
            />
          </div>
          <div className="documentControlsButton">
            <Button
              img="ic_delete_black_24px"
              onClick={deletePages}
              title="option.thumbnailPanel.delete"
            />
            <Button
              img="ic_extract_black_24px"
              title="action.extract"
              onClick={extractPages}
            />
          </div>
        </div>
        : null}
    </div>
  );
};

DocumentControls.propTypes = {
  deletePagesCallBack: PropTypes.func,
  selectedPageIndexes: PropTypes.arrayOf(PropTypes.number),
  pageLabels: PropTypes.arrayOf(PropTypes.string),
  updateSelectedPage: PropTypes.func,
  toggleDocumentControl: PropTypes.func,
  shouldShowControls: PropTypes.bool,
};

export default DocumentControls;