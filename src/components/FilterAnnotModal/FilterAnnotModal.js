import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import core from 'core';
import actions from 'actions';
import selectors from 'selectors';
import fireEvent from 'helpers/fireEvent';
import defaultTool from 'constants/defaultTool';
import Events from 'constants/events';
import { mapAnnotationToKey } from 'constants/map';
import DataElements from 'constants/dataElement';
import { rgbaToHex, getHexToRgbaString } from 'helpers/color';
import { getAnnotationClass } from 'helpers/getAnnotationClass';
import Choice from 'components/Choice';
import Button from 'components/Button';
import { Tabs, Tab, TabPanel } from 'components/Tabs';
import Tooltip from 'components/Tooltip';
import { COMMON_COLORS } from 'constants/commonColors';
import ModalWrapper from 'components/ModalWrapper';

import './FilterAnnotModal.scss';

const TABS_ID = 'filterAnnotModal';

const FilterAnnotModal = () => {
  const [isDisabled, isOpen, colorMap, selectedTab, annotationFilters,
    isMeasurementAnnotationFilterEnabled, customNoteFilter] = useSelector((state) => [
    selectors.isElementDisabled(state, DataElements.FILTER_MODAL),
    selectors.isElementOpen(state, DataElements.FILTER_MODAL),
    selectors.getColorMap(state),
    selectors.getSelectedTab(state, TABS_ID),
    selectors.getAnnotationFilters(state),
    selectors.getIsMeasurementAnnotationFilterEnabled(state),
    selectors.getCustomNoteFilter(state),
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
  const [isDocumentFilterActive, setIsDocumentFilterActive] = useState(false);
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
    const newFilter = (annot, documentViewerKey = 1) => {
      let type = true;
      let author = true;
      let color = true;
      let status = true;
      if (typesFilter.length > 0) {
        const isMeasurementAnnotation = annot.IT || annot.getCustomData('trn-is-count');
        if (isMeasurementAnnotationFilterEnabled && isMeasurementAnnotation) {
          const measurementKey = mapAnnotationToKey(annot);
          type = typesFilter.includes(measurementKey);
        } else {
          type = typesFilter.includes(getAnnotationClass(annot));
        }
      }
      if (authorFilter.length > 0) {
        author = authorFilter.includes(core.getDisplayAuthor(annot['Author'], documentViewerKey));
        if (!author && checkRepliesForAuthorFilter) {
          const allReplies = annot.getReplies();
          for (const reply of allReplies) {
            // Short-circuit the search if at least one reply is created by
            // one of the desired authors
            if (authorFilter.includes(core.getDisplayAuthor(reply['Author'], documentViewerKey))) {
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
          color = colorFilter.includes(COMMON_COLORS['gray8']);
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
    };
    dispatch(actions.setInternalNoteFilter(newFilter));
    dispatch(actions.setAnnotationFilters({
      isDocumentFilterActive,
      includeReplies: checkRepliesForAuthorFilter,
      authorFilter,
      colorFilter,
      typeFilter: typesFilter,
      statusFilter
    }));
    const redrawList = [];
    if (isDocumentFilterActive) {
      core.getDocumentViewers().forEach((documentViewer, index) => documentViewer.getAnnotationManager()
        .getAnnotationsList().forEach((annot) => {
          const shouldHide = !newFilter(annot, index + 1);
          if (shouldHide !== annot.NoView) {
            annot.NoView = shouldHide;
            redrawList.push(annot);
          }
        }));
    } else {
      core.getDocumentViewers().forEach((documentViewer) => documentViewer.getAnnotationManager()
        .getAnnotationsList().forEach((annot) => {
          if (annot.NoView === true) {
            annot.NoView = false;
            redrawList.push(annot);
          }
        }));
    }
    core.getDocumentViewers().forEach((documentViewer) => documentViewer.getAnnotationManager().drawAnnotationsFromList(redrawList));
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
    setIsDocumentFilterActive(false);
    setAuthorFilter([]);
    setTypesFilter([]);
    setColorFilter([]);
    setStatusFilter([]);

    const redrawList = [];
    core.getDocumentViewers().forEach((documentViewer) => documentViewer.getAnnotationManager().getAnnotationsList()
      .forEach((annot) => {
        if (annot.NoView === true) {
          annot.NoView = false;
          redrawList.push(annot);
        }
      }));
    core.getDocumentViewers().forEach((documentViewer) => documentViewer.getAnnotationManager().drawAnnotationsFromList(redrawList));
  };

  const closeModal = () => {
    dispatch(actions.closeElement(DataElements.FILTER_MODAL));
    core.setToolMode(defaultTool);
  };

  useEffect(() => {
    const clearAllFilters = () => {
      filterClear();
      filterApply();
    };
    core.addEventListener('documentUnloaded', clearAllFilters);
    return () => {
      core.removeEventListener('documentUnloaded', clearAllFilters);
    };
  }, []);

  useEffect(() => {
    let annotLists = core.getDocumentViewers().map((documentViewer) => documentViewer.getAnnotationManager().getAnnotationsList());

    if (customNoteFilter) {
      const filteredList = (annotLists[0]) ? annotLists[0].filter(customNoteFilter): [];
      annotLists[0] = filteredList;
      const filteredList2 = (annotLists[1]) ? annotLists[1].filter(customNoteFilter) : [];
      annotLists[1] = filteredList2;
    }

    const annots = [].concat(...annotLists).filter((annot) => !annot.Hidden);
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

      const isInFormBuilderMode = core.getAnnotationManager().getFormFieldCreationManager().isInFormFieldCreationMode();
      const ignoreFilter = (
        (!isInFormBuilderMode && annot instanceof window.Core.Annotations.WidgetAnnotation) ||
        (annot instanceof window.Core.Annotations.StickyAnnotation && annot.isReply()) ||
        annot instanceof window.Core.Annotations.Link
      );

      if (ignoreFilter) {
        return;
      }

      // If the annotation is also measurement, and the API is on, we want to instead add the measurement type
      const isMeasurementAnnotation = annot.IT || annot.getCustomData('trn-is-count');
      if (isMeasurementAnnotationFilterEnabled && isMeasurementAnnotation) {
        const measurementKey = mapAnnotationToKey(annot);
        annotTypesToBeAdded.add(measurementKey);
      } else {
        annotTypesToBeAdded.add(getAnnotationClass(annot));
      }
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
  }, [isOpen, isMeasurementAnnotationFilterEnabled]);

  useEffect(() => {
    if (selectedTab === DataElements.ANNOTATION_STATUS_FILTER_PANEL_BUTTON && !ifShowAnnotationStatus) {
      dispatch(actions.setSelectedTab(TABS_ID, DataElements.ANNOTATION_USER_FILTER_PANEL_BUTTON));
    }
  }, [isOpen, selectedTab, ifShowAnnotationStatus]);

  useEffect(() => {
    setFilterCount(
      (checkRepliesForAuthorFilter ? 1 : 0) +
      (isDocumentFilterActive ? 1 : 0) +
      authorFilter.length +
      colorFilter.length +
      typesFilter.length +
      statusFilter.length
    );
  }, [checkRepliesForAuthorFilter, isDocumentFilterActive, authorFilter, colorFilter, typesFilter, statusFilter]);

  useEffect(() => {
    setIfShowAnnotationStatus((statuses.length > 1) || (statuses.length === 1 && statuses[0] !== 'None'));
  }, [statuses]);

  useEffect(() => {
    if (isOpen) {
      setIsDocumentFilterActive(annotationFilters.isDocumentFilterActive);
      setCheckRepliesForAuthorFilter(annotationFilters.includeReplies);
      setAuthorFilter(annotationFilters.authorFilter);
      setColorFilter(annotationFilters.colorFilter);
      setTypesFilter(annotationFilters.typeFilter);
      setStatusFilter(annotationFilters.statusFilter);
    }
  }, [isOpen]);

  const renderAuthors = () => {
    return (
      <div className="user-filters three-column-filter">
        {[...authors].map((val, index) => {
          return (
            <Choice
              type="checkbox"
              key={index}
              aria-label={`${val} ${t('formField.types.checkbox')}`}
              label={<Tooltip content={val}><div>{val}</div></Tooltip>}
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
                label={<Tooltip content={t(`annotation.${val}`)}><div>{t(`annotation.${val}`)}</div></Tooltip>}
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
              <Tooltip content={`${t('option.colorPalette.colorLabel')} ${val?.toUpperCase?.()}`} hideOnClick={false}>
                <Choice
                  type="checkbox"
                  checked={colorFilter.includes(val)}
                  aria-label={`${t('option.colorPalette.colorLabel')} ${val?.toUpperCase()} ${t('formField.types.checkbox')}`}
                  id={val}
                  onChange={(e) => {
                    if (colorFilter.indexOf(e.target.getAttribute('id')) === -1) {
                      setColorFilter([...colorFilter, e.target.getAttribute('id')]);
                    } else {
                      setColorFilter(colorFilter.filter((color) => color !== e.target.getAttribute('id')));
                    }
                  }}
                />
              </Tooltip>
              <div className="colorCell" style={{ background: getHexToRgbaString(val) }}></div>
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
              aria-label={`${val} ${t('formField.types.checkbox')}`}
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
    <div className={modalClass} data-element={DataElements.FILTER_MODAL}>
      <ModalWrapper
        isOpen={isOpen}
        title={`${t('option.filterAnnotModal.filters')} (${filterCount})`}
        closeHandler={closeModal}
        onCloseClick={closeModal}
        swipeToClose
      >
        <div className="container" onMouseDown={(e) => e.stopPropagation()}>
          {core.getAnnotationsList().length > 0 ? (
            <div className="filter-modal">
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
              <fieldset className="settings-body">
                <legend id="filter-settings" className="settings-header">{t('option.filterAnnotModal.filterSettings')}</legend>
                <div className="settings" role="group" aria-labelledby='filter-settings'>
                  <Choice
                    label={t('option.filterAnnotModal.includeReplies')}
                    checked={checkRepliesForAuthorFilter}
                    onChange={(e) => setCheckRepliesForAuthorFilter(e.target.checked)}
                    id="filter-annot-modal-include-replies"
                  />
                  <Choice
                    label={t('option.filterAnnotModal.filterDocument')}
                    checked={isDocumentFilterActive}
                    onChange={(e) => setIsDocumentFilterActive(e.target.checked)}
                    id="filter-annot-modal-filter-document"
                  />
                </div>
              </fieldset>
              <div className="divider"></div>
              <div className="footer">
                <Button className="filter-annot-clear" onClick={filterClear} label={t('action.clearAll')}
                  disabled={filterCount === 0} />
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
      </ModalWrapper>
    </div>
  );
};

export default FilterAnnotModal;
