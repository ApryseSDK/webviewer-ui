import {
  calculateHorizontalDistanceToAnnotation,
  calculateRightHorizontalLineProperties,
  calculateLeftHorizontalLineProperties,
  calculateMiddleVerticalLineProperties,
} from 'helpers/annotationNoteConnectorLineHelper';

const defaultScenario = {
  annotationWidth: 86.42732000000001,
  annotationXPosition: 673.255,
  distanceToAnnotation: 1396.3176799999999,
  notePanelPadding: 16,
  notePanelWidth: 330,
  notesPanelResizeBarWidth: 14,
  scrollLeft: 0,
  viewerWidth: 2456,
  rightHorizontalLineLength: 1047.2382599999999,
  lineWidthRatio: 0.75,
  notesContainerTop: 375,
  rightHorizontalLineRightOffset: 300,
  rightHorizontalLineTopOffset: 335,
  viewerOffsetTop: 40,
  annotationHeight: 25.055152500000077,
  annotationLineOffset: 15,
  annotationNoZoomReferencePoint: { x: undefined, y: undefined },
  annotationTopLeftY: 788.1375025,
  isAnnotationNoZoom: false,
  leftHorizontalLineLength: 334.07942,
  leftHorizontalLineRightOffset: 1347.2382599999999,
  leftHorizontalLineTopOffset: 800.66507875,
  noZoomRefShiftX: 0,
  noZoomRefShiftY: 0,
  scrollTop: 0,
  bottomHeaderTop: 1237,
  horizontalLineHeight: 2,
  isAnnotationAboveViewer: false,
  isAnnotationBelow: false,
  isAnnotationOffScreen: false,
  isCustomUIEnabled: true,
  leftHorizontalLineTop: 800.66507875,
  rightHorizontalLineTop: 335,
  topHeadersHeight: 98,
  verticalLineBottom: 800.66507875,
  verticalLineHeight: 465.66507875,
  verticalLineTop: 335,
};

const aboveNoteScenario = {
  annotationWidth: 86.42732000000001,
  annotationXPosition: 673.255,
  distanceToAnnotation: 1396.3176799999999,
  notePanelPadding: 16,
  notePanelWidth: 330,
  notesPanelResizeBarWidth: 14,
  scrollLeft: 0,
  viewerWidth: 2456,
  rightHorizontalLineLength: 1047.2382599999999,
  lineWidthRatio: 0.75,
  notesContainerTop: 375,
  rightHorizontalLineRightOffset: 300,
  rightHorizontalLineTopOffset: 335,
  viewerOffsetTop: 40,
  annotationHeight: 25.055152500000077,
  annotationLineOffset: 15,
  annotationNoZoomReferencePoint: { x: undefined, y: undefined },
  annotationTopLeftY: 788.1375025,
  isAnnotationNoZoom: false,
  leftHorizontalLineLength: 334.07942,
  leftHorizontalLineRightOffset: 1347.2382599999999,
  leftHorizontalLineTopOffset: 200.66507875000002,
  noZoomRefShiftX: 0,
  noZoomRefShiftY: 0,
  scrollTop: 600,
  bottomHeaderTop: 1237,
  horizontalLineHeight: 2,
  isAnnotationAboveViewer: false,
  isAnnotationBelow: false,
  isAnnotationOffScreen: false,
  isCustomUIEnabled: true,
  leftHorizontalLineTop: 200.66507875000002,
  rightHorizontalLineTop: 335,
  topHeadersHeight: 98,
  verticalLineBottom: 337,
  verticalLineHeight: 134.33492124999998,
  verticalLineTop: 202.66507875000002,
};

const noZoomScenario = {
  annotationWidth: 37.200000000000045,
  annotationXPosition: 705.004625,
  distanceToAnnotation: 1413.795375,
  notePanelPadding: 16,
  notePanelWidth: 330,
  notesPanelResizeBarWidth: 14,
  scrollLeft: 0,
  viewerWidth: 2456,
  lineWidthRatio: 0.75,
  notesContainerTop: 315,
  rightHorizontalLineLength: 1060.34653125,
  rightHorizontalLineRightOffset: 300,
  rightHorizontalLineTopOffset: 275,
  viewerOffsetTop: 40,
  annotationHeight: 31,
  annotationLineOffset: 4,
  annotationNoZoomReferencePoint: { x: undefined, y: undefined },
  annotationTopLeftY: 615.9947375,
  isAnnotationNoZoom: true,
  leftHorizontalLineLength: 349.4488437499999,
  leftHorizontalLineRightOffset: 1360.34653125,
  leftHorizontalLineTopOffset: 631.4947375,
  noZoomRefShiftX: 0,
  noZoomRefShiftY: 0,
  scrollTop: 0,
  bottomHeaderTop: 1237,
  horizontalLineHeight: 2,
  isAnnotationAboveViewer: false,
  isAnnotationBelow: false,
  isAnnotationOffScreen: false,
  isCustomUIEnabled: true,
  leftHorizontalLineTop: 631.4947375,
  rightHorizontalLineTop: 275,
  topHeadersHeight: 98,
  verticalLineBottom: 631.4947375,
  verticalLineHeight: 356.49473750000004,
  verticalLineTop: 275,
};

const offScreenScenario = {
  annotationWidth: 86.42732000000001,
  annotationXPosition: 673.255,
  distanceToAnnotation: 1396.3176799999999,
  notePanelPadding: 16,
  notePanelWidth: 330,
  notesPanelResizeBarWidth: 14,
  scrollLeft: 0,
  viewerWidth: 2456,
  lineWidthRatio: 0.75,
  notesContainerTop: 375,
  rightHorizontalLineLength: 1047.2382599999999,
  rightHorizontalLineRightOffset: 300,
  rightHorizontalLineTopOffset: 335,
  viewerOffsetTop: 40,
  annotationHeight: 25.055152500000077,
  annotationLineOffset: 15,
  annotationNoZoomReferencePoint: { x: undefined, y: undefined },
  annotationTopLeftY: 788.1375025,
  isAnnotationNoZoom: false,
  leftHorizontalLineLength: 334.07942,
  leftHorizontalLineRightOffset: 1347.2382599999999,
  leftHorizontalLineTopOffset: -199.33492124999998,
  noZoomRefShiftX: 0,
  noZoomRefShiftY: 0,
  scrollTop: 1000,
  bottomHeaderTop: 1237,
  horizontalLineHeight: 2,
  isAnnotationAboveViewer: true,
  isAnnotationBelow: false,
  isAnnotationOffScreen: true,
  isCustomUIEnabled: true,
  leftHorizontalLineTop: -199.33492124999998,
  rightHorizontalLineTop: 335,
  topHeadersHeight: 98,
  verticalLineBottom: 337,
  verticalLineHeight: 239,
  verticalLineTop: 98,
};

const iframeDefaultScenario = {
  annotationWidth: 86.42732000000001,
  annotationXPosition: 836.255,
  distanceToAnnotation: 1233.3176799999999,
  notePanelPadding: 16,
  notePanelWidth: 330,
  notesPanelResizeBarWidth: 14,
  scrollLeft: 0,
  viewerWidth: 2456,
  lineWidthRatio: 0.75,
  notesContainerTop: 335,
  rightHorizontalLineLength: 924.9882599999999,
  rightHorizontalLineRightOffset: 300,
  rightHorizontalLineTopOffset: 335,
  viewerOffsetTop: 0,
  annotationHeight: 25.055152500000077,
  annotationLineOffset: 15,
  annotationNoZoomReferencePoint: { x: undefined, y: undefined },
  annotationTopLeftY: 788.1375025,
  isAnnotationNoZoom: false,
  leftHorizontalLineLength: 293.32942,
  leftHorizontalLineRightOffset: 1224.9882599999999,
  leftHorizontalLineTopOffset: 800.66507875,
  noZoomRefShiftX: 0,
  noZoomRefShiftY: 0,
  scrollTop: 0,
  bottomHeaderTop: 2456,
  horizontalLineHeight: 2,
  isAnnotationAboveViewer: false,
  isAnnotationBelow: false,
  isAnnotationOffScreen: false,
  isCustomUIEnabled: true,
  leftHorizontalLineTop: 800.66507875,
  rightHorizontalLineTop: 335,
  topHeadersHeight: 98,
  verticalLineBottom: 800.66507875,
  verticalLineHeight: 465.66507875,
  verticalLineTop: 335,
};

describe('annotationNoteConnectorLineHelper', () => {
  it('Should be able to calculate horizontal distance across from note', () => {
    const distanceToAnnotation = calculateHorizontalDistanceToAnnotation(defaultScenario);

    expect(distanceToAnnotation).toBe(defaultScenario.distanceToAnnotation);
  });

  it('Should be able to calculate right horizontal line properties', () => {
    const {
      rightHorizontalLineRightOffset,
      rightHorizontalLineTopOffset,
      rightHorizontalLineLength,
    } = calculateRightHorizontalLineProperties(defaultScenario);

    expect(rightHorizontalLineRightOffset).toBe(defaultScenario.rightHorizontalLineRightOffset);
    expect(rightHorizontalLineTopOffset).toBe(defaultScenario.rightHorizontalLineTopOffset);
    expect(rightHorizontalLineLength).toBe(defaultScenario.rightHorizontalLineLength);
  });

  it('Should be able to calculate left horizontal line properties', () => {
    const {
      leftHorizontalLineRightOffset,
      leftHorizontalLineTopOffset,
      leftHorizontalLineLength,
    } = calculateLeftHorizontalLineProperties(defaultScenario);

    expect(leftHorizontalLineRightOffset).toBe(defaultScenario.leftHorizontalLineRightOffset);
    expect(leftHorizontalLineTopOffset).toBe(defaultScenario.leftHorizontalLineTopOffset);
    expect(leftHorizontalLineLength).toBe(defaultScenario.leftHorizontalLineLength);
  });

  it('Should be able to calculate middle vertical line properties', () => {
    const {
      verticalLineTop,
      verticalLineHeight,
      isAnnotationOffScreen
    } = calculateMiddleVerticalLineProperties(defaultScenario);

    expect(verticalLineTop).toBe(defaultScenario.verticalLineTop);
    expect(verticalLineHeight).toBe(defaultScenario.verticalLineHeight);
    expect(isAnnotationOffScreen).toBe(defaultScenario.isAnnotationOffScreen);
  });

  it('Should be able to calculate right horizontal line properties when annoation is above the note', () => {
    const {
      rightHorizontalLineRightOffset,
      rightHorizontalLineTopOffset,
      rightHorizontalLineLength,
    } = calculateRightHorizontalLineProperties(aboveNoteScenario);

    expect(rightHorizontalLineRightOffset).toBe(aboveNoteScenario.rightHorizontalLineRightOffset);
    expect(rightHorizontalLineTopOffset).toBe(aboveNoteScenario.rightHorizontalLineTopOffset);
    expect(rightHorizontalLineLength).toBe(aboveNoteScenario.rightHorizontalLineLength);
  });

  it('Should be able to calculate left horizontal line properties when annoation is above the note', () => {
    const {
      leftHorizontalLineRightOffset,
      leftHorizontalLineTopOffset,
      leftHorizontalLineLength,
    } = calculateLeftHorizontalLineProperties(aboveNoteScenario);

    expect(leftHorizontalLineRightOffset).toBe(aboveNoteScenario.leftHorizontalLineRightOffset);
    expect(leftHorizontalLineTopOffset).toBe(aboveNoteScenario.leftHorizontalLineTopOffset);
    expect(leftHorizontalLineLength).toBe(aboveNoteScenario.leftHorizontalLineLength);
  });

  it('Should be able to calculate middle vertical line properties when annoation is above the note', () => {
    const {
      verticalLineTop,
      verticalLineHeight,
      isAnnotationOffScreen
    } = calculateMiddleVerticalLineProperties(aboveNoteScenario);

    expect(verticalLineTop).toBe(aboveNoteScenario.verticalLineTop);
    expect(verticalLineHeight).toBe(aboveNoteScenario.verticalLineHeight);
    expect(isAnnotationOffScreen).toBe(aboveNoteScenario.isAnnotationOffScreen);
  });

  it('Should be able to calculate right horizontal line properties when a NoZoomAnnotation is selected', () => {
    const {
      rightHorizontalLineRightOffset,
      rightHorizontalLineTopOffset,
      rightHorizontalLineLength,
    } = calculateRightHorizontalLineProperties(noZoomScenario);

    expect(rightHorizontalLineRightOffset).toBe(noZoomScenario.rightHorizontalLineRightOffset);
    expect(rightHorizontalLineTopOffset).toBe(noZoomScenario.rightHorizontalLineTopOffset);
    expect(rightHorizontalLineLength).toBe(noZoomScenario.rightHorizontalLineLength);
  });

  it('Should be able to calculate left horizontal line properties when a NoZoomAnnotation is selected', () => {
    const {
      leftHorizontalLineRightOffset,
      leftHorizontalLineTopOffset,
      leftHorizontalLineLength,
    } = calculateLeftHorizontalLineProperties(noZoomScenario);

    expect(leftHorizontalLineRightOffset).toBe(noZoomScenario.leftHorizontalLineRightOffset);
    expect(leftHorizontalLineTopOffset).toBe(noZoomScenario.leftHorizontalLineTopOffset);
    expect(leftHorizontalLineLength).toBe(noZoomScenario.leftHorizontalLineLength);
  });

  it('Should be able to calculate middle vertical line properties when a NoZoomAnnotation is selected', () => {
    const {
      verticalLineTop,
      verticalLineHeight,
      isAnnotationOffScreen
    } = calculateMiddleVerticalLineProperties(noZoomScenario);

    expect(verticalLineTop).toBe(noZoomScenario.verticalLineTop);
    expect(verticalLineHeight).toBe(noZoomScenario.verticalLineHeight);
    expect(isAnnotationOffScreen).toBe(noZoomScenario.isAnnotationOffScreen);
  });

  it('Should be able to calculate right horizontal line properties when the annotation is offscreen', () => {
    const {
      rightHorizontalLineRightOffset,
      rightHorizontalLineTopOffset,
      rightHorizontalLineLength,
    } = calculateRightHorizontalLineProperties(offScreenScenario);

    expect(rightHorizontalLineRightOffset).toBe(offScreenScenario.rightHorizontalLineRightOffset);
    expect(rightHorizontalLineTopOffset).toBe(offScreenScenario.rightHorizontalLineTopOffset);
    expect(rightHorizontalLineLength).toBe(offScreenScenario.rightHorizontalLineLength);
  });

  it('Should be able to calculate left horizontal line properties when the annotation is offscreen', () => {
    const {
      leftHorizontalLineRightOffset,
      leftHorizontalLineTopOffset,
      leftHorizontalLineLength,
    } = calculateLeftHorizontalLineProperties(offScreenScenario);

    expect(leftHorizontalLineRightOffset).toBe(offScreenScenario.leftHorizontalLineRightOffset);
    expect(leftHorizontalLineTopOffset).toBe(offScreenScenario.leftHorizontalLineTopOffset);
    expect(leftHorizontalLineLength).toBe(offScreenScenario.leftHorizontalLineLength);
  });

  it('Should be able to calculate middle vertical line properties when the annotation is offscreen', () => {
    const {
      verticalLineTop,
      verticalLineHeight,
      isAnnotationOffScreen
    } = calculateMiddleVerticalLineProperties(offScreenScenario);

    expect(verticalLineTop).toBe(offScreenScenario.verticalLineTop);
    expect(verticalLineHeight).toBe(offScreenScenario.verticalLineHeight);
    expect(isAnnotationOffScreen).toBe(offScreenScenario.isAnnotationOffScreen);
  });

  describe('Iframe scenarios', () => {
    it('Should be able to calculate horizontal distance across from note', () => {
      const distanceToAnnotation = calculateHorizontalDistanceToAnnotation(iframeDefaultScenario);

      expect(distanceToAnnotation).toBe(iframeDefaultScenario.distanceToAnnotation);
    });

    it('Should be able to calculate right horizontal line properties', () => {
      const {
        rightHorizontalLineRightOffset,
        rightHorizontalLineTopOffset,
        rightHorizontalLineLength,
      } = calculateRightHorizontalLineProperties(iframeDefaultScenario);

      expect(rightHorizontalLineRightOffset).toBe(iframeDefaultScenario.rightHorizontalLineRightOffset);
      expect(rightHorizontalLineTopOffset).toBe(iframeDefaultScenario.rightHorizontalLineTopOffset);
      expect(rightHorizontalLineLength).toBe(iframeDefaultScenario.rightHorizontalLineLength);
    });

    it('Should be able to calculate left horizontal line properties', () => {
      const {
        leftHorizontalLineRightOffset,
        leftHorizontalLineTopOffset,
        leftHorizontalLineLength,
      } = calculateLeftHorizontalLineProperties(iframeDefaultScenario);

      expect(leftHorizontalLineRightOffset).toBe(iframeDefaultScenario.leftHorizontalLineRightOffset);
      expect(leftHorizontalLineTopOffset).toBe(iframeDefaultScenario.leftHorizontalLineTopOffset);
      expect(leftHorizontalLineLength).toBe(iframeDefaultScenario.leftHorizontalLineLength);
    });

    it('Should be able to calculate middle vertical line properties', () => {
      const {
        verticalLineTop,
        verticalLineHeight,
        isAnnotationOffScreen
      } = calculateMiddleVerticalLineProperties(iframeDefaultScenario);

      expect(verticalLineTop).toBe(iframeDefaultScenario.verticalLineTop);
      expect(verticalLineHeight).toBe(iframeDefaultScenario.verticalLineHeight);
      expect(isAnnotationOffScreen).toBe(iframeDefaultScenario.isAnnotationOffScreen);
    });
  });
});
