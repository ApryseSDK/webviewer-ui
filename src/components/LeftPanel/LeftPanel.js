import React, { useEffect } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useTranslation } from 'react-i18next';

import LeftPanelTabs from 'components/LeftPanelTabs';
import PortfolioPanel from 'components/PortfolioPanel';
import ThumbnailsPanel from 'components/ThumbnailsPanel';
import OutlinesPanel from 'components/OutlinesPanel';
import BookmarksPanel from 'components/BookmarksPanel';
import LayersPanel from 'components/LayersPanel';
import FileAttachmentPanel from 'components/FileAttachmentPanel';
import SignaturePanel from 'components/SignaturePanel';
import CustomElement from 'components/CustomElement';
import ResizeBar from 'components/ResizeBar';
import Icon from 'components/Icon';
import NotesPanel from 'components/NotesPanel';

import core from 'core';
import selectors from 'selectors';
import actions from 'actions';
import { isMobileSize, isTabletAndMobileSize } from 'helpers/getDeviceSize';
import { isIE } from 'helpers/device';
import DataElements from 'constants/dataElement';

import './LeftPanel.scss';

const LeftPanel = () => {
  const isMobile = isMobileSize();
  const isTabletAndMobile = isTabletAndMobileSize();

  const [
    currentToolbarGroup,
    isHeaderOpen,
    isToolsHeaderOpen,
    isOfficeEditorToolsHeaderOpen,
    isOpen,
    isDisabled,
    activePanel,
    customPanels,
    currentWidth,
    notesInLeftPanel,
    isInDesktopOnlyMode,
    bookmarks,
    isBookmarkPanelEnabled,
    isBookmarkIconShortcutVisible,
    isMultiTabActive,
    isLogoBarEnabled,
    featureFlags,
    topHeadersHeight,
    bottomHeadersHeight,
    portfolioFiles,
    isOfficeEditorMode,
  ] = useSelector(
    (state) => [
      selectors.getCurrentToolbarGroup(state),
      selectors.isElementOpen(state, 'header'),
      selectors.isElementOpen(state, 'toolsHeader'),
      selectors.isElementOpen(state, 'officeEditorToolsHeader'),
      selectors.isElementOpen(state, DataElements.LEFT_PANEL),
      selectors.isElementDisabled(state, DataElements.LEFT_PANEL),
      selectors.getActiveLeftPanel(state),
      selectors.getCustomPanels(state),
      selectors.getLeftPanelWidth(state),
      selectors.getNotesInLeftPanel(state),
      selectors.isInDesktopOnlyMode(state),
      selectors.getBookmarks(state),
      !selectors.isElementDisabled(state, DataElements.BOOKMARK_PANEL),
      selectors.isBookmarkIconShortcutVisible(state),
      selectors.getIsMultiTab(state),
      !selectors.isElementDisabled(state, DataElements.LOGO_BAR),
      selectors.getFeatureFlags(state),
      selectors.getTopHeadersHeight(state),
      selectors.getBottomHeadersHeight(state),
      selectors.getPortfolio(state),
      selectors.getIsOfficeEditorMode(state),
    ],
    shallowEqual,
  );

  const minWidth = 264;
  const dispatch = useDispatch();
  const [t] = useTranslation();

  const onDrop = (e) => {
    // this is mainly for the thumbnail panel, to prevent the broswer from loading a document that dropped in
    e.preventDefault();
  };

  const onDragOver = (e) => {
    // when dragging over the "LeftPanel", change the cursor to "Move" from "Copy"
    e.preventDefault();
  };

  const getDisplay = (panel) => (panel === activePanel ? 'flex' : 'none');

  let style = {};
  if (isInDesktopOnlyMode || !isMobile) {
    style = { width: `${currentWidth}px`, minWidth: `${currentWidth}px` };
  }

  const isVisible = !(!isOpen || isDisabled);

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

  // TODO: For whoever is refactoring the LeftPanel to make it generic, review if this is the best approach
  // Once we move to the new UI we can remove the legacy stuff
  const legacyToolsHeaderOpen = isToolsHeaderOpen && currentToolbarGroup !== 'toolbarGroup-View';
  const legacyAllHeadersHidden = !isHeaderOpen && !legacyToolsHeaderOpen;

  const { customizableUI } = featureFlags;
  const wrapperStyle = {
    // prevent panel from appearing until scss is loaded
    display: 'none',
  };
  // Calculating its height according to the existing horizontal modular headers
  if (customizableUI) {
    const horizontalHeadersHeight = topHeadersHeight + bottomHeadersHeight;
    wrapperStyle['height'] = `calc(100% - ${horizontalHeadersHeight}px)`;
  }

  return (
    <div
      className={classNames({
        Panel: true,
        LeftPanel: true,
        'closed': !isVisible,
        'tools-header-open': legacyToolsHeaderOpen || isOfficeEditorToolsHeaderOpen,
        'tools-header-and-header-hidden': legacyAllHeadersHidden,
        'thumbnail-panel-active': activePanel === 'thumbnailsPanel',
        'outlines-panel-active': activePanel === 'outlinesPanel',
        'multi-tab-active': isMultiTabActive,
        'logo-bar-enabled': isLogoBarEnabled,
        'tracked-change-active': isOfficeEditorMode,
      })}
      onDrop={onDrop}
      onDragOver={onDragOver}
      data-element={DataElements.LEFT_PANEL}
      style={wrapperStyle}
    >
      <div
        className="left-panel-container"
        style={style}
      >
        {!isInDesktopOnlyMode && isMobile &&
          <div
            className="close-container"
          >
            <div
              className="close-icon-container"
              onClick={() => {
                dispatch(actions.closeElements(['leftPanel']));
              }}
            >
              <Icon
                glyph="ic_close_black_24px"
                className="close-icon"
              />
            </div>
          </div>
        }
        {isOfficeEditorMode ?
          <NotesPanel currentLeftPanelWidth={currentWidth} />
          :
          <>
            <div className="left-panel-header">
              <LeftPanelTabs showPortfolio={portfolioFiles.length > 0} />
            </div>
            {activePanel === DataElements.PORTFOLIO_PANEL
              && core.isFullPDFEnabled()
              && portfolioFiles.length > 0
              && <PortfolioPanel />}
            {activePanel === 'thumbnailsPanel' && <ThumbnailsPanel />}
            {activePanel === 'outlinesPanel' && <OutlinesPanel />}
            {activePanel === 'bookmarksPanel' && <BookmarksPanel />}
            {activePanel === 'layersPanel' && <LayersPanel />}
            {core.isFullPDFEnabled() && activePanel === 'signaturePanel' && <SignaturePanel />}
            {activePanel === 'attachmentPanel' && <FileAttachmentPanel />}
            {notesInLeftPanel && activePanel === 'notesPanel' && (
              <NotesPanel currentLeftPanelWidth={currentWidth} />
            )}
            {customPanels.map(({ panel }, index) => (
              <CustomElement
                key={panel.dataElement || index}
                className={`Panel ${panel.dataElement}`}
                display={getDisplay(panel.dataElement)}
                dataElement={panel.dataElement}
                render={panel.render}
              />
            ))}
          </>
        }
      </div>
      {(isInDesktopOnlyMode || !isTabletAndMobile) &&
        <ResizeBar
          dataElement="leftPanelResizeBar"
          minWidth={minWidth}
          onResize={(_width) => {
            let maxAllowedWidth = window.innerWidth;
            // there will be a scroll bar in IE, so we don't allow 100% page width
            if (isIE) {
              maxAllowedWidth -= 30;
            }
            dispatch(actions.setLeftPanelWidth(Math.min(_width, maxAllowedWidth)));
          }}
        />}
    </div>
  );
};

export default LeftPanel;
