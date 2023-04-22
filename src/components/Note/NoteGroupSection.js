import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Icon from 'components/Icon';
import NoteContent from 'components/NoteContent';
import PropTypes from 'prop-types';
import core from 'core';
import actions from 'actions';

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

  const upArrow = 'ic_chevron_up_black_24px';
  const downArrow = 'ic_chevron_down_black_24px';

  const ViewAllAnnotsButton = (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsViewingGroupAnnots(true);
      }}
      className="text-button"
    >
      {t('component.noteGroupSection.open')}
      <Icon glyph={downArrow} />
    </div>
  );
  const CloseAllAnnotsButton = (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsViewingGroupAnnots(false);
      }}
      className="text-button"
    >
      {t('component.noteGroupSection.close')}
      <Icon glyph={upArrow} />
    </div>
  );

  return (
    <div
      className="group-section"
    >
      {isViewingGroupAnnots ? CloseAllAnnotsButton : ViewAllAnnotsButton}
      {isViewingGroupAnnots &&
        groupAnnotations.map((groupAnnotation, i) => {
          // Ignore the group primary annotation
          if (i === 0) {
            return null;
          }
          return (
            <div
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
            </div>
          );
        })
      }
    </div>
  );
};

NoteGroupSection.propTypes = propTypes;

export default NoteGroupSection;