import React, { useEffect, useRef, useReducer } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import SignatureRowContent from 'components/SignatureStylePopup/SignatureRowContent';
import ToolsDropdown from 'components/ToolsDropdown';
import selectors from 'selectors';
import actions from 'actions';
import core from 'core';
import defaultTool from 'constants/defaultTool';

import './SelectedRubberStamp.scss';


const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const SelectedRubberStamp = () => {
  const dispatch = useDispatch();
  const [t, i18n] = useTranslation();
  const prevLanguage = usePrevious(i18n.language);
  // https://legacy.reactjs.org/docs/hooks-faq.html#is-there-something-like-forceupdate
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const [
    activeToolName,
    selectedStamp,
  ] = useSelector((state) => [
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

  const rubberStampToolArray = core.getToolsFromAllDocumentViewers('AnnotationCreateRubberStamp');
  const onStampsModified = () => {
    dispatch(actions.setStandardStamps(t));
    dispatch(actions.setCustomStamps(t));
  };

  useEffect(() => {
    rubberStampToolArray[0].addEventListener('stampsUpdated', onStampsModified);
    rubberStampToolArray[0].addEventListener('customStampsDeleted', onStampsModified);
    return () => {
      rubberStampToolArray[0].removeEventListener('stampsUpdated', onStampsModified);
      rubberStampToolArray[0].removeEventListener('customStampsDeleted', onStampsModified);
    };
  }, []);

  const [isToolStyleOpen] = useSelector(
    (state) => [
      selectors.isElementOpen(state, 'toolStylePopup'),
    ],
  );

  useEffect(() => {
    // set the tool mode and active tool group when first selected
    core.setToolMode(defaultTool);
  }, []);

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
            onClick={async () => {
              core.setToolMode('AnnotationCreateRubberStamp');
              const text = t(`rubberStamp.${selectedStamp.annotation['Icon']}`);
              for (const rubberStampTool of rubberStampToolArray) {
                await rubberStampTool.setRubberStamp(selectedStamp.annotation, text);
                rubberStampTool.showPreview();
              }
              forceUpdate();
            }}
            isActive={activeToolName === 'AnnotationCreateRubberStamp' && !rubberStampToolArray[0].isEmptyStamp()}
            altText={t('option.toolsOverlay.currentStamp')}
          />
        }
      </div>
      <ToolsDropdown
        onClick={() => dispatch(actions.toggleElement('toolStylePopup'))}
        isActive={isToolStyleOpen}
      />
    </div>
  );
};

export default SelectedRubberStamp;
