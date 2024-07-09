import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Measure from 'react-measure';
import { useTranslation } from 'react-i18next';
import selectors from 'selectors';
import actions from 'actions';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './TabPanel.scss';
import Button from 'components/Button';
import Element from 'components/Element';
import CustomElement from 'components/CustomElement';
import ToggleElementButton from 'components/ModularComponents/ToggleElementButton';
import { panelNames, panelData } from 'constants/panel';
import PortfolioPanel from 'components/PortfolioPanel';
import DataElements from 'constants/dataElement';
import core from 'core';
import useOnRedactionAnnotationChanged from 'hooks/useOnRedactionAnnotationChanged';
import LayersPanel from 'components/LayersPanel';
import TextEditingPanel from 'components/TextEditingPanel';
import MultiViewerWrapper from 'components/MultiViewer/MultiViewerWrapper';
import ComparePanel from 'components/MultiViewer/ComparePanel';
import OutlinesPanel from 'components/OutlinesPanel';
import SignaturePanel from 'components/SignaturePanel';
import BookmarksPanel from 'components/BookmarksPanel';
import FileAttachmentPanel from 'components/FileAttachmentPanel';
import ThumbnailsPanel from 'components/ThumbnailsPanel';
import StylePanel from 'components/StylePanel';
import RedactionPanel from 'components/RedactionPanel';
import SearchPanel from 'components/SearchPanel';
import NotesPanel from 'components/NotesPanel';
import SignatureListPanel from 'components/SignatureListPanel';
import RubberStampPanel from 'components/RubberStampPanel';

const TabPanel = ({ dataElement: tabPanelDataElement }) => {
  const dispatch = useDispatch();
  const [t] = useTranslation();
  const tabPanelHeaderRef = useRef();
  const moreButtonRef = useRef();
  const FLYOUT_NAME = `${tabPanelDataElement}-flyout`;
  const [panelsObject, setPanelsObject] = useState({});
  const [visiblePanelTabs, setVisiblePanelTabs] = useState([]);
  const [overflowItems, setOverflowItems] = useState([]);
  const [headerContainerPrevWidth, setHeaderContainerPrevWidth] = useState({ width: 0 });
  const [headerContainerWidth, setHeaderContainerWidth] = useState({ width: 0 });
  const moreButtonDefaultIcon = 'icon-tools-more';
  const [moreButtonIcon, setMoreButtonIcon] = useState(moreButtonDefaultIcon);
  const [labelFlag, setLabelFlag] = useState(false);
  const [iconFlag, setIconFlag] = useState(false);

  const [
    genericPanels,
    activeCustomPanel,
    flyoutMap,
    bookmarks,
    isBookmarkPanelEnabled,
    isBookmarkIconShortcutVisible,
    isPortfolioPanelDisabled,
  ] = useSelector(
    (state) => [
      selectors.getGenericPanels(state),
      selectors.getActiveCustomPanel(state, tabPanelDataElement),
      selectors.getFlyoutMap(state),
      selectors.getBookmarks(state),
      !selectors.isElementDisabled(state, DataElements.BOOKMARKS_PANEL),
      selectors.isBookmarkIconShortcutVisible(state),
      selectors.isElementDisabled(state, DataElements.PORTFOLIO_PANEL),
    ],
  );

  const { redactionAnnotationsList } = useOnRedactionAnnotationChanged();

  const panelsList = genericPanels.find((panel) => panel.dataElement === tabPanelDataElement).panelsList;

  const renderPanel = (panelName, dataElement) => {
    switch (panelName) {
      case panelNames.OUTLINE:
        return <OutlinesPanel dataElement={dataElement}/>;
      case panelNames.SIGNATURE:
        return <SignaturePanel dataElement={dataElement}/>;
      case panelNames.BOOKMARKS:
        return <BookmarksPanel dataElement={dataElement}/>;
      case panelNames.FILE_ATTACHMENT:
        return <FileAttachmentPanel dataElement={dataElement}/>;
      case panelNames.THUMBNAIL:
        return <ThumbnailsPanel panelSelector={dataElement} parentDataElement={tabPanelDataElement}/>;
      case panelNames.LAYERS:
        return <LayersPanel/>;
      case panelNames.TEXT_EDITING:
        return <TextEditingPanel dataElement={dataElement}/>;
      case panelNames.PORTFOLIO:
        return <PortfolioPanel />;
      case panelNames.CHANGE_LIST:
        return <MultiViewerWrapper><ComparePanel dataElement={dataElement}/></MultiViewerWrapper>;
      case panelNames.STYLE:
        return <StylePanel dataElement={dataElement}/>;
      case panelNames.REDACTION:
        return <RedactionPanel dataElement={dataElement} redactionAnnotationsList={redactionAnnotationsList}/>;
      case panelNames.SEARCH:
        return <SearchPanel dataElement={dataElement} parentDataElement={tabPanelDataElement}/>;
      case panelNames.NOTES:
        return <NotesPanel dataElement={dataElement} parentDataElement={tabPanelDataElement} isCustomPanel={true}
          isCustomPanelOpen={true}/>;
      case panelNames.SIGNATURE_LIST:
        return <SignatureListPanel dataElement={dataElement}/>;
      case panelNames.RUBBER_STAMP:
        return <RubberStampPanel dataElement={dataElement}/>;
      default:
        return <div></div>;
    }
  };

  const createCustomElement = (item) => {
    return <CustomElement
      key={item.dataElement}
      className={`Panel ${item.dataElement}`}
      display={item.dataElement}
      dataElement={item.dataElement}
      render={item.render}
    />;
  };

  const getPanelsObjectToRender = () => {
    const panelsToRender = {};
    panelsList?.forEach((panel, index) => {
      if (panel.render === panelNames.PORTFOLIO && isPortfolioPanelDisabled) {
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

  const handleActiveTabPanel = () => {
    if (activeCustomPanel && !visiblePanelTabs.includes(activeCustomPanel)) {
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
            dispatch(actions.setActiveCustomPanel(item, tabPanelDataElement));
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

  const getItemsToHide = (items, itemsDom, missingSpace) => {
    let spaceToFree = missingSpace;
    const allItems = [...items];
    const itemsToHide = [];
    while (spaceToFree <= 0 && allItems.length > 1) {
      const lastItem = allItems.pop();
      itemsToHide.push(lastItem);
      const lastItemDom = Array.from(itemsDom).find((item) => item.getAttribute('data-element') === `${lastItem}-${tabPanelDataElement}`);
      const lastItemSpace = lastItemDom.getBoundingClientRect().width;
      spaceToFree += (lastItemSpace);
    }
    return itemsToHide;
  };

  const calculateAvailableSpace = (itemsShown, headerRect) => {
    const lastItemRect = itemsShown[itemsShown.length - 1]?.getBoundingClientRect();
    const lastItemEnd = lastItemRect?.right || 0;
    const parentRectEnd = headerRect?.right || 0;

    return parentRectEnd - lastItemEnd;
  };

  const handleTabPanelElements = () => {
    dispatch(actions.closeElements([FLYOUT_NAME]));

    const itemsShown = Array.from(tabPanelHeaderRef?.current?.querySelectorAll('.tabPanelButton'));
    const headerRect = tabPanelHeaderRef.current.getBoundingClientRect();
    const availableSpace = calculateAvailableSpace(itemsShown, headerRect);
    const moreButtonRect = moreButtonRef.current.getBoundingClientRect();
    const sizeNeededForMoreButton = moreButtonRect.width;

    if (availableSpace < sizeNeededForMoreButton && visiblePanelTabs.length > 1) {
      const minAvailableSpaceRequired = availableSpace - sizeNeededForMoreButton;
      const itemsToHide = getItemsToHide(visiblePanelTabs, itemsShown, minAvailableSpaceRequired);
      moveItemsToOverflow(itemsToHide);
    } else if (overflowItems.length > 0) {
      const largestItem = itemsShown.reduce((largestItem, item) => {
        return largestItem.getBoundingClientRect().width > item.getBoundingClientRect().width ? largestItem : item;
      });

      const spaceForLargestItem = largestItem.getBoundingClientRect().width;
      if (availableSpace > spaceForLargestItem + sizeNeededForMoreButton) {
        moveItemsToContainer([overflowItems[0]]);
      }
    }
    handleActiveTabPanel();
  };

  useEffect(() => {
    setPanelsObject(getPanelsObjectToRender());
    // We set the overflow items to an empty array so we can re-calculate the overflow items when the tabs change
    setOverflowItems([]);
  }, [isPortfolioPanelDisabled]);

  useEffect(() => {
    handleActiveTabPanel();
  }, [activeCustomPanel]);

  useEffect(() => {
    if (!activeCustomPanel) {
      const firstPanel = Object.keys(panelsObject)[0];
      dispatch(actions.setActiveCustomPanel(firstPanel, tabPanelDataElement));
    }
    setVisiblePanelTabs(Object.keys(panelsObject));
  }, [panelsObject]);

  useEffect(() => {
    handleTabPanelElements();
    setOverflowFlyout();
  }, [
    visiblePanelTabs,
    overflowItems,
    headerContainerWidth
  ]);

  useEffect(() => {
    if (headerContainerPrevWidth !== headerContainerWidth) {
      if (headerContainerWidth > headerContainerPrevWidth) {
        if (overflowItems.length) {
          const itemsToMove = overflowItems.slice(0, 1);
          moveItemsToContainer(itemsToMove);
        }
      }
      setHeaderContainerPrevWidth(headerContainerWidth);
    }
  }, [headerContainerWidth]);

  useEffect(() => {
    if (isBookmarkPanelEnabled) {
      core.setBookmarkShortcutToggleOnFunction((pageIndex) => {
        dispatch(actions.addBookmark(pageIndex, t('message.untitled')));
      });
      core.setBookmarkShortcutToggleOffFunction((pageIndex) => {
        dispatch(actions.removeBookmark(pageIndex));
      });
      core.setUserBookmarks(Object.keys(bookmarks).map((pageIndex) => parseInt(pageIndex, 10)));
    }
  }, [isBookmarkPanelEnabled, bookmarks]);

  useEffect(() => {
    if (isBookmarkPanelEnabled && isBookmarkIconShortcutVisible) {
      core.setBookmarkIconShortcutVisibility(true);
    } else {
      core.setBookmarkIconShortcutVisibility(false);
    }
  }, [isBookmarkPanelEnabled, isBookmarkIconShortcutVisible]);

  const renderTabs = () => {
    if (visiblePanelTabs?.length) {
      return visiblePanelTabs.map((tab, index) => {
        const panelInfo = panelsObject[tab];
        return (
          <Button
            className={classNames({
              tabPanelButton: true,
              hasIcon: iconFlag,
              hasLabel: labelFlag,
              lastButton: overflowItems.length === 0 && index === visiblePanelTabs.length - 1,
            })}
            key={`${tab}-${tabPanelDataElement}`}
            isActive={tab === activeCustomPanel}
            dataElement={`${tab}-${tabPanelDataElement}`}
            img={panelInfo.icon}
            onClick={() => dispatch(actions.setActiveCustomPanel(tab, tabPanelDataElement))}
            title={panelInfo.title}
            label={panelInfo.label}
          />
        );
      });
    }
  };

  const getActivePanelRender = () => {
    const activePanel = panelsObject[activeCustomPanel];
    return activePanel?.render;
  };

  return (
    <>
      <Measure
        bounds
        innerRef={tabPanelHeaderRef}
        onResize={({ bounds }) => {
          setHeaderContainerWidth(bounds.width);
        }}>
        {({ measureRef }) => (
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
        )}
      </Measure>
      {getActivePanelRender()}
    </>
  );
};

TabPanel.propTypes = {
  dataElement: PropTypes.string.isRequired,
};

export default TabPanel;