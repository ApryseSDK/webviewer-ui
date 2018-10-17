import getHashParams from 'helpers/getHashParams';
import documentTypeParamToEngineType from 'helpers/documentTypeParamToEngineType';
import { zoomIn, zoomOut } from 'helpers/zoom';
import actions from 'actions';
import core from 'core';

export default {
  viewer: {
    disabledElements: {},
    disabledTools: {},
    openElements: {
      header: true
    },
    headers: {
      default: [
        { type: 'toggleElementButton', img: 'ic_left_sidebar_black_24px', element: 'leftPanel', dataElement: 'leftPanelButton', title: 'component.leftPanel' },
        { type: 'divider', hidden: [ 'tablet', 'mobile' ] },
        { type: 'toggleElementButton', img: 'ic_viewer_settings_black_24px', element: 'viewControlsOverlay', dataElement: 'viewControlsButton', title: 'component.viewControlsOverlay' },
        { type: 'toolButton', toolName: 'Pan', hidden: [ 'tablet', 'mobile' ] },
        { type: 'toolButton', toolName: 'AnnotationEdit', hidden: [ 'tablet', 'mobile' ] },
        {
          type: 'statefulButton',
          mount: update => {
            const fitModeToState = fitMode => {
              const docViewer = core.getDocumentViewer();
              // the returned state should be the opposite of the new current state
              // as the opposite state is what we want to switch to when the button
              // is pressed next
              if (fitMode === docViewer.FitMode.FitPage) {
                return 'FitWidth';
              } else if (fitMode === docViewer.FitMode.FitWidth) {
                return 'FitPage';
              }
            };

            core.addEventListener('fitModeUpdated.fitbutton', (e, fitMode) => {
              update(fitModeToState(fitMode));
            });

            // if initial fit mode is zoom then default to FitPage
            return fitModeToState(core.getFitMode()) || 'FitPage';
          },
          unmount: () => {
            core.removeEventListener('fitModeUpdated.fitbutton');
          },
          states: {
            FitWidth: {
              img: 'ic_fit_width_black_24px',
              onClick: core.fitToWidth,
              title: 'action.fitToWidth'
            },
            FitPage: {
              img: 'ic_fit_page_black_24px',
              onClick: core.fitToPage,
              title: 'action.fitToPage'
            }
          },
          dataElement: 'fitButton',
          hidden: ['mobile']
        },
        { type: 'actionButton', img: 'ic_zoom_out_black_24px', onClick: zoomOut, title: 'action.zoomOut', dataElement: 'zoomOutButton', hidden: [ 'mobile' ] },
        { type: 'actionButton', img: 'ic_zoom_in_black_24px', onClick: zoomIn, title: 'action.zoomIn', dataElement: 'zoomInButton', hidden: [ 'mobile' ] },
        { type: 'spacer' },
        { type: 'toolGroupButton', toolGroup: 'freeHandTools', dataElement: 'freeHandToolGroupButton', title: 'component.freehandToolsButton', hidden: [ 'tablet', 'mobile' ] },
        { type: 'toolGroupButton', toolGroup: 'textTools', dataElement: 'textToolGroupButton', title: 'component.textToolsButton', hidden: [ 'tablet', 'mobile' ] },
        { type: 'toolGroupButton', toolGroup: 'shapeTools', dataElement: 'shapeToolGroupButton', title: 'component.shapeToolsButton', hidden: [ 'tablet', 'mobile' ] },
        { type: 'toolButton', toolName: 'AnnotationCreateSignature', hidden: [ 'tablet', 'mobile' ] },
        { type: 'toolButton', toolName: 'AnnotationCreateFreeText', hidden: [ 'tablet', 'mobile' ] },
        { type: 'toolButton', toolName: 'AnnotationCreateSticky', hidden: [ 'tablet', 'mobile' ] },
        { type: 'toolGroupButton', toolGroup: 'miscTools', img: 'ic_more_black_24px', dataElement: 'miscToolGroupButton', title: 'component.miscToolsButton', hidden: [ 'tablet', 'mobile' ] },
        {
          type: 'actionButton',
          img: 'ic_edit_black_24px',
          onClick: dispatch => {
            dispatch(actions.setActiveHeaderGroup('tools'));
            core.setToolMode('AnnotationEdit');
            dispatch(actions.closeElements([ 'viewControlsOverlay', 'searchOverlay', 'menuOverlay', 'searchPanel', 'leftPanel' ]));
          },
          dataElement: 'toolsButton',
          title: 'component.toolsButton',
          hidden: [ 'desktop' ],
        },
        { type: 'divider', hidden: [ 'tablet', 'mobile' ] },
        { type: 'toggleElementButton', dataElement: 'searchButton',  element: 'searchOverlay', img: 'ic_search_black_24px', title: 'component.searchOverlay' },
        { type: 'toggleElementButton', dataElement: 'menuButton', element: 'menuOverlay', img: 'ic_overflow_black_24px', title: 'component.menuOverlay' }
      ],
      tools: [
        { type: 'toolGroupButton', toolGroup: 'freeHandTools', dataElement: 'freeHandToolGroupButton', title: 'component.freehandToolsButton' },
        { type: 'toolGroupButton', toolGroup: 'textTools', dataElement: 'textToolGroupButton', title: 'component.textToolsButton' },
        { type: 'toolGroupButton', toolGroup: 'shapeTools', dataElement: 'shapeToolGroupButton', title: 'component.shapeToolsButton' },
        { type: 'toolButton', toolName: 'AnnotationCreateSignature' },
        { type: 'toolButton', toolName: 'AnnotationCreateFreeText' },
        { type: 'toolButton', toolName: 'AnnotationCreateSticky' },
        { type: 'toolGroupButton', toolGroup: 'miscTools', img: 'ic_more_black_24px', dataElement: 'miscToolGroupButton', title: 'component.miscToolsButton' },
        { type: 'spacer' },
        {
          type: 'actionButton',
          dataElement: 'defaultHeaderButton',
          titile: 'action.close',
          img: 'ic_close_black_24px',
          onClick: dispatch => {
            dispatch(actions.setActiveHeaderGroup('default'));
            core.setToolMode('AnnotationEdit');
            dispatch(actions.closeElements([ 'viewControlsOverlay', 'searchOverlay', 'menuOverlay', 'searchPanel', 'leftPanel' ]));
          },
        },
      ]
    },
    toolButtonObjects: {
      AnnotationCreateFreeHand: { dataElement: 'freeHandToolButton', title: 'annotation.freehand', img: 'ic_annotation_freehand_black_24px', group:'freeHandTools', showColor: 'always' },
      AnnotationCreateFreeHand2: { dataElement: 'freeHandToolButton2', title: 'annotation.freehand2', img: 'ic_annotation_freehand_black_24px', group:'freeHandTools', showColor: 'always' },
      AnnotationCreateFreeHand3: { dataElement: 'freeHandToolButton3', title: 'annotation.freehand2', img: 'ic_annotation_freehand_black_24px', group:'freeHandTools', showColor: 'always' },
      AnnotationCreateFreeHand4: { dataElement: 'freeHandToolButton4', title: 'annotation.freehand2', img: 'ic_annotation_freehand_black_24px', group:'freeHandTools', showColor: 'always' },
      AnnotationCreateTextHighlight: { dataElement: 'highlightToolButton', title: 'annotation.hightlight', img: 'ic_annotation_highlight_black_24px', group:'textTools', showColor: 'always' },
      AnnotationCreateTextHighlight2: { dataElement: 'highlightToolButton2', title: 'annotation.highlight2', img: 'ic_annotation_highlight_black_24px', group:'textTools', showColor: 'always' },
      AnnotationCreateTextHighlight3: { dataElement: 'highlightToolButton3', title: 'annotation.highlight2', img: 'ic_annotation_highlight_black_24px', group:'textTools', showColor: 'always' },
      AnnotationCreateTextHighlight4: { dataElement: 'highlightToolButton4', title: 'annotation.highlight2', img: 'ic_annotation_highlight_black_24px', group:'textTools', showColor: 'always' },
      AnnotationCreateTextUnderline: { dataElement: 'underlineToolButton', title: 'annotation.underline', img: 'ic_annotation_underline_black_24px', group:'textTools', showColor: 'active' },
      AnnotationCreateTextSquiggly: { dataElement: 'squigglyToolButton', title: 'annotation.squiggly', img: 'ic_annotation_squiggly_black_24px', group:'textTools', showColor: 'active' },
      AnnotationCreateTextStrikeout: { dataElement: 'strikeoutToolButton', title: 'annotation.strikeout', img: 'ic_annotation_strikeout_black_24px', group:'textTools', showColor: 'active' },
      AnnotationCreateRectangle: { dataElement: 'rectangleToolButton', title: 'annotation.rectangle', img: 'ic_annotation_square_black_24px', group: 'shapeTools', showColor: 'active' },
      AnnotationCreateEllipse: { dataElement: 'ellipseToolButton', title: 'annotation.ellipse', img: 'ic_annotation_circle_black_24px', group: 'shapeTools', showColor: 'active' },
      AnnotationCreateLine: { dataElement: 'lineToolButton', title: 'annotation.line', img: 'ic_annotation_line_black_24px', group: 'shapeTools', showColor: 'active' },
      AnnotationCreateArrow: { dataElement: 'arrowToolButton', title: 'annotation.arrow', img: 'ic_annotation_arrow_black_24px', group: 'shapeTools', showColor: 'active' },
      AnnotationCreatePolyline: { dataElement: 'polylineToolButton', title: 'annotation.polyline', img: 'ic_annotation_polyline_black_24px', group: 'shapeTools', showColor: 'active' },
      AnnotationCreatePolygon: { dataElement: 'polygonToolButton', title: 'annotation.polygon', img: 'ic_annotation_polygon_black_24px', group: 'shapeTools', showColor: 'active' },
      AnnotationCreatePolygonCloud: { dataElement: 'cloudToolButton', title: 'annotation.polygonCloud', img: 'ic_annotation_cloud_black_24px', group: 'shapeTools', showColor: 'active' },
      AnnotationCreateSignature: { dataElement: 'signatureToolButton', title: 'annotation.signature', img: 'ic_annotation_signature_black_24px', showColor: 'active' },
      AnnotationCreateFreeText: { dataElement: 'freeTextToolButton', title: 'annotation.freetext', img: 'ic_annotation_freetext_black_24px', showColor: 'active' },
      AnnotationCreateSticky: { dataElement: 'stickyToolButton', title: 'annotation.stickyNote', img: 'ic_annotation_sticky_note_black_24px', showColor: 'active' },
      AnnotationCreateCallout: { dataElement: 'calloutToolButton', title: 'annotation.callout', img: 'ic_annotation_callout_black_24px', group: 'miscTools', showColor: 'active' },
      AnnotationCreateStamp: { dataElement: 'stampToolButton', title: 'annotation.stamp', img: 'ic_annotation_image_black_24px', group: 'miscTools', showColor: 'active' },
      Pan: { dataElement: 'panToolButton', title: 'tool.pan', img: 'ic_pan_black_24px', showColor: 'never' },
      AnnotationEdit: { dataElement: 'selectToolButton', title: 'tool.select', img: 'ic_select_black_24px', showColor: 'never' },
    },
    activeHeaderGroup: 'default',
    activeToolName: 'AnnotationEdit',
    activeToolStyles: {},
    activeLeftPanel: getHashParams('hideAnnotationPanel', false) || !getHashParams('a', false) || getHashParams('readonly', false) ? 'thumbnailsPanel' : 'notesPanel',
    activeToolGroup: '',
    expandedNotes: {},
    notePopupId: '',
    isNoteEditing: false,
    fitMode: '',
    zoom: 1,
    displayMode: 'Single',
    currentPage: undefined,
    sortNotesBy: 'position',
    isFullScreen: false,
    doesAutoLoad: getHashParams('auto_load', true),
    isDocumentLoaded: false,
    isReadOnly: getHashParams('readonly', false),
    loadingMessage: '',
  },
  search: {
    listeners: [],
    value: '',
    isCaseSensitive: false,
    isWholeWord: false,
    isWildcard: false,
    isRegex: false,
    isSearchUp: false,
    isAmbientString: false,
    activeResult: null,
    activeResultIndex: -1,
    results: [],
    isSearching: false,
    noResult: false,
    isProgrammaticSearch: false,
    isProgrammaticSearchFull: false,
  },
  document: {
    id: getHashParams('did', ''),
    path: getHashParams('initialDoc', getHashParams('d', '')),
    filename: null,
    file: null,
    type: null,
    pdfDoc: null,
    pdfType: getHashParams('pdf', 'wait'),
    officeType: getHashParams('office', 'wait'),
    isOffline: getHashParams('startOffline', false), // to viewer (double check with Matt)
    totalPages: 0,
    outlines: [],
    checkPassword: null,
    printQuality: 1
  },
  user: {
    name: getHashParams('user', 'Guest'),
    isAdmin: getHashParams('admin', false),
  },
  advanced: {
    azureWorkaround: getHashParams('azureWorkaround', false),
    customCSS: getHashParams('css', null),
    customData: getHashParams('custom', null),
    customHeaders: { },
    configScript: getHashParams('config', ''),
    defaultDisabledElements: getHashParams('disabledElements', ''),
    externalPath: getHashParams('p', ''),
    engineType: documentTypeParamToEngineType(getHashParams('documentType')),
    fullAPI: getHashParams('pdfnet', false),
    pdftronServer: getHashParams('pdftronServer', ''),
    preloadWorker: getHashParams('preloadWorker', false),
    serverUrl: getHashParams('server_url', process.env.NODE_ENV === 'development' ? '/annotations' : ''),
    serverUrlHeaders: JSON.parse(getHashParams('serverUrlHeaders', '{}')),
    streaming: getHashParams('streaming', false),
    subzero: getHashParams('subzero', false),
    useDownloader: getHashParams('useDownloader', true),
    useSharedWorker: getHashParams('useSharedWorker', false),
    disableI18n: getHashParams('disableI18n', false),
    pdfWorkerTransportPromise: null,
    officeWorkerTransportPromise: null,
    decrypt: null,
    decryptOptions: { }
  }
};