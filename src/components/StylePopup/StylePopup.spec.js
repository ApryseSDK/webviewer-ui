import { createStore } from 'redux';
import { Provider } from 'react-redux';
import React from 'react';
import { render, screen } from '@testing-library/react';
import StylePopup from 'components/StylePopup';
import DataElements from 'constants/dataElement';
import { workerTypes } from 'constants/types';
import core from 'core';

// mock initial state.
// UI Buttons are redux connected, and they need a state or the
// tests will error out
const initialState = {
  viewer: {
    openElements: {
      [DataElements.STYLE_POPUP_TEXT_STYLE_CONTAINER]: true
    },
    disabledElements: {},
    customElementOverrides: {},
    colorMap: {
      'freeText': {
        'currentStyleTab': 'TextColor',
        'iconColor': 'TextColor'
      },
      'stamp': {
        'currentStyleTab': null,
        'iconColor': null
      },
      'rectangle': {
        'currentStyleTab': 'StrokeColor',
        'iconColor': 'StrokeColor'
      }
    }
  }
};

function rootReducer(state = initialState, action) { // eslint-disable-line no-unused-vars
  return state;
}

const store = createStore(rootReducer);
const StylePopupWithRedux = (props) => (
  <Provider store={store}>
    <StylePopup {...props} />
  </Provider>
);

const createStylePopupTest = (colorMapKey, additionalProps = {}) => {
  const style = {
    Opacity: 20,
    StrokeThickness: 0,
    FontSize: '20pt',
    StrokeStyle: 'sold',
  };
  const { container } = render(<StylePopupWithRedux
    hideSnapModeCheckbox={false}
    colorMapKey={colorMapKey}
    style={style}
    onStyleChange={noop}
    onPropertyChange={noop}
    onSliderChange={noop}
    disableSeparator
    onRichTextStyleChange={noop}
    onLineStyleChange={noop}
    {...additionalProps}
  />);

  const header = container.querySelector('.palette-options');
  const menuList = container.querySelectorAll('.collapsible-menu');
  const menuItems = container.querySelectorAll('.menu-items');
  const sliders = container.querySelector('.sliders-container');
  const styles = container.querySelector('.styles-container');

  return {
    header,
    menuList,
    menuItems,
    container,
    sliders,
    styles,
  };
};

const noop = () => { };

describe('StylePopup component', () => {
  beforeEach(() => {
    core.setDocumentViewer(1, new window.Core.DocumentViewer());
  });

  it('Should render two collapsible menus and a header for free text', () => {
    const { header, menuItems, menuList } = createStylePopupTest('freeText', {
      properties: {
        FontSize: '20pt',
        Font: 'Arial',
        TextAlign: 'left',
        TextVerticalAlign: 'top',
        bold: false,
        italic: false,
        underline: false,
        strikeout: false,
        StrokeStyle: 'sold',
      },
      isFreeText: true
    });
    expect(menuList.length).toBe(2);
    expect(menuItems.length).toBe(1); // Colors menu does not need 'menu-items' class
    expect(header).toBeInTheDocument();
  });

  it('Should render slider for stamps with no header', () => {
    const { header, menuItems, menuList, sliders } = createStylePopupTest('stamp');
    expect(menuList.length).toBe(0);
    expect(menuItems.length).toBe(0);
    expect(header).toBeNull();
    expect(sliders).toBeInTheDocument();
    expect(sliders.children.length).toBeGreaterThanOrEqual(1);
  });

  it('Should render a header and sliders for other annotations', () => {
    const { header, menuItems, menuList, container, sliders, styles } = createStylePopupTest('rectangle');
    const palletePicker = container.querySelector('.ColorPalette');
    expect(menuList.length).toBe(0);
    expect(menuItems.length).toBe(0);
    expect(header).toBeInTheDocument();
    expect(sliders).toBeInTheDocument();
    expect(sliders.children.length).toBeGreaterThanOrEqual(1);
    expect(palletePicker).toBeInTheDocument();
  });

  it('Should not render styles for rectangle annotations', () => {
    initialState.viewer.colorMap.rectangle.currentStyleTab = 'FillColor';
    const { header, menuItems, menuList, container, sliders, styles } = createStylePopupTest('rectangle');
    expect(menuList.length).toBe(0);
    expect(menuItems.length).toBe(0);
    expect(header).toBeInTheDocument();
    expect(sliders).toBeInTheDocument();
    expect(styles).not.toBeInTheDocument();
    expect(sliders.children.length).toBeGreaterThanOrEqual(1);
  });

  describe('Show Measurement Snapping Option', () => {
    const checkboxText = 'Enable snapping for measurement tools';
    const props = {
      hideSnapModeCheckbox: false,
      style: {
        Scale: {},
        Precision: {}
      }
    };

    beforeEach(() => {
      core.getDocument = jest.fn();
    });

    it('Should render measurement snapping option if worker type is PDF', () => {
      core.getDocument.mockReturnValue({ getType: () => workerTypes.PDF });
      createStylePopupTest('distanceMeasurement', props);
      screen.getByText(checkboxText);
    });

    it('Should render measurement snapping option if document was swapped to client side', () => {
      core.getDocument.mockReturnValue({
        getType: () => workerTypes.WEBVIEWER_SERVER,
        isWebViewerServerDocument: () => false
      });

      createStylePopupTest('distanceMeasurement', props);
      screen.getByText(checkboxText);
    });

    it('Should not render measurement snapping option if worker type is WEBVIEWER_SERVER and not swapped client side', () => {
      core.getDocument.mockReturnValue({
        getType: () => workerTypes.WEBVIEWER_SERVER,
        isWebViewerServerDocument: () => true
      });

      createStylePopupTest('distanceMeasurement', props);

      const checkbox = screen.queryByText(checkboxText);
      expect(checkbox).toBeNull();
    });
  });
});