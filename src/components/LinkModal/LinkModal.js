import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import defaultTool from 'constants/defaultTool';
import core from 'core';
import { Tabs, Tab, TabPanel } from 'components/Tabs';
import Button from 'components/Button';
import actions from 'actions';
import selectors from 'selectors';
import DataElements from 'constants/dataElement';
import ModalWrapper from 'components/ModalWrapper';
import DataElementWrapper from 'components/DataElementWrapper';

import './LinkModal.scss';

const LinkModal = ({ rightClickedAnnotation, setRightClickedAnnotation }) => {
  const [
    isDisabled,
    isOpen,
    totalPages,
    currentPage,
    tabSelected,
    pageLabels,
    isRightClickAnnotationPopupEnabled,
    activeDocumentViewerKey,
    selectedTab,
  ] = useSelector((state) => [
    selectors.isElementDisabled(state, DataElements.LINK_MODAL),
    selectors.isElementOpen(state, DataElements.LINK_MODAL),
    selectors.getTotalPages(state),
    selectors.getCurrentPage(state),
    selectors.getSelectedTab(state, DataElements.LINK_MODAL),
    selectors.getPageLabels(state),
    selectors.isRightClickAnnotationPopupEnabled(state),
    selectors.getActiveDocumentViewerKey(state),
    selectors.getSelectedTab(state, 'linkModal'),
  ]);
  const [t] = useTranslation();
  const dispatch = useDispatch();

  const urlInput = React.createRef();
  const pageLabelInput = React.createRef();

  const [url, setURL] = useState('');
  const [pageLabel, setPageLabel] = useState('');
  const isRightClickedAnnotationSelected = core.isAnnotationSelected(rightClickedAnnotation, activeDocumentViewerKey);
  const selectedAnnotations = core.getSelectedAnnotations(activeDocumentViewerKey);
  const annotManager = core.getAnnotationManager(activeDocumentViewerKey);

  const closeModal = () => {
    dispatch(actions.closeElement(DataElements.LINK_MODAL));
    setURL('');
    core.setToolMode(defaultTool);
    setRightClickedAnnotation(null);
  };

  const newLink = (x, y, width, height, linkPageNumber = currentPage) => {
    const link = new window.Core.Annotations.Link();
    link.PageNumber = linkPageNumber;
    link.StrokeColor = new window.Core.Annotations.Color(0, 165, 228);
    link.StrokeStyle = 'underline';
    link.StrokeThickness = 2;
    link.Author = core.getCurrentUser();
    link.Subject = 'Link';
    link.X = x;
    link.Y = y;
    link.Width = width;
    link.Height = height;
    return link;
  };

  const createLink = (action) => {
    const linksResults = [];

    const quads = core.getSelectedTextQuads(activeDocumentViewerKey);

    // If annotation popup is on right click, this won't clear selected text if there's any, adding links will add links for both right-clicked annotation and selected text
    if (quads) {
      const selectedText = core.getSelectedText(activeDocumentViewerKey);
      for (const currPageNumber in quads) {
        const currPageLinks = [];
        quads[currPageNumber].forEach((quad) => {
          currPageLinks.push(
            newLink(
              Math.min(quad.x1, quad.x3),
              Math.min(quad.y1, quad.y3),
              Math.abs(quad.x1 - quad.x3),
              Math.abs(quad.y1 - quad.y3),
              parseInt(currPageNumber)
            )
          );
        });
        createHighlightAnnot(
          currPageLinks,
          quads[currPageNumber],
          selectedText,
          action
        );
        linksResults.push(...currPageLinks);
      }
    }

    const annotationsToAddLink = (!isRightClickAnnotationPopupEnabled || isRightClickedAnnotationSelected) ? selectedAnnotations : [rightClickedAnnotation];

    annotationsToAddLink.forEach((annot) => {
      if (!annot) {
        return;
      }
      const groupedAnnots = annotManager.getGroupAnnotations(annot);
      if (groupedAnnots.length > 1) {
        const linksToDelete = groupedAnnots.filter((annot) => annot instanceof window.Core.Annotations.Link);
        if (linksToDelete.length > 0) {
          core.deleteAnnotations(linksToDelete, activeDocumentViewerKey);
        }
      }

      // if multi-select an annotation with no link option with an annotation with link option and right click on the latter, link button will show up and will add links for all annotations
      const link = newLink(annot.X, annot.Y, annot.Width, annot.Height);
      link.addAction('U', action);
      core.addAnnotations([link], activeDocumentViewerKey);
      linksResults.push(link);
      annotManager.groupAnnotations(annot, [link]);
    });

    return linksResults;
  };

  const createHighlightAnnot = async (linkAnnotArray, quads, text, action) => {
    const linkAnnot = linkAnnotArray[0];
    const highlight = new window.Core.Annotations.TextHighlightAnnotation();
    highlight.PageNumber = linkAnnot.PageNumber;
    highlight.X = linkAnnot.X;
    highlight.Y = linkAnnot.Y;
    highlight.Width = linkAnnot.Width;
    highlight.Height = linkAnnot.Height;
    highlight.StrokeColor = new window.Core.Annotations.Color(0, 0, 0, 0);
    highlight.Opacity = 0;
    highlight.Quads = quads;
    highlight.Author = core.getCurrentUser(activeDocumentViewerKey);
    highlight.setContents(text);

    linkAnnotArray.forEach((link, index) => {
      link.addAction('U', action);
      index === 0 ? core.addAnnotations([link, highlight], activeDocumentViewerKey) : core.addAnnotations([link], activeDocumentViewerKey);
    });
    annotManager.groupAnnotations(highlight, linkAnnotArray, activeDocumentViewerKey);
  };

  const addURLLink = (e) => {
    e.preventDefault();

    if (!url.length) {
      return;
    }

    let urlWithProtocol;
    if (!core.isValidURI(url)) {
      urlWithProtocol = `https://${url}`;
    } else {
      urlWithProtocol = url;
    }

    const action = new window.Core.Actions.URI({ uri: urlWithProtocol });
    const links = createLink(action);

    let pageNumbersToDraw = links.map((link) => link.PageNumber);
    pageNumbersToDraw = [...new Set(pageNumbersToDraw)];
    pageNumbersToDraw.forEach((pageNumberToDraw) => {
      core.drawAnnotations(pageNumberToDraw, null, true, undefined, activeDocumentViewerKey);
    });

    closeModal();
  };

  const isValidPageLabel = () => {
    return pageLabels?.includes(pageLabel);
  };

  const addPageLink = (e) => {
    e.preventDefault();

    const Dest = window.Core.Actions.GoTo.Dest;

    const options = { dest: new Dest({ page: pageLabels.indexOf(pageLabel) + 1 }) };
    const action = new window.Core.Actions.GoTo(options);

    const links = createLink(action);

    let pageNumbersToDraw = links.map((link) => link.PageNumber);
    pageNumbersToDraw = [...new Set(pageNumbersToDraw)];
    pageNumbersToDraw.forEach((pageNumberToDraw) => {
      core.drawAnnotations(pageNumberToDraw, null, true, undefined, activeDocumentViewerKey);
    });

    closeModal();
  };

  useEffect(() => {
    if (isOpen) {
      //  prepopulate URL if URL is selected
      const selectedText = core.getSelectedText(activeDocumentViewerKey);
      if (selectedText) {
        const urlRegex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
        const urls = selectedText.match(urlRegex);
        if (urls && urls.length > 0) {
          setURL(urls[0]);
        }
      }

      setPageLabel(pageLabels.length > 0 ? pageLabels[0] : '1');
    }
  }, [totalPages, isOpen]);

  useEffect(() => {
    if (tabSelected === 'PageNumberPanelButton' && isOpen) {
      pageLabelInput.current.focus();
    } else if (tabSelected === 'URLPanelButton' && isOpen) {
      urlInput.current.focus();
    }
  }, [tabSelected, isOpen, pageLabelInput, urlInput]);

  useEffect(() => {
    core.addEventListener('documentUnloaded', closeModal);
    return () => {
      core.removeEventListener('documentUnloaded', closeModal);
    };
  }, []);

  const modalClass = classNames({
    Modal: true,
    LinkModal: true,
    open: isOpen,
    closed: !isOpen,
  });

  return isDisabled ? null : (
    <DataElementWrapper dataElement={DataElements.LINK_MODAL} className={modalClass}>
      <ModalWrapper
        title={t('link.insertLinkOrPage')}
        isOpen={isOpen}
        closeHandler={closeModal}
        onCloseClick={closeModal}
        swipeToClose>
        <div className="container" onMouseDown={(e) => e.stopPropagation()}>
          <Tabs id="linkModal">
            <div className="tabs-header-container">
              <div className="tab-list">
                <Tab dataElement="URLPanelButton" >
                  <button className="tab-options-button">{t('link.url')}</button>
                </Tab>
                <div className="tab-options-divider" />
                <Tab dataElement="PageNumberPanelButton">
                  <button className="tab-options-button">{t('link.page')}</button>
                </Tab>
              </div>
            </div>
            <TabPanel dataElement="URLPanel">
              <div className="panel-body">
                <div className="add-url-link">
                  <form onSubmit={addURLLink}>
                    <label htmlFor="urlInput" className="inputLabel">{t('link.enterUrlAlt')}</label>
                    <div className="linkInput">
                      <input
                        id="urlInput"
                        className="urlInput"
                        ref={urlInput}
                        value={url}
                        onChange={(e) => setURL(e.target.value)}
                      />
                    </div>
                  </form>
                </div>
              </div>
            </TabPanel>
            <TabPanel dataElement="PageNumberPanel">
              <div className="panel-body">
                <div className="add-url-link">
                  <form onSubmit={addPageLink}>
                    <label htmlFor="pageInput" className="inputLabel">{t('link.enterpage')}</label>
                    <div className="linkInput">
                      <input
                        id="pageInput"
                        className="pageInput"
                        ref={pageLabelInput}
                        value={pageLabel}
                        onChange={(e) => setPageLabel(e.target.value)}
                      />
                    </div>
                  </form>
                </div>
              </div>
            </TabPanel>
          </Tabs>
          <div className="divider"></div>
          <div className="footer">
            {
              (selectedTab === 'URLPanelButton')
                ?
                (
                  <Button
                    className="ok-button"
                    dataElement="linkSubmitButton"
                    label={t('action.link')}
                    onClick={addURLLink}
                    disabled={!url.length}
                  />
                )
                :
                (
                  <Button
                    className="ok-button"
                    dataElement="linkSubmitButton"
                    label={t('action.link')}
                    onClick={addPageLink}
                    disabled={!isValidPageLabel()}
                  />
                )
            }
          </div>
        </div>
      </ModalWrapper>
    </DataElementWrapper>
  );
};

export default LinkModal;
