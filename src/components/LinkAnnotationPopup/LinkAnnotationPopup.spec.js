import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Basic } from './LinkAnnotationPopup.stories';
import LinkAnnotationPopup from './LinkAnnotationPopup';

const TestAnnotationPopup = withProviders(Basic);
const LinkAnnotationPopupWithProviders = withProviders(LinkAnnotationPopup);

function noop() { }
const uri = 'https://www.Apryse.com';

describe('LinkAnnotationPopup Component', () => {
  it('Should not throw any errors when rendering storybook component', () => {
    expect(() => {
      render(<TestAnnotationPopup />);
    }).not.toThrow();
  });

  it('Should render link annotation popup with UI elements', () => {
    render(
      <LinkAnnotationPopupWithProviders
        isAnnotation={true}
        isMobileDevice={false}
        linkText={uri}
        handleUnLink={noop}
        handleOnMouseEnter={noop}
        handleOnMouseLeave={noop}
        handleMouseMove={noop}
      />
    );

    screen.getByText(uri);
    screen.getByRole('button', { name: 'action.unlink' });
  });

  it('Should not render link annotation popup when isAnnotation is false', () => {
    render(
      <LinkAnnotationPopupWithProviders
        isAnnotation={false}
        isMobileDevice={false}
        linkText={uri}
        handleUnLink={noop}
        handleOnMouseEnter={noop}
        handleOnMouseLeave={noop}
        handleMouseMove={noop}
      />
    );

    expect(screen.queryByText(uri)).toBeNull();
    expect(screen.queryByRole('button', { name: 'action.unlink' })).toBeNull();
  });

  it('Should not render link annotation popup when isMobileDevice is true', () => {
    render(
      <LinkAnnotationPopupWithProviders
        isAnnotation={true}
        isMobileDevice={true}
        linkText={uri}
        handleUnLink={noop}
        handleOnMouseEnter={noop}
        handleOnMouseLeave={noop}
        handleMouseMove={noop}
      />
    );

    expect(screen.queryByText(uri)).toBeNull();
    expect(screen.queryByRole('button', { name: 'Delete Link' })).toBeNull();
  });

  it('Should only render unlink button when linkText is empty', () => {
    render(
      <LinkAnnotationPopupWithProviders
        isAnnotation={true}
        isMobileDevice={false}
        linkText={''}
        handleUnLink={noop}
        handleOnMouseEnter={noop}
        handleOnMouseLeave={noop}
        handleMouseMove={noop}
      />
    );

    expect(screen.queryByText(uri)).toBeNull();
    screen.getByRole('button', { name: 'action.unlink' });
  });

  it('Should call handleUnLink when unlink button is clicked', () => {
    const handleUnLink = jest.fn();

    render(
      <LinkAnnotationPopupWithProviders
        isAnnotation={true}
        isMobileDevice={false}
        linkText={uri}
        handleUnLink={handleUnLink}
        handleOnMouseEnter={noop}
        handleOnMouseLeave={noop}
        handleMouseMove={noop}
      />
    );

    const unlinkButton = screen.getByRole('button', { name: 'action.unlink' });
    unlinkButton.click();
    expect(handleUnLink).toBeCalled();
  });

  it('Should call handleOnMouseEnter when mouse enters popup', () => {
    const handleOnMouseEnter = jest.fn();

    render(
      <LinkAnnotationPopupWithProviders
        isAnnotation={true}
        isMobileDevice={false}
        linkText={uri}
        handleUnLink={noop}
        handleOnMouseEnter={handleOnMouseEnter}
        handleOnMouseLeave={noop}
        handleMouseMove={noop}
      />
    );

    const popup = screen.getByTestId('link-annotation-element');
    fireEvent.mouseEnter(popup);
    expect(handleOnMouseEnter).toBeCalled();
  });

  it('Should call handleOnMouseLeave when mouse leaves popup', () => {
    const handleOnMouseLeave = jest.fn();

    render(
      <LinkAnnotationPopupWithProviders
        isAnnotation={true}
        isMobileDevice={false}
        linkText={uri}
        handleUnLink={noop}
        handleOnMouseEnter={noop}
        handleOnMouseLeave={handleOnMouseLeave}
        handleMouseMove={noop}
      />
    );

    const popup = screen.getByTestId('link-annotation-element');
    fireEvent.mouseLeave(popup);
    expect(handleOnMouseLeave).toBeCalled();
  });

  it('Should call handleMouseMove when mouse moves over popup', () => {
    const handleMouseMove = jest.fn();

    render(
      <LinkAnnotationPopupWithProviders
        isAnnotation={true}
        isMobileDevice={false}
        linkText={uri}
        handleUnLink={noop}
        handleOnMouseEnter={noop}
        handleOnMouseLeave={noop}
        handleMouseMove={handleMouseMove}
      />
    );

    const popup = screen.getByTestId('link-annotation-element');
    fireEvent.mouseMove(popup);
    expect(handleMouseMove).toBeCalled();
  });
});