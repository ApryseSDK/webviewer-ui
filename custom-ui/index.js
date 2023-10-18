const Webviewer = window.WebViewer;
const hashFile = `/${(window.location.hash || 'webviewer-demo.pdf').replace('#', '')}`;
// Remove init_timestamp so that the demo doesn't expire
window.localStorage.removeItem('init_timestamp');

const viewerElement = document.getElementById('viewer');
Webviewer.WebComponent({
  path: '/lib',
  initialDoc: hashFile,
}, viewerElement).then((instance) => {
  // This makes it easier to access the instance from the browser console
  window.instance = instance;

  const { Tools } = instance.Core;

  instance.UI.enableFeatureFlag(instance.UI.FeatureFlags.CUSTOMIZABLE_UI);

  //* Top Header *//
  // Define the top header items, left to right

  // function that creates a new divider each time it is called
  const createDivider = () => ({
    type: 'divider',
    dataElement: `divider-${Math.random()}`,
  });

  // Menu overlay hamberder button -> Pending implementation
  const menuOverlayToggle = new instance.UI.Components.CustomButton({
    dataElement: 'menuOverlayToggle',
    title: 'component.menuOverlay',
    img: 'ic-hamburger-menu',
    onClick: () => console.log('Menu Overlay button clicked'),
  });

  // Left panel toggle button
  const leftPanelToggle = new instance.UI.Components.ToggleElementButton({
    dataElement: 'left-panel-toggle',
    toggleElement: 'leftPanel',
    title: 'Left Panel',
    img: 'icon-header-sidebar-line'
  });

  // View Controls -> Pending implementation
  const viewControlsToggle = new instance.UI.Components.CustomButton({
    dataElement: 'viewControlsToggle',
    title: 'component.viewControlsOverlay',
    img: 'icon-header-page-manipulation-line',
    onClick: () => console.log('View Controls button clicked'),
  });

  // Zoom Controls
  const zoomControls = new instance.UI.Components.Zoom();

  // Pan Tool Button
  const panToolButton = new instance.UI.Components.ToolButton({
    dataElement: 'panToolButton',
    title: 'tool.pan',
    img: 'icon-header-pan',
    toolName: Tools.ToolNames.PAN,
  });

  // Annotation Edit/Select Tool Button
  const annotationEditToolButton = new instance.UI.Components.ToolButton({
    dataElement: 'annotationEditToolButton',
    title: 'tool.select',
    img: 'multi select',
    toolName: Tools.ToolNames.EDIT,
  });

  // Style Panel & Toggle
  instance.UI.addPanel({
    dataElement: 'stylePanel',
    render: instance.UI.Panels.STYLE,
    location: 'left',
  });

  const stylePanelToggle = new instance.UI.Components.ToggleElementButton({
    dataElement: 'stylePanelToggle',
    toggleElement: 'stylePanel',
    img: 'icon-style-panel-toggle',
    title: 'component.notesPanel',
  });

  // * Tool Buttons * //

  // ** Common Buttons ** //
  // We need an abstraction for undo and redo buttons
  const undoButton = new instance.UI.Components.CustomButton({
    dataElement: 'undoToolButton',
    title: 'action.undo',
    img: 'icon-operation-undo',
    onClick: () => console.log('Undo Tool button clicked'),
  });

  const redoButton = new instance.UI.Components.CustomButton({
    dataElement: 'redoToolButton',
    title: 'action.redo',
    img: 'icon-operation-redo',
    onClick: () => console.log('Redo Tool button clicked'),
  });

  const eraserToolButton = new instance.UI.Components.ToolButton({
    dataElement: 'eraserToolButton',
    title: 'annotation.eraser',
    img: 'icon-operation-eraser',
    toolName: Tools.ToolNames.ERASER,
  });

  // ** Annotate Tools ** //
  const underlineToolButton = new instance.UI.Components.ToolButton({
    dataElement: 'underlineToolButton',
    title: 'annotation.underline',
    img: 'icon-tool-text-manipulation-underline',
    toolName: Tools.ToolNames.UNDERLINE,
  });

  const underlineToolButton2 = new instance.UI.Components.ToolButton({
    dataElement: 'underlineToolButton2',
    title: 'annotation.underline',
    img: 'icon-tool-text-manipulation-underline',
    toolName: Tools.ToolNames.UNDERLINE2,
  });

  const highlightToolButton = new instance.UI.Components.ToolButton({
    dataElement: 'highlightToolButton',
    title: 'annotation.highlight',
    img: 'icon-tool-text-manipulation-highlight',
    toolName: Tools.ToolNames.HIGHLIGHT,
  });

  // ** Shapes Tools ** //
  const rectangleToolButton = new instance.UI.Components.ToolButton({
    dataElement: 'rectangleToolButton',
    title: 'annotation.rectangle',
    img: 'icon-tool-shape-rectangle',
    toolName: Tools.ToolNames.RECTANGLE,
  });

  const rectangleToolButton2 = new instance.UI.Components.ToolButton({
    dataElement: 'rectangleToolButton2',
    title: 'annotation.rectangle',
    img: 'icon-tool-shape-rectangle',
    toolName: Tools.ToolNames.RECTANGLE2,
  });

  const freeHandHighlightToolButton = new instance.UI.Components.ToolButton({
    dataElement: 'freeHandHighlightToolButton',
    title: 'annotation.freeHandHighlight',
    img: 'icon-tool-pen-highlight',
    toolName: Tools.ToolNames.FREEHAND_HIGHLIGHT,
  });


  // ** Insert Tools ** //
  const rubberStampToolButton = new instance.UI.Components.ToolButton({
    dataElement: 'rubberStampToolButton',
    title: 'annotation.rubberStamp',
    img: 'icon-tool-stamp-line',
    toolName: Tools.ToolNames.RUBBER_STAMP,
  });

  // ** Measure Tools ** //
  const distanceMeasurementToolButton = new instance.UI.Components.ToolButton({
    dataElement: 'distanceMeasurementToolButton',
    title: 'annotation.distanceMeasurement',
    img: 'icon-tool-measurement-distance-line',
    toolName: Tools.ToolNames.DISTANCE_MEASUREMENT,
  });

  const areaMeasurementToolButton = new instance.UI.Components.ToolButton({
    dataElement: 'areaMeasurementToolButton',
    title: 'annotation.areaMeasurement',
    img: 'icon-tool-measurement-area-polygon-line',
    toolName: Tools.ToolNames.AREA_MEASUREMENT,
  });

  // ** Edit Tools ** //
  const cropToolButton = new instance.UI.Components.ToolButton({
    dataElement: 'cropToolButton',
    title: 'annotation.crop',
    img: 'ic_crop_black_24px',
    toolName: Tools.ToolNames.CROP,
  });

  // ** Grouped Items ** //

  // This group is made up of the style panel, undo, redo, and eraser
  // not all ribbons support these but it DRYs up the code
  const defaultAnnotationUtilities = new instance.UI.Components.GroupedItems({
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
  const annotateGroupedItems = new instance.UI.Components.GroupedItems({
    dataElement: 'annotateGroupedItems',
    justifyContent: 'center',
    items: [
      underlineToolButton,
      underlineToolButton2,
      highlightToolButton,
      defaultAnnotationUtilities,
    ],
  });

  const shapesGroupedItems = new instance.UI.Components.GroupedItems({
    dataElement: 'shapesGroupedItems',
    items: [
      rectangleToolButton,
      rectangleToolButton2,
      freeHandHighlightToolButton,
      annotateGroupedItems
    ],
  });

  const insertGroupedItems = new instance.UI.Components.GroupedItems({
    dataElement: 'insertGroupedItems',
    items: [
      rubberStampToolButton,
      undoButton,
      redoButton,
      eraserToolButton
    ],
  });

  const measureGroupedItems = new instance.UI.Components.GroupedItems({
    dataElement: 'measureGroupedItems',
    items: [
      distanceMeasurementToolButton,
      areaMeasurementToolButton,
      annotateGroupedItems
    ],
  });

  const editGroupedItems = new instance.UI.Components.GroupedItems({
    dataElement: 'editGroupedItems',
    items: [
      cropToolButton,
      undoButton,
      redoButton,
      eraserToolButton
    ],
  });

  const fillAndSignGroupedItems = new instance.UI.Components.GroupedItems({
    dataElement: 'fillAndSignGroupedItems',
    items: [
      rubberStampToolButton,
      annotateGroupedItems
    ],
  });

  const groupedLeftHeaderButtons = new instance.UI.Components.GroupedItems({
    dataElement: 'groupedLeftHeaderButtons',
    alwaysVisible: true,
    grow: 1,
    items: [
      menuOverlayToggle,
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
  const viewRibbonItem = new instance.UI.Components.RibbonItem({
    dataElement: 'view-ribbon-item',
    label: 'View',
    title: 'View',
    toolbarGroup: 'toolbarGroup-View',
    type: 'ribbonItem',
    groupedItems: []
  });
  const annotateRibbonItem = new instance.UI.Components.RibbonItem({
    dataElement: 'annotations-ribbon-item',
    label: 'Annotate',
    title: 'Annotate',
    toolbarGroup: 'toolbarGroup-Annotate',
    type: 'ribbonItem',
    groupedItems: [annotateGroupedItems]
  });

  const shapesRibbomItem = new instance.UI.Components.RibbonItem({
    dataElement: 'shapes-ribbon-item',
    label: 'Shapes',
    title: 'Shapes',
    toolbarGroup: 'toolbarGroup-Shapes',
    type: 'ribbonItem',
    groupedItems: [shapesGroupedItems]
  });

  const insertRibbonItem = new instance.UI.Components.RibbonItem({
    dataElement: 'insert-ribbon-item',
    label: 'Insert',
    title: 'Insert',
    toolbarGroup: 'toolbarGroup-Insert',
    groupedItems: [insertGroupedItems]
  });

  const measureRibbonItem = new instance.UI.Components.RibbonItem({
    dataElement: 'measure-ribbon-item',
    label: 'Measure',
    title: 'Measure',
    toolbarGroup: 'toolbarGroup-Measure',
    groupedItems: [measureGroupedItems]
  });

  const editRibbonItem = new instance.UI.Components.RibbonItem({
    dataElement: 'edit-ribbon-item',
    label: 'Edit',
    title: 'Edit',
    toolbarGroup: 'toolbarGroup-Edit',
    groupedItems: [editGroupedItems]
  });

  const fillAndSignRibbonItem = new instance.UI.Components.RibbonItem({
    dataElement: 'fillAndSign-ribbon-item',
    label: 'Fill and Sign',
    title: 'Fill and Sign',
    toolbarGroup: 'toolbarGroup-FillAndSign',
    groupedItems: [fillAndSignGroupedItems]
  });

  // Ribbon Group
  const ribbonGroup = new instance.UI.Components.RibbonGroup({
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
      editRibbonItem,
      fillAndSignRibbonItem,
    ],
  });


  // Search Panel Toggle
  const searchPanelToggle = new instance.UI.Components.ToggleElementButton({
    dataElement: 'searchPanelToggle',
    toggleElement: 'searchPanel',
    img: 'icon-header-search',
    title: 'component.searchPanel',
  });

  // Notes Panel Toggle
  const notesPanelToggle = new instance.UI.Components.ToggleElementButton({
    dataElement: 'notesPanelToggle',
    toggleElement: 'notesPanel',
    img: 'icon-header-chat-line',
    title: 'component.notesPanel',
  });

  // Const Primary Header
  const primaryHeader = new instance.UI.Components.ModularHeader({
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

  const topToolsHeader = new instance.UI.Components.ModularHeader({
    dataElement: 'tools-header',
    placement: 'top',
    justifyContent: 'center',
    position: 'end',
    items: [
      annotateGroupedItems,
      shapesGroupedItems,
      insertGroupedItems,
      measureGroupedItems,
      editGroupedItems,
      fillAndSignGroupedItems,
    ],
  });

  instance.UI.addModularHeaders([
    primaryHeader,
    topToolsHeader,
  ]);
});