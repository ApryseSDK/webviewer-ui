import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import defaultTool from 'constants/defaultTool';
import Events from 'constants/events';
import ShareTypes, { ShareTypeColors } from 'constants/shareTypes';
import { mapAnnotationToKey } from 'constants/map';
import core from 'core';
import actions from 'actions';
import selectors from 'selectors';
import fireEvent from 'helpers/fireEvent';
import { getAnnotationShareType } from 'helpers/annotationShareType';
import { rgbaToHex, hexToRgba } from 'helpers/color';
import { getAnnotationClass } from 'helpers/getAnnotationClass';

import Choice from 'components/Choice';
import Button from 'components/Button';

import { Swipeable } from 'react-swipeable';
import { FocusTrap } from '@pdftron/webviewer-react-toolkit';

import './FilterAnnotModal.scss';

const FilterAnnotModal = ({ coAssessors }) => {
  const [isDisabled, isOpen, colorMap] = useSelector(state => [
    selectors.isElementDisabled(state, 'filterModal'),
    selectors.isElementOpen(state, 'filterModal'),
    selectors.getColorMap(state),
  ]);
  const [t] = useTranslation();
  const dispatch = useDispatch();

  // Fields to be rendered
  const [authors, setAuthors] = useState([]);
  const [annotTypes, setAnnotTypes] = useState([]);
  const [colors, setColorTypes] = useState([]);
  const [shareTypes, setShareTypes] = useState([]);

  const [authorFilter, setAuthorFilter] = useState([]);
  const [typesFilter, setTypesFilter] = useState([]);
  const [colorFilter, setColorFilter] = useState([]);
  const [checkRepliesForAuthorFilter, setCheckRepliesForAuthorFilter] = useState(true);
  // CUSTOM WISEFLOW: sharetype filter
  const [shareTypeFilter, setShareTypeFilter] = useState([]);
  const [coAssessorFilter, setCoAssessorFilter] = useState([]);

  const getIconColor = annot => {
    const key = mapAnnotationToKey(annot);
    const iconColorProperty = colorMap[key]?.iconColor;

    return annot[iconColorProperty];
  };

  const similarColorExist = (currColors, newColor) => {
    const colorObject = currColors.map(c =>
      Object.assign({
        R: parseInt(`${c[1]}${c[2]}`, 16),
        G: parseInt(`${c[3]}${c[4]}`, 16),
        B: parseInt(`${c[5]}${c[6]}`, 16),
      }),
    );

    const threshold = 10;
    const similarColors = colorObject.filter(
      c =>
        Math.abs(newColor.R - c.R) < threshold &&
        Math.abs(newColor.G - c.G) < threshold &&
        Math.abs(newColor.B - c.B) < threshold,
    );

    return !!similarColors.length;
  };

  const filterApply = () => {
    dispatch(
      actions.setCustomNoteFilter(annot => {
        let type = true;
        let author = true;
        let color = true;
        let sharetype = true;
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
        if (shareTypeFilter.length > 0) {
          // CUSTOM WISEFLOW: get customData sharetype
          if (getAnnotationShareType(annot)) {
            sharetype = shareTypeFilter.includes(getAnnotationShareType(annot));
          }
        }
        return type && author && color && sharetype;
      }),
    );
    fireEvent(Events.ANNOTATION_FILTER_CHANGED, {
      types: typesFilter,
      authors: authorFilter,
      colors: colorFilter,
      shareTypes: shareTypeFilter,
      checkRepliesForAuthorFilter,
    });
    closeModal();
  };

  const filterClear = () => {
    dispatch(
      actions.setCustomNoteFilter(annot => {
        return true;
      }),
    );
    setCheckRepliesForAuthorFilter(false);
    setAuthorFilter([]);
    setTypesFilter([]);
    setColorFilter([]);
    setShareTypeFilter([]);
    fireEvent('annotationFilterChanged', {
      types: [],
      authors: [],
      colors: [],
      statuses: [],
      checkRepliesForAuthorFilter: false,
      shareTypes: [],
    });
  };

  const closeModal = () => {
    dispatch(actions.closeElement('filterModal'));
    core.setToolMode(defaultTool);
  };

  useEffect(() => {
    const annots = core.getAnnotationsList();
    // set is a great way to remove any duplicate additions and ensure the unique items are present
    // the only gotcha that it should not be used by state since not always it will trigger a rerender
    const authorsToBeAdded = new Set();
    const annotTypesToBeAdded = new Set();
    const annotColorsToBeAdded = new Set();
    const annotShareTypesToBeAdded = new Set();
    annots.forEach(annot => {
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

      if (getAnnotationShareType(annot)) {
        annotShareTypesToBeAdded.add(getAnnotationShareType(annot));
      }
    });

    setAuthors([...authorsToBeAdded]);
    setAnnotTypes([...annotTypesToBeAdded]);
    setColorTypes([...annotColorsToBeAdded]);
    setShareTypes([...annotShareTypesToBeAdded]);

    core.addEventListener('documentUnloaded', closeModal);
    return () => {
      core.removeEventListener('documentUnloaded', closeModal);
    };
  }, [isOpen]);

  const renderAuthors = () => {
    return (
      <div className="filter">
        <div className="heading">{t('option.filterAnnotModal.author')}</div>
        <div className="buttons">
          {[...authors].map((val, index) => {
            return (
              <Choice
                type="checkbox"
                key={index}
                label={val}
                checked={authorFilter.includes(val)}
                id={val}
                onChange={e => {
                  if (authorFilter.indexOf(e.target.getAttribute('id')) === -1) {
                    setAuthorFilter([...authorFilter, e.target.getAttribute('id')]);
                  } else {
                    setAuthorFilter(authorFilter.filter(author => author !== e.target.getAttribute('id')));
                  }
                }}
              />
            );
          })}
        </div>
        {/* <div className="buttons">
          <Choice
            type="checkbox"
            label={t('option.filterAnnotModal.includeReplies')}
            checked={checkRepliesForAuthorFilter}
            onChange={
              e => setCheckRepliesForAuthorFilter(e.target.checked)
            }
            id="filter-annot-modal-include-replies"
          />
        </div> */}
      </div>
    );
  };

  const renderAnnotTypes = () => {
    return (
      <div className="filter">
        <div className="heading">{t('option.filterAnnotModal.types')}</div>
        <div className="buttons">
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
                  onChange={e => {
                    if (typesFilter.indexOf(e.target.getAttribute('id')) === -1) {
                      setTypesFilter([...typesFilter, e.target.getAttribute('id')]);
                    } else {
                      setTypesFilter(typesFilter.filter(type => type !== e.target.getAttribute('id')));
                    }
                  }}
                />
              );
            })}
        </div>
      </div>
    );
  };

  const renderColorTypes = () => {
    return (
      <div className="filter">
        <div className="heading">{t('option.filterAnnotModal.color')}</div>
        <div className="buttons color">
          {[...colors].map((val, index) => {
            return (
              <div className="colorSelect" key={`color${index}`}>
                <Choice
                  type="checkbox"
                  checked={colorFilter.includes(val)}
                  id={val}
                  onChange={e => {
                    if (colorFilter.indexOf(e.target.getAttribute('id')) === -1) {
                      setColorFilter([...colorFilter, e.target.getAttribute('id')]);
                    } else {
                      setColorFilter(colorFilter.filter(color => color !== e.target.getAttribute('id')));
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
      </div>
    );
  };

  const renderShareTypes = () => {
    return (
      <div className="filter">
        <div className="heading">{t('option.filterAnnotModal.shareType')}</div>
        <div className="buttons" style={{ gridTemplateColumns: `114px 100px` }}>
          {shareTypes.map((val, index) => {
            return (
              <Choice
                type="checkbox"
                key={index}
                checked={shareTypeFilter.includes(val)}
                label={
                  <div
                    style={{
                      backgroundColor: `${ShareTypeColors[val]}`,
                      padding: `5px 10px`,
                      borderRadius: `5px`,
                      color: `#fff`,
                    }}
                  >
                    {t(`option.state.${val.toLocaleLowerCase()}`)}
                  </div>
                }
                id={val}
                onChange={e => {
                  if (shareTypeFilter.indexOf(e.target.getAttribute('id')) === -1) {
                    setShareTypeFilter([...shareTypeFilter, e.target.getAttribute('id')]);
                  } else {
                    setShareTypeFilter(shareTypeFilter.filter(status => status !== e.target.getAttribute('id')));
                  }
                }}
              />
            );
          })}
        </div>
      </div>
    );
  };

  const renderCoAssessors = () => {
    if (!coAssessors) return null;
    return (
      <div className="filter">
        <div className="heading">{t('option.filterAnnotModal.coAssessor')}</div>
        <div className="buttons">
          {[...coAssessors].map((val, index) => {
            return (
              <Choice
                type="checkbox"
                key={index}
                label={val.name}
                checked={coAssessorFilter.includes(val)}
                id={val.id}
                onChange={e => {
                  if (coAssessorFilter.indexOf(e.target.getAttribute('id')) === -1) {
                    setCoAssessorFilter([...coAssessorFilter, e.target.getAttribute('id')]);
                  } else {
                    setCoAssessorFilter(coAssessorFilter.filter(type => type !== e.target.getAttribute('id')));
                  }
                }}
              />
            );
          })}
        </div>
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
    <Swipeable onSwipedUp={closeModal} onSwipedDown={closeModal} preventDefaultTouchmoveEvent>
      <div className={modalClass} data-element="filterModal" onMouseDown={closeModal}>
        <FocusTrap locked={isOpen} focusLastOnUnlock>
          <div className="container" onMouseDown={e => e.stopPropagation()}>
            {core.getAnnotationsList().length > 0 ? (
              <div className="filter-modal">
                <div className="swipe-indicator" />
                <div className="filter-options">
                  {renderAuthors()}
                  {renderShareTypes()}
                  {renderAnnotTypes()}
                  {renderColorTypes()}
                  {renderCoAssessors()}
                </div>
                <div className="footer">
                  <Button className="filter-annot-cancel" onClick={closeModal} label={t('action.cancel')} />
                  <Button className="filter-annot-clear" onClick={filterClear} label={t('action.clear')} />
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
    </Swipeable>
  );
};

export default FilterAnnotModal;
