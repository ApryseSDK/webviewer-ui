import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DocumentCropPopup from './DocumentCropPopup';
import DimensionsInput from './DimensionsInput';
import { Basic } from './DocumentCropPopup.stories';
import core from 'core';

const BasicDocumentCropPopupStory = withI18n(Basic);

const TestDocumentCropPopup = withProviders(DocumentCropPopup);

function noop() {}

jest.mock('core');

const annotation = {
  getPageNumber: () => {
    return 1;
  },
  getRect: () => {
    return {
      x1: 1,
      x2: 1,
      y1: 1,
      y2: 1,
    };
  },
  top: 1,
  bottom: 1,
  left: 1,
  right: 1
};

const DEFAULT_CROP_TYPE = {
  text: 'All',
  mode: 'ALL_PAGES',
};

const NON_DEFAULT_CROP_TYPE = {
  text: 'Current Page',
  mode: 'SINGLE_PAGE',
};

const SUPPORTED_UNITS = {
  'Inches (in)': '"',
  'Centimeters (cm)': 'cm',
  'Millimeters (mm)': 'mm',
}

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
}

const DEFAULT_UNITS = 'Inches (in)';
const DEFAULT_UNIT_IN_INPUT = '\"';

const COLLAPSIBLE_MENU_TITLE = 'Crop Dimensions';

const AUTO_TRIM_OPTIONS = ['Letter', 'Half letter', 'Junior legal'];

const DEFAULT_AUTO_TRIM = 'Letter';

const testPopup = (
  <div className="DocumentCropPopupContainer">
    <TestDocumentCropPopup
      cropAnnotation={annotation}
      cropMode={'ALL_PAGES'}
      onCropModeChange={noop()}
      getCropDimension={() => {
        1;
      }}
      setCropTop={1}
      setCropBottom={1}
      setCropLeft={1}
      setCropRight={1}
      closeDocumentCropPopup={noop()}
      applyCrop={noop()}
      isCropping={true}
      getPageHeight={noop()}
      getPageWidth={noop()}
      redrawCropAnnotations={noop}
      isInDesktopOnlyMode={false}
      isMobile={false}
      presetCropDimensions={CROP_DIMENSIONS}
    />
  </div>
);

const testDimensions = (
  <div className="DocumentCropPopup">
      <DimensionsInput
        top={1}
        right={1}
        bottom={1}
        left={1}
        unit={DEFAULT_UNITS}
        autoTrim={DEFAULT_AUTO_TRIM}
        supportedUnits={SUPPORTED_UNITS}
        autoTrimOptions={AUTO_TRIM_OPTIONS}
        onDimensionChange={noop}
        onUnitChange={noop}
        autoTrimActive={true}
        setAutoTrimActive={noop}
        onAutoTrimChange={noop}
      />
  </div>
)

describe('DocumentCropPopup', () => {
  describe('Component', () => {
    it('Story should not throw any errors', () => {
      expect(() => {
        render(<BasicDocumentCropPopupStory />);
      }).not.toThrow();
    });

    it('Renders with ' + DEFAULT_CROP_TYPE['text'] + ' Checked', () => {
      render(testPopup);
      const cropTypeRadioButtons = screen.getAllByRole('radio');
      const defaultCropTypeButton = screen.getByRole('radio', { name: DEFAULT_CROP_TYPE['text'] });
      expect(cropTypeRadioButtons[0]).toEqual(defaultCropTypeButton);
      expect(defaultCropTypeButton).toBeChecked();
    });

    it('Renders with ' + NON_DEFAULT_CROP_TYPE['text'] + ' Unchecked', () => {
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
  it('Should open when ' + COLLAPSIBLE_MENU_TITLE  + ' is clicked', () => {
    render(testPopup);
    const collapsibleMenu = screen.getByText('Crop Dimensions');
    spyOn(console, 'error');
    fireEvent.click(collapsibleMenu);
    expect(screen.getAllByRole('spinbutton').length).toEqual(4);
    expect(screen.getAllByRole('listbox').length).toEqual(2);
    expect(screen.getAllByRole('checkbox').length).toEqual(1);
  });

  it('Should close when ' + COLLAPSIBLE_MENU_TITLE + ' is clicked after being open', () => {
    render(testPopup);
    const collapsibleMenu = screen.getByText('Crop Dimensions');
    spyOn(console, 'error');
    fireEvent.click(collapsibleMenu);
    expect(screen.getAllByRole('spinbutton').length).toEqual(4);
    expect(screen.getAllByRole('listbox').length).toEqual(2);
    expect(screen.getAllByRole('checkbox').length).toEqual(1);
    fireEvent.click(collapsibleMenu);
    expect(screen.queryAllByRole('spinbutton').length).toEqual(0);
    expect(screen.queryAllByRole('listbox').length).toEqual(0);
    expect(screen.queryAllByRole('checkbox').length).toEqual(0);
  })

  describe('Crop Dimension Inputs', () => {
    it('Should be autopopulated by Annotation size', () => {
      render(testDimensions);
      const topInput = screen.getByTestId('top-input');
      expect(topInput).toHaveValue(annotation.top);
      const rightInput = screen.getByTestId('right-input');
      expect(rightInput).toHaveValue(annotation.right);
      const bottomInput = screen.getByTestId('bottom-input');
      expect(bottomInput).toHaveValue(annotation.bottom);
      const leftInput = screen.getByTestId('left-input');
      expect(leftInput).toHaveValue(annotation.left);
    });

    it('Should open with ' + DEFAULT_UNITS + ' selected and enabled', () => {
      render(testDimensions);
      const unitDropdown = screen.getByRole('button', {name: 'Unit'});
      expect(unitDropdown).toBeEnabled();
      expect(unitDropdown).toHaveTextContent(DEFAULT_UNITS);
      const unitsInInput = screen.getAllByText(DEFAULT_UNIT_IN_INPUT);
      expect(unitsInInput.length).toEqual(4);
    })
  })

  it('Should open with Auto-trim disabled but with ' + DEFAULT_AUTO_TRIM + ' selected', () => {
    render(testPopup);
    const collapsibleMenu = screen.getByText('Crop Dimensions');
    spyOn(console, 'error');
    fireEvent.click(collapsibleMenu);
    const autoTrimCheckbox = screen.getByLabelText('Auto-trim:');
    expect(autoTrimCheckbox).not.toBeChecked();
    // Dropdown elements create 2 different buttons, one for selected option and 1 for dropdown options.
    // We need to get the initial selected option here.
    const autoTrimDropdown = screen.getAllByRole('button', {name: DEFAULT_AUTO_TRIM})[0];
    expect(autoTrimDropdown).toBeDisabled();
  })
});
