import React, { useEffect } from 'react';
import AnnotationPopup from './AnnotationPopup';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import getAnnotationStyles from 'src/helpers/getAnnotationStyles';
import core from 'core';
import { BASIC_PALETTE } from 'constants/commonColors';
import initialState from 'src/redux/initialState';
import { disableRtlModeParameters, mobileStoryParameters } from 'helpers/storybookParams';
import AnnotationPopupContainer from './AnnotationPopupContainer';
const noop = () => { };

export default {
  title: 'Components/AnnotationPopup',
  component: AnnotationPopup,
};

const mockInitialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
    modularPopups: initialState.viewer.modularPopups,
    genericPanels: [],
    customPanels: [],
    unreadAnnotationIdSet: new Set(),
    colorMap: [{ colorMapKey: () => BASIC_PALETTE[0] }],
    openElements: {
      annotationPopup: true,
      stylePopupTextStyleContainer: false,
    },
    activeDocumentViewerKey: 1,
  },
  featureFlags: {
    customizableUI: true,
  },
};

const mockAnnotation = {
  Author: 'Mikel Landa',
  getReplies: () => [],
  getStatus: () => '',
  isReply: () => false,
  getAssociatedNumber: () => 1,
  getContents: noop,
  getCustomData: () => '',
  getAttachments: noop,
  getRichTextStyle: noop,
  ToolName: '',
  Opacity: 1,
  StrokeThickness: 1,
  isContentEditPlaceholder: () => false,
};

const basicHorizontalProps = {
  isOpen: true,
  isRightClickMenu: false,
  focusedAnnotation: mockAnnotation,
  position: { top: 0, left: 0 },
  showCommentButton: true,
  onCommentAnnotation: () => console.log('Comment'),
  showEditStyleButton: true,
  annotationStyle: getAnnotationStyles(mockAnnotation),
  showLinkButton: true,
  linkAnnotationToURL: () => console.log('Link'),
  showDeleteButton: true,
  onDeleteAnnotation: () => console.log('Delete'),
};


export const BasicHorizontal = () => {
  return (
    <Provider store={configureStore({ reducer: () => mockInitialState })}>
      <AnnotationPopup {...basicHorizontalProps} />
    </Provider>
  );
};

const basicVerticalProps = {
  ...basicHorizontalProps,
  isRightClickMenu: true,
};

export const BasicVertical = () => {
  return (
    <Provider store={configureStore({ reducer: () => mockInitialState })}>
      <AnnotationPopup {...basicVerticalProps} />
    </Provider>
  );
};

BasicVertical.parameters = disableRtlModeParameters;

export const IsReadOnlyMode = (props) => {
  core.getIsReadOnly = () => true;
  let annotationProps;
  if (Object.keys(props).length) {
    annotationProps = props;
  } else {
    annotationProps = basicHorizontalProps;
  }

  return (
    <Provider store={configureStore({ reducer: () => mockInitialState })}>
      <AnnotationPopup {...annotationProps} />
    </Provider>
  );
};

IsReadOnlyMode.parameters = disableRtlModeParameters;

const readOnlySignatureAnnotationProps = {
  isOpen: true,
  isRightClickMenu: false,
  focusedAnnotation: mockAnnotation,
  position: { top: 0, left: 0 },
  showCommentButton: false,
  onCommentAnnotation: () => console.log('Comment'),
  showEditStyleButton: false,
  annotationStyle: getAnnotationStyles(mockAnnotation),
  showLinkButton: false,
  linkAnnotationToURL: () => console.log('Link'),
  showDeleteButton: false,
  showClearSignatureButton: true,
  onDeleteAnnotation: () => console.log('Delete'),
  isAppearanceSignature: true
};

export const SignatureReadOnlyPopUp = () => {
  return (
    <Provider store={configureStore({ reducer: () => mockInitialState })}>
      <AnnotationPopup {...readOnlySignatureAnnotationProps} />
    </Provider>
  );
};

SignatureReadOnlyPopUp.parameters = disableRtlModeParameters;

const readOnlySignatureAnnotationPropsDisabled = {
  ...readOnlySignatureAnnotationProps,
  isRightClickMenu: true,
};

export const SignatureReadOnlyDisablePopUp = () => {
  return (
    <Provider store={configureStore({ reducer: () => mockInitialState })}>
      <AnnotationPopup {...readOnlySignatureAnnotationPropsDisabled} />
    </Provider>
  );
};

SignatureReadOnlyDisablePopUp.parameters = disableRtlModeParameters;

export const CustomizedAnnotationPopup = () => {
  const stateWithMockedPopups = {
    viewer: {
      disabledElements: {},
      customElementOverrides: {},
      modularPopups: {
        ...initialState.viewer.modularPopups,
        annotationPopup: [
          { dataElement: 'viewFileButton', type: 'customButton', onClick: () => {}, img: 'icon-view', title: 'View File' },
          { dataElement: 'commentcustomButton', type: 'customButton', onClick: () => {}, img: 'icon-unposted-comment', title: 'Comment' },
          { dataElement: 'stylePanelToggle', type: 'toggleButton', img: 'icon-style-panel-toggle', title: 'Edit Style' },
          { dataElement: 'statefulButton',
            type: 'statefulButton',
            mount: () =>{},
            initialState: 'SinglePage',
            className: 'stateful-button',
            states: {
              SinglePage: {
                img: 'icon-header-page-manipulation-page-layout-single-page-line',
                onClick: (update) => {
                  update('DoublePage');
                },
                title: 'Single Page',
              },
              DoublePage: {
                img: 'icon-header-page-manipulation-page-layout-double-page-line',
                onClick: (update) => {
                  update('SinglePage');
                },
                title: 'Double Page',
              },
            },
          },
        ]
      },
      customPanels: [],
      unreadAnnotationIdSet: new Set(),
      colorMap: [{ colorMapKey: () => BASIC_PALETTE[0] }],
      openElements: {
        stylePopupTextStyleContainer: false,
      },
      activeDocumentViewerKey: 1,
    },
    featureFlags: {
      customizableUI: true,
    },
  };
  return (
    <Provider store={configureStore({ reducer: () => stateWithMockedPopups })}>
      <AnnotationPopup {...basicHorizontalProps} />
    </Provider>
  );
};

CustomizedAnnotationPopup.parameters = disableRtlModeParameters;

export const AnnotationPopupMobileWithMultipleSelectedAnnotations = () => {
  useEffect(() => {
    const originalGetSelectedAnnotations = core.getSelectedAnnotations;
    const originalGetNumberOfGroups = core.getNumberOfGroups;
    core.getSelectedAnnotations = () => [mockAnnotation, { ...mockAnnotation }];
    core.getNumberOfGroups = () => 2;
    return () => {
      core.getSelectedAnnotations = originalGetSelectedAnnotations;
      core.getNumberOfGroups = originalGetNumberOfGroups;
    };
  }, []);

  const props = {
    focusedAnnotation: mockAnnotation,
    selectedMultipleAnnotations: true,
    canModify: true,
    focusedAnnotationStyle: {},
    isDatePickerOpen: false,
    setDatePickerOpen: () => {},
    isDatePickerMount: false,
    setDatePickerMount: () => {},
    hasAssociatedLink: false,
    includesFormFieldAnnotation: false,
    closePopup: () => {},
    widgetThatOpenedPopupRef: {},
  };
  return (
    <Provider store={configureStore({ reducer: (state = mockInitialState) => state })}>
      <AnnotationPopupContainer {...props} />
    </Provider>
  );
};

AnnotationPopupMobileWithMultipleSelectedAnnotations.parameters = {
  ...mobileStoryParameters,
  ...disableRtlModeParameters
};