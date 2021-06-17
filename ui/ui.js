// @link WebViewerInstance: https://www.pdftron.com/api/web/WebViewerInstance.html
// @link UI.setHeaderItems: https://www.pdftron.com/api/web/UI.html#setHeaderItems__anchor
// @link UI.enableElements: https://www.pdftron.com/api/web/UI.html#enableElements__anchor
// @link UI.disableElements: https://www.pdftron.com/api/web/UI.html#disableElements__anchor

// @link Header: https://www.pdftron.com/api/web/Header.html
// @link Header.getItems: https://www.pdftron.com/api/web/Header.html#getItems__anchor
// @link Header.update: https://www.pdftron.com/api/web/Header.html#update__anchor

WebViewer(
  {
    path: '../../../lib',
    /* PDFJS_IGNORE */ /* TEST_IGNORE */ webviewerServerURL: 'https://demo.pdftron.com/', // comment this out to do client-side only /* /TEST_IGNORE */ /* /PDFJS_IGNORE */
    initialDoc: 'https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf',
  },
  document.getElementById('viewer')
).then((instance) => {
  samplesSetup(instance);
  const { setHeaderItems, enableElements, disableElements, enableFeatures, disableFeatures, setTheme, Feature } = instance.UI;

  const reverseHeaderItems = () => {
    // Change header items
    setHeaderItems((header) => {
      const items = header.getItems();
      const copiedItems = items.splice(2, 18);
      copiedItems.reverse();
      header.update([].concat(items.slice(0, 2), copiedItems, items.slice(2)));
    });
  };

  const toggleElement = (e, dataElement) => {
    // Enable/disable individual element
    if (e.target.checked) {
      enableElements([dataElement]);
    } else {
      disableElements([dataElement]);
    }
  };

  if (NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
  }

  if (HTMLCollection && !HTMLCollection.prototype.forEach) {
    HTMLCollection.prototype.forEach = Array.prototype.forEach;
  }

  document.getElementsByName('header').forEach((radioInput) => {
    radioInput.onchange = () => {
      reverseHeaderItems();
    };
  });

  document.getElementById('ribbons').onchange = (e) => {
    // Enable/disable ribbons
    if (e.target.checked) {
      enableFeatures([Feature.Ribbons]);
    } else {
      disableFeatures([Feature.Ribbons]);
    }
  };

  document.getElementById('text-selection').onchange = (e) => {
    // Enable/disable text selection
    if (e.target.checked) {
      enableFeatures([Feature.TextSelection]);
    } else {
      disableFeatures([Feature.TextSelection]);
    }
  };

  document.getElementById('annotations').onchange = (e) => {
    // Enable/disable annotations
    if (e.target.checked) {
      enableFeatures([Feature.Annotations]);
    } else {
      disableFeatures([Feature.Annotations]);
    }
  };

  document.getElementById('notes-panel').onchange = (e) => {
    // Enable/disable notes panel
    if (e.target.checked) {
      enableFeatures([Feature.NotesPanel]);
    } else {
      disableFeatures([Feature.NotesPanel]);
    }
  };

  document.getElementById('file-picker').onchange = (e) => {
    // Enable/disable file picker
    if (e.target.checked) {
      enableFeatures([Feature.FilePicker]);
    } else {
      disableFeatures([Feature.FilePicker]);
    }
  };

  document.getElementById('print').onchange = (e) => {
    // Enable/disable print
    if (e.target.checked) {
      enableFeatures([Feature.Print]);
    } else {
      disableFeatures([Feature.Print]);
    }
  };

  document.getElementById('download').onchange = (e) => {
    // Enable/disable download
    if (e.target.checked) {
      enableFeatures([Feature.Download]);
    } else {
      disableFeatures([Feature.Download]);
    }
  };

  document.getElementById('view-controls').onchange = (e) => {
    toggleElement(e, 'viewControlsButton');
  };

  document.getElementById('search').onchange = (e) => {
    toggleElement(e, 'searchButton');
  };

  document.getElementById('pan-tool').onchange = (e) => {
    toggleElement(e, 'panToolButton');
  };

  document.getElementById('page-nav').onchange = (e) => {
    toggleElement(e, 'pageNavOverlay');
  };

  document.getElementById('default').onchange = (e) => {
    if (e.target.checked) {
      reverseHeaderItems();
    }
  };

  document.getElementById('reverse').onchange = (e) => {
    if (e.target.checked) {
      reverseHeaderItems();
    }
  };

  document.getElementsByName('theme').forEach((radioInput) => {
    radioInput.onchange = (e) => {
      if (e.target.id === 'light' && e.target.checked) {
        setTheme('light');
      } else {
        setTheme('dark');
      }
    };
  });
});
