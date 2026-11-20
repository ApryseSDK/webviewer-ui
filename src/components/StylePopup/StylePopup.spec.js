import { createStore } from 'redux';
import { Provider } from 'react-redux';
import React from 'react';
import { render, screen } from '@testing-library/react';
import StylePopup from 'components/StylePopup';
import DataElements from 'constants/dataElement';
import { workerTypes } from 'constants/types';
import core from 'core';
import InstanceIdContext from 'src/context/InstanceIdContext';
import { getCurrentInstanceId, registerInstance, resetInstances, setCurrentInstanceId } from 'core/documentViewers';

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
    },
    activeToolName: '',
    snapMode: {},
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

const createStylePopupTest = (colorMapKey, additionalProps = {}, wrap = (element) => element) => {
  const style = {
    Opacity: 20,
    StrokeThickness: 0,
    FontSize: '20pt',
    StrokeStyle: 'sold',
  };
  const { container } = render(wrap(<StylePopupWithRedux
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
  />));

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

    describe('with two instances', () => {
      beforeEach(() => {
        registerInstance(1);
        registerInstance(2);
      });

      afterEach(() => {
        resetInstances();
      });

      it('Should read the initial document from its own instance when another instance is current', () => {
        core.getDocument.mockImplementation(() => {
          const type = getCurrentInstanceId() === 1 ? workerTypes.PDF : workerTypes.WEBVIEWER_SERVER;
          return { getType: () => type, isWebViewerServerDocument: () => true };
        });
        setCurrentInstanceId(2);

        createStylePopupTest('distanceMeasurement', props, (element) => (
          <InstanceIdContext.Provider value={1}>{element}</InstanceIdContext.Provider>
        ));

        screen.getByText(checkboxText);
      });

      it('Should read the snap mode from the tool of its own instance when another instance is current', () => {
        const instancesAsked = [];
        jest.spyOn(core, 'isFullPDFEnabled').mockReturnValue(true);
        jest.spyOn(core, 'getToolMode').mockImplementation(() => {
          instancesAsked.push(getCurrentInstanceId());
          return { name: 'MeasurementTool', getSnapMode: () => true };
        });
        setCurrentInstanceId(2);

        createStylePopupTest('distanceMeasurement', props, (element) => (
          <InstanceIdContext.Provider value={1}>{element}</InstanceIdContext.Provider>
        ));

        expect(instancesAsked).toEqual([1]);
      });

      it('Should ask its own instance whether it is in form creation mode when another instance is current', () => {
        const instancesAsked = [];
        jest.spyOn(core, 'getFormFieldCreationManager').mockImplementation(() => {
          instancesAsked.push(getCurrentInstanceId());
          return { isInFormFieldCreationMode: () => false };
        });
        setCurrentInstanceId(2);

        createStylePopupTest('distanceMeasurement', props, (element) => (
          <InstanceIdContext.Provider value={1}>{element}</InstanceIdContext.Provider>
        ));

        expect(instancesAsked.length).toBeGreaterThan(0);
        expect(new Set(instancesAsked)).toEqual(new Set([1]));
      });
    });
  });
});