import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import Measure from 'react-measure';
import { useTranslation } from 'react-i18next';
import selectors from 'selectors';
import actions from 'actions';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './TabPanel.scss';
import Button from 'components/Button';
import Element from 'components/Element';
import ToggleElementButton from 'components/ModularComponents/ToggleElementButton';
import RedactionPanel from 'components/RedactionPanel';
import { panelNames, panelData } from 'constants/panel';
import { getPanelToRender, createCustomElement } from 'helpers/tabPanelHelper';
import { isMobileSize } from 'helpers/getDeviceSize';

const removeDuplicates = (array) => [...new Set(array)];
const MORE_BUTTON_MIN_WIDTH = 48;

const TabPanel = ({ dataElement: tabPanelDataElement, redactionAnnotationsList }) => {
  const dispatch = useDispatch();
  const [t] = useTranslation();
  const moreButtonDefaultIcon = 'icon-tools-more';
  const isMobile = isMobileSize();
  const tabPanelHeaderRef = useRef();
  const moreButtonRef = useRef();
  const previousHeaderWidthRef = useRef(0);
  const isShrinkingPanelRef = useRef(false);
  const isReconcilingOverflowRef = useRef(false);
  const FLYOUT_NAME = `${tabPanelDataElement}-flyout`;
  const [panelsObject, setPanelsObject] = useState({});
  const [visiblePanelTabs, setVisiblePanelTabs] = useState([]);
  const [overflowItems, setOverflowItems] = useState([]);
  const [headerContainerWidth, setHeaderContainerWidth] = useState(0);
  const [moreButtonIcon, setMoreButtonIcon] = useState(moreButtonDefaultIcon);
  const [hiddenTabsMinWidth, setHiddenTabsMinWidth] = useState({});
  const [isHeaderLayoutReady, setIsHeaderLayoutReady] = useState(false);
  const hasIcon = Object.values(panelsObject).some((panel) => panel.icon);
  const hasLabel = Object.values(panelsObject).some((panel) => panel.label);

  const genericPanels = useSelector(selectors.getGenericPanels);
  const selectedTab = useSelector((state) => selectors.getActiveTabInPanel(state, tabPanelDataElement));
  const flyoutMap = useSelector(selectors.getFlyoutMap, shallowEqual);
  const activeDocumentViewerKey = useSelector(selectors.getActiveDocumentViewerKey);
  const portfolioFiles = useSelector((state) => selectors.getPortfolio(state, activeDocumentViewerKey));
  const disabledElements = useSelector(selectors.getDisabledElements);
  const enabledPanels = useSelector((state) => selectors.getEnabledTabPanelTabs(state, tabPanelDataElement));

  const renderPanel = (panelName, dataElement) => {
    if (panelName === panelNames.REDACTION) {
      return (
        <RedactionPanel
          dataElement={dataElement}
          redactionAnnotationsList={redactionAnnotationsList}
          isCustomPanel={true}
        />
      );
    } else {
      return getPanelToRender(panelName, dataElement, tabPanelDataElement);
    }
  };
  const getPanelsObjectToRender = () => {
    const panelsToRender = {};
    const presetPanels = Object.values(panelNames);
    enabledPanels?.forEach((panel, index) => {
      const panelRenderer = panel.render;
      // Case it is a preset panel
      if (typeof panelRenderer === 'string') {
        const customPanel = genericPanels.find((customPanel) => [customPanel.render, customPanel.dataElement].includes(panelRenderer));

        if (!customPanel) {
          console.warn(`Panel ${panelRenderer} is not a valid custom panel`);
          return;
        }

        if (presetPanels.includes(customPanel.render)) {
          const panelInfo = panelData[customPanel.render];
          panelsToRender[panelRenderer] = {
            title: panelInfo.title,
            label: panel.label ?? panelInfo.label,
            icon: panel.icon ?? panelInfo.icon,
            sortIndex: index,
            tabPanel: tabPanelDataElement,
            render: renderPanel(customPanel.render, `${customPanel.dataElement}-tab-panel`)
          };
        } else {
          panelsToRender[panelRenderer] = {
            ...customPanel,
            render: createCustomElement(customPanel),
            sortIndex: index,
          };
        }
      } else if (typeof panelRenderer === 'function') {
        dispatch(actions.addPanel(panel));
        panelsToRender[panel.dataElement] = {
          title: panel.title,
          label: panel.label,
          icon: panel.icon,
          render: createCustomElement(panel),
          sortIndex: index,
        };
      }
    });

    return panelsToRender;
  };

  const handleMoreButtonIcon = () => {
    if (selectedTab && !visiblePanelTabs.includes(selectedTab)) {
      setMoreButtonIcon('icon-tools-more-active');
    } else {
      setMoreButtonIcon(moreButtonDefaultIcon);
    }
  };

  const setOverflowFlyout = () => {
    const flyout = {
      dataElement: FLYOUT_NAME,
      className: 'tabPanelOverflowFlyout',
      items: [],
    };
    if (overflowItems.length > 0) {
      for (const item of overflowItems) {
        const flyoutItem = {
          ...panelsObject[item],
          onClick: () => {
            dispatch(actions.setActiveTabInPanel(item, tabPanelDataElement));
            dispatch(actions.closeElements([FLYOUT_NAME]));
          },
          sortIndex: panelsObject[item].sortIndex,
          tabPanel: tabPanelDataElement,
          dataElement: item,
          label: panelsObject[item].title,
        };
        flyout.items.push(flyoutItem);
      }
      flyout.items.sort((a, b) => a.sortIndex - b.sortIndex);
    }

    if (flyoutMap[FLYOUT_NAME]) {
      dispatch(actions.updateFlyout(FLYOUT_NAME, flyout));
    } else {
      dispatch(actions.addFlyout(flyout, FLYOUT_NAME));
    }
  };

  const moveItemsToOverflow = (items) => {
    setOverflowItems(removeDuplicates([...overflowItems, ...items]).sort((a, b) => panelsObject[a].sortIndex - panelsObject[b].sortIndex));
    const itemsToKeepVisible = visiblePanelTabs.filter((item) => !(items.includes(item)));
    setVisiblePanelTabs(removeDuplicates(itemsToKeepVisible));
  };

  const moveItemsToContainer = (items) => {
    setVisiblePanelTabs(removeDuplicates([...visiblePanelTabs, ...items]));
    const itemsToKeepInOverflow = overflowItems.filter((item) => !(items.includes(item)));
    setOverflowItems(removeDuplicates(itemsToKeepInOverflow));
  };

  const getItemsToHide = (itemsDom, missingSpace) => {
    let spaceToFree = Math.abs(missingSpace);
    const allItems = [...visiblePanelTabs];
    const itemsToHide = [];

    // Continue removing items while we need to free space
    while (spaceToFree > 0 && allItems.length > 1) {
      const lastItem = allItems.pop();
      const lastItemDom = Array.from(itemsDom).find((item) => item.getAttribute('data-element') === `${lastItem}-${tabPanelDataElement}`);
      if (!lastItemDom) {
        break;
      }
      const lastItemWidth = lastItemDom.getBoundingClientRect().width;
      itemsToHide.push(lastItem);
      spaceToFree -= lastItemWidth;
      setHiddenTabsMinWidth((prev) => ({
        ...prev,
        [lastItem]: lastItemWidth,
      }));
    }
    return itemsToHide;
  };

  const getItemsToShow = (availableSpace, moreButtonWidth) => {
    let spaceToFill = availableSpace;
    const allItems = [...overflowItems];
    const itemsToShow = [];

    while (spaceToFill > 0 && allItems.length > 0) {
      const firstItem = allItems[0];
      const firstItemWidth = hiddenTabsMinWidth[firstItem];
      const remainingOverflowCount = allItems.length - 1;
      const requiredSpace = firstItemWidth + (remainingOverflowCount > 0 ? moreButtonWidth : 0);
      if (spaceToFill >= requiredSpace) {
        itemsToShow.push(firstItem);
        allItems.shift();
        spaceToFill -= firstItemWidth;
      } else {
        break;
      }
    }
    return itemsToShow;
  };

  const calculateAvailableSpace = (itemsShown, headerRect) => {
    const totalMinWidth = itemsShown.reduce((acc, item) => {
      const minWidth = parseFloat(getComputedStyle(item).minWidth) || item.getBoundingClientRect().width;
      return acc + minWidth;
    }, 0);

    const panelWidth = headerRect.width;
    const availableSpace = panelWidth - totalMinWidth;
    return availableSpace;
  };

  const handleTabPanelElements = (shouldCheckForOverflow = false) => {
    const headerElement = tabPanelHeaderRef.current;
    const moreButtonElement = moreButtonRef.current;
    if (!headerElement || !moreButtonElement) {
      return false;
    }

    dispatch(actions.closeElements([FLYOUT_NAME]));
    const itemsShown = Array.from(headerElement.querySelectorAll('.tabPanelButton'));
    const headerRect = headerElement.getBoundingClientRect();
    const moreButtonWidth = Number.parseFloat(getComputedStyle(moreButtonElement).minWidth) || MORE_BUTTON_MIN_WIDTH;
    const availableSpace = calculateAvailableSpace(itemsShown, headerRect);

    // when the panel is getting smaller
    const shouldReconcileOverflow = shouldCheckForOverflow || isShrinkingPanelRef.current || isReconcilingOverflowRef.current;
    if (shouldReconcileOverflow) {
      const minAvailableSpaceRequired = availableSpace - moreButtonWidth;
      if (minAvailableSpaceRequired < 0 && visiblePanelTabs.length > 1) {
        const itemsToHide = getItemsToHide(itemsShown, minAvailableSpaceRequired);
        if (itemsToHide.length) {
          isReconcilingOverflowRef.current = true;
          moveItemsToOverflow(itemsToHide);
          return true;
        }
      } else {
        isReconcilingOverflowRef.current = false;
      }
    } else if (availableSpace > 0 && overflowItems.length > 0) {
      const itemsToGetBack = getItemsToShow(availableSpace, moreButtonWidth);
      if (itemsToGetBack.length) {
        moveItemsToContainer(itemsToGetBack);
        return true;
      }
    }
    handleMoreButtonIcon();
    return false;
  };

  useEffect(() => {
    const panelsToRender = getPanelsObjectToRender();

    isReconcilingOverflowRef.current = false;
    setIsHeaderLayoutReady(false);
    setPanelsObject(panelsToRender);
    setVisiblePanelTabs(Object.keys(panelsToRender));

    // We set the overflow items to an empty array so we can re-calculate the overflow items when the tabs change
    setOverflowItems([]);
  }, [portfolioFiles, redactionAnnotationsList, disabledElements]);

  useEffect(() => {
    if (!selectedTab) {
      const firstPanel = Object.keys(panelsObject)[0];
      dispatch(actions.setActiveTabInPanel(firstPanel, tabPanelDataElement));
    }
  }, [panelsObject]);

  useEffect(() => {
    handleMoreButtonIcon();
  }, [selectedTab]);

  useLayoutEffect(() => {
    const canMeasureHeader = headerContainerWidth > 0 && visiblePanelTabs.length > 0;
    if (!canMeasureHeader) {
      return;
    }

    const didUpdateOverflow = handleTabPanelElements(!isHeaderLayoutReady);
    if (!didUpdateOverflow && !isHeaderLayoutReady) {
      setIsHeaderLayoutReady(true);
    }
    overflowItems.length > 0 && setOverflowFlyout();
  }, [
    visiblePanelTabs,
    overflowItems,
    headerContainerWidth,
    isHeaderLayoutReady,
  ]);

  const renderTabs = () => {
    if (visiblePanelTabs?.length) {
      return visiblePanelTabs.map((tab, index) => {
        const panelInfo = panelsObject[tab];
        const isActive = tab === selectedTab;
        const tabSelector = `${tab}-${tabPanelDataElement}`;
        return (
          <Button
            className={classNames({
              tabPanelButton: true,
              hasIcon,
              hasLabel,
              lastButton: overflowItems.length === 0 && index === visiblePanelTabs.length - 1,
            })}
            key={tabSelector}
            isActive={isActive}
            dataElement={tabSelector}
            img={panelInfo.icon}
            onClick={() => dispatch(actions.setActiveTabInPanel(tab, tabPanelDataElement))}
            title={panelInfo.title}
            label={panelInfo.label}
            ariaCurrent={isActive}
          />
        );
      });
    }
  };

  const getActivePanelRender = () => {
    const activePanel = panelsObject[selectedTab];
    return activePanel?.render;
  };

  const closePanel = () => {
    dispatch(actions.closeElement(tabPanelDataElement));
  };

  const childElements = <>
    <Measure
      bounds
      innerRef={tabPanelHeaderRef}
      onResize={({ bounds }) => {
        isShrinkingPanelRef.current = previousHeaderWidthRef.current > 0 && bounds.width < previousHeaderWidthRef.current;
        previousHeaderWidthRef.current = bounds.width;
        setHeaderContainerWidth(bounds.width);
      }}>
      {({ measureRef }) => (
        <>
          <div className='tabPanelTitleContainer'>
            {isMobile ? <Button className='tabPanelCloseButton' ariaLabel={t('action.close')} img='ic_close_black_24px' dataElement="tabPanelCloseButton" title={t('action.close')} onClick={closePanel} /> : undefined}
          </div>
          <div
            ref={measureRef}
            className={classNames('TabPanelHeader', { layoutPending: !isHeaderLayoutReady })}
            aria-hidden={!isHeaderLayoutReady}
          >
            <Element className='TabPanelHeaderElements' dataElement='TabPanelHeaderElements'>
              {renderTabs()}
              <div
                ref={moreButtonRef}
                className={classNames({
                  'moreButton': true,
                  'hidden': overflowItems.length === 0,
                  'active': moreButtonIcon === 'icon-tools-more-active',
                })}
              >
                <ToggleElementButton
                  dataElement={`${tabPanelDataElement}-moreButton`}
                  toggleElement={FLYOUT_NAME}
                  title="action.more"
                  img={moreButtonIcon}
                />
              </div>
            </Element>
          </div>
        </>
      )}
    </Measure>
    {getActivePanelRender()}
  </>;

  return <div className='tabPanelContainer'>{childElements}</div>;
};

TabPanel.propTypes = {
  dataElement: PropTypes.string.isRequired,
  redactionAnnotationsList: PropTypes.array,
};

export default TabPanel;
