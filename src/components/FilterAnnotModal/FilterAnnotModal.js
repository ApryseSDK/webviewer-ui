import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import defaultTool from 'constants/defaultTool';
import Events from 'constants/events';
import core from 'core';
import actions from 'actions';
import selectors from 'selectors';
import fireEvent from 'helpers/fireEvent';
import { rgbaToHex, hexToRgba } from 'helpers/color';
import { getAnnotationClass } from 'helpers/getAnnotationClass';

import Choice from 'components/Choice';
import Button from 'components/Button';

import { Swipeable } from 'react-swipeable';
import { FocusTrap } from '@pdftron/webviewer-react-toolkit';

import './FilterAnnotModal.scss';

const FilterAnnotModal = () => {
  const [isDisabled, isOpen] = useSelector(state => [
    selectors.isElementDisabled(state, 'filterModal'),
    selectors.isElementOpen(state, 'filterModal'),
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
  const [statusFilter, setStatusFilter] = useState([]);

  const filterApply = () => {
    dispatch(
      actions.setCustomNoteFilter(annot => {
        let type = true;
        let author = true;
        let color = true;
        let status = true;
        if (typesFilter.length > 0) {
          type = typesFilter.includes(getAnnotationClass(annot));
        }
        if (authorFilter.length > 0) {
          author = authorFilter.includes(core.getDisplayAuthor(annot['Author']));
        }
        if (colorFilter.length > 0) {
          if (annot.Color) {
            color = colorFilter.includes(rgbaToHex(annot.Color.R, annot.Color.G, annot.Color.B, annot.Color.A));
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
    fireEvent(Events.ANNOTATION_FILTER_CHANGED, { types: typesFilter, authors: authorFilter, colors: colorFilter, statuses: statusFilter });
    closeModal();
  };

  const filterClear = () => {
    dispatch(
      actions.setCustomNoteFilter(annot => {
        return true;
      }),
    );
    setAuthorFilter([]);
    setTypesFilter([]);
    setColorFilter([]);
    setStatusFilter([]);
    fireEvent(Events.ANNOTATION_FILTER_CHANGED, { types: [], authors: [], colors: [], statuses: [] });
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
    const annotStatusesToBeAdded = new Set();
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
      if (annot.Color) {
        annotColorsToBeAdded.add(rgbaToHex(annot.Color.R, annot.Color.G, annot.Color.B, annot.Color.A));
      } else {
        annotColorsToBeAdded.add('#485056');
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

  const renderAuthors = () => {
    return (
      <div className="filter">
        <div className="heading">{t('option.filterAnnotModal.commentBy')}</div>
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

  const renderStatusTypes = () => {
    // Hide status filter if there is only on status type
    if (statuses.length === 1) {
      return null;
    }

    return (
      <div className="filter">
        <div className="heading">{t('option.status.status')}</div>
        <div className="buttons">
          {[...statuses].map((val, index) => {
            return (
              <Choice
                type="checkbox"
                key={index}
                checked={statusFilter.includes(val)}
                label={t(`option.state.${val.toLocaleLowerCase()}`)}
                id={val}
                onChange={e => {
                  if (statusFilter.indexOf(e.target.getAttribute('id')) === -1) {
                    setStatusFilter([...statusFilter, e.target.getAttribute('id')]);
                  } else {
                    setStatusFilter(statusFilter.filter(status => status !== e.target.getAttribute('id')));
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
                  {renderAnnotTypes()}
                  {renderColorTypes()}
                  {renderStatusTypes()}
                </div>
                <div className="footer">
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
