/// <reference types="Cypress" />
import defaultToolStylesMap from '../../../src/constants/defaultToolStylesMap';

let testFilesPath = '/test/files';
let WebViewerUrl = 'http://localhost:3001/' //'http://localhost/WebViewerJS/lib/uix/build/'
// let WebViewerUrl = 'http://localhost/WebViewerJS/lib/uix/build/'
// let testFilesPath = '/WebViewerJS/samples/files';

/**
 * Note Skip running of all these tests because they aren't working
 */

function waitOneSecond(time) {
  return new Cypress.Promise((resolve, reject) => {
    setTimeout(() => {
      // waited = true
      resolve('foo')
    }, time || 2000)
  })
}


describe.skip('Test extension and preloadWorker options', () => {
  // beforeEach(() => {
  //   cy.visit(WebViewerUrl + '#d=/files/png_file&a=1');
  // });
  it('should start with no backend', function () {
    cy.visit(WebViewerUrl);
    cy.window()
      .then((win) => {
        cy.wrap(null).then(() => {
          return waitOneSecond(400).then(() => {
            expect(win.CoreControls.getCurrentPDFBackendType()).to.be.undefined;
          })
        })
      })
  })
  it('should load pdf worker', function () {
    cy.visit(WebViewerUrl + '#preloadWorker=pdf');

    cy.server({ enable: false })
    cy.window()
      .then((win) => {
        cy.wrap(null).then(() => {
          return waitOneSecond(1000).then(() => {
            expect(win.CoreControls.getCurrentPDFBackendType()).not.to.be.undefined;
          })
        })
      })
  })

  it('should load office worker', function () {
    cy.visit(WebViewerUrl + '#preloadWorker=office');
    let waited = false
    let CoreControls;
    let spy
    cy.window()
      .then((win) => {
        cy.wrap(null).then(() => {
          return waitOneSecond(1000).then(() => {
            expect(win.CoreControls.getCurrentOfficeBackendType()).not.to.be.undefined;
          })
        })
      })
  })

  it('should load office and pdf workers', function () {
    cy.visit(WebViewerUrl + '#preloadWorker=all');
    let waited = false
    let CoreControls;
    let spy
    cy.window()
      .then((win) => {
        cy.wrap(null).then(() => {
          return waitOneSecond(2000).then(() => {
            expect(win.CoreControls.getCurrentOfficeBackendType()).not.to.be.undefined;
            expect(win.CoreControls.getCurrentPDFBackendType()).not.to.be.undefined;
          })
        })
      })
  })

  it('load pdf with extension flag', function () {
    cy.visit(WebViewerUrl + '#d=' + testFilesPath + '/pdf_file&extension=pdf');
    let spy
    cy.window().then((win) => {
      spy = cy.spy()
      win.readerControl.docViewer.on('documentLoaded', spy)
      cy.wrap(null).then(() => {
        return waitOneSecond().then((str) => {
          expect(spy).to.be.called.once
        })
      })
    })
  })
  it('should fail the test for inncorrect extension flag', function () {
    cy.visit(WebViewerUrl + '#d=' + testFilesPath + '/pdf_file&extension=docx');
    let spy
    cy.window().then((win) => {
      spy = cy.spy(win.console, "error")

      cy.wrap(null).then(() => {
        return waitOneSecond().then((str) => {
          expect(spy).to.be.called
        })
      })
    })
  })
  it('load pdf with wrong extension and extension flag', function () {
    cy.visit(WebViewerUrl + '#d=' + testFilesPath + '/pdf_file.xxx&extension=pdf');
    let spy
    cy.window().then((win) => {
      spy = cy.spy()
      win.readerControl.docViewer.on('documentLoaded', spy)
      cy.wrap(null).then(() => {
        return waitOneSecond().then((str) => {
          expect(spy).to.be.called.once;
        })
      })
    })
  })
  it('load office doc with extension flag', function () {
    cy.visit(WebViewerUrl + '#d=' + testFilesPath + '/office_file&extension=docx');
    let spy
    cy.window().then((win) => {
      spy = cy.spy()
      win.readerControl.docViewer.on('documentLoaded', spy)
      cy.wrap(null).then(() => {
        return waitOneSecond(3000).then((str) => {
          expect(spy).to.be.called.once
        })
      })
    })
  })

  it('load xod with extension flag', function () {
    cy.visit(WebViewerUrl + '#d=' + testFilesPath + '/xod_file&extension=xod');
    let spy
    cy.window().then((win) => {
      spy = cy.spy()
      win.readerControl.docViewer.on('documentLoaded', spy)

      cy.wrap(null).then(() => {
        return waitOneSecond(1000).then((str) => {
          expect(spy).to.be.called.once
        })
      })
    })
  })
  it('load png with extension=png flag', function () {
    cy.visit(WebViewerUrl + '#d=' + testFilesPath + '/png_file&a=1&extension=png');
    let waited = false
    let spy
    cy.window().then((win) => {
      spy = cy.spy()
      win.readerControl.docViewer.on('documentLoaded', spy)

      cy.wrap(null).then(() => {
        return waitOneSecond().then((str) => {
          expect(spy).to.be.called.once
        })
      })
    })
  })

  it('load pdf with extension and filename flag', function () {
    cy.visit(WebViewerUrl + '#d=' + testFilesPath + '/pdf_file&extension=pdf&filename=testfile.pdf');
    let spy
    cy.window().then((win) => {
      spy = cy.spy()
      win.readerControl.docViewer.on('documentLoaded', spy)

      cy.wrap(null).then(() => {
        return waitOneSecond().then((str) => {
          expect(spy).to.be.called.once
        })
      })
    })
  })

});



describe.skip('Test extension in url', () => {

  it('should fail loading image doc without extension', function () {
    cy.visit(WebViewerUrl + '#d=' + testFilesPath + '/png_file');
    let spy
    cy.window().then((win) => {
      spy = cy.spy()
      win.readerControl.docViewer.on('documentLoaded', spy)
      cy.wrap(null).then(() => {
        return waitOneSecond(2000).then(() => {
          expect(spy).not.to.be.called;
        })
      })
    })
  })

  it('should loading image doc with extension', function () {
    cy.visit(WebViewerUrl + '#d=' + testFilesPath + '/png_file' + '&extension=png');
    let spy
    cy.window().then((win) => {
      spy = cy.spy()
      win.readerControl.docViewer.on('documentLoaded', spy)
      cy.wrap(null).then(() => {
        return waitOneSecond(3000).then(() => {
          expect(spy).to.be.called.once;
        })
      })
    })
  })

  it('should loading office doc with extension and filename', function () {
    cy.visit(WebViewerUrl + '#d=' + testFilesPath + '/office_file' + '&extension=docx&filename=test.docx');
    let spy
    cy.window().then((win) => {
      spy = cy.spy()
      win.readerControl.docViewer.on('documentLoaded', spy)
      cy.wrap(null).then(() => {
        return waitOneSecond(2000).then(() => {
          expect(spy).to.be.called.once;
        })
      })
    })
  })

})

describe.skip('Test loadDocument extension and preloadWorker options', () => {
  before(() => {
    cy.server()
    cy.visit(WebViewerUrl + '#preloadWorker=pdf');
  });

  it('load xod with extension and filename flag', function () {
    let spy
    cy.window().then((win) => {
      spy = cy.spy()
      win.readerControl.docViewer.on('documentLoaded', spy)
      win.readerControl.loadDocument(testFilesPath + '/xod_file', {extension: 'xod'})
      cy.wrap(null).then(() => {
        return waitOneSecond(2000).then(() => {
          expect(spy).to.be.called.once;
        })
      })
    })


  })
  it('load pdf with extension and filename flag', function () {
    let spy
    cy.window().then((win) => {
      spy = cy.spy()
      win.readerControl.docViewer.on('documentLoaded', spy)
      win.readerControl.loadDocument(testFilesPath + '/pdf_file', {extension: 'pdf'})
      cy.wrap(null).then(() => {
        return waitOneSecond(2000).then(() => {
          expect(spy).to.be.called.once;
        })
      })
    })


  })

})
const changingStickyToolStyles = () => {
  return new Promise(resolve => {
    // change the stroke color to the first color in the palette
    // set opacity to almost 0
    cy.get('.HeaderItems').within(() => {
      cy.get('[data-element="stickyToolButton"]').click().click();
    });
    cy.get('.cell').first().click();
    cy.get('line').first().click('left').then(resolve);
  });
};
