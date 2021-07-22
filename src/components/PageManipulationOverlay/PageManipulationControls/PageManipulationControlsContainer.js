import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next'
import selectors from 'selectors';
import actions from 'actions';
import core from 'core';
import PageManipulationControls from './PageManipulationControls';
import extractPagesWithAnnotations from '../../../helpers/extractPagesWithAnnotations';
import { saveAs } from 'file-saver';

function PageManipulationControlsContainer(props) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { pageNumbers } = props;

  const [isPageDeletionConfirmationModalEnabled] = useSelector(state => [
    selectors.pageDeletionConfirmationModalEnabled(state),
  ]);

  const handleDelete = () => {
    if (isPageDeletionConfirmationModalEnabled) {
      let message = t('warning.deletePage.deleteMessage');
      const title = t('warning.deletePage.deleteTitle');
      const confirmButtonText = t('action.ok');

      let warning = {
        message,
        title,
        confirmButtonText,
        onConfirm: () => core.removePages(pageNumbers).then(() => {
          const currentPage = core.getCurrentPage();
          console.log({ currentPage })
          dispatch(actions.setSelectedPageThumbnails([]));
        }),
      };

      if (core.getDocumentViewer().getPageCount() === 1) {
        message = t('warning.deletePage.deleteLastPageMessage');

        warning = {
          message,
          title,
          confirmButtonText,
          onConfirm: () => Promise.resolve(),
        };
      }

      dispatch(actions.showWarningMessage(warning));
    } else {
      core.removePages(pageNumbers)
    }
  };

  const extractPages = () => {
    if (pageNumbers.length === 0) {
      noPagesSelectedWarning();
      return;
    }

    const message = t('warning.extractPage.message');
    const title = t('warning.extractPage.title');
    const confirmBtnText = t('warning.extractPage.confirmBtn');
    const secondaryBtnText = t('warning.extractPage.secondaryBtn');

    let warning = {
      message,
      title,
      confirmBtnText,
      onConfirm: () =>
        extractPagesWithAnnotations(pageNumbers).then(file => {
          saveAs(file, 'extractedDocument.pdf');
        }),
      secondaryBtnText,
      onSecondary: () => {
        extractPagesWithAnnotations(pageNumbers).then(file => {
          saveAs(file, 'extractedDocument.pdf');
          core.removePages(pageNumbers).then(() => {
            dispatch(actions.setSelectedPageThumbnails([]));
          });
        });
      },
    };

    dispatch(actions.showWarningMessage(warning));
  };


  return (
    <PageManipulationControls
      deletePages={handleDelete}
      extractPages={extractPages}
    />
  )

};

export default PageManipulationControlsContainer;