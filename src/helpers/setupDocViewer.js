import core from 'core';

const setupDocViewer = () => {
  const docViewer = core.getDocumentViewer();

  // at 100% zoom level, adjust this whenever zoom/fitmode is updated
  docViewer.DEFAULT_MARGIN = 10;
  addToolsToDocViewer(docViewer);
};

const addToolsToDocViewer = docViewer => {
  const toolModeMap = core.getToolModeMap();

  toolModeMap.AnnotationCreateTextHighlight2 = new window.Tools.TextHighlightCreateTool(docViewer, 'AnnotationCreateTextHighlight2');
  toolModeMap.AnnotationCreateTextHighlight3 = new window.Tools.TextHighlightCreateTool(docViewer, 'AnnotationCreateTextHighlight3');
  toolModeMap.AnnotationCreateTextHighlight4 = new window.Tools.TextHighlightCreateTool(docViewer, 'AnnotationCreateTextHighlight4');
  toolModeMap.AnnotationCreateFreeHand2 = new window.Tools.FreeHandCreateTool(docViewer, 'AnnotationCreateFreeHand2');
  toolModeMap.AnnotationCreateFreeHand3 = new window.Tools.FreeHandCreateTool(docViewer, 'AnnotationCreateFreeHand3');
  toolModeMap.AnnotationCreateFreeHand4 = new window.Tools.FreeHandCreateTool(docViewer, 'AnnotationCreateFreeHand4');
  toolModeMap.AnnotationCreateFreeText2 = new window.Tools.FreeTextCreateTool(docViewer, 'AnnotationCreateFreeText2');
  toolModeMap.AnnotationCreateFreeText3 = new window.Tools.FreeTextCreateTool(docViewer, 'AnnotationCreateFreeText3');
  toolModeMap.AnnotationCreateFreeText4 = new window.Tools.FreeTextCreateTool(docViewer, 'AnnotationCreateFreeText4');
  toolModeMap.AnnotationCreateCallout2 = new window.Tools.CalloutCreateTool(docViewer, 'AnnotationCreateCallout2');
  toolModeMap.AnnotationCreateCallout3 = new window.Tools.CalloutCreateTool(docViewer, 'AnnotationCreateCallout3');
  toolModeMap.AnnotationCreateCallout4 = new window.Tools.CalloutCreateTool(docViewer, 'AnnotationCreateCallout4');
  toolModeMap.AnnotationCreateSticky2 = new window.Tools.StickyCreateTool(docViewer, 'AnnotationCreateSticky2');
  toolModeMap.AnnotationCreateSticky3 = new window.Tools.StickyCreateTool(docViewer, 'AnnotationCreateSticky3');
  toolModeMap.AnnotationCreateSticky4 = new window.Tools.StickyCreateTool(docViewer, 'AnnotationCreateSticky4');
  toolModeMap.AnnotationCreateTextUnderline2 = new window.Tools.TextUnderlineCreateTool(docViewer, 'AnnotationCreateTextUnderline2');
  toolModeMap.AnnotationCreateTextUnderline3 = new window.Tools.TextUnderlineCreateTool(docViewer, 'AnnotationCreateTextUnderline3');
  toolModeMap.AnnotationCreateTextUnderline4 = new window.Tools.TextUnderlineCreateTool(docViewer, 'AnnotationCreateTextUnderline4');
  toolModeMap.AnnotationCreateTextStrikeout2 = new window.Tools.TextStrikeoutCreateTool(docViewer, 'AnnotationCreateTextStrikeout2');
  toolModeMap.AnnotationCreateTextStrikeout3 = new window.Tools.TextStrikeoutCreateTool(docViewer, 'AnnotationCreateTextStrikeout3');
  toolModeMap.AnnotationCreateTextStrikeout4 = new window.Tools.TextStrikeoutCreateTool(docViewer, 'AnnotationCreateTextStrikeout4');
  toolModeMap.AnnotationCreateTextSquiggly2 = new window.Tools.TextSquigglyCreateTool(docViewer, 'AnnotationCreateTextSquiggly2');
  toolModeMap.AnnotationCreateTextSquiggly3 = new window.Tools.TextSquigglyCreateTool(docViewer, 'AnnotationCreateTextSquiggly3');
  toolModeMap.AnnotationCreateTextSquiggly4 = new window.Tools.TextSquigglyCreateTool(docViewer, 'AnnotationCreateTextSquiggly4');
  toolModeMap.AnnotationCreateRectangle2 = new window.Tools.RectangleCreateTool(docViewer, 'AnnotationCreateRectangle2');
  toolModeMap.AnnotationCreateRectangle3 = new window.Tools.RectangleCreateTool(docViewer, 'AnnotationCreateRectangle3');
  toolModeMap.AnnotationCreateRectangle4 = new window.Tools.RectangleCreateTool(docViewer, 'AnnotationCreateRectangle4');
  toolModeMap.AnnotationCreateEllipse2 = new window.Tools.EllipseCreateTool(docViewer, 'AnnotationCreateEllipse2');
  toolModeMap.AnnotationCreateEllipse3 = new window.Tools.EllipseCreateTool(docViewer, 'AnnotationCreateEllipse3');
  toolModeMap.AnnotationCreateEllipse4 = new window.Tools.EllipseCreateTool(docViewer, 'AnnotationCreateEllipse4');
  toolModeMap.AnnotationCreatePolygon2 = new window.Tools.PolygonCreateTool(docViewer, 'AnnotationCreatePolygon2');
  toolModeMap.AnnotationCreatePolygon3 = new window.Tools.PolygonCreateTool(docViewer, 'AnnotationCreatePolygon3');
  toolModeMap.AnnotationCreatePolygon4 = new window.Tools.PolygonCreateTool(docViewer, 'AnnotationCreatePolygon4');
  toolModeMap.AnnotationCreatePolygonCloud2 = new window.Tools.PolygonCloudCreateTool(docViewer, 'AnnotationCreatePolygonCloud2');
  toolModeMap.AnnotationCreatePolygonCloud3 = new window.Tools.PolygonCloudCreateTool(docViewer, 'AnnotationCreatePolygonCloud3');
  toolModeMap.AnnotationCreatePolygonCloud4 = new window.Tools.PolygonCloudCreateTool(docViewer, 'AnnotationCreatePolygonCloud4');
  toolModeMap.AnnotationCreateLine2 = new window.Tools.LineCreateTool(docViewer, 'AnnotationCreateLine2');
  toolModeMap.AnnotationCreateLine3 = new window.Tools.LineCreateTool(docViewer, 'AnnotationCreateLine3');
  toolModeMap.AnnotationCreateLine4 = new window.Tools.LineCreateTool(docViewer, 'AnnotationCreateLine4');
  toolModeMap.AnnotationCreatePolyline2 = new window.Tools.PolylineCreateTool(docViewer, 'AnnotationCreatePolyline2');
  toolModeMap.AnnotationCreatePolyline3 = new window.Tools.PolylineCreateTool(docViewer, 'AnnotationCreatePolyline3');
  toolModeMap.AnnotationCreatePolyline4 = new window.Tools.PolylineCreateTool(docViewer, 'AnnotationCreatePolyline4');
  toolModeMap.AnnotationCreateArrow2 = new window.Tools.ArrowCreateTool(docViewer, 'AnnotationCreateArrow2');
  toolModeMap.AnnotationCreateArrow3 = new window.Tools.ArrowCreateTool(docViewer, 'AnnotationCreateArrow3');
  toolModeMap.AnnotationCreateArrow4 = new window.Tools.ArrowCreateTool(docViewer, 'AnnotationCreateArrow4');
  toolModeMap.AnnotationCreateCountMeasurement2 = new window.Tools.CountMeasurementCreateTool(docViewer, 'AnnotationCreateCountMeasurement2');
  toolModeMap.AnnotationCreateCountMeasurement3 = new window.Tools.CountMeasurementCreateTool(docViewer, 'AnnotationCreateCountMeasurement3');
  toolModeMap.AnnotationCreateCountMeasurement4 = new window.Tools.CountMeasurementCreateTool(docViewer, 'AnnotationCreateCountMeasurement4');
  toolModeMap.AnnotationCreateDistanceMeasurement2 = new window.Tools.DistanceMeasurementCreateTool(docViewer, 'AnnotationCreateDistanceMeasurement2');
  toolModeMap.AnnotationCreateDistanceMeasurement3 = new window.Tools.DistanceMeasurementCreateTool(docViewer, 'AnnotationCreateDistanceMeasurement3');
  toolModeMap.AnnotationCreateDistanceMeasurement4 = new window.Tools.DistanceMeasurementCreateTool(docViewer, 'AnnotationCreateDistanceMeasurement4');
  toolModeMap.AnnotationCreatePerimeterMeasurement2 = new window.Tools.PerimeterMeasurementCreateTool(docViewer, 'AnnotationCreatePerimeterMeasurement2');
  toolModeMap.AnnotationCreatePerimeterMeasurement3 = new window.Tools.PerimeterMeasurementCreateTool(docViewer, 'AnnotationCreatePerimeterMeasurement3');
  toolModeMap.AnnotationCreatePerimeterMeasurement4 = new window.Tools.PerimeterMeasurementCreateTool(docViewer, 'AnnotationCreatePerimeterMeasurement4');
  toolModeMap.AnnotationCreateAreaMeasurement2 = new window.Tools.AreaMeasurementCreateTool(docViewer, 'AnnotationCreateAreaMeasurement2');
  toolModeMap.AnnotationCreateAreaMeasurement3 = new window.Tools.AreaMeasurementCreateTool(docViewer, 'AnnotationCreateAreaMeasurement3');
  toolModeMap.AnnotationCreateAreaMeasurement4 = new window.Tools.AreaMeasurementCreateTool(docViewer, 'AnnotationCreateAreaMeasurement4');
  toolModeMap.AnnotationCreateEllipseMeasurement2 = new window.Tools.EllipseMeasurementCreateTool(docViewer, 'AnnotationCreateEllipseMeasurement2');
  toolModeMap.AnnotationCreateEllipseMeasurement3 = new window.Tools.EllipseMeasurementCreateTool(docViewer, 'AnnotationCreateEllipseMeasurement3');
  toolModeMap.AnnotationCreateEllipseMeasurement4 = new window.Tools.EllipseMeasurementCreateTool(docViewer, 'AnnotationCreateEllipseMeasurement4');
  toolModeMap.AnnotationCreateRectangularAreaMeasurement2 = new window.Tools.RectangularAreaMeasurementCreateTool(docViewer, 'AnnotationCreateRectangularAreaMeasurement2');
  toolModeMap.AnnotationCreateRectangularAreaMeasurement3 = new window.Tools.RectangularAreaMeasurementCreateTool(docViewer, 'AnnotationCreateRectangularAreaMeasurement3');
  toolModeMap.AnnotationCreateRectangularAreaMeasurement4 = new window.Tools.RectangularAreaMeasurementCreateTool(docViewer, 'AnnotationCreateRectangularAreaMeasurement4');
};

export default setupDocViewer;
