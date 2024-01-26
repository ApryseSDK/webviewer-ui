import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import core from 'core';
import DataElements from 'constants/dataElement';
import DataElementWrapper from 'components/DataElementWrapper';
import CreateRubberStampButton from './CreateRubberStampButton';
import Divider from '../ModularComponents/Divider';
import './RubberStampPanel.scss';
import StandardRubberStamps from './StandardRubberStamps';
import CustomRubberStamps from './CustomRubberStamps';

const TOOL_NAME = 'AnnotationCreateRubberStamp';

const RubberStampPanel = () => {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const stampToolArray = core.getToolsFromAllDocumentViewers(TOOL_NAME);

  const [
    standardStamps,
    customStamps,
    selectedStampIndex,
  ] = useSelector(
    (state) => [
      selectors.getStandardStamps(state),
      selectors.getCustomStamps(state),
      selectors.getSelectedStampIndex(state),
    ],
    shallowEqual,
  );
  const setSelectedRubberStamp = useCallback(async (annotation, index) => {
    core.setToolMode(TOOL_NAME);
    for (const tool of stampToolArray) {
      const text = t(`rubberStamp.${annotation['Icon']}`);
      await tool.setRubberStamp(annotation, text);
      tool.showPreview();
    }
    dispatch(actions.setSelectedStampIndex(index));
  }, []);

  return (
    <DataElementWrapper dataElement={DataElements.RUBBER_STAMP_PANEL} className="Panel RubberStampPanel">
      <div className='rubber-stamp-panel-header'>
        {t('rubberStampPanel.header')}
      </div>
      <CreateRubberStampButton />
      <div className='rubber-stamps-container'>
        <CustomRubberStamps
          selectedStampIndex={selectedStampIndex}
          standardStampsOffset={standardStamps.length}
          setSelectedRubberStamp={setSelectedRubberStamp}
          customStamps={customStamps} />
        <Divider />
        <StandardRubberStamps
          setSelectedRubberStamp={setSelectedRubberStamp}
          standardStamps={standardStamps}
          selectedStampIndex={selectedStampIndex} />
      </div>

    </DataElementWrapper>
  );
};

export default RubberStampPanel;