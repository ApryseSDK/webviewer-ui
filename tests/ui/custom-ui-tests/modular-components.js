export const testUI = {
  'modularComponents': {
    'comparePanelToggle': {
      'dataElement': 'comparePanelToggle',
      'title': 'action.comparePages',
      'label': 'action.comparePages',
      'type': 'presetButton',
      'buttonType': 'compareButton',
      'disabled': true
    },
    'filePickerButton': {
      'dataElement': 'filePickerButton',
      'title': 'action.openFile',
      'label': 'action.openFile',
      'type': 'presetButton',
      'disabled': true
    },
    'downloadButton': {
      'dataElement': 'downloadButton',
      'title': 'action.download',
      'label': 'action.download',
      'type': 'presetButton'
    },
    'saveAsButton': {
      'dataElement': 'saveAsButton',
      'title': 'saveModal.saveAs',
      'isActive': false,
      'label': 'saveModal.saveAs',
      'type': 'presetButton'
    },
    'printButton': {
      'dataElement': 'printButton',
      'title': 'action.print',
      'isActive': false,
      'label': 'action.print',
      'type': 'presetButton'
    },
    'createPortfolioButton': {
      'dataElement': 'createPortfolioButton',
      'title': 'portfolio.createPDFPortfolio',
      'isActive': false,
      'label': 'portfolio.createPDFPortfolio',
      'type': 'presetButton',
      'disabled': true
    },
    'settingsButton': {
      'dataElement': 'settingsButton',
      'title': 'option.settings.settings',
      'isActive': false,
      'label': 'option.settings.settings',
      'type': 'presetButton'
    },
    'divider-0.1': {
      'dataElement': 'divider-0.1',
      'type': 'divider'
    },
    'leftPanelButton': {
      'dataElement': 'leftPanelButton',
      'title': 'Left Panel',
      'type': 'toggleButton',
      'img': 'icon-header-sidebar-line',
      'toggleElement': 'tabPanel'
    },
    'view-controls': {
      'dataElement': 'view-controls',
      'type': 'viewControls',
      'title': 'component.viewControls',
      'icon': 'icon-header-page-manipulation-line'
    },
    'divider-0.3': {
      'dataElement': 'divider-0.3',
      'type': 'divider'
    },
    'zoom-container': {
      'dataElement': 'zoom-container',
      'type': 'zoom'
    },
    'divider-0.2': {
      'dataElement': 'divider-0.2',
      'type': 'divider'
    },
    'panToolButton': {
      'dataElement': 'panToolButton',
      'type': 'toolButton',
      'toolName': 'Pan'
    },
    'annotationEditToolButton': {
      'dataElement': 'annotationEditToolButton',
      'type': 'toolButton',
      'toolName': 'AnnotationEdit'
    },
    'menuButton': {
      'dataElement': 'menuButton',
      'img': 'ic-hamburger-menu',
      'title': 'component.menuOverlay',
      'toggleElement': 'MainMenuFlyout',
      'type': 'toggleButton'
    },
    'groupedLeftHeaderButtons': {
      'dataElement': 'groupedLeftHeaderButtons',
      'items': [
        'menuButton',
        'divider-0.1',
        'leftPanelButton',
        'view-controls',
        'divider-0.3',
        'zoom-container',
        'divider-0.2',
        'panToolButton',
        'annotationEditToolButton'
      ],
      'type': 'groupedItems',
      'grow': 1,
      'gap': 12,
      'alwaysVisible': true
    },
    'toolbarGroup-View': {
      'dataElement': 'toolbarGroup-View',
      'title': 'View',
      'type': 'ribbonItem',
      'label': 'View',
      'groupedItems': [],
      'toolbarGroup': 'toolbarGroup-View'
    },
    'toolbarGroup-Annotate': {
      'dataElement': 'toolbarGroup-Annotate',
      'title': 'Annotate',
      'type': 'ribbonItem',
      'label': 'Annotate',
      'groupedItems': [
        'annotateGroupedItems'
      ],
      'toolbarGroup': 'toolbarGroup-Annotate'
    },
    'toolbarGroup-Shapes': {
      'dataElement': 'toolbarGroup-Shapes',
      'title': 'Shapes',
      'type': 'ribbonItem',
      'label': 'Shapes',
      'groupedItems': [
        'shapesGroupedItems'
      ],
      'toolbarGroup': 'toolbarGroup-Shapes'
    },
    'toolbarGroup-Insert': {
      'dataElement': 'toolbarGroup-Insert',
      'title': 'Insert',
      'type': 'ribbonItem',
      'label': 'Insert',
      'groupedItems': [
        'insertGroupedItems'
      ],
      'toolbarGroup': 'toolbarGroup-Insert'
    },
    'toolbarGroup-Measure': {
      'dataElement': 'toolbarGroup-Measure',
      'title': 'Measure',
      'type': 'ribbonItem',
      'label': 'Measure',
      'groupedItems': [
        'measureGroupedItems'
      ],
      'toolbarGroup': 'toolbarGroup-Measure',
      'disabled': true
    },
    'toolbarGroup-Redact': {
      'dataElement': 'toolbarGroup-Redact',
      'title': 'Redact',
      'type': 'ribbonItem',
      'label': 'Redact',
      'groupedItems': [
        'redactionGroupedItems'
      ],
      'toolbarGroup': 'toolbarGroup-Redact',
      'disabled': true
    },
    'toolbarGroup-Edit': {
      'dataElement': 'toolbarGroup-Edit',
      'title': 'Edit',
      'type': 'ribbonItem',
      'label': 'Edit',
      'groupedItems': [
        'editGroupedItems'
      ],
      'toolbarGroup': 'toolbarGroup-Edit'
    },
    'toolbarGroup-EditText': {
      'dataElement': 'toolbarGroup-EditText',
      'title': 'Content Edit',
      'type': 'ribbonItem',
      'label': 'Content Edit',
      'groupedItems': [
        'contentEditGroupedItems'
      ],
      'toolbarGroup': 'toolbarGroup-EditText',
      'disabled': true
    },
    'toolbarGroup-FillAndSign': {
      'dataElement': 'toolbarGroup-FillAndSign',
      'title': 'Fill and Sign',
      'type': 'ribbonItem',
      'label': 'Fill and Sign',
      'groupedItems': [
        'fillAndSignGroupedItems'
      ],
      'toolbarGroup': 'toolbarGroup-FillAndSign'
    },
    'toolbarGroup-Forms': {
      'dataElement': 'toolbarGroup-Forms',
      'title': 'Forms',
      'type': 'ribbonItem',
      'label': 'Forms',
      'groupedItems': [
        'formsGroupedItems'
      ],
      'toolbarGroup': 'toolbarGroup-Forms'
    },
    'default-ribbon-group': {
      'dataElement': 'default-ribbon-group',
      'items': [
        'toolbarGroup-View',
        'toolbarGroup-Annotate',
        'toolbarGroup-Shapes',
        'toolbarGroup-Insert',
        'toolbarGroup-Measure',
        'toolbarGroup-Redact',
        'toolbarGroup-Edit',
        'toolbarGroup-EditText',
        'toolbarGroup-FillAndSign',
        'toolbarGroup-Forms'
      ],
      'type': 'ribbonGroup',
      'justifyContent': 'start',
      'grow': 2,
      'gap': 12,
      'alwaysVisible': false
    },
    'searchPanelToggle': {
      'dataElement': 'searchPanelToggle',
      'title': 'component.searchPanel',
      'type': 'toggleButton',
      'img': 'icon-header-search',
      'toggleElement': 'searchPanel'
    },
    'notesPanelToggle': {
      'dataElement': 'notesPanelToggle',
      'title': 'component.notesPanel',
      'type': 'toggleButton',
      'img': 'icon-header-chat-line',
      'toggleElement': 'notesPanel'
    },
    'highlightToolButton': {
      'dataElement': 'highlightToolButton',
      'type': 'toolButton',
      'toolName': 'AnnotationCreateTextHighlight'
    },
    'underlineToolButton': {
      'dataElement': 'underlineToolButton',
      'type': 'toolButton',
      'toolName': 'AnnotationCreateTextUnderline'
    },
    'strikeoutToolButton': {
      'dataElement': 'strikeoutToolButton',
      'type': 'toolButton',
      'toolName': 'AnnotationCreateTextStrikeout'
    },
    'squigglyToolButton': {
      'dataElement': 'squigglyToolButton',
      'type': 'toolButton',
      'toolName': 'AnnotationCreateTextSquiggly'
    },
    'freeTextToolButton': {
      'dataElement': 'freeTextToolButton',
      'type': 'toolButton',
      'toolName': 'AnnotationCreateFreeText'
    },
    'markInsertTextToolButton': {
      'dataElement': 'markInsertTextToolButton',
      'type': 'toolButton',
      'toolName': 'AnnotationCreateMarkInsertText'
    },
    'markReplaceTextToolButton': {
      'dataElement': 'markReplaceTextToolButton',
      'type': 'toolButton',
      'toolName': 'AnnotationCreateMarkReplaceText'
    },
    'freeHandToolButton': {
      'dataElement': 'freeHandToolButton',
      'type': 'toolButton',
      'toolName': 'AnnotationCreateFreeHand'
    },
    'freeHandHighlightToolButton': {
      'dataElement': 'freeHandHighlightToolButton',
      'type': 'toolButton',
      'toolName': 'AnnotationCreateFreeHandHighlight'
    },
    'stickyToolButton': {
      'dataElement': 'stickyToolButton',
      'type': 'toolButton',
      'toolName': 'AnnotationCreateSticky'
    },
    'calloutToolButton': {
      'dataElement': 'calloutToolButton',
      'type': 'toolButton',
      'toolName': 'AnnotationCreateCallout'
    },
    'divider-0.4': {
      'dataElement': 'divider-0.4',
      'type': 'divider'
    },
    'stylePanelToggle': {
      'dataElement': 'stylePanelToggle',
      'title': 'action.style',
      'type': 'toggleButton',
      'img': 'icon-style-panel-toggle',
      'toggleElement': 'stylePanel'
    },
    'indexPanelListToggle': {
      'dataElement': 'indexPanelListToggle',
      'title': 'component.indexPanel',
      'type': 'toggleButton',
      'img': 'icon-index-panel-list',
      'toggleElement': 'indexPanel'
    },
    'divider-0.5': {
      'dataElement': 'divider-0.5',
      'type': 'divider'
    },
    'undoButton': {
      'dataElement': 'undoButton',
      'type': 'presetButton',
      'buttonType': 'undoButton'
    },
    'redoButton': {
      'dataElement': 'redoButton',
      'type': 'presetButton',
      'buttonType': 'redoButton'
    },
    'eraserToolButton': {
      'dataElement': 'eraserToolButton',
      'type': 'toolButton',
      'toolName': 'AnnotationEraserTool'
    },
    'defaultAnnotationUtilities': {
      'dataElement': 'defaultAnnotationUtilities',
      'items': [
        'divider-0.5',
        'undoButton',
        'redoButton',
        'eraserToolButton'
      ],
      'type': 'groupedItems',
      'grow': 0,
      'gap': 12,
      'alwaysVisible': false
    },
    'annotateToolsGroupedItems': {
      'dataElement': 'annotateToolsGroupedItems',
      'items': [
        'highlightToolButton',
        'underlineToolButton',
        'strikeoutToolButton',
        'squigglyToolButton',
        'freeHandToolButton',
        'freeHandHighlightToolButton',
        'freeTextToolButton',
        'markInsertTextToolButton',
        'markReplaceTextToolButton',
        'stickyToolButton',
        'calloutToolButton'
      ],
      'type': 'groupedItems',
      'justifyContent': 'center',
      'grow': 0,
      'gap': 12,
      'alwaysVisible': false
    },
    'annotateGroupedItems': {
      'dataElement': 'annotateGroupedItems',
      'items': [
        'annotateToolsGroupedItems',
        'divider-0.4',
        'stylePanelToggle',
        'defaultAnnotationUtilities'
      ],
      'type': 'groupedItems',
      'justifyContent': 'center',
      'grow': 0,
      'gap': 12,
      'alwaysVisible': false
    },
    'rectangleToolButton': {
      'dataElement': 'rectangleToolButton',
      'type': 'toolButton',
      'toolName': 'AnnotationCreateRectangle'
    },
    'ellipseToolButton': {
      'dataElement': 'ellipseToolButton',
      'type': 'toolButton',
      'toolName': 'AnnotationCreateEllipse'
    },
    'arcToolButton': {
      'dataElement': 'arcToolButton',
      'type': 'toolButton',
      'toolName': 'AnnotationCreateArc'
    },
    'polygonToolButton': {
      'dataElement': 'polygonToolButton',
      'type': 'toolButton',
      'toolName': 'AnnotationCreatePolygon'
    },
    'cloudToolButton': {
      'dataElement': 'cloudToolButton',
      'type': 'toolButton',
      'toolName': 'AnnotationCreatePolygonCloud'
    },
    'lineToolButton': {
      'dataElement': 'lineToolButton',
      'type': 'toolButton',
      'toolName': 'AnnotationCreateLine'
    },
    'polylineToolButton': {
      'dataElement': 'polylineToolButton',
      'type': 'toolButton',
      'toolName': 'AnnotationCreatePolyline'
    },
    'arrowToolButton': {
      'dataElement': 'arrowToolButton',
      'type': 'toolButton',
      'toolName': 'AnnotationCreateArrow'
    },
    'shapesToolsGroupedItems': {
      'dataElement': 'shapesToolsGroupedItems',
      'items': [
        'rectangleToolButton',
        'ellipseToolButton',
        'arcToolButton',
        'polygonToolButton',
        'cloudToolButton',
        'lineToolButton',
        'polylineToolButton',
        'arrowToolButton'
      ],
      'type': 'groupedItems',
      'grow': 0,
      'gap': 12,
      'alwaysVisible': false
    },
    'shapesGroupedItems': {
      'dataElement': 'shapesGroupedItems',
      'items': [
        'shapesToolsGroupedItems',
        'divider-0.4',
        'stylePanelToggle',
        'defaultAnnotationUtilities'
      ],
      'type': 'groupedItems',
      'grow': 0,
      'gap': 12,
      'alwaysVisible': false
    },
    'rubberStampToolButton': {
      'dataElement': 'rubberStampToolButton',
      'type': 'toolButton',
      'toolName': 'AnnotationCreateRubberStamp'
    },
    'signatureCreateToolButton': {
      'dataElement': 'signatureCreateToolButton',
      'type': 'toolButton',
      'toolName': 'AnnotationCreateSignature'
    },
    'fileAttachmentButton': {
      'dataElement': 'fileAttachmentButton',
      'type': 'toolButton',
      'toolName': 'AnnotationCreateFileAttachment'
    },
    'stampToolButton': {
      'dataElement': 'stampToolButton',
      'type': 'toolButton',
      'toolName': 'AnnotationCreateStamp'
    },
    'insertToolsGroupedItems': {
      'dataElement': 'insertToolsGroupedItems',
      'items': [
        'rubberStampToolButton',
        'signatureCreateToolButton',
        'fileAttachmentButton',
        'stampToolButton'
      ],
      'type': 'groupedItems',
      'grow': 0,
      'gap': 12,
      'alwaysVisible': false
    },
    'insertGroupedItems': {
      'dataElement': 'insertGroupedItems',
      'items': [
        'insertToolsGroupedItems',
        'divider-0.4',
        'stylePanelToggle',
        'defaultAnnotationUtilities'
      ],
      'type': 'groupedItems',
      'grow': 0,
      'gap': 12,
      'alwaysVisible': false
    },
    'redactionToolButton': {
      'dataElement': 'redactionToolButton',
      'type': 'toolButton',
      'toolName': 'AnnotationCreateRedaction'
    },
    'pageRedactionToggleButton': {
      'dataElement': 'pageRedactionToggleButton',
      'title': 'action.redactPages',
      'type': 'toggleButton',
      'img': 'icon-tool-page-redact',
      'toggleElement': 'pageRedactionModal'
    },
    'redactionPanelToggle': {
      'dataElement': 'redactionPanelToggle',
      'type': 'toggleButton',
      'img': 'icon-redact-panel',
      'toggleElement': 'redactionPanel',
      'title': 'component.redactionPanel',
      'disabled': true
    },
    'redactionGroupedItems': {
      'dataElement': 'redactionGroupedItems',
      'items': [
        'redactionToolButton',
        'pageRedactionToggleButton',
        'redactionPanelToggle',
        'divider-0.4',
        'stylePanelToggle',
        'defaultAnnotationUtilities'
      ],
      'type': 'groupedItems',
      'grow': 0,
      'gap': 12,
      'alwaysVisible': false
    },
    'distanceMeasurementToolButton': {
      'dataElement': 'distanceMeasurementToolButton',
      'type': 'toolButton',
      'toolName': 'AnnotationCreateDistanceMeasurement'
    },
    'arcMeasurementToolButton': {
      'dataElement': 'arcMeasurementToolButton',
      'type': 'toolButton',
      'toolName': 'AnnotationCreateArcMeasurement'
    },
    'perimeterMeasurementToolButton': {
      'dataElement': 'perimeterMeasurementToolButton',
      'type': 'toolButton',
      'toolName': 'AnnotationCreatePerimeterMeasurement'
    },
    'areaMeasurementToolButton': {
      'dataElement': 'areaMeasurementToolButton',
      'type': 'toolButton',
      'toolName': 'AnnotationCreateAreaMeasurement'
    },
    'ellipseMeasurementToolButton': {
      'dataElement': 'ellipseMeasurementToolButton',
      'type': 'toolButton',
      'toolName': 'AnnotationCreateEllipseMeasurement'
    },
    'rectangularAreaMeasurementToolButton': {
      'dataElement': 'rectangularAreaMeasurementToolButton',
      'type': 'toolButton',
      'toolName': 'AnnotationCreateRectangularAreaMeasurement'
    },
    'countMeasurementToolButton': {
      'dataElement': 'countMeasurementToolButton',
      'type': 'toolButton',
      'toolName': 'AnnotationCreateCountMeasurement'
    },
    'measureGroupedItems': {
      'dataElement': 'measureGroupedItems',
      'items': [
        'distanceMeasurementToolButton',
        'arcMeasurementToolButton',
        'perimeterMeasurementToolButton',
        'areaMeasurementToolButton',
        'ellipseMeasurementToolButton',
        'rectangularAreaMeasurementToolButton',
        'countMeasurementToolButton',
        'divider-0.4',
        'stylePanelToggle',
        'defaultAnnotationUtilities'
      ],
      'type': 'groupedItems',
      'grow': 0,
      'gap': 12,
      'alwaysVisible': false
    },
    'cropToolButton': {
      'dataElement': 'cropToolButton',
      'type': 'toolButton',
      'toolName': 'CropPage'
    },
    'snippingToolButton': {
      'dataElement': 'snippingToolButton',
      'type': 'toolButton',
      'toolName': 'SnippingTool'
    },
    'editGroupedItems': {
      'dataElement': 'editGroupedItems',
      'items': [
        'cropToolButton',
        'snippingToolButton'
      ],
      'type': 'groupedItems',
      'grow': 0,
      'gap': 12,
      'alwaysVisible': false
    },
    'addParagraphToolGroupButton': {
      'dataElement': 'addParagraphToolGroupButton',
      'type': 'toolButton',
      'toolName': 'AddParagraphTool',
      'disabled': true
    },
    'addImageContentToolGroupButton': {
      'dataElement': 'addImageContentToolGroupButton',
      'type': 'toolButton',
      'toolName': 'AddImageContentTool',
      'disabled': true
    },
    'divider-0.6': {
      'dataElement': 'divider-0.6',
      'type': 'divider'
    },
    'contentEditButton': {
      'dataElement': 'contentEditButton',
      'type': 'presetButton',
      'buttonType': 'contentEditButton',
      'disabled': true
    },
    'contentEditGroupedItems': {
      'dataElement': 'contentEditGroupedItems',
      'items': [
        'addParagraphToolGroupButton',
        'addImageContentToolGroupButton',
        'divider-0.6',
        'contentEditButton'
      ],
      'type': 'groupedItems',
      'grow': 0,
      'gap': 12,
      'alwaysVisible': false
    },
    'crossStampToolButton': {
      'dataElement': 'crossStampToolButton',
      'type': 'toolButton',
      'toolName': 'AnnotationCreateCrossStamp'
    },
    'checkStampToolButton': {
      'dataElement': 'checkStampToolButton',
      'type': 'toolButton',
      'toolName': 'AnnotationCreateCheckStamp'
    },
    'dotStampToolButton': {
      'dataElement': 'dotStampToolButton',
      'type': 'toolButton',
      'toolName': 'AnnotationCreateDotStamp'
    },
    'calendarToolButton': {
      'dataElement': 'calendarToolButton',
      'type': 'toolButton',
      'toolName': 'AnnotationCreateDateFreeText'
    },
    'fillAndSignGroupedItems': {
      'dataElement': 'fillAndSignGroupedItems',
      'items': [
        'signatureCreateToolButton',
        'freeTextToolButton',
        'crossStampToolButton',
        'checkStampToolButton',
        'dotStampToolButton',
        'rubberStampToolButton',
        'calendarToolButton',
        'divider-0.4',
        'stylePanelToggle',
        'defaultAnnotationUtilities'
      ],
      'type': 'groupedItems',
      'grow': 0,
      'gap': 12,
      'alwaysVisible': false
    },
    'signatureFieldButton': {
      'dataElement': 'signatureFieldButton',
      'type': 'toolButton',
      'toolName': 'SignatureFormFieldCreateTool'
    },
    'textFieldButton': {
      'dataElement': 'textFieldButton',
      'type': 'toolButton',
      'toolName': 'TextFormFieldCreateTool'
    },
    'checkboxFieldButton': {
      'dataElement': 'checkboxFieldButton',
      'type': 'toolButton',
      'toolName': 'CheckBoxFormFieldCreateTool'
    },
    'radioFieldButton': {
      'dataElement': 'radioFieldButton',
      'type': 'toolButton',
      'toolName': 'RadioButtonFormFieldCreateTool'
    },
    'listBoxFieldButton': {
      'dataElement': 'listBoxFieldButton',
      'type': 'toolButton',
      'toolName': 'ListBoxFormFieldCreateTool'
    },
    'comboBoxFieldButton': {
      'dataElement': 'comboBoxFieldButton',
      'type': 'toolButton',
      'toolName': 'ComboBoxFormFieldCreateTool'
    },
    'divider-0.7': {
      'dataElement': 'divider-0.7',
      'type': 'divider'
    },
    'formFieldEditButton': {
      'dataElement': 'formFieldEditButton',
      'type': 'presetButton',
      'buttonType': 'formFieldEditButton'
    },
    'divider-0.8': {
      'dataElement': 'divider-0.8',
      'type': 'divider'
    },
    'formsToolsGroupedItems': {
      'dataElement': 'formsToolsGroupedItems',
      'items': [
        'signatureFieldButton',
        'textFieldButton',
        'freeTextToolButton',
        'checkboxFieldButton',
        'radioFieldButton',
        'listBoxFieldButton',
        'comboBoxFieldButton',
        'divider-0.7',
        'formFieldEditButton'
      ],
      'type': 'groupedItems',
      'grow': 0,
      'gap': 12,
      'alwaysVisible': false
    },
    'formsGroupedItems': {
      'dataElement': 'formsGroupedItems',
      'items': [
        'formsToolsGroupedItems',
        'divider-0.8',
        'stylePanelToggle',
        'indexPanelListToggle'
      ],
      'type': 'groupedItems',
      'grow': 0,
      'gap': 12,
      'alwaysVisible': false
    },
    'page-controls-container': {
      'dataElement': 'page-controls-container',
      'type': 'pageControls',
      'title': 'component.pageControls',
      'icon': 'icon-page-controls'
    },
    'newDocumentButton': {
      'dataElement': 'newDocumentButton',
      'presetDataElement': 'newDocumentPresetButton',
      'label': 'action.newDocument',
      'title': 'action.newDocument',
      'isActive': false,
      'type': 'presetButton',
      'buttonType': 'newDocumentButton'
    },
    'fullscreenButton': {
      'dataElement': 'fullscreenButton',
      'presetDataElement': 'fullscreenPresetButton',
      'label': 'action.enterFullscreen',
      'title': 'action.enterFullscreen',
      'type': 'presetButton',
      'buttonType': 'fullscreenButton'
    }
  },
  'modularHeaders': {
    'default-top-header': {
      'dataElement': 'default-top-header',
      'placement': 'top',
      'grow': 0,
      'gap': 12,
      'position': 'start',
      'float': false,
      'stroke': true,
      'dimension': {
        'paddingTop': 8,
        'paddingBottom': 8,
        'borderWidth': 1
      },
      'style': {},
      'items': [
        'groupedLeftHeaderButtons',
        'default-ribbon-group',
        'comparePanelToggle',
        'searchPanelToggle',
        'notesPanelToggle'
      ]
    },
    'tools-header': {
      'dataElement': 'tools-header',
      'placement': 'top',
      'justifyContent': 'center',
      'grow': 0,
      'gap': 12,
      'position': 'end',
      'float': false,
      'stroke': true,
      'dimension': {
        'paddingTop': 8,
        'paddingBottom': 8,
        'borderWidth': 1
      },
      'style': {},
      'items': [
        'annotateGroupedItems',
        'shapesGroupedItems',
        'insertGroupedItems',
        'redactionGroupedItems',
        'measureGroupedItems',
        'editGroupedItems',
        'contentEditGroupedItems',
        'fillAndSignGroupedItems',
        'formsGroupedItems'
      ]
    },
    'page-nav-floating-header': {
      'dataElement': 'page-nav-floating-header',
      'placement': 'bottom',
      'grow': 0,
      'gap': 12,
      'position': 'center',
      'opacityMode': 'dynamic',
      'opacity': 'none',
      'float': true,
      'stroke': true,
      'dimension': {
        'paddingTop': 8,
        'paddingBottom': 8,
        'borderWidth': 1
      },
      'style': {
        'background': 'var(--gray-1)',
        'padding': '8px',
        'borderStyle': 'solid',
        'borderWidth': 1,
        'borderColor': 'var(--gray-5)'
      },
      'items': [
        'page-controls-container'
      ]
    }
  },
  'panels': {
    'comparePanel': {
      'dataElement': 'comparePanel',
      'render': 'changeListPanel',
      'location': 'right'
    },
    'stylePanel': {
      'dataElement': 'stylePanel',
      'render': 'stylePanel',
      'location': 'left'
    },
    'thumbnailsPanel': {
      'dataElement': 'thumbnailsPanel',
      'render': 'thumbnailsPanel',
      'location': 'left'
    },
    'outlinesPanel': {
      'dataElement': 'outlinesPanel',
      'render': 'outlinesPanel',
      'location': 'left'
    },
    'bookmarksPanel': {
      'dataElement': 'bookmarksPanel',
      'render': 'bookmarksPanel',
      'location': 'left'
    },
    'formFieldPanel': {
      'dataElement': 'formFieldPanel',
      'render': 'formFieldPanel',
      'location': 'right'
    },
    'indexPanel': {
      'dataElement': 'indexPanel',
      'render': 'indexPanel',
      'location': 'right'
    },
    'layersPanel': {
      'dataElement': 'layersPanel',
      'render': 'layersPanel',
      'location': 'left'
    },
    'signatureListPanel': {
      'dataElement': 'signatureListPanel',
      'render': 'signatureListPanel',
      'location': 'left'
    },
    'fileAttachmentPanel': {
      'dataElement': 'fileAttachmentPanel',
      'render': 'fileAttachmentPanel',
      'location': 'left'
    },
    'rubberStampPanel': {
      'dataElement': 'rubberStampPanel',
      'render': 'rubberStampPanel',
      'location': 'left'
    },
    'textEditingPanel': {
      'dataElement': 'textEditingPanel',
      'render': 'textEditingPanel',
      'location': 'right'
    },
    'signaturePanel': {
      'dataElement': 'signaturePanel',
      'render': 'signaturePanel',
      'location': 'left',
      'disabled': true
    },
    'portfolioPanel': {
      'dataElement': 'portfolioPanel',
      'render': 'portfolioPanel',
      'location': 'left',
      'disabled': true
    },
    'tabPanel': {
      'render': 'tabPanel',
      'dataElement': 'tabPanel',
      'panelsList': [
        {
          'render': 'thumbnailsPanel'
        },
        {
          'render': 'outlinesPanel'
        },
        {
          'render': 'bookmarksPanel'
        },
        {
          'render': 'layersPanel'
        },
        {
          'render': 'signaturePanel'
        },
        {
          'render': 'fileAttachmentPanel'
        },
        {
          'render': 'portfolioPanel'
        }
      ],
      'location': 'left'
    },
    'notesPanel': {
      'dataElement': 'notesPanel',
      'render': 'notesPanel',
      'location': 'right'
    },
    'searchPanel': {
      'dataElement': 'searchPanel',
      'render': 'searchPanel',
      'location': 'right'
    },
    'redactionPanel': {
      'dataElement': 'redactionPanel',
      'render': 'redactionPanel',
      'location': 'right',
      'disabled': true
    }
  },
  'flyouts': {
    'MainMenuFlyout': {
      'dataElement': 'MainMenuFlyout',
      'items': [
        'newDocumentButton',
        'filePickerButton',
        'downloadButton',
        'fullscreenButton',
        'saveAsButton',
        'printButton',
        'divider',
        'createPortfolioButton',
        'divider',
        'settingsButton',
        'divider'
      ]
    }
  }
};

export const invalidUI = {
  'modularComponents': {
    'menuButton': {
      'dataElement': 'menuButton',
      'img': 'ic-hamburger-menu',
      'title': 'component.menuOverlay',
      'toggleElement': 'MainMenuFlyout',
    },
  },
  'modularHeaders': {
    'default-top-header': {
      'dataElement': 'default-top-header',
      'grow': 0,
      'gap': 12,
      'position': 'start',
      'float': false,
      'stroke': true,
      'dimension': {
        'paddingTop': 8,
        'paddingBottom': 8,
        'borderWidth': 1
      },
      'style': {},
      'items': [
        'searchPanelToggle'
      ]
    }
  },
  'panels': {
    'searchPanel': {
      'dataElement': 'searchPanel',
      'render': 'searchPanel',
    }
  }
};

export const uiWithButtons = {
  'modularComponents': {
    'testButton': {
      'dataElement': 'testButton',
      'title': 'this is a test button',
      'type': 'customButton',
      'label': 'test',
      'img': 'icon-save',
      'onClick': 'alertClick'
    },
    'aStatefulButton': {
      'dataElement': 'aStatefulButton',
      'type': 'statefulButton',
      'states': {
        'SinglePage': {
          'img': 'icon-header-page-manipulation-page-layout-single-page-line',
          'title': 'Single Page',
          'onClick': 'singlePageOnClick'
        },
        'DoublePage': {
          'img': 'icon-header-page-manipulation-page-layout-double-page-line',
          'title': 'Double Page',
          'onClick': 'doublePageOnClick'
        }
      },
      'initialState': 'SinglePage',
      'mount': 'statefulButtonMount',
      'unmount': 'statefulButtonUnmount'
    }
  },
  'modularHeaders': {
    'default-top-header': {
      'dataElement': 'default-top-header',
      'placement': 'top',
      'grow': 0,
      'gap': 12,
      'position': 'start',
      'float': false,
      'stroke': true,
      'dimension': {
        'paddingTop': 8,
        'paddingBottom': 8,
        'borderWidth': 1
      },
      'style': {},
      'items': [
        'testButton',
        'aStatefulButton'
      ]
    },
  },
};