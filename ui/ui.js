// @link WebViewerInstance: https://docs.apryse.com/api/web/WebViewerInstance.html
// @link UI.setHeaderItems: https://docs.apryse.com/api/web/UI.html#.setHeaderItems__anchor
// @link UI.enableElements: https://docs.apryse.com/api/web/UI.html#.enableElements__anchor
// @link UI.disableElements: https://docs.apryse.com/api/web/UI.html#.disableElements__anchor

// @link Header: https://docs.apryse.com/api/web/UI.Header.html
// @link Header.getItems: https://docs.apryse.com/api/web/UI.Header.html#getItems__anchor
// @link Header.update: https://docs.apryse.com/api/web/UI.Header.html#update__anchor
// eslint-disable-next-line no-undef
const WebViewerConstructor = isWebComponent() ? WebViewer.WebComponent : WebViewer;

WebViewerConstructor(
  {
    path: '../../../lib',
    initialDoc: 'https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf',
  },
  document.getElementById('viewer')
).then((instance) => {
  samplesSetup(instance);
  const { setHeaderItems, enableElements, disableElements, enableFeatures, disableFeatures, setTheme, Feature, Theme } = instance.UI;

  const findFirstDividerIndex = (items) => {
    for (let i = 0; i < items.length; ++i) {
      if (items[i].type === 'divider') {
        return i;
      }
    }
  };

  const reverseHeaderItems = () => {
    // Change header items
    setHeaderItems((header) => {
      const items = header.getItems();
      // reverse all items after first divider
      const indexAfterFirstDivider = findFirstDividerIndex(items) + 1;
      // could use findIndex if you don't need to support IE
      // const indexAfterFirstDivider = items.findIndex(item => item.type === 'divider') + 1;
      const itemsToReverse = items.slice(indexAfterFirstDivider);
      itemsToReverse.reverse();

      header.update([].concat(items.slice(0, indexAfterFirstDivider), itemsToReverse));
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
        setTheme(Theme.LIGHT);
      } else {
        setTheme(Theme.DARK);
      }
    };
  });
});
