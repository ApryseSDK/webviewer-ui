import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch, shallowEqual, useStore } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import core from 'core';
import classNames from 'classnames';
import DataElements from 'constants/dataElement';
import { PANEL_SIZES, panelNames } from 'constants/panel';
import defaultTool from 'constants/defaultTool';
import Events from 'constants/events';
import DataElementWrapper from 'components/DataElementWrapper';
import CreateRubberStampButton from './CreateRubberStampButton';
import Divider from '../ModularComponents/Divider';
import './RubberStampPanel.scss';
import StandardRubberStamps from './StandardRubberStamps';
import CustomRubberStamps from './CustomRubberStamps';
import { isMobileSize } from 'helpers/getDeviceSize';
import setToolModeAndGroup from 'helpers/setToolModeAndGroup';

const TOOL_NAME = 'AnnotationCreateRubberStamp';

const RubberStampPanel = () => {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const stampToolArray = core.getToolsFromAllDocumentViewers(TOOL_NAME);
  const isMobile = isMobileSize();

  const [
    standardStamps,
    customStamps,
    selectedStampIndex,
    mobilePanelSize,
    featureFlags,
  ] = useSelector(
    (state) => [
      selectors.getStandardStamps(state),
      selectors.getCustomStamps(state),
      selectors.getSelectedStampIndex(state),
      selectors.getMobilePanelSize(state),
      selectors.getFeatureFlags(state),
    ],
    shallowEqual,
  );
  const store = useStore();
  const customizableUI = featureFlags.customizableUI;

  const setSelectedRubberStamp = useCallback(async (annotation, index) => {
    core.setToolMode(TOOL_NAME);
    for (const tool of stampToolArray) {
      const text = t(`rubberStamp.${annotation['Icon']}`);
      await tool.setRubberStamp(annotation, text);
      tool.showPreview();
    }
    dispatch(actions.setSelectedStampIndex(index));

    if (isMobile && mobilePanelSize !== PANEL_SIZES.SMALL_SIZE) {
      dispatch(actions.setMobilePanelSize(PANEL_SIZES.SMALL_SIZE));
    }
  }, []);

  useEffect(() => {
    dispatch(actions.setSelectedStampIndex(null));
  }, []);

  useEffect(() => {
    const onVisibilityChanged = (e) => {
      const activeTool = core.getToolMode();
      const activeToolName = activeTool?.name;
      const { element, isVisible } = e.detail;
      if (element === panelNames.RUBBER_STAMP && !isVisible) {
        if (activeToolName === TOOL_NAME || activeToolName === defaultTool) {
          setToolModeAndGroup(store, defaultTool);
        }
      }
    };

    window.addEventListener(Events.VISIBILITY_CHANGED, onVisibilityChanged);
    return () => {
      window.removeEventListener(Events.VISIBILITY_CHANGED, onVisibilityChanged);
    };
  }, []);

  return (
    <DataElementWrapper dataElement={DataElements.RUBBER_STAMP_PANEL} className={classNames({
      'Panel': true,
      'RubberStampPanel': true,
      [mobilePanelSize]: isMobile,
      'custom-panel': customizableUI,
    })}>
      <div className='rubber-stamp-panel-header'>
        {t('rubberStampPanel.header')}
      </div>
      <CreateRubberStampButton />
      <div className={
        classNames({
          'rubber-stamps-container': true,
          [mobilePanelSize]: isMobile,
        })}>
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