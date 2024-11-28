import React, { useEffect, useRef, useState } from 'react';
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
import DataElements from 'constants/dataElement';
import { getPanelToRender, createCustomElement } from 'helpers/tabPanelHelper';
import { isMobileSize } from 'helpers/getDeviceSize';

const TabPanel = ({ dataElement: tabPanelDataElement, redactionAnnotationsList }) => {
  const dispatch = useDispatch();
  const [t] = useTranslation();
  const moreButtonDefaultIcon = 'icon-tools-more';
  const PANEL_PADDING = 32;
  const isMobile = isMobileSize();
  const tabPanelHeaderRef = useRef();
  const moreButtonRef = useRef();
  const FLYOUT_NAME = `${tabPanelDataElement}-flyout`;
  const [panelsObject, setPanelsObject] = useState({});
  const [visiblePanelTabs, setVisiblePanelTabs] = useState([]);
  const [overflowItems, setOverflowItems] = useState([]);
  const [headerContainerPrevWidth, setHeaderContainerPrevWidth] = useState({ width: 0 });
  const [headerContainerWidth, setHeaderContainerWidth] = useState({ width: 0 });
  const [moreButtonIcon, setMoreButtonIcon] = useState(moreButtonDefaultIcon);
  const [labelFlag, setLabelFlag] = useState(false);
  const [iconFlag, setIconFlag] = useState(false);
  const [hiddenTabsMinWidth, setHiddenTabsMinWidth] = useState({});
  const [isShrinkingPanel, setIsShrinkingPanel] = useState(false);

  const genericPanels = useSelector(selectors.getGenericPanels);
  const selectedTab = useSelector((state) => selectors.getActiveTabInPanel(state, tabPanelDataElement));
  const flyoutMap = useSelector(selectors.getFlyoutMap, shallowEqual);
  const isPortfolioPanelDisabled = useSelector((state) => selectors.isElementDisabled(state, DataElements.PORTFOLIO_PANEL));
  const isSignaturePanelDisabled = useSelector((state) => selectors.isElementDisabled(state, DataElements.SIGNATURE_PANEL));

  const panelsList = genericPanels.find((panel) => panel.dataElement === tabPanelDataElement).panelsList;
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
    panelsList?.forEach((panel, index) => {
      if (panel.render === panelNames.PORTFOLIO && isPortfolioPanelDisabled ||
        panel.render === panelNames.SIGNATURE && isSignaturePanelDisabled) {
        return;
      }
      if (panel.icon) {
        setIconFlag(true);
      }
      if (panel.label) {
        setLabelFlag(true);
      }
      const panelRenderer = panel.render;
      const presetPanels = Object.values(panelNames);
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
          // preset panels may not have these explicitly set by the user
          // since they have their own defaults
          if (panelInfo.icon) {
            setIconFlag(true);
          }
          if (panelInfo.label) {
            setLabelFlag(true);
          }
        } else {
          panelsToRender[panelRenderer] = {
            ...customPanel,
            render: createCustomElement(customPanel),
            sortIndex: index,
          };
          if (customPanel.icon) {
            setIconFlag(true);
          }
          if (customPanel.label) {
            setLabelFlag(true);
          }
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

    setVisiblePanelTabs(Object.keys(panelsToRender));
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
    setOverflowItems([...overflowItems, ...items].sort((a, b) => panelsObject[a].sortIndex - panelsObject[b].sortIndex));
    const itemsToKeepVisible = visiblePanelTabs.filter((item) => !(items.includes(item)));
    setVisiblePanelTabs(itemsToKeepVisible);
  };

  const moveItemsToContainer = (items) => {
    setVisiblePanelTabs([...visiblePanelTabs, ...items]);
    const itemsToKeepInOverflow = overflowItems.filter((item) => !(items.includes(item)));
    setOverflowItems(itemsToKeepInOverflow);
  };

  const getItemsToHide = (itemsDom, missingSpace) => {
    let spaceToFree = Math.abs(missingSpace);
    const allItems = [...visiblePanelTabs];
    const itemsToHide = [];

    // Continue removing items while we need to free space
    while (spaceToFree > 0 && allItems.length > 1) {
      const lastItem = allItems.pop();
      const lastItemDom = Array.from(itemsDom).find((item) => item.getAttribute('data-element') === `${lastItem}-${tabPanelDataElement}`);
      const lastItemWidth = lastItemDom.getBoundingClientRect().width;
      const spaceFreedByItem = lastItemWidth;

      if (spaceToFree > spaceFreedByItem) {
        itemsToHide.push(lastItem);
        spaceToFree -= lastItemWidth;
        setHiddenTabsMinWidth((prev) => ({
          ...prev,
          [lastItem]: lastItemWidth,
        }));
      } else {
        break;
      }
    }
    return itemsToHide;
  };

  const getItemsToShow = (availableSpace) => {
    let spaceToFill = availableSpace;
    const allItems = [...overflowItems];
    const itemsToShow = [];

    while (spaceToFill > 0 && allItems.length > 0) {
      const firstItem = allItems[0];
      const firstItemWidth = hiddenTabsMinWidth[firstItem];
      if (spaceToFill >= firstItemWidth) {
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
    return availableSpace - PANEL_PADDING;
  };

  const handleTabPanelElements = () => {
    dispatch(actions.closeElements([FLYOUT_NAME]));
    const itemsShown = Array.from(tabPanelHeaderRef?.current?.querySelectorAll('.tabPanelButton'));
    const headerRect = tabPanelHeaderRef.current.getBoundingClientRect();
    const moreButtonWidth = moreButtonRef.current.getBoundingClientRect().width;
    const availableSpace = calculateAvailableSpace(itemsShown, headerRect);

    // when the panel is getting smaller
    if (isShrinkingPanel) {
      const minAvailableSpaceRequired = availableSpace - moreButtonWidth;
      if (minAvailableSpaceRequired < 0 && visiblePanelTabs.length > 1) {
        const itemsToHide = getItemsToHide(itemsShown, minAvailableSpaceRequired);
        if (itemsToHide.length) {
          moveItemsToOverflow(itemsToHide);
        }
      }
    } else if (availableSpace > 0 && overflowItems.length > 0) {
      const itemsToGetBack = getItemsToShow(availableSpace);
      if (itemsToGetBack.length) {
        moveItemsToContainer(itemsToGetBack);
      }
    }
    handleMoreButtonIcon();
  };

  useEffect(() => {
    setPanelsObject(getPanelsObjectToRender());
    // We set the overflow items to an empty array so we can re-calculate the overflow items when the tabs change
    setOverflowItems([]);
  }, [isPortfolioPanelDisabled, isSignaturePanelDisabled, redactionAnnotationsList]);

  useEffect(() => {
    if (!selectedTab) {
      const firstPanel = Object.keys(panelsObject)[0];
      dispatch(actions.setActiveTabInPanel(firstPanel, tabPanelDataElement));
    }
    setVisiblePanelTabs(Object.keys(panelsObject));
  }, [panelsObject]);

  useEffect(() => {
    handleMoreButtonIcon();
  }, [selectedTab]);

  useEffect(() => {
    if (headerContainerPrevWidth !== headerContainerWidth) {
      if (headerContainerWidth > headerContainerPrevWidth) {
        setIsShrinkingPanel(false);
      } else {
        setIsShrinkingPanel(true);
      }
      setHeaderContainerPrevWidth(headerContainerWidth);
    }
  }, [headerContainerWidth]);

  useEffect(() => {
    handleTabPanelElements();
    overflowItems.length > 0 && setOverflowFlyout();
  }, [
    visiblePanelTabs,
    overflowItems,
    headerContainerWidth,
  ]);

  const renderTabs = () => {
    if (visiblePanelTabs?.length) {
      return visiblePanelTabs.map((tab, index) => {
        const panelInfo = panelsObject[tab];
        const isActive = tab === selectedTab;
        return (
          <Button
            className={classNames({
              tabPanelButton: true,
              hasIcon: iconFlag,
              hasLabel: labelFlag,
              lastButton: overflowItems.length === 0 && index === visiblePanelTabs.length - 1,
            })}
            key={`${tab}-${tabPanelDataElement}`}
            isActive={isActive}
            dataElement={`${tab}-${tabPanelDataElement}`}
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
    dispatch(actions.closeElement('tabPanel'));
  };

  const childElements = <>
    <Measure
      bounds
      innerRef={tabPanelHeaderRef}
      onResize={({ bounds }) => {
        setHeaderContainerWidth(bounds.width);
      }}>
      {({ measureRef }) => (
        <>
          <div className='tabPanelTitleContainer'>
            {isMobile ? <Button className='tabPanelCloseButton' ariaLabel={t('action.close')} img='ic_close_black_24px' dataElement="tabPanelCloseButton" title={t('action.close')} onClick={closePanel} /> : undefined}
          </div>
          <div ref={measureRef} className='TabPanelHeader'>
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

  return isMobile ? (<div className='tabPanelContainer'>{childElements}</div>) : childElements;
};

TabPanel.propTypes = {
  dataElement: PropTypes.string.isRequired,
  redactionAnnotationsList: PropTypes.array,
};

export default TabPanel;