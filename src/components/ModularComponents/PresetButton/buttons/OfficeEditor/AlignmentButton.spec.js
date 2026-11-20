import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { JUSTIFICATION_OPTIONS } from 'constants/officeEditor';
import AlignmentButton from './AlignmentButton';

const mockUpdateParagraphStyle = jest.fn();
let mockIsActive = false;

jest.mock('hooks/useCore', () => () => ({
  core: {
    getOfficeEditor: () => ({ updateParagraphStyle: mockUpdateParagraphStyle }),
  },
}));

// Drive the active state directly through the selector result the component consumes.
jest.mock('react-redux', () => ({
  useSelector: () => mockIsActive,
}));

jest.mock('../../../Helpers/menuItems', () => ({
  menuItems: {
    alignLeftButton: { dataElement: 'alignLeftButton', icon: 'icon-menu-left-align', title: 'officeEditor.leftAlign' },
    alignCenterButton: { dataElement: 'alignCenterButton', icon: 'icon-menu-center-align', title: 'officeEditor.centerAlign' },
    alignRightButton: { dataElement: 'alignRightButton', icon: 'icon-menu-right-align', title: 'officeEditor.rightAlign' },
    justifyBothButton: { dataElement: 'justifyBothButton', icon: 'icon-menu-both-align', title: 'officeEditor.justify' },
  },
}));

jest.mock('components/ActionButton', () => {
  const MockActionButton = (props) => (
    <button
      type="button"
      data-element={props.dataElement}
      data-img={props.img}
      onClick={props.onClick}
    >
      {props.title}
    </button>
  );
  return MockActionButton;
});

jest.mock('../../../FlyoutItemContainer', () => {
  const MockFlyoutItemContainer = (props) => (
    <button
      type="button"
      data-element="flyout-item"
      data-additional-class={props.additionalClass}
      onClick={props.onClick}
    >
      flyout
    </button>
  );
  return MockFlyoutItemContainer;
});

const LEFT_BUTTON_TYPE = 'alignLeftButton';

// Mirror the production pairing of button type and alignment from PresetButton.js
// so parameterized cases exercise realistic prop combinations.
const ALIGNMENT_BY_BUTTON_TYPE = {
  alignLeftButton: JUSTIFICATION_OPTIONS.Left,
  alignCenterButton: JUSTIFICATION_OPTIONS.Center,
  alignRightButton: JUSTIFICATION_OPTIONS.Right,
  justifyBothButton: JUSTIFICATION_OPTIONS.Both,
};

describe('AlignmentButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsActive = false;
  });

  it('should render an ActionButton using the menu metadata for the given button type', () => {
    render(<AlignmentButton buttonType={LEFT_BUTTON_TYPE} alignment={JUSTIFICATION_OPTIONS.Left} />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-element', 'alignLeftButton');
    expect(button).toHaveAttribute('data-img', 'icon-menu-left-align');
    expect(button).toHaveTextContent('officeEditor.leftAlign');
  });

  it.each(Object.entries(ALIGNMENT_BY_BUTTON_TYPE))(
    'should apply the %s alignment as the paragraph justification when clicked',
    (buttonType, alignment) => {
      render(<AlignmentButton buttonType={buttonType} alignment={alignment} />);

      fireEvent.click(screen.getByRole('button'));

      expect(mockUpdateParagraphStyle).toHaveBeenCalledTimes(1);
      expect(mockUpdateParagraphStyle).toHaveBeenCalledWith({ justification: alignment });
    }
  );

  it('should prefer explicit dataElement, img, and title props over the menu metadata', () => {
    render(
      <AlignmentButton
        buttonType={LEFT_BUTTON_TYPE}
        alignment={JUSTIFICATION_OPTIONS.Left}
        dataElement="customAlignButton"
        img="custom-icon"
        title="Custom Title"
      />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-element', 'customAlignButton');
    expect(button).toHaveAttribute('data-img', 'custom-icon');
    expect(button).toHaveTextContent('Custom Title');
  });

  describe('as a flyout item', () => {
    it('should render a FlyoutItemContainer instead of an ActionButton', () => {
      render(<AlignmentButton buttonType={LEFT_BUTTON_TYPE} alignment={JUSTIFICATION_OPTIONS.Left} isFlyoutItem />);

      expect(screen.getByRole('button')).toHaveAttribute('data-element', 'flyout-item');
    });

    it.each(Object.entries(ALIGNMENT_BY_BUTTON_TYPE))(
      'should apply the %s alignment as the paragraph justification when clicked',
      (buttonType, alignment) => {
        render(<AlignmentButton buttonType={buttonType} alignment={alignment} isFlyoutItem />);

        fireEvent.click(screen.getByRole('button'));

        expect(mockUpdateParagraphStyle).toHaveBeenCalledTimes(1);
        expect(mockUpdateParagraphStyle).toHaveBeenCalledWith({ justification: alignment });
      }
    );

    it('should mark the flyout item active when the alignment matches the current justification', () => {
      mockIsActive = true;

      render(<AlignmentButton buttonType={LEFT_BUTTON_TYPE} alignment={JUSTIFICATION_OPTIONS.Left} isFlyoutItem />);

      expect(screen.getByRole('button')).toHaveAttribute('data-additional-class', 'active');
    });

    it('should not mark the flyout item active when the alignment does not match the current justification', () => {
      mockIsActive = false;

      render(<AlignmentButton buttonType={LEFT_BUTTON_TYPE} alignment={JUSTIFICATION_OPTIONS.Left} isFlyoutItem />);

      expect(screen.getByRole('button')).toHaveAttribute('data-additional-class', '');
    });
  });
});
