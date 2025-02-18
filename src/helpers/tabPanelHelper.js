import React from 'react';
import { panelNames } from 'constants/panel';
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
import SearchPanel from 'components/SearchPanel';
import NotesPanel from 'components/NotesPanel';
import SignatureListPanel from 'components/SignatureListPanel';
import RubberStampPanel from 'components/RubberStampPanel';
import PortfolioPanel from 'components/PortfolioPanel';
import CustomElement from 'components/CustomElement';


export const getPanelToRender = (panelName, dataElement, tabPanelDataElement) => {
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

export const createCustomElement = (item) => {
  return <CustomElement
    key={item.dataElement}
    className={`Panel ${item.dataElement}`}
    display={item.dataElement}
    dataElement={item.dataElement}
    render={item.render}
  />;
};

export const getEnabledPanels = (paramsObject) => {
  const { panelsList, disabledElements, tabPanelDataElement } = paramsObject;
  const enabledPanels = panelsList.filter((panel) => {
    const isPanelDisabled = disabledElements[panel.render]?.disabled;
    const isPanelTabDisabled = disabledElements[`${panel.render}-${tabPanelDataElement}`]?.disabled;
    return !isPanelDisabled && !isPanelTabDisabled;
  });
  return enabledPanels;
};