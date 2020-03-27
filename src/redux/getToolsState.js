import React from 'react';
import core from 'core';
import SignatureToolButton from 'components/SignatureToolButton';
import actions from 'actions';
// import ToolsOverlay from 'components/ToolsOverlay';
import defaultTool from 'constants/defaultTool';


const getTools = () => {
  const desktopState = [
    { type: 'spacer' },
    { type: 'toolGroupButton', toolGroup: 'freeHandTools', dataElement: 'freeHandToolGroupButton', title: 'component.freehandToolsButton' },
    { type: 'toolGroupButton', toolGroup: 'shapeTools', dataElement: 'shapeToolGroupButton', title: 'component.shapeToolsButton' },
    { type: 'toolGroupButton', toolGroup: 'textTools', dataElement: 'textToolGroupButton', title: 'component.textToolsButton' },
    { type: 'toolGroupButton', toolGroup: 'textTools2', dataElement: 'textToolGroupButton2', title: 'component.textToolsButton' },
    { type: 'toolGroupButton', toolGroup: 'measurementTools', dataElement: 'measurementToolGroupButton', title: 'component.measurementToolsButton' },
    { type: 'toolGroupButton', toolGroup: 'freeTextTools', dataElement: 'freeTextToolGroupButton', title: 'component.freeTextToolsButton' },
    { type: 'toolGroupButton', toolGroup: 'stickyTools', dataElement: 'stickyToolGroupButton', title: 'component.stickyToolsButton' },
    // { type: 'toggleElementButton', toolName: 'AnnotationCreateRedaction', className: 'redactHeader', dataElement: 'redactionButton', element: 'redactionOverlay', img: 'ic_annotation_add_redact_black_24px', title: 'component.redaction' },
    {
      type: 'customElement',
      render: () => <SignatureToolButton />,
      // dataElement: 'signatureToolButton',
    },
    { type: 'toolGroupButton', toolGroup: 'miscTools', img: 'icon-tools-more', dataElement: 'miscToolGroupButton', title: 'component.miscToolsButton' },
    {
      type: 'customElement',
      render: () => {
        const ToolsOverlay = require('components/ToolsOverlay').default;
        return (<ToolsOverlay />);
      },
      dataElement: 'toolsOverlay',
    },
    { type: 'divider' },
    {
      type: 'actionButton',
      dataElement: 'undoButton',
      titile: 'action.close',
      img: 'icon-operation-undo',
      onClick: () => {
        core.undo();
      },
    },
    {
      type: 'actionButton',
      dataElement: 'redoButton',
      titile: 'action.close',
      img: 'icon-operation-redo',
      onClick: () => {
        core.redo();
      },
    },
    { type: 'toolButton', toolName: 'AnnotationEraserTool' },
    { type: 'spacer' },
  ];

  const tabletState = [
    { type: 'spacer' },
    { type: 'toolGroupButton', toolGroup: 'textTools', dataElement: 'textToolGroupButton', title: 'component.textToolsButton' },
    { type: 'toolGroupButton', toolGroup: 'textTools2', dataElement: 'textToolGroupButton2', title: 'component.textToolsButton' },
    { type: 'toolGroupButton', toolGroup: 'freeHandAndShapeTools', dataElement: 'freeHandToolGroupButton', title: 'component.freeHandAndShapeToolsButton', img: 'icon - tool - pen and shape - phone - line' },
    // { type: 'toolGroupButton', toolGroup: 'shapeTools', dataElement: 'shapeToolGroupButton', title: 'component.shapeToolsButton' },
    { type: 'toolGroupButton', toolGroup: 'freeTextTools', dataElement: 'freeTextToolGroupButton', title: 'component.freeTextToolsButton' },
    { type: 'toolGroupButton', toolGroup: 'stickyTools', dataElement: 'stickyToolGroupButton', title: 'component.stickyToolsButton' },
    {
      type: 'customElement',
      render: () => <SignatureToolButton />,
      // dataElement: 'signatureToolButton',
    },

    { type: 'toolGroupButton', toolGroup: 'measurementTools', dataElement: 'measurementToolGroupButton', title: 'component.measurementToolsButton' },
    // { type: 'toggleElementButton', toolName: 'AnnotationCreateRedaction', className: 'redactHeader', dataElement: 'redactionButton', element: 'redactionOverlay', img: 'ic_annotation_add_redact_black_24px', title: 'component.redaction' },

    { type: 'toolGroupButton', toolGroup: 'miscTools', img: 'icon-tools-more', dataElement: 'miscToolGroupButton', title: 'component.miscToolsButton' },
    { type: 'divider' },
    {
      type: 'actionButton',
      dataElement: 'undoButton',
      titile: 'action.close',
      img: 'icon-operation-undo',
      onClick: () => {
        core.undo();
      },
    },
    {
      type: 'actionButton',
      dataElement: 'redoButton',
      titile: 'action.close',
      img: 'icon-operation-redo',
      onClick: () => {
        core.redo();
      },
    },
    { type: 'toolButton', toolName: 'AnnotationEraserTool' },
    { type: 'spacer' },
    {
      type: 'actionButton',
      dataElement: 'closeToolsButton',
      titile: 'action.close',
      img: 'ic_close_black_24px',
      style: { position: 'absolute', right: 0 },
      onClick: dispatch => {
        dispatch(actions.closeElements(['toolsHeader', 'toolsOverlay']));
        core.setToolMode(defaultTool);
        dispatch(actions.setActiveToolGroup(''));
      },
    },
  ];

  const mobileState = [
    { type: 'toolGroupButton', toolGroup: 'textTools', dataElement: 'textToolGroupButton', title: 'component.textToolsButton' },
    // { type: 'toolGroupButton', toolGroup: 'textTools2', dataElement: 'textToolGroupButton2', title: 'component.textToolsButton' },
    { type: 'toolGroupButton', toolGroup: 'freeHandTools', dataElement: 'freeHandToolGroupButton', title: 'component.freehandToolsButton', img: 'icon - tool - pen and shape - phone - line' },
    // { type: 'toolGroupButton', toolGroup: 'shapeTools', dataElement: 'shapeToolGroupButton', title: 'component.shapeToolsButton' },
    { type: 'toolGroupButton', toolGroup: 'freeTextTools', dataElement: 'freeTextToolGroupButton', title: 'component.freeTextToolsButton' },
    // { type: 'toolGroupButton', toolGroup: 'stickyTools', dataElement: 'stickyToolGroupButton', title: 'component.stickyToolsButton' },
    {
      type: 'customElement',
      render: () => <SignatureToolButton />,
      // dataElement: 'signatureToolButton',
    },

    { type: 'toolGroupButton', toolGroup: 'measurementTools', dataElement: 'measurementToolGroupButton', title: 'component.measurementToolsButton' },
    // { type: 'toggleElementButton', toolName: 'AnnotationCreateRedaction', className: 'redactHeader', dataElement: 'redactionButton', element: 'redactionOverlay', img: 'ic_annotation_add_redact_black_24px', title: 'component.redaction' },

    { type: 'toolGroupButton', toolGroup: 'miscTools', img: 'icon-tools-more', dataElement: 'miscToolGroupButton', title: 'component.miscToolsButton' },
    {
      type: 'actionButton',
      dataElement: 'closeToolsButton',
      titile: 'action.close',
      img: 'ic_close_black_24px',
      style: { position: 'absolute', right: 0 },
      onClick: dispatch => {
        dispatch(actions.closeElements(['toolsHeader', 'toolsOverlay']));
        core.setToolMode(defaultTool);
        dispatch(actions.setActiveToolGroup(''));
      },
    },
  ];

  if (window.matchMedia('(max-width: 640px)').matches) {
    return mobileState;
  }
  if (window.matchMedia('(max-width: 900px)').matches) {
    return tabletState;
  }
  return desktopState;
};

const getToolButtonObjects = () => {
  const desktopState = {
    AnnotationCreateDistanceMeasurement: { dataElement: 'distanceMeasurementToolButton', title: 'annotation.distanceMeasurement', img: 'ic_annotation_distance_black_24px', group: 'measurementTools', showColor: 'active' },
    AnnotationCreatePerimeterMeasurement: { dataElement: 'perimeterMeasurementToolButton', title: 'annotation.perimeterMeasurement', img: 'ic_annotation_perimeter_black_24px', group: 'measurementTools', showColor: 'active' },
    AnnotationCreateAreaMeasurement: { dataElement: 'areaMeasurementToolButton', title: 'annotation.areaMeasurement', img: 'ic_annotation_area_black_24px', group: 'measurementTools', showColor: 'active' },
    AnnotationCreateFreeHand: { dataElement: 'freeHandToolButton', title: 'annotation.freehand', img: 'icon-tool-pen-line', group: 'freeHandTools', showColor: 'always' },
    AnnotationCreateFreeHand2: { dataElement: 'freeHandToolButton2', title: 'annotation.freehand2', img: 'icon-tool-pen-line', group: 'freeHandTools', showColor: 'always' },
    AnnotationCreateFreeHand3: { dataElement: 'freeHandToolButton3', title: 'annotation.freehand2', img: 'icon-tool-pen-line', group: 'freeHandTools', showColor: 'always' },
    AnnotationCreateFreeHand4: { dataElement: 'freeHandToolButton4', title: 'annotation.freehand2', img: 'icon-tool-pen-line', group: 'freeHandTools', showColor: 'always' },
    AnnotationCreateTextHighlight: { dataElement: 'highlightToolButton', title: 'annotation.highlight', img: 'icon-tool-text-manipulation-highlight', group: 'textTools', showColor: 'always' },
    AnnotationCreateTextHighlight2: { dataElement: 'highlightToolButton2', title: 'annotation.highlight2', img: 'icon-tool-text-manipulation-highlight', group: 'textTools', showColor: 'always' },
    AnnotationCreateTextHighlight3: { dataElement: 'highlightToolButton3', title: 'annotation.highlight2', img: 'icon-tool-text-manipulation-highlight', group: 'textTools', showColor: 'always' },
    AnnotationCreateTextHighlight4: { dataElement: 'highlightToolButton4', title: 'annotation.highlight2', img: 'icon-tool-text-manipulation-highlight', group: 'textTools', showColor: 'always' },
    AnnotationCreateTextUnderline: { dataElement: 'underlineToolButton', title: 'annotation.underline', img: 'icon-tool-text-manipulation-underline', group: 'textTools2', showColor: 'always' },
    AnnotationCreateTextUnderline2: { dataElement: 'underlineToolButton', title: 'annotation.underline', img: 'icon-tool-text-manipulation-underline', group: 'textTools2', showColor: 'always' },
    AnnotationCreateTextSquiggly: { dataElement: 'squigglyToolButton', title: 'annotation.squiggly', img: 'icon-tool-text-manipulation-squiggly', group: 'textTools2', showColor: 'always' },
    AnnotationCreateTextStrikeout: { dataElement: 'strikeoutToolButton', title: 'annotation.strikeout', img: 'icon-tool-text-manipulation-strikethrough', group: 'textTools2', showColor: 'always' },

    AnnotationCreateFreeText: { dataElement: 'freeTextToolButton', title: 'annotation.freetext2', img: 'icon-tool-text-free-text', group: 'freeTextTools', showColor: 'always' },
    AnnotationCreateFreeText2: { dataElement: 'freeTextToolButton2', title: 'annotation.freetext2', img: 'icon-tool-text-free-text', group: 'freeTextTools', showColor: 'always' },
    AnnotationCreateFreeText3: { dataElement: 'freeTextToolButton3', title: 'annotation.freetext2', img: 'icon-tool-text-free-text', group: 'freeTextTools', showColor: 'always' },
    // AnnotationCreateFreeText4: { dataElement: 'freeTextToolButton4', title: 'annotation.freetext2', img: 'icon-tool-text-free-text', group: 'freeTextTools', showColor: 'always' },
    AnnotationCreateCallout: { dataElement: 'calloutToolButton', title: 'annotation.callout', img: 'icon-tool-callout-line', group: 'freeTextTools', showColor: 'always' },


    AnnotationCreateSticky: { dataElement: 'sitckyToolButton', title: 'annotation.stickyNote', img: 'icon-tool-comment-line', group: 'stickyTools', showColor: 'always' },
    AnnotationCreateSticky2: { dataElement: 'sitckyToolButton2', title: 'annotation.stickyNote', img: 'icon-tool-comment-line', group: 'stickyTools', showColor: 'always' },
    AnnotationCreateSticky3: { dataElement: 'sitckyToolButton3', title: 'annotation.stickyNote', img: 'icon-tool-comment-line', group: 'stickyTools', showColor: 'always' },
    AnnotationCreateSticky4: { dataElement: 'sitckyToolButton4', title: 'annotation.stickyNote', img: 'icon-tool-comment-line', group: 'stickyTools', showColor: 'always' },

    AnnotationCreateRectangle: { position: 0, dataElement: 'rectangleToolButton', title: 'annotation.rectangle', img: 'icon-tool-shape-rectangle', group: 'shapeTools', showColor: 'always' },
    AnnotationCreateEllipse: { position: 1, dataElement: 'ellipseToolButton', title: 'annotation.ellipse', img: 'icon-tool-shape-oval', group: 'shapeTools', showColor: 'always' },
    AnnotationCreateLine: { position: 2, dataElement: 'lineToolButton', title: 'annotation.line', img: 'icon-tool-shape-line', group: 'shapeTools', showColor: 'always' },
    AnnotationCreatePolyline: { position: 3, dataElement: 'polylineToolButton', title: 'annotation.polyline', img: 'icon-tool-shape-polyline', group: 'shapeTools', showColor: 'always' },
    AnnotationCreatePolygon: { position: 4, dataElement: 'polygonToolButton', title: 'annotation.polygon', img: 'icon-tool-shape-polygon', group: 'shapeTools', showColor: 'always' },
    AnnotationCreatePolygonCloud: { position: 5, dataElement: 'cloudToolButton', title: 'annotation.polygonCloud', img: 'icon-tool-shape-cloud', group: 'shapeTools', showColor: 'always' },
    AnnotationCreateArrow: { position: 6, dataElement: 'arrowToolButton', title: 'annotation.arrow', img: 'icon-tool-shape-arrow', group: 'shapeTools', showColor: 'always' },

    AnnotationCreateSignature: { dataElement: 'signatureToolButton', title: 'annotation.signature', img: 'icon-tool-signature', group: 'signatureTools', showColor: 'active' },

    AnnotationCreateStamp: { dataElement: 'stampToolButton', title: 'annotation.stamp', img: 'icon-tool-image-line', group: 'miscTools', showColor: 'active' },
    AnnotationCreateRubberStamp: { dataElement: 'rubberStampToolButton', title: 'annotation.rubberStamp', img: 'icon-tool-stamp-line', group: 'miscTools', showColor: 'active' },
    CropPage: { dataElement: 'cropToolButton', title: 'annotation.crop', img: 'ic_crop_black_24px', showColor: 'never', group: 'miscTools' },
    AnnotationCreateRedaction: { dataElement: 'redactionButton', title: 'option.redaction.markForRedaction', img: 'icon-tool-redaction-full-page', group: 'miscTools', showColor: 'never' },
    // CropPage2: { dataElement: 'cropToolButton', title: 'annotation.crop', img: 'ic_crop_black_24px', showColor: 'never', group: 'miscTools' },

    Pan: { dataElement: 'panToolButton', title: 'tool.pan', img: 'icon-header-pan', showColor: 'never' },
    AnnotationEdit: { dataElement: 'selectToolButton', title: 'tool.select', img: 'icon-header-select-line', showColor: 'never' },
    // For mobile
    TextSelect: { dataElement: 'textSelectButton', img: 'icon - header - select - line', showColor: 'never' },
    MarqueeZoomTool: { dataElement: 'marqueeToolButton', showColor: 'never' },
    AnnotationEraserTool: { dataElement: 'eraserToolButton', title: 'annotation.eraser', img: 'icon-operation-eraser', showColor: 'never' },
  };

  const tabletState = {
    AnnotationCreateDistanceMeasurement: { dataElement: 'distanceMeasurementToolButton', title: 'annotation.distanceMeasurement', img: 'ic_annotation_distance_black_24px', group: 'measurementTools', showColor: 'active' },
    AnnotationCreatePerimeterMeasurement: { dataElement: 'perimeterMeasurementToolButton', title: 'annotation.perimeterMeasurement', img: 'ic_annotation_perimeter_black_24px', group: 'measurementTools', showColor: 'active' },
    AnnotationCreateAreaMeasurement: { dataElement: 'areaMeasurementToolButton', title: 'annotation.areaMeasurement', img: 'ic_annotation_area_black_24px', group: 'measurementTools', showColor: 'active' },
    // AnnotationCreateFreeHand: { dataElement: 'freeHandToolButton', title: 'annotation.freehand', img: 'icon-tool-pen-line', group: 'freeHandTools', showColor: 'always' },
    // AnnotationCreateFreeHand2: { dataElement: 'freeHandToolButton2', title: 'annotation.freehand2', img: 'icon-tool-pen-line', group: 'freeHandTools', showColor: 'always' },
    // AnnotationCreateFreeHand3: { dataElement: 'freeHandToolButton3', title: 'annotation.freehand2', img: 'icon-tool-pen-line', group: 'freeHandTools', showColor: 'always' },
    // AnnotationCreateFreeHand4: { dataElement: 'freeHandToolButton4', title: 'annotation.freehand2', img: 'icon-tool-pen-line', group: 'freeHandTools', showColor: 'always' },
    AnnotationCreateTextHighlight: { dataElement: 'highlightToolButton', title: 'annotation.highlight', img: 'icon-tool-text-manipulation-highlight', group: 'textTools', showColor: 'always' },
    AnnotationCreateTextHighlight2: { dataElement: 'highlightToolButton2', title: 'annotation.highlight2', img: 'icon-tool-text-manipulation-highlight', group: 'textTools', showColor: 'always' },
    AnnotationCreateTextHighlight3: { dataElement: 'highlightToolButton3', title: 'annotation.highlight2', img: 'icon-tool-text-manipulation-highlight', group: 'textTools', showColor: 'always' },
    AnnotationCreateTextHighlight4: { dataElement: 'highlightToolButton4', title: 'annotation.highlight2', img: 'icon-tool-text-manipulation-highlight', group: 'textTools', showColor: 'always' },
    AnnotationCreateTextUnderline: { dataElement: 'underlineToolButton', title: 'annotation.underline', img: 'icon-tool-text-manipulation-underline', group: 'textTools2', showColor: 'always' },
    AnnotationCreateTextUnderline2: { dataElement: 'underlineToolButton', title: 'annotation.underline', img: 'icon-tool-text-manipulation-underline', group: 'textTools2', showColor: 'always' },
    AnnotationCreateTextSquiggly: { dataElement: 'squigglyToolButton', title: 'annotation.squiggly', img: 'icon-tool-text-manipulation-squiggly', group: 'textTools2', showColor: 'always' },
    AnnotationCreateTextStrikeout: { dataElement: 'strikeoutToolButton', title: 'annotation.strikeout', img: 'icon-tool-text-manipulation-strikethrough', group: 'textTools2', showColor: 'always' },


    AnnotationCreateFreeText: { dataElement: 'freeTextToolButton', title: 'annotation.freetext2', img: 'icon-tool-text-free-text', group: 'freeTextTools', showColor: 'always' },
    AnnotationCreateFreeText2: { dataElement: 'freeTextToolButton2', title: 'annotation.freetext2', img: 'icon-tool-text-free-text', group: 'freeTextTools', showColor: 'always' },
    AnnotationCreateFreeText3: { dataElement: 'freeTextToolButton3', title: 'annotation.freetext2', img: 'icon-tool-text-free-text', group: 'freeTextTools', showColor: 'always' },
    AnnotationCreateFreeText4: { dataElement: 'freeTextToolButton4', title: 'annotation.freetext2', img: 'icon-tool-text-free-text', group: 'freeTextTools', showColor: 'always' },

    AnnotationCreateSticky: { dataElement: 'sitckyToolButton', title: 'annotation.stickyNote', img: 'icon-tool-comment-line', group: 'stickyTools', showColor: 'always' },
    AnnotationCreateSticky2: { dataElement: 'sitckyToolButton2', title: 'annotation.stickyNote', img: 'icon-tool-comment-line', group: 'stickyTools', showColor: 'always' },
    AnnotationCreateSticky3: { dataElement: 'sitckyToolButton3', title: 'annotation.stickyNote', img: 'icon-tool-comment-line', group: 'stickyTools', showColor: 'always' },
    AnnotationCreateSticky4: { dataElement: 'sitckyToolButton4', title: 'annotation.stickyNote', img: 'icon-tool-comment-line', group: 'stickyTools', showColor: 'always' },


    AnnotationCreateFreeHand2: { position: 0, dataElement: 'freeHandToolButton2', title: 'annotation.freehand2', img: 'icon-tool-pen-line', group: 'freeHandAndShapeTools', showColor: 'always' },
    AnnotationCreateRectangle: { position: 1, dataElement: 'rectangleToolButton', title: 'annotation.rectangle', img: 'icon-tool-shape-rectangle', group: 'freeHandAndShapeTools', showColor: 'always' },
    AnnotationCreateEllipse: { position: 2, dataElement: 'ellipseToolButton', title: 'annotation.ellipse', img: 'icon-tool-shape-oval', group: 'freeHandAndShapeTools', showColor: 'always' },
    AnnotationCreateLine: { position: 3, dataElement: 'lineToolButton', title: 'annotation.line', img: 'icon-tool-shape-line', group: 'freeHandAndShapeTools', showColor: 'always' },
    AnnotationCreatePolyline: { position: 4, dataElement: 'polylineToolButton', title: 'annotation.polyline', img: 'icon-tool-shape-polyline', group: 'freeHandAndShapeTools', showColor: 'always' },
    AnnotationCreatePolygon: { position: 5, dataElement: 'polygonToolButton', title: 'annotation.polygon', img: 'icon-tool-shape-polygon', group: 'freeHandAndShapeTools', showColor: 'always' },
    AnnotationCreatePolygonCloud: { position: 6, dataElement: 'cloudToolButton', title: 'annotation.polygonCloud', img: 'icon-tool-shape-cloud', group: 'freeHandAndShapeTools', showColor: 'always' },
    AnnotationCreateArrow: { position: 7, dataElement: 'arrowToolButton', title: 'annotation.arrow', img: 'icon-tool-shape-arrow', group: 'freeHandAndShapeTools', showColor: 'always' },

    AnnotationCreateSignature: { dataElement: 'signatureToolButton', title: 'annotation.signature', img: 'icon-tool-signature', group: 'signatureTools', showColor: 'active' },
    // AnnotationCreateCallout: { dataElement: 'calloutToolButton', title: 'annotation.callout', img: 'icon-tool-callout-line', group: 'miscTools', showColor: 'always' },

    AnnotationCreateStamp: { dataElement: 'stampToolButton', title: 'annotation.stamp', img: 'icon-tool-image-line', group: 'miscTools', showColor: 'active' },
    AnnotationCreateRubberStamp: { dataElement: 'rubberStampToolButton', title: 'annotation.rubberStamp', img: 'icon-tool-stamp-line', group: 'miscTools', showColor: 'active' },
    CropPage: { dataElement: 'cropToolButton', title: 'annotation.crop', img: 'ic_crop_black_24px', showColor: 'never', group: 'miscTools' },
    AnnotationCreateRedaction: { dataElement: 'redactionButton', title: 'option.redaction.markForRedaction', img: 'icon-tool-redaction-full-page', group: 'miscTools', showColor: 'never' },

    Pan: { dataElement: 'panToolButton', title: 'tool.pan', img: 'icon-header-pan', showColor: 'never' },
    AnnotationEdit: { dataElement: 'selectToolButton', title: 'tool.select', img: 'icon-header-select-line', showColor: 'never' },
    // For mobile
    TextSelect: { dataElement: 'textSelectButton', img: 'icon - header - select - line', showColor: 'never' },
    MarqueeZoomTool: { dataElement: 'marqueeToolButton', showColor: 'never' },
    AnnotationEraserTool: { dataElement: 'eraserToolButton', title: 'annotation.eraser', img: 'icon-operation-eraser', showColor: 'never' },
  };

  const mobileState = {
    AnnotationCreateDistanceMeasurement: { dataElement: 'distanceMeasurementToolButton', title: 'annotation.distanceMeasurement', img: 'ic_annotation_distance_black_24px', group: 'measurementTools', showColor: 'active' },
    AnnotationCreatePerimeterMeasurement: { dataElement: 'perimeterMeasurementToolButton', title: 'annotation.perimeterMeasurement', img: 'ic_annotation_perimeter_black_24px', group: 'measurementTools', showColor: 'active' },
    AnnotationCreateAreaMeasurement: { dataElement: 'areaMeasurementToolButton', title: 'annotation.areaMeasurement', img: 'ic_annotation_area_black_24px', group: 'measurementTools', showColor: 'active' },
    // AnnotationCreateFreeHand: { dataElement: 'freeHandToolButton', title: 'annotation.freehand', img: 'icon-tool-pen-line', group: 'freeHandTools', showColor: 'always' },
    // AnnotationCreateFreeHand2: { dataElement: 'freeHandToolButton2', title: 'annotation.freehand2', img: 'icon-tool-pen-line', group: 'freeHandTools', showColor: 'always' },
    // AnnotationCreateFreeHand3: { dataElement: 'freeHandToolButton3', title: 'annotation.freehand2', img: 'icon-tool-pen-line', group: 'freeHandTools', showColor: 'always' },
    // AnnotationCreateFreeHand4: { dataElement: 'freeHandToolButton4', title: 'annotation.freehand2', img: 'icon-tool-pen-line', group: 'freeHandTools', showColor: 'always' },
    AnnotationCreateTextHighlight: { dataElement: 'highlightToolButton', title: 'annotation.highlight', img: 'icon-tool-text-manipulation-highlight', group: 'textTools', showColor: 'always' },
    // AnnotationCreateTextHighlight2: { dataElement: 'highlightToolButton2', title: 'annotation.highlight2', img: 'icon-tool-text-manipulation-highlight', group: 'textTools', showColor: 'always' },
    // AnnotationCreateTextHighlight3: { dataElement: 'highlightToolButton3', title: 'annotation.highlight2', img: 'icon-tool-text-manipulation-highlight', group: 'textTools', showColor: 'always' },
    // AnnotationCreateTextHighlight4: { dataElement: 'highlightToolButton4', title: 'annotation.highlight2', img: 'icon-tool-text-manipulation-highlight', group: 'textTools', showColor: 'always' },
    AnnotationCreateTextUnderline: { dataElement: 'underlineToolButton', title: 'annotation.underline', img: 'icon-tool-text-manipulation-underline', group: 'textTools', showColor: 'always' },
    AnnotationCreateTextSquiggly: { dataElement: 'squigglyToolButton', title: 'annotation.squiggly', img: 'icon-tool-text-manipulation-squiggly', group: 'textTools', showColor: 'always' },
    AnnotationCreateTextStrikeout: { dataElement: 'strikeoutToolButton', title: 'annotation.strikeout', img: 'icon-tool-text-manipulation-strikethrough', group: 'textTools', showColor: 'always' },

    AnnotationCreateFreeText: { dataElement: 'freeTextToolButton', title: 'annotation.freetext2', img: 'icon-tool-text-free-text', group: 'freeTextTools', showColor: 'always' },
    AnnotationCreateFreeText2: { dataElement: 'freeTextToolButton2', title: 'annotation.freetext2', img: 'icon-tool-text-free-text', group: 'freeTextTools', showColor: 'always' },
    // AnnotationCreateFreeText3: { dataElement: 'freeTextToolButton3', title: 'annotation.freetext2', img: 'icon-tool-text-free-text', group: 'freeTextTools', showColor: 'always' },
    // AnnotationCreateFreeText4: { dataElement: 'freeTextToolButton4', title: 'annotation.freetext2', img: 'icon-tool-text-free-text', group: 'freeTextTools', showColor: 'always' },

    AnnotationCreateSticky: { dataElement: 'sitckyToolButton', title: 'annotation.stickyNote', img: 'icon-tool-comment-line', group: 'freeTextTools', showColor: 'always' },
    // AnnotationCreateSticky2: { dataElement: 'sitckyToolButton2', title: 'annotation.stickyNote', img: 'icon-tool-comment-line', group: 'stickyTools', showColor: 'always' },
    // AnnotationCreateSticky3: { dataElement: 'sitckyToolButton3', title: 'annotation.stickyNote', img: 'icon-tool-comment-line', group: 'stickyTools', showColor: 'always' },
    // AnnotationCreateSticky4: { dataElement: 'sitckyToolButton4', title: 'annotation.stickyNote', img: 'icon-tool-comment-line', group: 'stickyTools', showColor: 'always' },

    AnnotationCreateFreeHand2: { position: 0, dataElement: 'freeHandToolButton2', title: 'annotation.freehand2', img: 'icon-tool-pen-line', group: 'freeHandTools', showColor: 'always' },
    AnnotationCreateRectangle: { position: 1, dataElement: 'rectangleToolButton', title: 'annotation.rectangle', img: 'icon-tool-shape-rectangle', group: 'freeHandTools', showColor: 'always' },
    AnnotationCreateEllipse: { position: 2, dataElement: 'ellipseToolButton', title: 'annotation.ellipse', img: 'icon-tool-shape-oval', group: 'freeHandTools', showColor: 'always' },
    AnnotationCreateLine: { position: 3, dataElement: 'lineToolButton', title: 'annotation.line', img: 'icon-tool-shape-line', group: 'freeHandTools', showColor: 'always' },
    AnnotationCreatePolyline: { position: 4, dataElement: 'polylineToolButton', title: 'annotation.polyline', img: 'icon-tool-shape-polyline', group: 'freeHandTools', showColor: 'always' },
    AnnotationCreatePolygon: { position: 5, dataElement: 'polygonToolButton', title: 'annotation.polygon', img: 'icon-tool-shape-polygon', group: 'freeHandTools', showColor: 'always' },
    AnnotationCreatePolygonCloud: { position: 6, dataElement: 'cloudToolButton', title: 'annotation.polygonCloud', img: 'icon-tool-shape-cloud', group: 'freeHandTools', showColor: 'always' },
    AnnotationCreateArrow: { position: 7, dataElement: 'arrowToolButton', title: 'annotation.arrow', img: 'icon-tool-shape-arrow', group: 'freeHandTools', showColor: 'always' },

    AnnotationCreateSignature: { dataElement: 'signatureToolButton', title: 'annotation.signature', img: 'icon-tool-signature', group: 'signatureTools', showColor: 'active' },

    // AnnotationCreateCallout: { dataElement: 'calloutToolButton', title: 'annotation.callout', img: 'icon-tool-callout-line', group: 'freeTextTools', showColor: 'always' },
    AnnotationCreateStamp: { dataElement: 'stampToolButton', title: 'annotation.stamp', img: 'icon-tool-image-line', group: 'miscTools', showColor: 'active' },
    AnnotationCreateRubberStamp: { dataElement: 'rubberStampToolButton', title: 'annotation.rubberStamp', img: 'icon-tool-stamp-line', group: 'miscTools', showColor: 'active' },
    CropPage: { dataElement: 'cropToolButton', title: 'annotation.crop', img: 'ic_crop_black_24px', showColor: 'never', group: 'miscTools' },
    AnnotationCreateRedaction: { dataElement: 'redactionButton', title: 'option.redaction.markForRedaction', img: 'icon-tool-redaction-full-page', group: 'miscTools', showColor: 'never' },

    Pan: { dataElement: 'panToolButton', title: 'tool.pan', img: 'icon-header-pan', showColor: 'never' },
    AnnotationEdit: { dataElement: 'selectToolButton', title: 'tool.select', img: 'icon-header-select-line', showColor: 'never' },
    // For mobile
    TextSelect: { dataElement: 'textSelectButton', img: 'icon - header - select - line', showColor: 'never' },
    MarqueeZoomTool: { dataElement: 'marqueeToolButton', showColor: 'never' },
    AnnotationEraserTool: { dataElement: 'eraserToolButton', title: 'annotation.eraser', img: 'icon-operation-eraser', showColor: 'never' },
  };

  if (window.matchMedia('(max-width: 640px)').matches) {
    return mobileState;
  }
  if (window.matchMedia('(max-width: 900px)').matches) {
    return tabletState;
  }
  return desktopState;
};

const getToolsState = () => ({
  tools: getTools(),
  toolButtonObjects: getToolButtonObjects(),
});

export {
  getTools,
  getToolButtonObjects,
  getToolsState,
};
