import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch, shallowEqual, useStore } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import useCore from 'hooks/useCore';
import classNames from 'classnames';
import DataElements from 'constants/dataElement';
import { PANEL_SIZES, panelNames } from 'constants/panel';
import defaultTool from 'constants/defaultTool';
import Events from 'constants/events';
import { getCustomStampCategory, getCustomStampsByCategory, getStandardStampCategory, getStandardStampsByCategory } from 'helpers/stamps';
import DataElementWrapper from 'components/DataElementWrapper';
import CreateRubberStampButton from './CreateRubberStampButton';
import './RubberStampPanel.scss';
import StandardRubberStamps from './StandardRubberStamps';
import CustomRubberStamps from './CustomRubberStamps';
import { isMobileSize } from 'helpers/getDeviceSize';
import setToolModeAndGroup from 'helpers/setToolModeAndGroup';
import PropTypes from 'prop-types';
import { getEventHandler } from 'helpers/fireEvent';
import StampSearchOverlay from './StampSearchOverlay';
import HorizontalDivider from 'components/HorizontalDivider';
import { Tabs, Tab, TabPanel } from 'components/Tabs';
import useStampSearch from 'hooks/useStampSearch/useStampSearch';
import useStampSearchOptionsFlyout from 'hooks/useStampSearchOptionsFlyout';

const TOOL_NAME = 'AnnotationCreateRubberStamp';
const DOCUMENT_TEMPLATE_ID_CUSTOM_DATA_KEY = 'trn-pdf-stamp-template-id';

const RubberStampPanel = ({ dataElement = DataElements.RUBBER_STAMP_PANEL, isFlyout = false }) => {
  const { core } = useCore();
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const stampToolArray = core.getToolsFromAllDocumentViewers(TOOL_NAME);
  const isMobile = isMobileSize();

  const isPanelOpen = useSelector((state) => selectors.isElementOpen(state, dataElement), shallowEqual);
  const standardStamps = useSelector(selectors.getStandardStamps, shallowEqual);
  const customStamps = useSelector(selectors.getCustomStamps, shallowEqual);
  const [isDocumentStampsLoading, setIsDocumentStampsLoading] = useState(() => (
    stampToolArray.some((tool) => tool['isDocumentStampsLoading']?.())
  ));
  const isMultiViewerMode = useSelector(selectors.isMultiViewerMode);
  const selectedStampIndex = useSelector(selectors.getSelectedStampIndex);
  const mobilePanelSize = useSelector(selectors.getMobilePanelSize);
  const selectedTab = useSelector((state) => selectors.getSelectedTab(state, DataElements.RUBBER_STAMP_PANEL));
  const isInitialTabSelection = useRef(true);
  const customCategories = useSelector((state) => selectors.getCustomStampCategories(state));
  const standardCategories = useSelector((state) => selectors.getStandardStampCategories(state));
  const {
    categoryMap: customCategoryMap,
    visibleCategories: visibleCustomCategories,
    onCheckboxChange: onCustomCheckboxChange,
  } = useStampSearchOptionsFlyout({
    stamps: customStamps,
    categories: customCategories,
    getStampsByCategory: getCustomStampsByCategory,
  });
  const {
    categoryMap: standardCategoryMap,
    visibleCategories: visibleStandardCategories,
    onCheckboxChange: onStandardCheckboxChange,
  } = useStampSearchOptionsFlyout({
    stamps: standardStamps,
    categories: standardCategories,
    getStampsByCategory: getStandardStampsByCategory,
  });
  const isStandardStampsTabOpen = selectedTab === DataElements.RUBBER_STAMP_PANEL_PRESET_TAB;
  const { searchValue, setSearchValue, searchResults } = useStampSearch({
    stamps: isStandardStampsTabOpen ? standardStamps : customStamps,
    visibleCategories: isStandardStampsTabOpen ? visibleStandardCategories : visibleCustomCategories,
    getStampCategory: isStandardStampsTabOpen ? getStandardStampCategory : getCustomStampCategory,
  });
  const [rubberStampsScrollParent, setRubberStampsScrollParent] = useState(null);

  const store = useStore();

  useEffect(() => {
    const updateDocumentStampsLoading = () => {
      setIsDocumentStampsLoading(stampToolArray.some((tool) => tool['isDocumentStampsLoading']?.()));
    };

    stampToolArray.forEach((tool) => {
      tool.addEventListener?.('documentStampsLoadingChanged', updateDocumentStampsLoading);
    });
    updateDocumentStampsLoading();

    return () => {
      stampToolArray.forEach((tool) => {
        tool.removeEventListener?.('documentStampsLoadingChanged', updateDocumentStampsLoading);
      });
    };
  }, [core, isMultiViewerMode]);

  const setRubberStampsContainerRef = useCallback((node) => {
    setRubberStampsScrollParent(node || null);
  }, []);

  useEffect(() => {
    if (!rubberStampsScrollParent) {
      return;
    }

    const dispatchScrollEvent = () => {
      rubberStampsScrollParent.dispatchEvent(new Event('scroll'));
    };

    const observer = new MutationObserver(() => {
      requestAnimationFrame(dispatchScrollEvent);
    });
    observer.observe(rubberStampsScrollParent, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [rubberStampsScrollParent]);

  const getDocumentStampText = (annotation, translate) => {
    const icon = annotation?.Icon || '';
    const translationKey = `rubberStamp.${icon}`;
    const translatedText = translate(translationKey);
    return translatedText === translationKey ? (icon || translate('annotation.stamp')) : translatedText;
  };

  const registrationsMatch = (a, b) => {
    if (!b || a.sources.length !== b.sources.length) {
      return false;
    }
    return a.sources.every((src, i) => {
      const other = b.sources[i];
      return src.source === other.source
        && src.title === other.title
        && src.filename === other.filename
        && src.extension === other.extension
        && src.cropVisibleContent === other.cropVisibleContent
        && src.category === other.category
        && JSON.stringify(src.pages) === JSON.stringify(other.pages);
    });
  };

  const syncDocumentStampRegistrations = async (stampToolArray, annotation) => {
    const templateId = annotation?.getCustomData?.(DOCUMENT_TEMPLATE_ID_CUSTOM_DATA_KEY);
    if (!templateId) {
      return;
    }

    const sourceTool = stampToolArray.find((tool) => tool.hasDocumentStampTemplate?.(templateId)) || null;
    if (!sourceTool) {
      return;
    }

    const registration = sourceTool.getDocumentStampRegistration?.();
    if (!registration) {
      return;
    }

    const toolsToSync = stampToolArray.filter((tool) => {
      if (tool === sourceTool) {
        return false;
      }
      const siblingRegistration = tool.getDocumentStampRegistration?.();
      return !registrationsMatch(registration, siblingRegistration);
    });

    await Promise.all(toolsToSync.map((tool) => tool.setDocumentStamps(registration.sources, registration.options)));
  };

  const applyRubberStampSelection = async (stampToolArray, annotation, text) => {
    for (const tool of stampToolArray) {
      await tool.setRubberStamp(annotation, text);
      await tool.showPreview();
    }
  };

  const setSelectedRubberStamp = useCallback(async (annotation, index) => {
    core.setToolMode(TOOL_NAME);
    await syncDocumentStampRegistrations(stampToolArray, annotation);
    const text = getDocumentStampText(annotation, t);
    await applyRubberStampSelection(stampToolArray, annotation, text);
    dispatch(actions.setSelectedStampIndex(index));

    if (isMobile && mobilePanelSize !== PANEL_SIZES.SMALL_SIZE) {
      dispatch(actions.setMobilePanelSize(PANEL_SIZES.SMALL_SIZE));
    }
  }, []);

  useEffect(() => {
    if (isInitialTabSelection.current) {
      isInitialTabSelection.current = false;
      return;
    }
    dispatch(actions.setSelectedStampIndex(null));
    setToolModeAndGroup(store, defaultTool);
  }, [dispatch, selectedTab, store]);

  useEffect(() => {
    dispatch(actions.setSelectedStampIndex(null));
  }, []);

  useEffect(() => {
    const onVisibilityChanged = (element, isVisible) => {
      const activeTool = core.getToolMode();
      const activeToolName = activeTool?.name;
      if (element === panelNames.RUBBER_STAMP && !isVisible) {
        if (activeToolName === TOOL_NAME || activeToolName === defaultTool) {
          setToolModeAndGroup(store, defaultTool);
        }
      }
    };

    getEventHandler().addEventListener(Events.VISIBILITY_CHANGED, onVisibilityChanged);
    return () => {
      getEventHandler().removeEventListener(Events.VISIBILITY_CHANGED, onVisibilityChanged);
    };
  }, []);

  const categoryMap = selectedTab === DataElements.RUBBER_STAMP_PANEL_CUSTOM_TAB ? customCategoryMap : standardCategoryMap;
  const onCategoryCheckboxChange = useCallback((category) => {
    if (selectedTab === DataElements.RUBBER_STAMP_PANEL_CUSTOM_TAB) {
      onCustomCheckboxChange(category);
    } else {
      onStandardCheckboxChange(category);
    }
  }, [selectedTab, onCustomCheckboxChange, onStandardCheckboxChange]);

  const stampPanel =
    (<DataElementWrapper dataElement={dataElement} className={classNames({
      'Panel': true,
      'RubberStampPanel': true,
      [mobilePanelSize]: isMobile,
      'modular-ui-panel': true,
      'isFlyout': isFlyout,
    })}>
      <h1 className='rubber-stamp-panel-header'>
        {t('rubberStampPanel.header')}
      </h1>
      <Tabs id="rubberStampPanel">
        <div className='stamp-panel-toggle-buttons'>
          <Tab dataElement={DataElements.RUBBER_STAMP_PANEL_PRESET_TAB}>
            <button className='stamp-panel-toggle-button'>
              {t('rubberStampPanel.preset')}
            </button>
          </Tab>
          <Tab dataElement={DataElements.RUBBER_STAMP_PANEL_CUSTOM_TAB}>
            <button className='stamp-panel-toggle-button'>
              {t('rubberStampPanel.custom')}
            </button>
          </Tab>
        </div>
        <StampSearchOverlay
          categoryMap={categoryMap}
          onCategoryCheckboxChange={onCategoryCheckboxChange}
          isPanelOpen={isPanelOpen}
          isFlyout={isFlyout}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
        <HorizontalDivider />
        <div className={
          classNames({
            'rubber-stamps-container': true,
            [mobilePanelSize]: isMobile,
            isFlyout: isFlyout,
          })}
        ref={setRubberStampsContainerRef}>
          <TabPanel dataElement={DataElements.RUBBER_STAMP_PANEL_PRESET}>
            <StandardRubberStamps
              setSelectedRubberStamp={setSelectedRubberStamp}
              selectedStampIndex={selectedStampIndex}
              isFlyout={isFlyout}
              scrollParent={rubberStampsScrollParent}
              searchResults={isStandardStampsTabOpen ? searchResults : {}}
              isDocumentStampsLoading={isDocumentStampsLoading}
            />
          </TabPanel>
          <TabPanel dataElement={DataElements.RUBBER_STAMP_PANEL_CUSTOM}>
            <CustomRubberStamps
              selectedStampIndex={selectedStampIndex}
              standardStampsOffset={standardStamps.length}
              setSelectedRubberStamp={setSelectedRubberStamp}
              isFlyout={isFlyout}
              scrollParent={rubberStampsScrollParent}
              searchResults={isStandardStampsTabOpen ? {} : searchResults}
            />
          </TabPanel>
        </div>
        <TabPanel dataElement="rubberStampPanelCustom">
          <div className='rubber-stamp-panel-footer'>
            <CreateRubberStampButton />
          </div>
        </TabPanel>
      </Tabs>
    </DataElementWrapper>);

  return stampPanel;
};

RubberStampPanel.propTypes = {
  dataElement: PropTypes.string,
  isFlyout: PropTypes.bool,
};

export default RubberStampPanel;