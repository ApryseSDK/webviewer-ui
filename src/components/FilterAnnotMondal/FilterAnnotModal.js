import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import defaultTool from 'constants/defaultTool';
import core from 'core';
import actions from 'actions';
import selectors from 'selectors';

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

  const filterApply = () => {
    dispatch(
      actions.setCustomNoteFilter(annot => {
        let type = true;
        let author = true;
        if (typesFilter.length > 0) {
          type = typesFilter.includes(annot.Subject);
        }
        if (authorFilter.length > 0) {
          author = authorFilter.includes(core.getDisplayAuthor(annot));
        }
        return type && author;
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
      if (annot.Subject && annot.Subject !== '') {
        annotTypesToBeAdded.add(annot.Subject);
      }
    });
    setAuthors([...authorsToBeAdded]);
    setAnnotTypes([...annotTypesToBeAdded]);
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
                  </div>
                  <div className="filter">
                    <div className="heading">{t('option.filterAnnotModal.types')}</div>
                    <div className="buttons">
                      {[...annotTypes].map((val, index) => {
                        return (
                          <Choice
                            type="checkbox"
                            key={index}
                            label={val}
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
