import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DocumentCropPopup from './DocumentCropPopup';
import { Basic } from './DocumentCropPopup.stories';

const BasicDocumentCropPopupStory = withI18n(Basic);

const TestDocumentCropPopup = withProviders(DocumentCropPopup);

function noop() {}

jest.mock('core');

const createMockAnnotation = () => {
  return {
    x: 100,
    y: 100,
    width: 100,
    height: 100,
    getPageNumber() {
      return 1;
    },
    getRect() {
      return {
        x1: 1,
        x2: 2,
        y1: 3,
        y2: 4,
      };
    },
    getX() {
      return this.x;
    },
    getY() {
      return this.y;
    },
    getWidth() {
      return this.width;
    },
    getHeight() {
      return this.height;
    },
    setX(x) {
      this.x = Number(x);
    },
    setY(y) {
      this.y = Number(y);
    },
    setWidth(w) {
      this.width = Number(w);
    },
    setHeight(h) {
      this.height = Number(h);
    },
  };
};

const DEFAULT_CROP_TYPE = {
  text: 'All',
  mode: 'ALL_PAGES',
};

const NON_DEFAULT_CROP_TYPE = {
  text: 'Current Page',
  mode: 'SINGLE_PAGE',
};

const CROP_DIMENSIONS = {
  'Letter': {
    'yOffset': 0,
    'height': 11,
    'xOffset': 0,
    'width': 8.5,
  },
  'Half letter': {
    'yOffset': 0,
    'height': 5.5,
    'xOffset': 0,
    'width': 8.5,
  },
  'Junior legal': {
    'yOffset': 0,
    'height': 5,
    'xOffset': 0,
    'width': 8,
  }
};

const DEFAULT_UNITS = 'Inches (in)';
const DEFAULT_UNIT_IN_INPUT = '"';

const unitConversions = {
  '"': 1,
  'cm': 2.54,
  'mm': 25.4,
  'pt': 72,
};

const COLLAPSIBLE_MENU_TITLE = 'Crop Dimensions';

const DEFAULT_AUTO_TRIM = 'Letter';

const popupProps = {
  cropAnnotation: createMockAnnotation(),
  cropMode: 'ALL_PAGES',
  onCropModeChange: noop,
  closeDocumentCropPopup: noop,
  applyCrop: noop,
  isCropping: true,
  getPageHeight() {
    return 792;
  },
  getPageWidth() {
    return 612;
  },
  isPageRotated() {
    return false;
  },
  redrawCropAnnotations: noop,
  isInDesktopOnlyMode: false,
  isMobile: false,
  getPageCount: () => {
    9;
  },
  getCurrentPage: () => {
    1;
  },
  selectedPages: [],
  onSelectedPagesChange: noop,
  presetCropDimensions: CROP_DIMENSIONS
};

const testPopup = (
  <div className="DocumentCropPopupContainer">
    <TestDocumentCropPopup {...popupProps} />
  </div>
);

describe('DocumentCropPopup', () => {
  describe('Component', () => {
    it('Story should not throw any errors', () => {
      expect(() => {
        render(<BasicDocumentCropPopupStory />);
      }).not.toThrow();
    });

    it(`Renders with ${DEFAULT_CROP_TYPE['text']} Checked`, () => {
      render(testPopup);
      const cropTypeRadioButtons = screen.getAllByRole('radio');
      const defaultCropTypeButton = screen.getByRole('radio', { name: DEFAULT_CROP_TYPE['text'] });
      expect(cropTypeRadioButtons[0]).toEqual(defaultCropTypeButton);
      expect(defaultCropTypeButton).toBeChecked();
    });

    it(`Renders with ${NON_DEFAULT_CROP_TYPE['text']} Unchecked `, () => {
      render(testPopup);

      const cropTypeRadioButtons = screen.getAllByRole('radio');
      const nondefaultCropTypeButton = screen.getByRole('radio', { name: NON_DEFAULT_CROP_TYPE['text'] });
      expect(cropTypeRadioButtons[0]).not.toEqual(nondefaultCropTypeButton);
      expect(nondefaultCropTypeButton).not.toBeChecked();
    });

    it('Renders with Crop Dimensions collapsed', () => {
      render(testPopup);

      expect(screen.queryAllByRole('spinbutton').length).toEqual(0);
    });
  });
});

describe('Dimensions Input Menu', () => {
  it(`Should open when ${COLLAPSIBLE_MENU_TITLE} is clicked`, () => {
    render(testPopup);
    const collapsibleMenu = screen.getByText('Crop Dimensions');
    fireEvent.click(collapsibleMenu);
    expect(screen.getAllByRole('spinbutton').length).toEqual(4);
    expect(screen.getAllByRole('list').length).toEqual(2);
  });

  it(`Should close when ${COLLAPSIBLE_MENU_TITLE} is clicked after being open`, () => {
    render(testPopup);
    const collapsibleMenu = screen.getByText('Crop Dimensions');
    fireEvent.click(collapsibleMenu);
    expect(screen.getAllByRole('spinbutton').length).toEqual(4);
    expect(screen.getAllByRole('list').length).toEqual(2);
    fireEvent.click(collapsibleMenu);
    expect(screen.queryAllByRole('spinbutton').length).toEqual(0);
    expect(screen.queryAllByRole('list').length).toEqual(0);
  });

  it('Should be autopopulated by Annotation size', () => {
    render(testPopup);
    const collapsibleMenu = screen.getByText('Crop Dimensions');
    fireEvent.click(collapsibleMenu);
    const yOffset = screen.getByTestId('yOffset-input');
    expect(yOffset).toHaveValue(Math.trunc((createMockAnnotation().getY() / unitConversions['pt']) * 10000) / 10000);
    const width = screen.getByTestId('width-input');
    expect(width).toHaveValue(Math.trunc((createMockAnnotation().getWidth() / unitConversions['pt']) * 10000) / 10000);
    const height = screen.getByTestId('height-input');
    expect(height).toHaveValue(
      Math.trunc((createMockAnnotation().getHeight() / unitConversions['pt']) * 10000) / 10000,
    );
    const xOffset = screen.getByTestId('xOffset-input');
    expect(xOffset).toHaveValue(Math.trunc((createMockAnnotation().getX() / unitConversions['pt']) * 10000) / 10000);
  });

  it(`Should open with ${DEFAULT_UNITS} selected and enabled`, () => {
    render(testPopup);
    const collapsibleMenu = screen.getByText('Crop Dimensions');
    fireEvent.click(collapsibleMenu);
    const unitDropdown = screen.getAllByRole('button', { name: DEFAULT_UNITS })[0];
    expect(unitDropdown).toBeEnabled();
    expect(unitDropdown).toHaveTextContent(DEFAULT_UNITS);
    const unitsInInput = screen.getAllByText(DEFAULT_UNIT_IN_INPUT);
    expect(unitsInInput.length).toEqual(4);
  });

  it(`Should open with ${DEFAULT_AUTO_TRIM} selected and enabled`, () => {
    render(testPopup);
    const collapsibleMenu = screen.getByText('Crop Dimensions');
    fireEvent.click(collapsibleMenu);
    const autoTrimDropdown = screen.getAllByRole('button', { name: DEFAULT_AUTO_TRIM })[0];
    expect(autoTrimDropdown).toBeEnabled();
  });
});
