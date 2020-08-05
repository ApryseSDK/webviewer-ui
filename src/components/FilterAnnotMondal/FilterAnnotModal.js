import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import defaultTool from 'constants/defaultTool';
import core from 'core';
import actions from 'actions';
import selectors from 'selectors';
import Choice from 'components/Choice';

import { Swipeable } from 'react-swipeable';

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

  const filterApply = () => {
    dispatch(
      actions.setCustomNoteFilter(annot => {
        return (
          typesFilter.includes(annot.Subject.toLowerCase().replace(/\s/g, '')) && authorFilter.includes(annot.Author)
        );
      }),
    );
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
    closeModal();
  };

  const closeModal = () => {
    dispatch(actions.closeElement('filterModal'));
    core.setToolMode(defaultTool);
  };

  useEffect(() => {
    const annots = core.getAnnotationsList();
    let authorsToBeAdded = new Set();
    let annotTypesToBeAdded = new Set();
    annots.forEach(annot => {
      authorsToBeAdded.add(core.getDisplayAuthor(annot));
      annotTypesToBeAdded.add(annot.Subject.toLowerCase().replace(/\s/g, ''));
    });
    setAuthors([...authorsToBeAdded]);
    setAnnotTypes([...annotTypesToBeAdded]);
  }, [isOpen]);

  const modalClass = classNames({
    Modal: true,
    LinkModal: true,
    open: isOpen,
    closed: !isOpen,
  });

  return isDisabled ? null : (
    <Swipeable onSwipedUp={closeModal} onSwipedDown={closeModal} preventDefaultTouchmoveEvent>
      <div className={modalClass} data-element="filterModal" onMouseDown={closeModal}>
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
                </div>
                <div className="filter">
                  <div className="heading">{t('option.filterAnnotModal.types')}</div>
                  <div className="buttons">
                    {[...annotTypes].map((val, index) => {
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
                <div className="filter-annot-clear" onClick={filterClear}>
                  {t('action.clear')}
                </div>
                <div className="filter-annot-apply" onClick={filterApply}>
                  {t('action.apply')}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="swipe-indicator" />
              <div className="message">{t('message.noAnnotationsFilter')}</div>
            </div>
          )}
        </div>
      </div>
    </Swipeable>
  );
};

export default FilterAnnotModal;
