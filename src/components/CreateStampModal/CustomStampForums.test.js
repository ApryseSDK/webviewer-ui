import CustomStampForums from 'components/CreateStampModal/CustomStampForums';
import { render, fireEvent } from '@testing-library/react';
import React from 'react';

const ModalBodyWithI18n = withProviders(CustomStampForums);

const noop = () => {};

const props = {
  dateTimeFormats: [
    {
      date: 'DD/MM/YYYY',
      time: 'h:mm A',
      timeFirst: false,
    },
    {
      date: 'DD/MM/YYYY',
      time: 'HH:mm',
      timeFirst: false,
    }
  ],
  fonts: [
    'Arial',
    'Times New Roman',
  ],
  getCustomColorAndRemove: noop,
  openColorPicker: noop,
  openDeleteModal: noop,
  setEmptyInput: noop,
  setState: noop,
  stampTool: {
    drawCustomStamp: noop,
  },
  state: {
    bold: true,
    color: '#2A85D0',
    dataURL: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQYV2NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=',
    font: 'Tahoma',
    height: 100,
    italic: false,
    strikeout: false,
    subtitle: '[$currentUser] DD MMM YYYY HH:mm',
    textColor: '#FFFFFF',
    title: 'Draft',
    underline: false,
    width: 300,
  },
  userName: 'Guest',
};

describe('Custom Stamp Modal Body Tests: <CustomStampForums />', () => {
  it('should render correctly', () => {
    const { container } = render(<ModalBodyWithI18n {...props}/>);

    // Should contain canvas div and scrollable div
    expect(container.querySelector('.canvas-container')).toBeTruthy();
    const scrollableDiv = container.querySelector('.scroll-container');
    expect(scrollableDiv).toBeTruthy();

    // Scrollable div should contain 6 children
    expect(scrollableDiv.children.length).toBe(6);

    // should have two dropdowns, 1 input, 3 checkboxes, and 4 buttons
    expect(container.querySelectorAll('.Dropdown').length).toBe(2);
    expect(container.querySelectorAll('input[type="text"]').length).toBe(1);
    expect(container.querySelectorAll('input[type="checkbox"]').length).toBe(3);
    expect(container.querySelectorAll('.Button').length).toBe(4);
  });
  it('Should change state and call draw canvas', () => {
    const setStateMock = jest.fn();
    const stampToolMock = {
      drawCustomStamp: jest.fn(),
    };
    const { container } = render(
      <ModalBodyWithI18n
        {...props} setState={setStateMock} stampTool={stampToolMock}
      />
    );
    // Fire interaction events and check if setState and drawCustomStamp are called
    let expectedCalls = 1; // Calls 1 time on intial Render
    const textInput = container.querySelector('input[type="text"]');
    fireEvent.change(textInput, { target: { value: 'test' } });
    expectedCalls++;
    for (const checkbox of container.querySelectorAll('input[type="checkbox"]')) {
      fireEvent.click(checkbox);
      expectedCalls++;
    }
    for (const button of container.querySelectorAll('.Button')) {
      fireEvent.click(button);
      expectedCalls++;
    }
    expect(setStateMock).toHaveBeenCalledTimes(expectedCalls);
    expect(stampToolMock.drawCustomStamp).toHaveBeenCalledTimes(expectedCalls);
  });
});