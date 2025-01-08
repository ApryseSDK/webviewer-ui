import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Button from 'components/Button';
import NoteContent from 'components/NoteContent';
import PropTypes from 'prop-types';
import core from 'core';
import actions from 'actions';
import selectors from 'selectors';
import classNames from 'classnames';

const propTypes = {
  groupAnnotations: PropTypes.array.isRequired,
  isMultiSelectMode: PropTypes.bool.isRequired,
};

const NoteGroupSection = ({
  groupAnnotations,
  isMultiSelectMode,
}) => {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const [isViewingGroupAnnots, setIsViewingGroupAnnots] = useState(false);
  const customizableUI = useSelector((state) => selectors.getFeatureFlags(state)?.customizableUI);

  const upArrow = 'ic_chevron_up_black_24px';
  const downArrow = 'ic_chevron_down_black_24px';

  const ViewAllAnnotsButton = (
    <Button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsViewingGroupAnnots(true);
      }}
      className="text-button"
      ariaLabel={t('component.noteGroupSection.open')}
      label={t('component.noteGroupSection.open')}
      img={downArrow}
    />
  );
  const CloseAllAnnotsButton = (
    <Button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsViewingGroupAnnots(false);
      }}
      className="text-button"
      ariaLabel={t('component.noteGroupSection.close')}
      label={t('component.noteGroupSection.close')}
      img={upArrow}
    />
  );

  return (
    <div
      className={classNames({
        'group-section': true,
        'modular-ui': customizableUI,
      })}
    >
      {isViewingGroupAnnots ? CloseAllAnnotsButton : ViewAllAnnotsButton}
      {isViewingGroupAnnots &&
        groupAnnotations.map((groupAnnotation, i) => {
          // Ignore the group primary annotation
          if (i === 0) {
            return null;
          }
          return (
            <Button
              key={groupAnnotation.Id}
              className="group-child"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                core.selectAnnotation(groupAnnotation);
                core.jumpToAnnotation(groupAnnotation);
                dispatch(actions.openElement('annotationPopup'));
              }}
            >
              <NoteContent
                key={groupAnnotation.Id}
                annotation={groupAnnotation}
                isUnread={false}
                isGroupMember={true}
                isMultiSelectMode={isMultiSelectMode}
              />
            </Button>
          );
        })
      }
    </div>
  );
};

NoteGroupSection.propTypes = propTypes;

export default NoteGroupSection;