import { createStore } from "redux";
import { Provider } from "react-redux";
import React from "react";
import { render } from "@testing-library/react";
import StylePopup from 'components/StylePopup';

// mock initial state.
// UI Buttons are redux connected, and they need a state or the
// tests will error out
const initialState = {
  viewer: {
    openElements: [],
    disabledElements: {},
    customElementOverrides: {},
    colorMap: {
      "freeText": {
        "currentPalette": "TextColor",
        "iconColor": "TextColor"
      },
      "stamp": {
        "currentPalette": null,
        "iconColor": null
      },
      "rectangle": {
        "currentPalette": "StrokeColor",
        "iconColor": "StrokeColor"
      },
    }
  }
};

function rootReducer(state = initialState, action) { // eslint-disable-line no-unused-vars
  return state;
}

const store = createStore(rootReducer);
const StylePopupWithRedux = props => (
  <Provider store={store}>
    <StylePopup {...props} />
  </Provider>
);

const createStylePopupTest = (colorMapKey, additionalProps = {}) => {
  const style = {
    Opacity: 20,
    StrokeThickness: 0,
    FontSize: "20pt",
  };
  const { container } = render(<StylePopupWithRedux
    hideSnapModeCheckbox={false}
    colorMapKey={colorMapKey}
    style={style}
    onStyleChange={noop}
    onPropertyChange={noop}
    disableSeparator
    onRichTextStyleChange={noop}
    {...additionalProps}
  />);

  const header = container.querySelector(".palette-options");
  const menuList = container.querySelectorAll('.collapsible-menu');
  const menuItems = container.querySelectorAll('.menu-items');
  const sliders = container.querySelector(".sliders-container");

  return {
    header,
    menuList,
    menuItems,
    container,
    sliders
  };
};

const noop = () => {};

describe('StylePopup component', () => {
  it('Should render two collapsible menus and a header for free text', () => {
    const { header, menuItems, menuList } = createStylePopupTest("freeText", {
      freeTextProperties: {
        FontSize: "20pt",
        Font: "Arial",
        TextAlign: "left",
        TextVerticalAlign: "top",
        bold: false,
        italic: false,
        underline: false,
        strikeout: false,
      },
      isFreeText: true,
      isFontSizeSliderDisabled: true,
    });
    expect(menuList.length).toBe(2);
    expect(menuItems.length).toBe(2);
    expect(header).toBeInTheDocument();
    expect(menuItems[0]).toHaveClass('closed');
    expect(menuItems[1]).toHaveClass('closed');
  });
  it('Should render slider for stamps with no header', () => {
    const { header, menuItems, menuList, container, sliders } = createStylePopupTest("stamp");
    expect(menuList.length).toBe(0);
    expect(menuItems.length).toBe(0);
    expect(header).toBeNull();
    expect(sliders).toBeInTheDocument();
    expect(sliders.children.length).toBeGreaterThanOrEqual(1);
  });
  it('Should render a header and sliders for other annotations', () => {
    const { header, menuItems, menuList, container, sliders } = createStylePopupTest("rectangle");
    const palletePicker = container.querySelector(".ColorPalette");
    expect(menuList.length).toBe(0);
    expect(menuItems.length).toBe(0);
    expect(header).toBeInTheDocument();
    expect(sliders).toBeInTheDocument();
    expect(sliders.children.length).toBeGreaterThanOrEqual(1);
    expect(palletePicker).toBeInTheDocument();
  });
});