/// <reference path="../../ts/types.d.ts" />
const hashFile = `/${(window.location.hash || 'webviewer-demo.pdf').replace('#', '')}`;
// Remove init_timestamp so that the demo doesn't expire
window.localStorage.removeItem('init_timestamp');

const viewerElement = document.getElementById('viewer');
WebViewer.WebComponent({
  path: '/lib',
  initialDoc: hashFile,
  enableRedaction: true,
  fullAPI: true,
}, viewerElement).then((instance) => {
  // This makes it easier to access the instance from the browser console
  window.instance = instance;

  const { UI, Core } = instance;
  const { Tools } = Core;

  UI.enableFeatureFlag(UI.FeatureFlags.CUSTOMIZABLE_UI);
  UI.enableFeatures([
    UI.Feature.Initials,
    UI.Feature.ContentEdit,
  ]);
  UI.enableElements(['bookmarksPanel']);

  //* Top Header *//
  // Define the top header items, left to right

  // function that creates a new divider each time it is called
  const createDivider = () => ({
    type: 'divider',
    dataElement: `divider-${Math.random()}`,
  });

  // Menu Flyout Hamburger button
  const mainMenu = new UI.Components.MainMenu();

  // Left panel toggle button
  const leftPanelToggle = new UI.Components.ToggleElementButton({
    dataElement: 'left-panel-toggle',
    toggleElement: 'customLeftPanel',
    title: 'Left Panel',
    img: 'icon-header-sidebar-line'
  });

  // View Controls
  const viewControlsToggle = new UI.Components.ViewControls();

  // Zoom Controls
  const zoomControls = new UI.Components.Zoom();

  // Pan Tool Button
  const panToolButton = new UI.Components.ToolButton({
    dataElement: 'panToolButton',
    toolName: Tools.ToolNames.PAN,
  });

  // Annotation Edit/Select Tool Button
  const annotationEditToolButton = new UI.Components.ToolButton({
    dataElement: 'annotationEditToolButton',
    toolName: Tools.ToolNames.EDIT,
  });

  // Style Panel & Toggle
  UI.addPanel({
    dataElement: 'stylePanel',
    render: UI.Panels.STYLE,
    location: 'left',
  });

  const stylePanelToggle = new UI.Components.ToggleElementButton({
    dataElement: 'stylePanelToggle',
    toggleElement: UI.Panels.STYLE,
    img: 'icon-style-panel-toggle',
    title: 'action.style',
  });

  // Thumbnail Panel
  UI.addPanel({
    dataElement: 'thumbnailPanel',
    render: UI.Panels.THUMBNAIL,
    location: 'left',
  });

  // Outline Panel
  UI.addPanel({
    dataElement: 'outlinePanel',
    render: UI.Panels.OUTLINE,
    location: 'left',
  });

  // Bookmark Panel
  UI.addPanel({
    dataElement: 'bookmarkPanel',
    render: UI.Panels.BOOKMARKS,
    location: 'left',
  });

  // Layers Panel
  UI.addPanel({
    dataElement: 'layersPanel',
    render: UI.Panels.LAYERS,
    location: 'left',
  });

  // Signature Panel
  UI.addPanel({
    dataElement: 'signatureListPanel',
    render: UI.Panels.SIGNATURE_LIST,
    location: 'left',
  });

  // File Attachment Panel
  UI.addPanel({
    dataElement: 'fileAttachmentPanel',
    render: UI.Panels.FILE_ATTACHMENT,
    location: 'left',
  });

  // Stamp panel
  instance.UI.addPanel({
    dataElement: 'rubberStampPanel',
    render: instance.UI.Panels.RUBBER_STAMP,
    location: 'left',
  });

  // Text Editing Panel
  UI.addPanel({
    dataElement: 'textEditingPanel',
    render: UI.Panels.TEXT_EDITING,
    location: 'right',
  });

  // Portfolio Panel
  UI.addPanel({
    dataElement: 'portfolioPanel',
    render: UI.Panels.PORTFOLIO,
    location: 'left',
  });

  // Left Panel
  const tabPanel = new UI.Components.TabPanel({
    dataElement: 'customLeftPanel',
    panelsList: [
      {
        render: UI.Panels.THUMBNAIL
      },
      {
        render: UI.Panels.OUTLINE
      },
      {
        render: UI.Panels.BOOKMARKS
      },
      {
        render: UI.Panels.LAYERS
      },
      {
        render: UI.Panels.SIGNATURE
      },
      {
        render: UI.Panels.FILE_ATTACHMENT
      },
      {
        render: UI.Panels.PORTFOLIO
      }
    ],
    location: 'left'
  });

  UI.addPanel(tabPanel);
  UI.setPanelWidth('customLeftPanel', 330);

  // Notes Panel
  UI.addPanel({
    dataElement: 'notesPanel',
    render: UI.Panels.NOTES,
    location: 'right',
  });
  UI.setPanelWidth('notesPanel', 330);

  UI.addPanel({
    dataElement: 'searchPanel',
    render: UI.Panels.SEARCH,
    location: 'right',
  });
  UI.setPanelWidth('searchPanel', 330);

  // * Tool Buttons * //

  // ** Common Buttons ** //
  const undoButton = new UI.Components.PresetButton({ buttonType: UI.PRESET_BUTTON_TYPES.UNDO });

  const redoButton = new UI.Components.PresetButton({ buttonType: UI.PRESET_BUTTON_TYPES.REDO });

  const eraserToolButton = new UI.Components.ToolButton({
    dataElement: 'eraserToolButton',
    toolName: Tools.ToolNames.ERASER,
  });

  const formFieldEditButton = new UI.Components.PresetButton({ buttonType: UI.PRESET_BUTTON_TYPES.FORM_FIELD_EDIT });
  const contentEditButton = new UI.Components.PresetButton({ buttonType: instance.UI.PRESET_BUTTON_TYPES.CONTENT_EDIT });

  // ** Annotate Tools ** //
  const underlineToolButton = new UI.Components.ToolButton({
    dataElement: 'underlineToolButton',
    toolName: Tools.ToolNames.UNDERLINE,
  });

  const highlightToolButton = new UI.Components.ToolButton({
    dataElement: 'highlightToolButton',
    toolName: Tools.ToolNames.HIGHLIGHT,
  });

  const freeTextToolButton = new UI.Components.ToolButton({
    dataElement: 'freeTextToolButton',
    toolName: Tools.ToolNames.FREETEXT,
  });

  const createMarkInsertToolButton = new UI.Components.ToolButton({
    dataElement: 'markInsertTextToolButton',
    toolName: Tools.ToolNames.MARK_INSERT_TEXT,
  });

  const createMarkReplaceTextButton = new UI.Components.ToolButton({
    dataElement: 'markReplaceTextToolButton',
    toolName: Tools.ToolNames.MARK_REPLACE_TEXT,
  });

  const squigglyToolButton = new UI.Components.ToolButton({
    dataElement: 'squigglyToolButton',
    toolName: Tools.ToolNames.SQUIGGLY,
  });

  const strikeoutToolButton = new UI.Components.ToolButton({
    dataElement: 'strikeoutToolButton',
    toolName: Tools.ToolNames.STRIKEOUT,
  });

  const stickyToolButton = new UI.Components.ToolButton({
    dataElement: 'stickyToolButton',
    toolName: Tools.ToolNames.STICKY,
  });

  // ** Shapes Tools ** //
  const rectangleToolButton = new UI.Components.ToolButton({
    dataElement: 'rectangleToolButton',
    toolName: Tools.ToolNames.RECTANGLE,
  });

  const freeHandToolButton = new UI.Components.ToolButton({
    dataElement: 'freeHandToolButton',
    toolName: Tools.ToolNames.FREEHAND,
  });

  const freeHandHighlightToolButton = new UI.Components.ToolButton({
    dataElement: 'freeHandHighlightToolButton',
    toolName: Tools.ToolNames.FREEHAND_HIGHLIGHT,
  });

  const lineToolButton = new UI.Components.ToolButton({
    dataElement: 'lineToolButton',
    toolName: Tools.ToolNames.LINE,
  });

  const polylineToolButton = new UI.Components.ToolButton({
    dataElement: 'polylineToolButton',
    toolName: Tools.ToolNames.POLYLINE,
  });

  const arrowToolButton = new UI.Components.ToolButton({
    dataElement: 'arrowToolButton',
    toolName: Tools.ToolNames.ARROW,
  });

  const arcToolButton = new UI.Components.ToolButton({
    dataElement: 'arcToolButton',
    toolName: Tools.ToolNames.ARC,
  });

  const ellipseToolButton = new UI.Components.ToolButton({
    dataElement: 'ellipseToolButton',
    toolName: Tools.ToolNames.ELLIPSE,
  });

  const polygonToolButton = new UI.Components.ToolButton({
    dataElement: 'polygonToolButton',
    toolName: Tools.ToolNames.POLYGON,
  });

  const cloudToolButton = new UI.Components.ToolButton({
    dataElement: 'cloudToolButton',
    toolName: Tools.ToolNames.POLYGON_CLOUD,
  });

  // ** Insert Tools ** //
  const rubberStampToolButton = new UI.Components.ToolButton({
    dataElement: 'rubberStampToolButton',
    toolName: Tools.ToolNames.RUBBER_STAMP,
  });
  const calloutToolButton = new UI.Components.ToolButton({
    dataElement: 'calloutToolButton',
    toolName: Tools.ToolNames.CALLOUT,
  });
  const calendarToolButton = new UI.Components.ToolButton({
    dataElement: 'calendarToolButton',
    toolName: Tools.ToolNames.DATE_FREETEXT,
  });
  const signatureCreateToolButton = new UI.Components.ToolButton({
    dataElement: 'signatureCreateToolButton',
    toolName: Tools.ToolNames.SIGNATURE,
  });
  const fileAttachmentToolButton = new UI.Components.ToolButton({
    dataElement: 'fileAttachmentButton',
    toolName: Tools.ToolNames.FILEATTACHMENT
  });
  const stampCreateToolButton = new UI.Components.ToolButton({
    dataElement: 'stampToolButton',
    toolName: Tools.ToolNames.STAMP,
  });

  // ** Redaction Tools ** //
  const redactionToolButton = new UI.Components.ToolButton({
    dataElement: 'redactionToolButton',
    toolName: Tools.ToolNames.REDACTION,
  });

  // ** Measure Tools ** //
  const distanceMeasurementToolButton = new UI.Components.ToolButton({
    dataElement: 'distanceMeasurementToolButton',
    toolName: Tools.ToolNames.DISTANCE_MEASUREMENT,
  });

  const arcMeasurementToolButton = new UI.Components.ToolButton({
    dataElement: 'arcMeasurementToolButton',
    toolName: Tools.ToolNames.ARC_MEASUREMENT,
  });

  const perimeterMeasurementToolButton = new UI.Components.ToolButton({
    dataElement: 'perimeterMeasurementToolButton',
    toolName: Tools.ToolNames.PERIMETER_MEASUREMENT,
  });

  const areaMeasurementToolButton = new UI.Components.ToolButton({
    dataElement: 'areaMeasurementToolButton',
    toolName: Tools.ToolNames.AREA_MEASUREMENT,
  });

  const ellipseMeasurementToolButton = new UI.Components.ToolButton({
    dataElement: 'ellipseMeasurementToolButton',
    toolName: Tools.ToolNames.ELLIPSE_MEASUREMENT,
  });

  const rectangularAreaMeasurementToolButton = new UI.Components.ToolButton({
    dataElement: 'rectangularAreaMeasurementToolButton',
    toolName: Tools.ToolNames.RECTANGULAR_AREA_MEASUREMENT,
  });

  const countMeasurementToolButton = new UI.Components.ToolButton({
    dataElement: 'countMeasurementToolButton',
    toolName: Tools.ToolNames.COUNT_MEASUREMENT,
  });

  // ** Edit Tools ** //
  const cropToolButton = new UI.Components.ToolButton({
    dataElement: 'cropToolButton',
    toolName: Tools.ToolNames.CROP,
  });
  const snipToolButton = new UI.Components.ToolButton({
    dataElement: 'snippingToolButton',
    toolName: Tools.ToolNames.SNIPPING,
  });

  // ** Form Tools ** //
  const signatureFieldButton = new UI.Components.ToolButton({
    dataElement: 'signatureFieldButton',
    toolName: Tools.ToolNames.SIG_FORM_FIELD,
  });

  const textFieldButton = new UI.Components.ToolButton({
    dataElement: 'textFieldButton',
    toolName: Tools.ToolNames.TEXT_FORM_FIELD,
  });

  const checkboxFieldButton = new UI.Components.ToolButton({
    dataElement: 'checkboxFieldButton',
    toolName: Tools.ToolNames.CHECK_BOX_FIELD,
  });

  const radioFieldButton = new UI.Components.ToolButton({
    dataElement: 'radioFieldButton',
    toolName: Tools.ToolNames.RADIO_FORM_FIELD,
  });

  const listBoxFieldButton = new UI.Components.ToolButton({
    dataElement: 'listBoxFieldButton',
    toolName: Tools.ToolNames.LIST_BOX_FIELD,
  });

  const comboBoxFieldButton = new UI.Components.ToolButton({
    dataElement: 'comboBoxFieldButton',
    toolName: Tools.ToolNames.COMBO_BOX_FIELD,
  });

  // ** Content Edit Tools ** //
  const addParagraphButton = new instance.UI.Components.ToolButton({
    dataElement: 'addParagraphToolGroupButton',
    toolName: Tools.ToolNames.ADD_PARAGRAPH,
  });

  const addImageContentButton = new instance.UI.Components.ToolButton({
    dataElement: 'addImageContentToolGroupButton',
    toolName: Tools.ToolNames.ADD_IMAGE_CONTENT,
  });

  // ** Fill and Sign Tools ** //
  const crossStampToolButton = new UI.Components.ToolButton({
    dataElement: 'crossStampToolButton',
    toolName: Tools.ToolNames.FORM_FILL_CROSS,
  });

  const checkStampToolButton = new UI.Components.ToolButton({
    dataElement: 'checkStampToolButton',
    toolName: Tools.ToolNames.FORM_FILL_CHECKMARK,
  });

  const dotStampToolButton = new UI.Components.ToolButton({
    dataElement: 'dotStampToolButton',
    toolName: Tools.ToolNames.FORM_FILL_DOT,
  });

  // ** Grouped Items ** //

  // This group is made up of the style panel, undo, redo, and eraser
  // not all ribbons support these but it DRYs up the code
  const defaultAnnotationUtilities = new UI.Components.GroupedItems({
    dataElement: 'defaultAnnotationUtilities',
    items: [
      createDivider(),
      stylePanelToggle,
      createDivider(),
      undoButton,
      redoButton,
      eraserToolButton
    ],
  });

  // Each Ribbon item can be linked to one or more grouped items
  const annotateGroupedItems = new UI.Components.GroupedItems({
    dataElement: 'annotateGroupedItems',
    justifyContent: 'center',
    items: [
      highlightToolButton,
      underlineToolButton,
      strikeoutToolButton,
      squigglyToolButton,
      freeTextToolButton,
      createMarkInsertToolButton,
      createMarkReplaceTextButton,
      freeHandToolButton,
      freeHandHighlightToolButton,
      stickyToolButton,
      calloutToolButton,
      defaultAnnotationUtilities,
    ],
  });

  const shapesGroupedItems = new UI.Components.GroupedItems({
    dataElement: 'shapesGroupedItems',
    items: [
      rectangleToolButton,
      ellipseToolButton,
      arcToolButton,
      polygonToolButton,
      cloudToolButton,
      lineToolButton,
      polylineToolButton,
      arrowToolButton,
      defaultAnnotationUtilities
    ],
  });

  const insertGroupedItems = new UI.Components.GroupedItems({
    dataElement: 'insertGroupedItems',
    items: [
      rubberStampToolButton,
      signatureCreateToolButton,
      fileAttachmentToolButton,
      stampCreateToolButton,
      createDivider(),
      stylePanelToggle,
      createDivider(),
      undoButton,
      redoButton,
      eraserToolButton
    ],
  });

  const measureGroupedItems = new UI.Components.GroupedItems({
    dataElement: 'measureGroupedItems',
    items: [
      distanceMeasurementToolButton,
      arcMeasurementToolButton,
      perimeterMeasurementToolButton,
      areaMeasurementToolButton,
      ellipseMeasurementToolButton,
      rectangularAreaMeasurementToolButton,
      countMeasurementToolButton,
      defaultAnnotationUtilities,
    ],
  });

  const contentEditGroupedItems = new UI.Components.GroupedItems({
    dataElement: 'contentEditGroupedItems',
    items: [
      addParagraphButton,
      addImageContentButton,
      createDivider(),
      contentEditButton,
    ],
  });

  const formsGroupedItems = new UI.Components.GroupedItems({
    dataElement: 'formsGroupedItems',
    items: [
      signatureFieldButton,
      textFieldButton,
      freeTextToolButton,
      checkboxFieldButton,
      radioFieldButton,
      listBoxFieldButton,
      comboBoxFieldButton,
      createDivider(),
      formFieldEditButton,
      createDivider(),
      stylePanelToggle,
    ],
  });

  UI.addPanel({
    dataElement: 'redactionPanel',
    render: UI.Panels.REDACTION,
    location: 'right',
  });

  UI.setPanelWidth('redactionPanel', 330);

  const redactionPanelToggle = new UI.Components.ToggleElementButton(
    {
      type: 'toggleElementButton',
      img: 'icon-redact-panel',
      dataElement: 'redactionPanelToggle',
      toggleElement: 'redactionPanel',
    },
  );

  const fullPageRedactionToggle = new UI.Components.ToggleElementButton(
    {
      type: 'toggleElementButton',
      img: 'icon-tool-page-redact',
      dataElement: 'pageRedactionToggleButton',
      toggleElement: 'pageRedactionModal',
      title: 'action.redactPages',
    }
  );

  const redactionGroupedItems = new UI.Components.GroupedItems({
    dataElement: 'redactionGroupedItems',
    items: [
      redactionToolButton,
      fullPageRedactionToggle,
      redactionPanelToggle,
      defaultAnnotationUtilities,
    ],
  });

  const editGroupedItems = new UI.Components.GroupedItems({
    dataElement: 'editGroupedItems',
    items: [
      cropToolButton,
      snipToolButton,
      undoButton,
      redoButton,
      eraserToolButton
    ],
  });

  const fillAndSignGroupedItems = new UI.Components.GroupedItems({
    dataElement: 'fillAndSignGroupedItems',
    items: [
      signatureCreateToolButton,
      freeTextToolButton,
      crossStampToolButton,
      checkStampToolButton,
      dotStampToolButton,
      rubberStampToolButton,
      calendarToolButton,
      defaultAnnotationUtilities
    ],
  });

  const groupedLeftHeaderButtons = new UI.Components.GroupedItems({
    dataElement: 'groupedLeftHeaderButtons',
    alwaysVisible: true,
    grow: 1,
    items: [
      mainMenu,
      createDivider(),
      leftPanelToggle,
      viewControlsToggle,
      createDivider(),
      zoomControls,
      createDivider(),
      panToolButton,
      annotationEditToolButton,
      createDivider(),
    ]
  });

  // Ribbon Items
  const viewRibbonItem = new UI.Components.RibbonItem({
    dataElement: 'toolbarGroup-View',
    label: 'View',
    title: 'View',
    toolbarGroup: 'toolbarGroup-View',
    type: 'ribbonItem',
    groupedItems: []
  });
  const annotateRibbonItem = new UI.Components.RibbonItem({
    dataElement: 'toolbarGroup-Annotate',
    label: 'Annotate',
    title: 'Annotate',
    toolbarGroup: 'toolbarGroup-Annotate',
    type: 'ribbonItem',
    groupedItems: ['annotateGroupedItems']
  });

  const shapesRibbomItem = new UI.Components.RibbonItem({
    dataElement: 'toolbarGroup-Shapes',
    label: 'Shapes',
    title: 'Shapes',
    toolbarGroup: 'toolbarGroup-Shapes',
    type: 'ribbonItem',
    groupedItems: ['shapesGroupedItems']
  });

  const insertRibbonItem = new UI.Components.RibbonItem({
    dataElement: 'toolbarGroup-Insert',
    label: 'Insert',
    title: 'Insert',
    toolbarGroup: 'toolbarGroup-Insert',
    groupedItems: ['insertGroupedItems']
  });

  const measureRibbonItem = new UI.Components.RibbonItem({
    dataElement: 'toolbarGroup-Measure',
    label: 'Measure',
    title: 'Measure',
    toolbarGroup: 'toolbarGroup-Measure',
    groupedItems: ['measureGroupedItems']
  });

  const redactionRibbonItem = new UI.Components.RibbonItem({
    dataElement: 'toolbarGroup-Redact',
    label: 'Redact',
    title: 'Redact',
    toolbarGroup: 'toolbarGroup-Redact',
    groupedItems: ['redactionGroupedItems']
  });

  const editRibbonItem = new UI.Components.RibbonItem({
    dataElement: 'toolbarGroup-Edit',
    label: 'Edit',
    title: 'Edit',
    toolbarGroup: 'toolbarGroup-Edit',
    groupedItems: ['editGroupedItems']
  });

  const fillAndSignRibbonItem = new UI.Components.RibbonItem({
    dataElement: 'toolbarGroup-FillAndSign',
    label: 'Fill and Sign',
    title: 'Fill and Sign',
    toolbarGroup: 'toolbarGroup-FillAndSign',
    groupedItems: ['fillAndSignGroupedItems']
  });

  const formsRibbonItem = new UI.Components.RibbonItem({
    dataElement: 'toolbarGroup-Forms',
    label: 'Forms',
    title: 'Forms',
    toolbarGroup: 'toolbarGroup-Forms',
    groupedItems: ['formsGroupedItems']
  });

  const contentEditRibbonItem = new UI.Components.RibbonItem({
    dataElement: 'toolbarGroup-EditText',
    label: 'Content Edit',
    title: 'Content Edit',
    toolbarGroup: 'toolbarGroup-EditText',
    groupedItems: ['contentEditGroupedItems']
  });

  // Ribbon Group
  const ribbonGroup = new UI.Components.RibbonGroup({
    dataElement: 'default-ribbon-group',
    grow: 2,
    justifyContent: 'start',
    title: 'Default Tools',
    type: 'ribbonGroup',
    items: [
      viewRibbonItem,
      annotateRibbonItem,
      shapesRibbomItem,
      insertRibbonItem,
      measureRibbonItem,
      redactionRibbonItem,
      editRibbonItem,
      contentEditRibbonItem,
      fillAndSignRibbonItem,
      formsRibbonItem,
    ],
  });


  // Search Panel Toggle
  const searchPanelToggle = new UI.Components.ToggleElementButton({
    dataElement: 'searchPanelToggle',
    toggleElement: 'searchPanel',
    img: 'icon-header-search',
    title: 'component.searchPanel',
  });

  // Notes Panel Toggle
  const notesPanelToggle = new UI.Components.ToggleElementButton({
    dataElement: 'notesPanelToggle',
    toggleElement: 'notesPanel',
    img: 'icon-header-chat-line',
    title: 'component.notesPanel',
  });

  // Const Primary Header
  const primaryHeader = new UI.Components.ModularHeader({
    dataElement: 'default-top-header',
    placement: 'top',
    position: 'start',
    items: [
      groupedLeftHeaderButtons,
      ribbonGroup,
      searchPanelToggle,
      notesPanelToggle,
    ],
  });

  const topToolsHeader = new UI.Components.ModularHeader({
    dataElement: 'tools-header',
    placement: 'top',
    justifyContent: 'center',
    position: 'end',
    items: [
      annotateGroupedItems,
      shapesGroupedItems,
      insertGroupedItems,
      redactionGroupedItems,
      measureGroupedItems,
      editGroupedItems,
      contentEditGroupedItems,
      fillAndSignGroupedItems,
      formsGroupedItems,
    ],
  });

  const pageNavigationTool = {
    dataElement: 'page-controls-container',
    type: 'pageControls',
  };

  const bottomHeader = new UI.Components.ModularHeader({
    dataElement: 'bottomHeader-23ds',
    placement: 'bottom',
    position: 'center',
    float: true,
    style: {
      background: 'var(--gray-1)',
      padding: '8px',
    }
  });
  bottomHeader.setItems([pageNavigationTool]);

  UI.setModularHeaders([
    primaryHeader,
    topToolsHeader,
    bottomHeader,
  ]);
});