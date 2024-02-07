import { expect } from 'chai';
import { setupWebViewerInstance, simulateClick, delay, } from '../../utils/TestingUtils';
import core from 'core';

/* eslint-disable no-unused-expressions */
describe('Test UI APIs', function() {
  this.timeout(20000);

  let viewerDiv;

  beforeEach(async () => {
    // Create a new div with an ID and add it to the body before each test
    viewerDiv = document.createElement('div');
    viewerDiv.id = 'viewerDiv';
    document.body.appendChild(viewerDiv);
  });

  afterEach(() => {
    // Clean up the div after each test
    document.body.removeChild(viewerDiv);
  });


  it('test that document loaded fires', async () => {
    const options = {
      initialDoc: '/base/test/fixtures/pdfs/blank.pdf',
    };
    const instance = await setupWebViewerInstance(options);
    // create a promise that resolves when the document loaded event fires
    const documentLoadedPromise = new Promise((resolve) => {
      instance.UI.addEventListener('documentLoaded', resolve);
    });
    await documentLoadedPromise;
  });
  it('Check WebComponent for instance.UI.dispose() function', async () => {
    const options = {
      initialDoc: '/base/test/fixtures/pdfs/blank.pdf',
    };
    const instance = await setupWebViewerInstance(options);
    // create a promise that resolves when the document loaded event fires
    const documentLoadedPromise = new Promise((resolve) => {
      instance.UI.addEventListener('documentLoaded', resolve);
    });
    await documentLoadedPromise;
    expect(instance.UI.dispose).to.exists;
  });

  it('correctly loads as a web component', async () => {
    const instance = await setupWebViewerInstance({}, true);
    // create a promise that resolves when the viewer loaded event fires
    const UIEvents = instance.UI.Events;
    const documentLoadedPromise = new Promise((resolve) => {
      instance.UI.addEventListener(UIEvents.VIEWER_LOADED, () => {
        resolve();
      });
    });
    await documentLoadedPromise;
  });

  it('starts web component in demo mode by default', async () => {
    const instance = await setupWebViewerInstance({}, true);
    await instance.Core.createDocument(
      '/base/test/fixtures/pdfs/demo.pdf'
    );
    expect(instance.Core.isDemoMode()).to.equal(true);
  });

  it('can use a license with web component', async () => {
    const validLicenseKey = 'Xodo:WEBCPU:1::B+:AMS(20251005):4AFFA5071EE93B85D58C93FCF12FB6654FDEE6AAFE629A39F5C7';
    const instance = await setupWebViewerInstance({
      l: validLicenseKey,
    }, true);
    await instance.Core.createDocument(
      '/base/test/fixtures/pdfs/demo.pdf'
    );
    expect(instance.Core.isDemoMode()).to.equal(false);
  });

  it('correctly set mentions data in the mentions manager', async () => {
    const instance = await setupWebViewerInstance();

    const user = {
      email: 'zzhang@pdftron.com',
      id: 'zhijie',
      name: 'Zhijie',
      type: 'user',
      value: 'Zhijie',
    };
    const user2 = {
      email: 'czhang@gmail.com',
      id: 'chuhe',
      name: 'Chuhe',
      type: 'user',
      value: 'Chuhe',
    };
    const userData = [user, user2];
    instance.UI.mentions.setUserData(userData);
    expect(instance.UI.mentions.getUserData()).to.deep.equal(userData);
  });

  it('the UI awaits for the set language promise to resolve and does not set a random language', async () => {
    const instance = await setupWebViewerInstance();
    const { UI } = instance;

    async function setLanguageMultipleTimes() {
      let languageChangeCount = 0;
      UI.addEventListener(UI.Events.LANGUAGE_CHANGED, () => {
        languageChangeCount++;
      });
      UI.setLanguage('en');
      UI.setLanguage('de');
      await UI.setLanguage('fr');
      return languageChangeCount;
    }

    const languageChangeCount = await setLanguageMultipleTimes();
    expect(languageChangeCount).to.equal(1);
    expect(instance.UI.getCurrentLanguage()).to.equal('fr');
  });

  it('closes the save modal when we unload the document', async () => {
    const options = {
      initialDoc: '/base/test/fixtures/pdfs/blank.pdf',
    };
    const instance = await setupWebViewerInstance(options);

    // create a promise that resolves when the document loaded event fires
    const documentLoadedPromise = new Promise((resolve) => {
      instance.UI.addEventListener('documentLoaded', () => {
        instance.UI.openElement('saveModal');
        resolve();
      });
    });

    const onSaveModalOpened = new Promise((resolve) => {
      instance.UI.addEventListener('visibilityChanged', async (event) => {
        const { element, isVisible } = event.detail;
        if (element === 'saveModal') {
          if (isVisible) {
            expect(instance.Core.documentViewer.getDocument()).to.not.equal(null);
            resolve();
          }
        }
      });
    });

    const onSaveModalClosed = new Promise((resolve) => {
      instance.UI.addEventListener('visibilityChanged', (event) => {
        const { element, isVisible } = event.detail;
        if (element === 'saveModal' && !isVisible) {
          resolve();
        }
      });
    });

    await documentLoadedPromise;
    await onSaveModalOpened;
    await delay(5000);
    await instance.Core.documentViewer.closeDocument();
    await onSaveModalClosed;
  });

  it('Add custom stamp button can be disabled', async () => {
    const instance = await setupWebViewerInstance({}, true);
    const { UI } = instance;
    expect(UI.isElementDisabled('createCustomStampButton')).to.equal(false);

    // Set the tool and open the overlay and set the custom stamp tab
    UI.setToolMode(instance.Core.Tools.ToolNames.RUBBER_STAMP);
    UI.toggleElementVisibility('toolStylePopup');
    UI.setSelectedTab('rubberStampTab', 'customStampPanel');

    // query for element with dataElement and assert it exists
    const webComponent = document.getElementsByTagName('apryse-webviewer')[0];
    let createCustomStampButton = webComponent.shadowRoot.querySelector('[data-element="createCustomStampButton"]');
    expect(createCustomStampButton).to.not.equal(null);

    // Disable it
    UI.disableElements(['createCustomStampButton']);

    // get button again and assert it doesnt exist and that it is disabled in the redux store
    createCustomStampButton = webComponent.shadowRoot.querySelector('[data-element="createCustomStampButton"]');
    expect(createCustomStampButton).to.equal(null);
    expect(UI.isElementDisabled('createCustomStampButton')).to.equal(true);
  });

  it('Delete custom stamp button can be disabled', async () => {
    const instance = await setupWebViewerInstance({}, true);
    const { UI } = instance;

    // Pre-load some custom stamps
    const customStamps = [
      { title: 'MyCustomStamp1' },
      { title: 'MyCustomStamp1' },
    ];
    const tool = instance.Core.documentViewer.getTool('AnnotationCreateRubberStamp');
    const stampsSetPromise = new Promise((resolve) => {
      tool.addEventListener('stampsUpdated', () => {
        resolve();
      });
    });
    tool.setCustomStamps(customStamps);

    await stampsSetPromise;

    // Set the tool and open the overlay and set the custom stamp tab
    UI.setToolMode(instance.Core.Tools.ToolNames.RUBBER_STAMP);
    // wait to set the tool mode before toggling the overlay
    await delay(100);
    UI.toggleElementVisibility('toolStylePopup');
    UI.setSelectedTab('rubberStampTab', 'customStampPanel');
    // Add a small delay because the stamps are loaded async into the overlay
    await delay(1);

    // query for element with dataElement and assert it exists
    const webComponent = document.getElementsByTagName('apryse-webviewer')[0];
    let deleteCustomStampButton = webComponent.shadowRoot.querySelector('[data-element="deleteCustomStampButton"]');
    expect(deleteCustomStampButton).to.not.equal(null);

    // Disable it
    UI.disableElements(['deleteCustomStampButton']);

    // get button again and assert it doesnt exist and that it is disabled in the redux store
    deleteCustomStampButton = webComponent.shadowRoot.querySelector('[data-element="deleteCustomStampButton"]');
    expect(deleteCustomStampButton).to.equal(null);
    expect(UI.isElementDisabled('deleteCustomStampButton')).to.equal(true);
  });

  it('registers tools to all document viewers when in multiviewer mode', async () => {
    const instance = await setupWebViewerInstance();
    const { UI } = instance;
    const { Tools, Annotations } = instance.Core;

    const triangleToolName = 'AnnotationCreateTriangle';

    class TriangleCreateTool extends Tools.GenericAnnotationCreateTool {
      constructor(documentViewer) {
        super(documentViewer, TriangleAnnotation);
      }
    }
    class TriangleAnnotation extends Annotations.CustomAnnotation {
      constructor() {
        super('triangle'); // provide the custom XFDF element name
        this.Subject = 'Triangle';
      }
    }
    TriangleAnnotation.prototype.elementName = 'triangle';

    UI.enterMultiViewerMode();

    const multiViewerPromise = new Promise((resolve) => {
      instance.UI.addEventListener(UI.Events.MULTI_VIEWER_READY, resolve);
    });

    await multiViewerPromise;

    instance.Core.getDocumentViewers().forEach((documentViewer, i) => {
      UI.registerTool({
        toolName: triangleToolName,
        toolObject: new TriangleCreateTool(documentViewer),
        buttonImage: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">' +
          '<path d="M12 7.77L18.39 18H5.61L12 7.77M12 4L2 20h20L12 4z"/>' +
          '<path fill="none" d="M0 0h24v24H0V0z"/>' +
        '</svg>',
        buttonName: 'triangleToolButton',
        tooltip: 'Triangle',
        documentViewerNumber: i + 1,
      }, TriangleAnnotation);
    });

    expect(instance.Core.getDocumentViewers()[0].getToolModeMap()[triangleToolName]).not.to.equal(undefined);
    expect(instance.Core.getDocumentViewers()[1].getToolModeMap()[triangleToolName]).not.to.equal(undefined);

    UI.unregisterTool('AnnotationCreateTriangle');
    expect(instance.Core.getDocumentViewers()[0].getToolModeMap()[triangleToolName]).to.equal(undefined);
    expect(instance.Core.getDocumentViewers()[1].getToolModeMap()[triangleToolName]).to.equal(undefined);
  });

  it('test that the filter button stays active when panel closes and opens', async () => {
    const options = {
      initialDoc: '/base/test/fixtures/pdfs/demo-redaction.pdf',
    };
    const instance = await setupWebViewerInstance(options);

    const { documentViewer } = instance.Core;

    // create a promise that resolves when the annotations loaded event fires
    const annotationsLoadedPromise = new Promise((resolve) => {
      documentViewer.addEventListener('annotationsLoaded', resolve);
    });
    await annotationsLoadedPromise;

    // click on the toggleNotesButton data element and wait for the notes panel to open
    const iframe = document.querySelector('#viewerDiv iframe');
    const notesToggleButton = iframe.contentDocument.querySelector('[data-element="toggleNotesButton"]');
    simulateClick(notesToggleButton);
    await delay(300);

    // click on the filter button and wait for the filter modal to open
    let filterButton = iframe.contentDocument.querySelector('[data-element="filterAnnotationButton"]');
    simulateClick(filterButton);
    await delay(300);

    // click through on the filter modal tab
    const filterModalTypeButton = iframe.contentDocument.querySelector('[data-element="annotationTypeFilterPanelButton"]');
    simulateClick(filterModalTypeButton);

    // click on the filter modal option
    const filterModalOptionCheckbox = iframe.contentDocument.querySelector('[data-element="annotationTypeFilterPanel"] .ui__choice__label');
    simulateClick(filterModalOptionCheckbox);

    // click on the filter modal apply button
    const filterModalApplyButton = iframe.contentDocument.querySelector('.filter-annot-apply');
    simulateClick(filterModalApplyButton);

    // assert that the filter button is active
    expect(filterButton.classList.contains('active')).to.equal(true);

    // click on the toggleNotesButton data element twice to close and open the panel
    simulateClick(notesToggleButton);
    simulateClick(notesToggleButton);
    await delay(300);

    // assert that the filter button is still active
    filterButton = iframe.contentDocument.querySelector('[data-element="filterAnnotationButton"]');
    expect(filterButton.classList.contains('active')).to.equal(true);
  });

  // requires running with a production build locally
  it('test that the multi note status popup appears when the button is clicked', async () => {
    const options = {
      initialDoc: 'https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf',
    };
    const instance = await setupWebViewerInstance(options);

    const { documentViewer, annotationManager } = instance.Core;

    // create a promise that resolves when the annotations loaded event fires
    const annotationsLoadedPromise = new Promise((resolve) => {
      documentViewer.addEventListener('annotationsLoaded', resolve);
    });
    await annotationsLoadedPromise;

    // click on the toggleNotesButton data element and wait for the notes panel to open
    const iframe = document.querySelector('#viewerDiv iframe');
    const notesToggleButton = iframe.contentDocument.querySelector('[data-element="toggleNotesButton"]');
    simulateClick(notesToggleButton);
    await delay(100);

    // click on the multiSelectMode button and wait to enter multi select mode
    const multiSelectModeButton = iframe.contentDocument.querySelector('[data-element="multiSelectModeButton"]');
    simulateClick(multiSelectModeButton);
    await delay(100);

    // select some annotations and wait for the multi select status button to activate
    const annotations = annotationManager.getAnnotationsList();
    annotationManager.selectAnnotations([annotations[0], annotations[1]]);
    await delay(100);
    expect(annotationManager.getSelectedAnnotations().length).to.equal(2);

    // click the multi select status button
    const multiStateButton = iframe.contentDocument.querySelector('[data-element="multiStateButton"]');
    expect(multiStateButton).to.not.equal(null);
    expect(multiStateButton.classList.contains('disabled')).to.equal(false);
    simulateClick(multiStateButton);

    // check for note state popup
    const notePopupState = iframe.contentDocument.querySelector('[data-element="notePopupState"]');
    expect(notePopupState).to.not.equal(null);

    // click on the note state popup Accepted option
    const notePopupStateAccepted = iframe.contentDocument.querySelector('[data-element="notePopupStateAccepted"]');
    simulateClick(notePopupStateAccepted);

    expect(annotations[0].getStatus()).to.equal('Accepted');
    expect(annotations[1].getStatus()).to.equal('Accepted');
  });

  it('should only accept allowed file extensions on multi tab upload button', async () => {
    const options = {
      fullAPI: true,
      initialDoc: '/base/test/fixtures/pdfs/demo-redaction.pdf',
    };
    const instance = await setupWebViewerInstance(options);
    const acceptFormats = ['pdf', 'xod'];

    instance.UI.enableFeatures([instance.UI.Feature.MultiTab]);
    instance.Core.setAllowedFileExtensions(acceptFormats); // sets the allowed file extensions for the UI component
    window.Core.setAllowedFileExtensions(acceptFormats); // sets the allowed file extensions in core

    // create a promise that resolves when the document loaded event fires
    const documentLoadedPromise = new Promise((resolve) => {
      instance.UI.addEventListener('documentLoaded', resolve);
    });
    await documentLoadedPromise;

    const iframe = document.querySelector('#viewerDiv iframe');
    iframe.style.height = '100vh';

    // click on the new tab button
    const addTabButton = iframe.contentDocument.querySelector('div.TabsHeader div.add-button button');
    simulateClick(addTabButton);
    await delay(500);

    // click on the upload tab button
    const filePickerPanelButton = iframe.contentDocument.querySelector('button[data-element="filePickerPanelButton"]');
    simulateClick(filePickerPanelButton);
    await delay(500);

    // assert that the file input only accepts pdf and xod files
    const fileInput = iframe.contentDocument.querySelector('div[data-element="filePickerPanel"] input[type="file"]');
    expect(fileInput.accept).to.equal(core.getAllowedFileExtensions());
  });

  it('test that the search API works with search overlay closed', async () => {
    const options = {
      initialDoc: 'https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf',
    };
    const instance = await setupWebViewerInstance(options);

    const { documentViewer } = instance.Core;

    let resultsCount = 0;

      documentViewer.addEventListener("documentLoaded", () => {
        const searchListener = (searchPattern, options, results) => {
            resultsCount = results.length;
        };

        instance.UI.addSearchListener(searchListener);
        // start search after document loads
        instance.UI.searchTextFull("PDF|Library", { regex: true });
      });

    await delay(5000);
    expect(resultsCount).to.greaterThan(0);
  });

  it('test that the search API works with search overlay open', async () => {
    const options = {
      initialDoc: 'https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf',
    };
    const instance = await setupWebViewerInstance(options);

    const { documentViewer } = instance.Core;

    instance.UI.openElements('searchPanel');

    let resultsCount = 0;

      documentViewer.addEventListener("documentLoaded", () => {
        const searchListener = (searchPattern, options, results) => {
            resultsCount = results.length;
        };

        instance.UI.addSearchListener(searchListener);
        // start search after document loads
        instance.UI.searchTextFull("PDF|Library", { regex: true });
      });

    await delay(5000);
    expect(resultsCount).to.greaterThan(0);
  });

  it('can add/remove tools to the form field creation mode whitelist via API', async () => {
    const options = {
      initialDoc: 'https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf',
    };
    const instance = await setupWebViewerInstance(options);

    const { documentViewer } = instance.Core;
    const formFieldCreationManager = documentViewer.getAnnotationManager().getFormFieldCreationManager();

    expect(
      formFieldCreationManager.isToolAllowedInFormFieldCreationMode(
        'AnnotationCreateRectangle'
      )
    ).to.equal(false);

    formFieldCreationManager.allowToolsInFormFieldCreationMode([
      'AnnotationCreateRectangle'
    ]);

    expect(
      formFieldCreationManager.isToolAllowedInFormFieldCreationMode(
        'AnnotationCreateRectangle'
      )
    ).to.equal(true);

    formFieldCreationManager.disallowToolsInFormFieldCreationMode([
      'AnnotationCreateRectangle',
    ]);

    expect(
      formFieldCreationManager.isToolAllowedInFormFieldCreationMode(
        'AnnotationCreateRectangle'
      )
    ).to.equal(false);
  });
});