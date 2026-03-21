import React from 'react';
import MobilePanelWrapper from './MobilePanelWrapper';
import { isMobileSize } from 'helpers/getDeviceSize';
import { MockApp } from 'src/helpers/storybookHelper';
import { mockSavedSignatures } from 'src/components/SignatureStylePopup/mockedSignatures';
import initialState from 'src/redux/initialState';
import { mockHeadersNormalized, mockModularComponents } from '../AppStories/mockAppState';
import { mobileStoryParameters, mobileStoryGlobals } from 'helpers/storybookParams';

const mobileWarningStyle = {
  height: '100vh',
  width: '100vw',
  backgroundColor: 'red',
  opacity: '15%',
  textAlign: 'center',
  alignItems: 'center',
  justifyContent: 'center',
  display: 'flex',
};

const renderMobileOnly = (content) => {
  if (!isMobileSize()) {
    return (
      <div style={mobileWarningStyle}>
        VIEW THIS STORY IN MOBILE MODE
      </div>
    );
  }
  return content;
};

export default {
  title: 'ModularComponents/MobilePanel',
  component: MobilePanelWrapper,
  parameters: {
    ...mobileStoryParameters,
    customizableUI: true,
    chromatic: {
      delay: 2000,
      modes: {
        'Light theme RTL': { disable: true },
      },
    },
  },
  globals: mobileStoryGlobals,
};

const createMobileState = (panelName, viewerOverrides = {}) => ({
  ...initialState,
  viewer: {
    ...initialState.viewer,
    bookmarkIconShortcutVisibility: false,
    openElements: {
      ...initialState.viewer.openElements,
      contextMenuPopup: false,
      MobilePanelWrapper: true,
      [panelName]: true,
    },
    activeTabInPanel: {
      ...initialState.viewer.activeTabInPanel,
      tabPanel: panelName,
    },
    savedSignatures: [...mockSavedSignatures],
    ...viewerOverrides,
  },
  featureFlags: {
    ...initialState.featureFlags,
    customizableUI: true,
  },
});

const renderMobileApp = (panelName, viewerOverrides) => (
  renderMobileOnly(
    <MockApp initialState={createMobileState(panelName, viewerOverrides)} />
  )
);

export const MobilePanelWithOutlinePanel = () => renderMobileApp('outlinesPanel');

export const MobilePanelWithBookmarksPanel = () => renderMobileApp('bookmarksPanel');

export const MobilePanelWithFileAttachmentPanel = () => renderMobileApp('fileAttachmentPanel');

export const MobilePanelWithThumbnailsPanel = () => renderMobileApp('thumbnailsPanel');

export const MobilePanelWithLayersPanel = () => renderMobileApp('layersPanel');

export const MobilePanelWithSignatureListPanelEmpty = () => (
  renderMobileOnly(
    <MockApp
      initialState={createMobileState('signatureListPanel', {
        savedSignatures: [],
      })}
    />
  )
);

export const MobilePanelWithSignatureListPanelWithSignatures = () => (
  renderMobileOnly(
    <MockApp
      initialState={createMobileState('signatureListPanel', {
        activeCustomRibbon: 'toolbarGroup-Insert',
        modularHeaders: mockHeadersNormalized,
        modularComponents: mockModularComponents,
        isInDesktopOnlyMode: false,
        activeGroupedItems: [
          'insertGroupedItems',
          'insertToolsGroupedItems',
          'defaultAnnotationUtilities',
        ],
        activeToolName: 'AnnotationCreateSignature',
      })}
    />
  )
);

export const MobilePanelWithCustomPanel = () => (
  renderMobileOnly(
    <MockApp
      initialState={createMobileState('customMainPanel', {
        genericPanels: [
          ...initialState.viewer.genericPanels,
          {
            dataElement: 'customMainPanel',
            render: 'thumbnailsPanel',
          },
        ],
      })}
    />
  )
);
