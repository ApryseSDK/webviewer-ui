import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import defaultTool from 'constants/defaultTool';
import core from 'core';
import actions from 'actions';
import selectors from 'selectors';
import fireEvent from 'helpers/fireEvent';
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

  const [authorFilter, setAuthorFilter] = useState([]);
  const [typesFilter, setTypesFilter] = useState([]);
  const [checkRepliesForAuthorFilter, setCheckRepliesForAuthorFilter] = useState(true);

  const filterApply = () => {
    dispatch(
      actions.setCustomNoteFilter(annot => {
        let type = true;
        let author = true;
        if (typesFilter.length > 0) {
          type = typesFilter.includes(getAnnotationClass(annot));
        }
        if (authorFilter.length > 0) {
          author = authorFilter.includes(core.getDisplayAuthor(annot));
          if (!author && checkRepliesForAuthorFilter) {
            const allReplies = annot.getReplies();
            for (const reply of allReplies) {
              // Short-circuit the search if at least one reply is created by
              // one of the desired authors
              if (authorFilter.includes(core.getDisplayAuthor(reply))) {
                author = true;
                break;
              }
            }
          }
        }
        return type && author;
      }),
    );
    fireEvent('annotationFilterChanged', {
      types: typesFilter,
      authors: authorFilter,
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
    fireEvent('annotationFilterChanged', {
      types: [],
      authors: [],
      checkRepliesForAuthorFilter: false,
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
    annots.forEach(annot => {
      if (core.getDisplayAuthor(annot) && core.getDisplayAuthor(annot) !== '') {
        authorsToBeAdded.add(core.getDisplayAuthor(annot));
      }
      // We don't show it in the filter for WidgetAnnotation or StickyAnnotation or LinkAnnotation from the comments  
      if (annot instanceof Annotations.WidgetAnnotation 
        || (annot instanceof Annotations.StickyAnnotation && annot.isReply())
        || (annot instanceof Annotations.Link)){
          return;
      }
      annotTypesToBeAdded.add(getAnnotationClass(annot));
    });
    setAuthors([...authorsToBeAdded]);
    setAnnotTypes([...annotTypesToBeAdded]);

    core.addEventListener('documentUnloaded', closeModal);
    return () => {
      core.removeEventListener('documentUnloaded', closeModal);
    };
  }, [isOpen]);

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
                    <div className="buttons">
                      <Choice
                        type="checkbox"
                        label={t('option.filterAnnotModal.includeReplies')}
                        checked={checkRepliesForAuthorFilter}
                        onChange={
                          e => setCheckRepliesForAuthorFilter(e.target.checked)
                        }
                        id="filter-annot-modal-include-replies"
                      />
                    </div>
                  </div>
                  <div className="filter">
                    <div className="heading">{t('option.filterAnnotModal.types')}</div>
                    <div className="buttons">
                      {[...annotTypes].sort((type1, type2) => t(`annotation.${type1}`) <= t(`annotation.${type2}`) ? -1 : 1).map((val, index) => {
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
