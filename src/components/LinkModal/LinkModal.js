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
    pageLabels,
  ] = useSelector(state => [
    selectors.isElementDisabled(state, 'linkModal'),
    selectors.isElementOpen(state, 'linkModal'),
    selectors.getTotalPages(state),
    selectors.getCurrentPage(state),
    selectors.getSelectedTab(state, 'linkModal'),
    selectors.getPageLabels(state),
  ]);
  const [t] = useTranslation();
  const dispatch = useDispatch();

  const urlInput = React.createRef();
  const pageLabelInput = React.createRef();

  const [url, setURL] = useState('');
  const [pageLabel, setPageLabel] = useState("");

  const closeModal = () => {
    dispatch(actions.closeElement('linkModal'));
    setURL('');
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
        const associatedLinks = annot.getAssociatedLinks();
        if (associatedLinks.length > 0) {
          const linksToDelete = [];
          associatedLinks.forEach(linkId => {
            linksToDelete.push(core.getAnnotationById(linkId));
          });
          core.deleteAnnotations(linksToDelete);
          annot.unassociateLinks();
        }

        const link = newLink(annot.X, annot.Y, annot.Width, annot.Height);
        linksResults.push(link);
        annot.associateLink([link.Id]);
      });
    }

    return linksResults;
  };

  const createHighlightAnnot = async(linkAnnotArray, quads, text) => {
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

    const linkAnnotIdArray = linkAnnotArray.map(link => link.Id);
    highlight.associateLink(linkAnnotIdArray);

    core.addAnnotations([highlight]);
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

  const isValidPageLabel = () => {
    return pageLabels?.includes(pageLabel);
  };

  const addPageLink = e => {
    e.preventDefault();

    const links = createLink();

    const Dest = window.Actions.GoTo.Dest;

    const options = { dest: new Dest({ page: pageLabels.indexOf(pageLabel) + 1 }) };
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

      setPageLabel(pageLabels.length > 0 ? pageLabels[0] : "1");
    }
  }, [totalPages, isOpen]);

  useEffect(() => {
    if (tabSelected === 'PageNumberPanelButton' && isOpen) {
      pageLabelInput.current.focus();
    } else if (tabSelected === 'URLPanelButton' && isOpen) {
      urlInput.current.focus();
    }
  }, [tabSelected, isOpen, pageLabelInput, urlInput]);

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
                    ref={pageLabelInput}
                    value={pageLabel}
                    onChange={e => setPageLabel(e.target.value)}
                  />
                  <Button
                    dataElement="linkSubmitButton"
                    label={t('action.link')}
                    onClick={addPageLink}
                    disabled={!isValidPageLabel()}
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
