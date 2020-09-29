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

import { Swipeable } from 'react-swipeable';

import './LinkModal.scss';

const LinkModal = () => {
  const [
    isDisabled,
    isOpen,
    totalPages,
    currentPage,
    tabSelected,
  ] = useSelector(state => [
    selectors.isElementDisabled(state, 'linkModal'),
    selectors.isElementOpen(state, 'linkModal'),
    selectors.getTotalPages(state),
    selectors.getCurrentPage(state),
    selectors.getSelectedTab(state, 'linkModal'),
  ]);
  const [t] = useTranslation();
  const dispatch = useDispatch();

  const urlInput = React.createRef();
  const pageNumberInput = React.createRef();

  const [url, setURL] = useState('');
  const [pageNumber, setPageNumber] = useState(1);

  const closeModal = () => {
    dispatch(actions.closeElement('linkModal'));
    setURL('');
    setPageNumber(1);
    core.setToolMode(defaultTool);
  };

  const newLink = (x, y, width, height, linkPageNumber = currentPage) => {
    const link = new Annotations.Link();
    link.PageNumber = linkPageNumber;
    link.StrokeColor = new Annotations.Color(0, 165, 228);
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

  const createLink = () => {
    const linksResults = [];

    const quads = core.getSelectedTextQuads();
    const selectedAnnotations = core.getSelectedAnnotations();

    if (quads) {
      const selectedText = core.getSelectedText();
      for (const currPageNumber in quads) {
        const currPageLinks = [];
        quads[currPageNumber].forEach(quad => {
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
        // create a transparent highlight annotation in case of no annotation being linked to
        createHighlightAnnot(
          currPageLinks,
          quads[currPageNumber],
          selectedText,
        );
        linksResults.push(...currPageLinks);
      }
    }

    if (selectedAnnotations) {
      selectedAnnotations.forEach(annot => {
        const annotManager = core.getAnnotationManager();
        const groupedAnnots = annotManager.getGroupAnnotations(annot);

        // ungroup and delete any previously created links
        if (groupedAnnots.length > 1) {
          const linksToDelete = groupedAnnots.filter(annot => annot instanceof Annotations.Link);
          if (linksToDelete.length > 0) {
            annotManager.ungroupAnnotations(groupedAnnots);
            core.deleteAnnotations(linksToDelete);
          }
        }

        const link = newLink(annot.X, annot.Y, annot.Width, annot.Height);
        linksResults.push(link);
        annotManager.groupAnnotations(annot, [link]);
      });
    }

    return linksResults;
  };

  const createHighlightAnnot = async(linkAnnotArray, quads, text) => {
    const annotManager = core.getAnnotationManager();
    const linkAnnot = linkAnnotArray[0];
    const highlight = new Annotations.TextHighlightAnnotation();
    highlight.PageNumber = linkAnnot.PageNumber;
    highlight.X = linkAnnot.X;
    highlight.Y = linkAnnot.Y;
    highlight.Width = linkAnnot.Width;
    highlight.Height = linkAnnot.Height;
    highlight.StrokeColor = new Annotations.Color(0, 0, 0, 0);
    highlight.Opacity = 0;
    highlight.Quads = quads;
    highlight.Author = core.getCurrentUser();
    highlight.setContents(text);

    core.addAnnotations([highlight]);
    annotManager.groupAnnotations(highlight, linkAnnotArray);
  };

  const addURLLink = e => {
    e.preventDefault();

    const links = createLink();

    const action = new window.Actions.URI({ uri: url });
    links.forEach(link => {
      link.addAction('U', action);
      core.addAnnotations([link]);
    });

    let pageNumbersToDraw = links.map(link => link.PageNumber);
    pageNumbersToDraw = [...new Set(pageNumbersToDraw)];
    pageNumbersToDraw.forEach(pageNumberToDraw => {
      core.drawAnnotations(pageNumberToDraw, null, true);
    });

    closeModal();
  };

  const addPageLink = e => {
    e.preventDefault();

    const links = createLink();

    const Dest = window.Actions.GoTo.Dest;
    const options = { dest: new Dest({ page: pageNumber }) };
    const action = new window.Actions.GoTo(options);

    links.forEach(link => {
      link.addAction('U', action);
      core.addAnnotations([link]);
    });

    let pageNumbersToDraw = links.map(link => link.PageNumber);
    pageNumbersToDraw = [...new Set(pageNumbersToDraw)];
    pageNumbersToDraw.forEach(pageNumberToDraw => {
      core.drawAnnotations(pageNumberToDraw, null, true);
    });

    closeModal();
  };

  useEffect(() => {
    if (isOpen) {
      //  prepopulate URL if URL is selected
      const selectedText = core.getSelectedText();
      if (selectedText) {
        const urlRegex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
        const urls = selectedText.match(urlRegex);
        if (urls && urls.length > 0) {
          setURL(urls[0]);
        }
      }
    }
  }, [totalPages, isOpen]);

  useEffect(() => {
    if (tabSelected === 'PageNumberPanelButton' && isOpen) {
      pageNumberInput.current.focus();
    } else if (tabSelected === 'URLPanelButton' && isOpen) {
      urlInput.current.focus();
    }
  }, [tabSelected, isOpen, pageNumberInput, urlInput]);

  const modalClass = classNames({
    Modal: true,
    LinkModal: true,
    open: isOpen,
    closed: !isOpen,
  });

  return isDisabled ? null : (
    <Swipeable
      onSwipedUp={closeModal}
      onSwipedDown={closeModal}
      preventDefaultTouchmoveEvent
    >
      <div
        className={modalClass}
        data-element="linkModal"
        onMouseDown={closeModal}
      >
        <div className="container" onMouseDown={e => e.stopPropagation()}>
          <div className="swipe-indicator" />
          <Tabs id="linkModal">
            <div className="tab-list">
              <Tab dataElement="URLPanelButton">
                <div className="tab-options-button">{t('link.url')}</div>
              </Tab>
              <div className="divider" />
              <Tab dataElement="PageNumberPanelButton">
                <div className="tab-options-button">{t('link.page')}</div>
              </Tab>
            </div>

            <TabPanel dataElement="URLPanel">
              <form onSubmit={addURLLink}>
                <div>{t('link.enterurl')}</div>
                <div className="linkInput">
                  <input
                    className="urlInput"
                    type="url"
                    ref={urlInput}
                    value={url}
                    onChange={e => setURL(e.target.value)}
                  />
                  <Button
                    dataElement="linkSubmitButton"
                    label={t('action.link')}
                    onClick={addURLLink}
                  />
                </div>
              </form>
            </TabPanel>
            <TabPanel dataElement="PageNumberPanel">
              <form onSubmit={addPageLink}>
                <div>{t('link.enterpage')}</div>
                <div className="linkInput">
                  <input
                    type="number"
                    ref={pageNumberInput}
                    value={pageNumber}
                    onChange={e => setPageNumber(parseInt(e.target.value, 10))}
                    min={1}
                    max={totalPages}
                  />
                  <Button
                    dataElement="linkSubmitButton"
                    label={t('action.link')}
                    onClick={addPageLink}
                    disabled={pageNumber < 1 || pageNumber > totalPages}
                  />
                </div>
              </form>
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </Swipeable>
  );
};

export default LinkModal;
