import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import SignatureRowContent from 'components/SignatureStylePopup/SignatureRowContent';
import ToolsDropdown from 'components/ToolsDropdown';
import selectors from 'selectors';
import actions from 'actions';
import core from 'core';

import './SelectedRubberStamp.scss';

const usePrevious = value => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const SelectedSignatureRow = () => {
  const dispatch = useDispatch();
  const [t, i18n] = useTranslation();
  const prevLanguage = usePrevious(i18n.language);

  const [
    activeToolName,
    selectedStamp,
  ] = useSelector(state => [
    selectors.getActiveToolName(state),
    selectors.getSelectedStamp(state),
  ]);

  useEffect(() => {
    dispatch(actions.setStandardStamps(t));
    dispatch(actions.setCustomStamps(t));
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const isLanguageChanged = prevLanguage !== i18n.language;
    if (isLanguageChanged) {
      dispatch(actions.setStandardStamps(t));
      dispatch(actions.setCustomStamps(t));
    }
  });

  const rubberStampTool = core.getTool('AnnotationCreateRubberStamp');
  const onStampsAdded = () => {
    dispatch(actions.setStandardStamps(t));
    dispatch(actions.setCustomStamps(t));
  };

  useEffect(() => {
    rubberStampTool.on('stampsUpdated', onStampsAdded);
    return () => {
      rubberStampTool.off('stampsUpdated', onStampsAdded);
    };
  }, []);

  const [isToolStyleOpen] = useSelector(
    state => [
      selectors.isElementOpen(state, 'toolStylePopup'),
    ],
  );
  return (
    <div
      className="selected-rubber-stamp-container"
    >
      <div
        className="selected-rubber-stamp"
      >
        {selectedStamp &&
          <SignatureRowContent
            imgSrc={selectedStamp.imgSrc}
            onClick={() => {
              core.setToolMode('AnnotationCreateRubberStamp');
              const text = t(`rubberStamp.${selectedStamp.annotation['Icon']}`);
              rubberStampTool.setRubberStamp(selectedStamp.annotation, text);
              rubberStampTool.showPreview();
            }}
            isActive={activeToolName === 'AnnotationCreateRubberStamp'}
            altText={t('option.toolsOverlay.currentStamp')}
          />}
      </div>
      <ToolsDropdown
        onClick={() => dispatch(actions.toggleElement('toolStylePopup'))}
        isActive={isToolStyleOpen}
      />
    </div>
  );
};

export default SelectedSignatureRow;