import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import core from 'core';
import actions from 'actions';
import selectors from 'selectors';
import fireEvent from 'helpers/fireEvent';
import { Swipeable } from 'react-swipeable';
import { FocusTrap } from '@pdftron/webviewer-react-toolkit';
import defaultTool from 'constants/defaultTool';
import Events from 'constants/events';
import { mapAnnotationToKey } from 'constants/map';
import DataElements from 'constants/dataElement';
import { rgbaToHex, hexToRgba } from 'helpers/color';
import { getAnnotationClass } from 'helpers/getAnnotationClass';
import Choice from 'components/Choice';
import Button from 'components/Button';
import { Tabs, Tab, TabPanel } from 'components/Tabs';

import './FilterAnnotModal.scss';

const TABS_ID = 'filterAnnotModal';

const FilterAnnotModal = () => {
  const [isDisabled, isOpen, colorMap, selectedTab, annotationFilters] = useSelector((state) => [
    selectors.isElementDisabled(state, DataElements.FILTER_MODAL),
    selectors.isElementOpen(state, DataElements.FILTER_MODAL),
    selectors.getColorMap(state),
    selectors.getSelectedTab(state, TABS_ID),
    selectors.getAnnotationFilters(state)
  ]);
  const [t] = useTranslation();
  const dispatch = useDispatch();

  const [authors, setAuthors] = useState([]);
  const [annotTypes, setAnnotTypes] = useState([]);
  const [colors, setColorTypes] = useState([]);
  const [statuses, setStatusTypes] = useState([]);
  const [authorFilter, setAuthorFilter] = useState([]);
  const [typesFilter, setTypesFilter] = useState([]);
  const [colorFilter, setColorFilter] = useState([]);
  const [checkRepliesForAuthorFilter, setCheckRepliesForAuthorFilter] = useState(true);
  const [statusFilter, setStatusFilter] = useState([]);
  const [filterCount, setFilterCount] = useState(0);
  const [ifShowAnnotationStatus, setIfShowAnnotationStatus] = useState(false);

  const getIconColor = (annot) => {
    const key = mapAnnotationToKey(annot);
    const iconColorProperty = colorMap[key]?.iconColor;

    return annot[iconColorProperty];
  };

  const similarColorExist = (currColors, newColor) => {
    const colorObject = currColors.map((c) => Object.assign({
      R: parseInt(`${c[1]}${c[2]}`, 16),
      G: parseInt(`${c[3]}${c[4]}`, 16),
      B: parseInt(`${c[5]}${c[6]}`, 16)
    }));

    const threshold = 10;
    const similarColors = colorObject
      .filter((c) => Math.abs(newColor.R - c.R) < threshold
        && Math.abs(newColor.G - c.G) < threshold
        && Math.abs(newColor.B - c.B) < threshold);

    return !!similarColors.length;
  };

  const filterApply = () => {
    dispatch(
      actions.setCustomNoteFilter((annot) => {
        let type = true;
        let author = true;
        let color = true;
        let status = true;
        if (typesFilter.length > 0) {
          type = typesFilter.includes(getAnnotationClass(annot));
        }
        if (authorFilter.length > 0) {
          author = authorFilter.includes(core.getDisplayAuthor(annot['Author']));
          if (!author && checkRepliesForAuthorFilter) {
            const allReplies = annot.getReplies();
            for (const reply of allReplies) {
              // Short-circuit the search if at least one reply is created by
              // one of the desired authors
              if (authorFilter.includes(core.getDisplayAuthor(reply['Author']))) {
                author = true;
                break;
              }
            }
          }
        }
        if (colorFilter.length > 0) {
          const iconColor = getIconColor(annot);
          if (iconColor) {
            color = similarColorExist(colorFilter, iconColor);
          } else {
            // check for default color if no color is available
            color = colorFilter.includes('#485056');
          }
        }
        if (statusFilter.length > 0) {
          if (annot.getStatus()) {
            status = statusFilter.includes(annot.getStatus());
          } else {
            status = statusFilter.includes('None');
          }
        }
        return type && author && color && status;
      }),
    );
    dispatch(actions.setAnnotationFilters({
      includeReplies: checkRepliesForAuthorFilter,
      authorFilter,
      colorFilter,
      typeFilter: typesFilter,
      statusFilter
    }));
    fireEvent(
      Events.ANNOTATION_FILTER_CHANGED,
      {
        types: typesFilter,
        authors: authorFilter,
        colors: colorFilter,
        statuses: statusFilter,
        checkRepliesForAuthorFilter
      }
    );
    closeModal();
  };

  const filterClear = () => {
    setCheckRepliesForAuthorFilter(false);
    setAuthorFilter([]);
    setTypesFilter([]);
    setColorFilter([]);
    setStatusFilter([]);
  };

  const closeModal = () => {
    dispatch(actions.closeElement(DataElements.FILTER_MODAL));
    core.setToolMode(defaultTool);
  };

  useEffect(() => {
    const annots = core.getAnnotationsList();
    // set is a great way to remove any duplicate additions and ensure the unique items are present
    // the only gotcha that it should not be used by state since not always it will trigger a rerender
    const authorsToBeAdded = new Set();
    const annotTypesToBeAdded = new Set();
    const annotColorsToBeAdded = new Set();
    const annotStatusesToBeAdded = new Set();
    annots.forEach((annot) => {
      const displayAuthor = core.getDisplayAuthor(annot['Author']);
      if (displayAuthor && displayAuthor !== '') {
        authorsToBeAdded.add(displayAuthor);
      }
      // We don't show it in the filter for WidgetAnnotation or StickyAnnotation or LinkAnnotation from the comments
      if (
        annot instanceof Annotations.WidgetAnnotation ||
        (annot instanceof Annotations.StickyAnnotation && annot.isReply()) ||
        annot instanceof Annotations.Link
      ) {
        return;
      }
      annotTypesToBeAdded.add(getAnnotationClass(annot));
      const iconColor = getIconColor(annot);
      if (iconColor && !similarColorExist([...annotColorsToBeAdded], iconColor)) {
        annotColorsToBeAdded.add(rgbaToHex(iconColor.R, iconColor.G, iconColor.B, iconColor.A));
      }

      if (annot.getStatus()) {
        annotStatusesToBeAdded.add(annot.getStatus());
      } else {
        annotStatusesToBeAdded.add('None');
      }
    });

    setAuthors([...authorsToBeAdded]);
    setAnnotTypes([...annotTypesToBeAdded]);
    setColorTypes([...annotColorsToBeAdded]);
    setStatusTypes([...annotStatusesToBeAdded]);

    core.addEventListener('documentUnloaded', closeModal);
    return () => {
      core.removeEventListener('documentUnloaded', closeModal);
    };
  }, [isOpen]);

  useEffect(() => {
    if (selectedTab === DataElements.ANNOTATION_STATUS_FILTER_PANEL_BUTTON && !ifShowAnnotationStatus) {
      dispatch(actions.setSelectedTab(TABS_ID, DataElements.ANNOTATION_USER_FILTER_PANEL_BUTTON));
    }
  }, [isOpen, selectedTab, ifShowAnnotationStatus]);

  useEffect(() => {
    setFilterCount((checkRepliesForAuthorFilter ? 1 : 0) + authorFilter.length + colorFilter.length + typesFilter.length + statusFilter.length);
  }, [checkRepliesForAuthorFilter, authorFilter, colorFilter, typesFilter, statusFilter]);

  useEffect(() => {
    setIfShowAnnotationStatus((statuses.length > 1) || (statuses.length === 1 && statuses[0] !== 'None'));
  }, [statuses]);

  useEffect(() => {
    if (isOpen) {
      setCheckRepliesForAuthorFilter(annotationFilters.includeReplies);
      setAuthorFilter(annotationFilters.authorFilter);
      setColorFilter(annotationFilters.colorFilter);
      setTypesFilter(annotationFilters.typeFilter);
      setStatusFilter(annotationFilters.statusFilter);
    }
  }, [isOpen]);

  const renderAuthors = () => {
    return (
      <>
        <div className="include-replies">
          <Choice
            isSwitch
            label={t('option.filterAnnotModal.includeReplies')}
            checked={checkRepliesForAuthorFilter}
            onChange={(e) => setCheckRepliesForAuthorFilter(e.target.checked)}
            id="filter-annot-modal-include-replies"
          />
        </div>
        <div className="user-filters three-column-filter">
          {[...authors].map((val, index) => {
            return (
              <Choice
                type="checkbox"
                key={index}
                label={val}
                checked={authorFilter.includes(val)}
                id={val}
                onChange={(e) => {
                  if (authorFilter.indexOf(e.target.getAttribute('id')) === -1) {
                    setAuthorFilter([...authorFilter, e.target.getAttribute('id')]);
                  } else {
                    setAuthorFilter(authorFilter.filter((author) => author !== e.target.getAttribute('id')));
                  }
                }}
              />
            );
          })}
        </div>
      </>
    );
  };

  const renderAnnotTypes = () => {
    return (
      <div className="type-filters three-column-filter">
        {[...annotTypes]
          .sort((type1, type2) => (t(`annotation.${type1}`) <= t(`annotation.${type2}`) ? -1 : 1))
          .map((val, index) => {
            return (
              <Choice
                type="checkbox"
                key={index}
                label={t(`annotation.${val}`)}
                checked={typesFilter.includes(val)}
                id={val}
                onChange={(e) => {
                  if (typesFilter.indexOf(e.target.getAttribute('id')) === -1) {
                    setTypesFilter([...typesFilter, e.target.getAttribute('id')]);
                  } else {
                    setTypesFilter(typesFilter.filter((type) => type !== e.target.getAttribute('id')));
                  }
                }}
              />
            );
          })}
      </div>
    );
  };

  const renderColorTypes = () => {
    return (
      <div className="color-filters">
        {[...colors].map((val, index) => {
          return (
            <div className="colorSelect" key={`color${index}`}>
              <Choice
                type="checkbox"
                checked={colorFilter.includes(val)}
                id={val}
                onChange={(e) => {
                  if (colorFilter.indexOf(e.target.getAttribute('id')) === -1) {
                    setColorFilter([...colorFilter, e.target.getAttribute('id')]);
                  } else {
                    setColorFilter(colorFilter.filter((color) => color !== e.target.getAttribute('id')));
                  }
                }}
              />
              <div
                className="colorCell"
                style={{
                  background: hexToRgba(val),
                }}
              ></div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderStatusTypes = () => {
    return (
      <div className="status-filters three-column-filter">
        {[...statuses].map((val, index) => {
          return (
            <Choice
              type="checkbox"
              key={index}
              checked={statusFilter.includes(val)}
              label={t(`option.state.${val.toLocaleLowerCase()}`)}
              id={val}
              onChange={(e) => {
                if (statusFilter.indexOf(e.target.getAttribute('id')) === -1) {
                  setStatusFilter([...statusFilter, e.target.getAttribute('id')]);
                } else {
                  setStatusFilter(statusFilter.filter((status) => status !== e.target.getAttribute('id')));
                }
              }}
            />
          );
        })}
      </div>
    );
  };

  const modalClass = classNames({
    Modal: true,
    FilterAnnotModal: true,
    open: isOpen,
    closed: !isOpen,
  });

  return isDisabled ? null : (
    <div className={modalClass} data-element={DataElements.FILTER_MODAL} onMouseDown={closeModal}>
      <FocusTrap locked={isOpen} focusLastOnUnlock>
        <div className="container" onMouseDown={(e) => e.stopPropagation()}>
          {core.getAnnotationsList().length > 0 ? (
            <div className="filter-modal">
              <Swipeable onSwipedDown={closeModal} preventDefaultTouchmoveEvent>
                <div className="swipe-indicator" />
                <div className="header">
                  <div>{`${t('option.filterAnnotModal.filters')} (${filterCount})`}</div>
                  <Button
                    img="icon-close"
                    onClick={closeModal}
                    title="action.close"
                  />
                </div>
              </Swipeable>
              <div className="divider"></div>
              <div className="body">
                <Tabs id={TABS_ID}>
                  <div className="tab-list">
                    <Tab dataElement={DataElements.ANNOTATION_USER_FILTER_PANEL_BUTTON}>
                      <button className="tab-options-button">
                        {t('option.filterAnnotModal.user')}
                      </button>
                    </Tab>
                    <div className="tab-options-divider" />
                    <Tab dataElement={DataElements.ANNOTATION_COLOR_FILTER_PANEL_BUTTON}>
                      <button className="tab-options-button">
                        {t('option.filterAnnotModal.color')}
                      </button>
                    </Tab>
                    <div className="tab-options-divider" />
                    <Tab dataElement={DataElements.ANNOTATION_TYPE_FILTER_PANEL_BUTTON}>
                      <button className="tab-options-button">
                        {t('option.filterAnnotModal.type')}
                      </button>
                    </Tab>
                    {ifShowAnnotationStatus && (
                      <>
                        <div className="tab-options-divider" />
                        <Tab dataElement={DataElements.ANNOTATION_STATUS_FILTER_PANEL_BUTTON}>
                          <button className="tab-options-button">
                            {t('option.filterAnnotModal.status')}
                          </button>
                        </Tab>
                      </>
                    )}
                  </div>
                  <div className="filter-options">
                    <TabPanel dataElement="annotationUserFilterPanel">
                      {renderAuthors()}
                    </TabPanel>
                    <TabPanel dataElement="annotationColorFilterPanel">
                      {renderColorTypes()}
                    </TabPanel>
                    <TabPanel dataElement="annotationTypeFilterPanel">
                      {renderAnnotTypes()}
                    </TabPanel>
                    {ifShowAnnotationStatus && (
                      <TabPanel dataElement="annotationStatusFilterPanel">
                        {renderStatusTypes()}
                      </TabPanel>
                    )}
                  </div>
                </Tabs>
              </div>
              <div className="divider"></div>
              <div className="footer">
                <Button className="filter-annot-clear" onClick={filterClear} label={t('action.clearAll')} disabled={filterCount === 0} />
                <Button className="filter-annot-apply" onClick={filterApply} label={t('action.apply')} />
              </div>
            </div>
          ) : (
            <div>
              <div className="swipe-indicator" />
              <div className="message">{t('message.noAnnotationsFilter')}</div>
            </div>
          )}
        </div>
      </FocusTrap>
    </div>
  );
};

export default FilterAnnotModal;
