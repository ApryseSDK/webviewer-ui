export const mockHeaders = [
  {
    dataElement: 'default-top-header',
    placement: 'top',
    grow: 0,
    gap: 12,
    position: 'start',
    'float': false,
    items: [
      {
        dataElement: 'groupedLeftHeaderButtons',
        grow: 1,
        gap: 12,
        items: [
          {
            dataElement: 'menuOverlayToggle',
            title: 'component.menuOverlay',
            type: 'customButton',
            img: 'ic-hamburger-menu'
          },
          {
            type: 'divider',
            dataElement: 'divider-1'
          },
          {
            dataElement: 'left-panel-toggle',
            title: 'Left Panel',
            type: 'toggleButton',
            img: 'icon-header-sidebar-line',
            toggleElement: 'leftPanel'
          },
          {
            dataElement: 'viewControlsToggle',
            title: 'component.viewControlsOverlay',
            type: 'customButton',
            img: 'icon-header-page-manipulation-line'
          },
          {
            dataElement: 'zoom-container',
            type: 'zoom'
          },
          {
            dataElement: 'panToolButton',
            title: 'tool.pan',
            type: 'toolButton',
            img: 'icon-header-pan',
            toolName: 'Pan'
          },
          {
            dataElement: 'annotationEditToolButton',
            title: 'tool.select',
            type: 'toolButton',
            img: 'multi select',
            toolName: 'AnnotationEdit'
          }
        ],
        type: 'groupedItems',
        alwaysVisible: true,
        style: {},
      },
      {
        dataElement: 'default-ribbon-group',
        justifyContent: 'start',
        grow: 2,
        gap: 12,
        items: [
          {
            dataElement: 'view-ribbon-item',
            title: 'View',
            type: 'ribbonItem',
            label: 'View',
            toolbarGroup: 'toolbarGroup-View',
            direction: 'row',
            groupedItems: [],
            sortIndex: 0,
            justifyContent: 'start'
          },
          {
            dataElement: 'annotations-ribbon-item',
            title: 'Annotate',
            type: 'ribbonItem',
            label: 'Annotate',
            toolbarGroup: 'toolbarGroup-Annotate',
            direction: 'row',
            groupedItems: [
              {
                dataElement: 'annotateGroupedItems',
                justifyContent: 'center',
                grow: 0,
                gap: 12,
                items: [
                  {
                    dataElement: 'underlineToolButton',
                    title: 'annotation.underline',
                    type: 'toolButton',
                    img: 'icon-tool-text-manipulation-underline',
                    toolName: 'AnnotationCreateTextHighlight'
                  },
                  {
                    dataElement: 'undoToolButton',
                    title: 'action.undo',
                    type: 'customButton',
                    img: 'icon-operation-undo'
                  },
                  {
                    dataElement: 'redoToolButton',
                    title: 'action.redo',
                    type: 'customButton',
                    img: 'icon-operation-redo'
                  },
                  {
                    dataElement: 'eraserToolButton',
                    title: 'annotation.eraser',
                    type: 'toolButton',
                    img: 'icon-operation-eraser',
                    toolName: 'AnnotationEraserTool'
                  }
                ],
                type: 'groupedItems',
                alwaysVisible: false,
                style: {},
              }
            ],
            sortIndex: 1,
            justifyContent: 'start'
          },
          {
            dataElement: 'shapes-ribbon-item',
            title: 'Shapes',
            type: 'ribbonItem',
            label: 'Shapes',
            toolbarGroup: 'toolbarGroup-Shapes',
            direction: 'row',
            groupedItems: [
              {
                dataElement: 'shapesGroupedItems',
                grow: 0,
                gap: 12,
                items: [
                  {
                    dataElement: 'rectangleToolButton',
                    title: 'annotation.rectangle',
                    type: 'toolButton',
                    img: 'icon-tool-shape-rectangle',
                    toolName: 'AnnotationCreateRectangle'
                  },
                  {
                    dataElement: 'undoToolButton',
                    title: 'action.undo',
                    type: 'customButton',
                    img: 'icon-operation-undo'
                  },
                  {
                    dataElement: 'redoToolButton',
                    title: 'action.redo',
                    type: 'customButton',
                    img: 'icon-operation-redo'
                  },
                  {
                    dataElement: 'eraserToolButton',
                    title: 'annotation.eraser',
                    type: 'toolButton',
                    img: 'icon-operation-eraser',
                    toolName: 'AnnotationEraserTool'
                  }
                ],
                type: 'groupedItems',
                alwaysVisible: false,
                style: {},
              }
            ],
            sortIndex: 2,
            justifyContent: 'start'
          },
          {
            dataElement: 'insert-ribbon-item',
            title: 'Insert',
            type: 'ribbonItem',
            label: 'Insert',
            toolbarGroup: 'toolbarGroup-Insert',
            direction: 'row',
            groupedItems: [
              {
                dataElement: 'insertGroupedItems',
                grow: 0,
                gap: 12,
                items: [
                  {
                    dataElement: 'rubberStampToolButton',
                    title: 'annotation.rubberStamp',
                    type: 'toolButton',
                    img: 'icon-tool-stamp-line',
                    toolName: 'AnnotationCreateRubberStamp'
                  },
                  {
                    dataElement: 'undoToolButton',
                    title: 'action.undo',
                    type: 'customButton',
                    img: 'icon-operation-undo'
                  },
                  {
                    dataElement: 'redoToolButton',
                    title: 'action.redo',
                    type: 'customButton',
                    img: 'icon-operation-redo'
                  },
                  {
                    dataElement: 'eraserToolButton',
                    title: 'annotation.eraser',
                    type: 'toolButton',
                    img: 'icon-operation-eraser',
                    toolName: 'AnnotationEraserTool'
                  }
                ],
                type: 'groupedItems',
                alwaysVisible: false,
                style: {},
              }
            ],
            sortIndex: 3,
            justifyContent: 'start'
          },
          {
            dataElement: 'measure-ribbon-item',
            title: 'Measure',
            type: 'ribbonItem',
            label: 'Measure',
            toolbarGroup: 'toolbarGroup-Measure',
            direction: 'row',
            groupedItems: [
              {
                dataElement: 'measureGroupedItems',
                grow: 0,
                gap: 12,
                items: [
                  {
                    dataElement: 'distanceMeasurementToolButton',
                    title: 'annotation.distanceMeasurement',
                    type: 'toolButton',
                    img: 'icon-tool-measurement-distance-line',
                    toolName: 'AnnotationCreateDistanceMeasurement'
                  },
                  {
                    dataElement: 'undoToolButton',
                    title: 'action.undo',
                    type: 'customButton',
                    img: 'icon-operation-undo'
                  },
                  {
                    dataElement: 'redoToolButton',
                    title: 'action.redo',
                    type: 'customButton',
                    img: 'icon-operation-redo'
                  },
                  {
                    dataElement: 'eraserToolButton',
                    title: 'annotation.eraser',
                    type: 'toolButton',
                    img: 'icon-operation-eraser',
                    toolName: 'AnnotationEraserTool'
                  }
                ],
                type: 'groupedItems',
                alwaysVisible: false,
                style: {},
              }
            ],
            sortIndex: 4,
            justifyContent: 'start'
          },
          {
            dataElement: 'edit-ribbon-item',
            title: 'Edit',
            type: 'ribbonItem',
            label: 'Edit',
            toolbarGroup: 'toolbarGroup-Edit',
            direction: 'row',
            groupedItems: [
              {
                dataElement: 'editGroupedItems',
                grow: 0,
                gap: 12,
                items: [
                  {
                    dataElement: 'cropToolButton',
                    title: 'annotation.crop',
                    type: 'toolButton',
                    img: 'ic_crop_black_24px',
                    toolName: 'CropPage'
                  },
                  {
                    dataElement: 'undoToolButton',
                    title: 'action.undo',
                    type: 'customButton',
                    img: 'icon-operation-undo'
                  },
                  {
                    dataElement: 'redoToolButton',
                    title: 'action.redo',
                    type: 'customButton',
                    img: 'icon-operation-redo'
                  },
                  {
                    dataElement: 'eraserToolButton',
                    title: 'annotation.eraser',
                    type: 'toolButton',
                    img: 'icon-operation-eraser',
                    toolName: 'AnnotationEraserTool'
                  }
                ],
                type: 'groupedItems',
                alwaysVisible: false,
                style: {},
              }
            ],
            sortIndex: 5,
            justifyContent: 'start'
          },
          {
            dataElement: 'fillAndSign-ribbon-item',
            title: 'Fill and Sign',
            type: 'ribbonItem',
            label: 'Fill and Sign',
            toolbarGroup: 'toolbarGroup-FillAndSign',
            direction: 'row',
            groupedItems: [
              {
                dataElement: 'fillAndSignGroupedItems',
                grow: 0,
                gap: 12,
                items: [
                  {
                    dataElement: 'rubberStampToolButton',
                    title: 'annotation.rubberStamp',
                    type: 'toolButton',
                    img: 'icon-tool-stamp-line',
                    toolName: 'AnnotationCreateRubberStamp'
                  },
                  {
                    dataElement: 'undoToolButton',
                    title: 'action.undo',
                    type: 'customButton',
                    img: 'icon-operation-undo'
                  },
                  {
                    dataElement: 'redoToolButton',
                    title: 'action.redo',
                    type: 'customButton',
                    img: 'icon-operation-redo'
                  },
                  {
                    dataElement: 'eraserToolButton',
                    title: 'annotation.eraser',
                    type: 'toolButton',
                    img: 'icon-operation-eraser',
                    toolName: 'AnnotationEraserTool'
                  }
                ],
                type: 'groupedItems',
                alwaysVisible: false,
                style: {},
              }
            ],
            sortIndex: 6,
            justifyContent: 'start'
          }
        ],
        type: 'ribbonGroup',
        alwaysVisible: false,
        style: {},
        store: {
          liftedStore: {}
        }
      },
      {
        dataElement: 'searchPanelToggle',
        title: 'component.searchPanel',
        type: 'toggleButton',
        img: 'icon-header-search',
        toggleElement: 'searchPanel'
      },
      {
        dataElement: 'notesPanelToggle',
        title: 'component.notesPanel',
        type: 'toggleButton',
        img: 'icon-header-chat-line',
        toggleElement: 'notesPanel'
      }
    ],
    itemValidTypes: [
      'customButton',
      'statefulButton',
      'groupedItems',
      'groupedTools',
      'ribbonItem',
      'divider',
      'toggleButton',
      'ribbonGroup',
      'toolGroupButton',
      'toolButton',
      'zoom',
      'flyout'
    ],
    stroke: true,
    dimension: {
      paddingTop: 8,
      paddingBottom: 8,
      borderWidth: 1
    },
    style: {}
  },
  {
    dataElement: 'tools-header',
    placement: 'top',
    justifyContent: 'center',
    grow: 0,
    gap: 12,
    position: 'end',
    'float': false,
    items: [
      {
        dataElement: 'annotateGroupedItems',
        justifyContent: 'center',
        grow: 0,
        gap: 12,
        items: [
          {
            dataElement: 'underlineToolButton',
            title: 'annotation.underline',
            type: 'toolButton',
            img: 'icon-tool-text-manipulation-underline',
            toolName: 'AnnotationCreateTextHighlight'
          },
          {
            dataElement: 'undoToolButton',
            title: 'action.undo',
            type: 'customButton',
            img: 'icon-operation-undo'
          },
          {
            dataElement: 'redoToolButton',
            title: 'action.redo',
            type: 'customButton',
            img: 'icon-operation-redo'
          },
          {
            dataElement: 'eraserToolButton',
            title: 'annotation.eraser',
            type: 'toolButton',
            img: 'icon-operation-eraser',
            toolName: 'AnnotationEraserTool'
          }
        ],
        type: 'groupedItems',
        alwaysVisible: false,
        style: {},
      },
      {
        dataElement: 'shapesGroupedItems',
        grow: 0,
        gap: 12,
        items: [
          {
            dataElement: 'rectangleToolButton',
            title: 'annotation.rectangle',
            type: 'toolButton',
            img: 'icon-tool-shape-rectangle',
            toolName: 'AnnotationCreateRectangle'
          },
          {
            dataElement: 'undoToolButton',
            title: 'action.undo',
            type: 'customButton',
            img: 'icon-operation-undo'
          },
          {
            dataElement: 'redoToolButton',
            title: 'action.redo',
            type: 'customButton',
            img: 'icon-operation-redo'
          },
          {
            dataElement: 'eraserToolButton',
            title: 'annotation.eraser',
            type: 'toolButton',
            img: 'icon-operation-eraser',
            toolName: 'AnnotationEraserTool'
          }
        ],
        type: 'groupedItems',
        alwaysVisible: false,
        style: {},
      },
      {
        dataElement: 'insertGroupedItems',
        grow: 0,
        gap: 12,
        items: [
          {
            dataElement: 'rubberStampToolButton',
            title: 'annotation.rubberStamp',
            type: 'toolButton',
            img: 'icon-tool-stamp-line',
            toolName: 'AnnotationCreateRubberStamp'
          },
          {
            dataElement: 'undoToolButton',
            title: 'action.undo',
            type: 'customButton',
            img: 'icon-operation-undo'
          },
          {
            dataElement: 'redoToolButton',
            title: 'action.redo',
            type: 'customButton',
            img: 'icon-operation-redo'
          },
          {
            dataElement: 'eraserToolButton',
            title: 'annotation.eraser',
            type: 'toolButton',
            img: 'icon-operation-eraser',
            toolName: 'AnnotationEraserTool'
          }
        ],
        type: 'groupedItems',
        alwaysVisible: false,
        style: {},
      },
      {
        dataElement: 'measureGroupedItems',
        grow: 0,
        gap: 12,
        items: [
          {
            dataElement: 'distanceMeasurementToolButton',
            title: 'annotation.distanceMeasurement',
            type: 'toolButton',
            img: 'icon-tool-measurement-distance-line',
            toolName: 'AnnotationCreateDistanceMeasurement'
          },
          {
            dataElement: 'undoToolButton',
            title: 'action.undo',
            type: 'customButton',
            img: 'icon-operation-undo'
          },
          {
            dataElement: 'redoToolButton',
            title: 'action.redo',
            type: 'customButton',
            img: 'icon-operation-redo'
          },
          {
            dataElement: 'eraserToolButton',
            title: 'annotation.eraser',
            type: 'toolButton',
            img: 'icon-operation-eraser',
            toolName: 'AnnotationEraserTool'
          }
        ],
        type: 'groupedItems',
        alwaysVisible: false,
        style: {},
      },
      {
        dataElement: 'editGroupedItems',
        grow: 0,
        gap: 12,
        items: [
          {
            dataElement: 'cropToolButton',
            title: 'annotation.crop',
            type: 'toolButton',
            img: 'ic_crop_black_24px',
            toolName: 'CropPage'
          },
          {
            dataElement: 'undoToolButton',
            title: 'action.undo',
            type: 'customButton',
            img: 'icon-operation-undo'
          },
          {
            dataElement: 'redoToolButton',
            title: 'action.redo',
            type: 'customButton',
            img: 'icon-operation-redo'
          },
          {
            dataElement: 'eraserToolButton',
            title: 'annotation.eraser',
            type: 'toolButton',
            img: 'icon-operation-eraser',
            toolName: 'AnnotationEraserTool'
          }
        ],
        type: 'groupedItems',
        alwaysVisible: false,
        style: {},
      },
      {
        dataElement: 'fillAndSignGroupedItems',
        grow: 0,
        gap: 12,
        items: [
          {
            dataElement: 'rubberStampToolButton',
            title: 'annotation.rubberStamp',
            type: 'toolButton',
            img: 'icon-tool-stamp-line',
            toolName: 'AnnotationCreateRubberStamp'
          },
          {
            dataElement: 'undoToolButton',
            title: 'action.undo',
            type: 'customButton',
            img: 'icon-operation-undo'
          },
          {
            dataElement: 'redoToolButton',
            title: 'action.redo',
            type: 'customButton',
            img: 'icon-operation-redo'
          },
          {
            dataElement: 'eraserToolButton',
            title: 'annotation.eraser',
            type: 'toolButton',
            img: 'icon-operation-eraser',
            toolName: 'AnnotationEraserTool'
          }
        ],
        type: 'groupedItems',
        alwaysVisible: false,
        style: {},
      }
    ],
    itemValidTypes: [
      'customButton',
      'statefulButton',
      'groupedItems',
      'groupedTools',
      'ribbonItem',
      'divider',
      'toggleButton',
      'ribbonGroup',
      'toolGroupButton',
      'toolButton',
      'zoom',
      'flyout'
    ],
    stroke: true,
    dimension: {
      paddingTop: 8,
      paddingBottom: 8,
      borderWidth: 1
    },
    style: {
      backgroundColor: '#e7ebee'
    }
  }
];

const styleToggleButton = {
  dataElement: 'stylePanelToggle',
  toggleElement: 'stylePanel',
  img: 'icon-style-panel-toggle',
  title: 'component.notesPanel',
  type: 'toggleButton'
};
const newHeaders = [...mockHeaders];
newHeaders[0] = { ...newHeaders[0], items: [...newHeaders[0].items, styleToggleButton] };
export const mockHeadersWithStyleButton = (newHeaders);