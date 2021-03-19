import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Basic } from './ZoomOverlay.stories';
import ZoomOverlay from "./ZoomOverlay";
import core from 'core';
import {createStore} from "redux";
import {Provider} from "react-redux";

const BasicZoomOverlay = withI18n(Basic);

// create test component with mock redux and i18n
const initialState = {
  viewer: {
    disabledElements: {},
    openElements: ['zoomOverlay'],
    colorMap: [{colorMapKey: '#F1A099'}],
    toolButtonObjects: {MarqueeZoomTool: { dataElement: 'marqueeToolButton', showColor: 'never' }},
    customElementOverrides: [{marqueeToolButton: {disabled: true}}]
  },
};
function rootReducer(state = initialState, action) { // eslint-disable-line no-unused-vars
  return state;
}
const store = createStore(rootReducer);
const ZoomOverlayWithMockRedux = function(props) {
  return (
    <Provider store={store}>
      <ZoomOverlay {...props} />
    </Provider>
  );
};
const TestZoomOverlay = withI18n(ZoomOverlayWithMockRedux);

function noop() {}

jest.mock('core');

describe('ZoomOverlay', () => {
  describe('Component', () => {
    it('Story should not throw any errors', () => {
      expect(() => {
        render(<BasicZoomOverlay />);
      }).not.toThrow();
    });

    it('Should execute fitToWidth when fitToWidth button clicked', () => {
      const fitToWidth = jest.fn();
      
      const { container } = render(
          <TestZoomOverlay
                zoomList={[1]}
                currentZoomLevel={1}
                isReaderMode={false}
                fitToWidth={fitToWidth}
                fitToPage={noop}
                onClickZoomLevelOption={noop}
                onClickMarqueeZoom={noop}
                isMarqueeZoomActive={false}
                isMarqueeToolButtonDisabled={false}
            />
        );
      const fitToWidthButton = container.querySelector('[aria-label="Fit to width"]');
      expect(fitToWidthButton).toBeInTheDocument();
      fireEvent.click(fitToWidthButton);
      expect(fitToWidth).toHaveBeenCalled();
    });

    it('Should execute fitToPage when fitToPage button clicked', () => {
      const fitToPage = jest.fn();
      const { container } = render(
          <TestZoomOverlay
              zoomList={[1]}
              currentZoomLevel={1}
              isReaderMode={false}
              fitToWidth={noop}
              fitToPage={fitToPage}
              onClickZoomLevelOption={noop}
              onClickMarqueeZoom={noop}
              isMarqueeZoomActive={false}
              isMarqueeToolButtonDisabled={false}
          />);
      const fitToPageButton = container.querySelector('[aria-label="Fit to page"]');
      expect(fitToPageButton).toBeInTheDocument();
      fireEvent.click(fitToPageButton);
      expect(fitToPage).toHaveBeenCalled();
    });

    it('Should execute onClickZoomLevelOption when zoom level option clicked', () => {
      const onClickZoomLevelOption = jest.fn();
      const { container } = render(
          <TestZoomOverlay
              zoomList={[1]}
              currentZoomLevel={1}
              isReaderMode={false}
              fitToWidth={noop}
              fitToPage={noop}
              onClickZoomLevelOption={onClickZoomLevelOption}
              onClickMarqueeZoom={noop}
              isMarqueeZoomActive={false}
              isMarqueeToolButtonDisabled={false}
          />);
      const zoomLevelOptionButton = container.querySelector('button[aria-label="100%"]');
      expect(zoomLevelOptionButton).toBeInTheDocument();
      fireEvent.click(zoomLevelOptionButton);
      expect(onClickZoomLevelOption).toHaveBeenCalled();
    })

    it('Should render same number of zoom level options as defined in zoomList', () => {
      const { container } = render(
          <TestZoomOverlay
              zoomList={[0.1, 0.5, 1]}
              currentZoomLevel={1}
              isReaderMode={false}
              fitToWidth={noop}
              fitToPage={noop}
              onClickZoomLevelOption={noop}
              onClickMarqueeZoom={noop}
              isMarqueeZoomActive={false}
              isMarqueeToolButtonDisabled={false}
          />);
      const zoomLevelOptions = container.querySelectorAll('.OverlayItem');
      expect(zoomLevelOptions.length).toEqual(3);
    })

    it('Should highlight zoom level option that equals to current zoom level', () => {
      const { container } = render(
          <TestZoomOverlay
              zoomList={[0.1, 0.5, 1]}
              currentZoomLevel={0.5}
              isReaderMode={false}
              fitToWidth={noop}
              fitToPage={noop}
              onClickZoomLevelOption={noop}
              onClickMarqueeZoom={noop}
              isMarqueeZoomActive={false}
              isMarqueeToolButtonDisabled={false}
          />);
      const highlightedOption = container.querySelector('button[aria-label="50%"]');
      expect(highlightedOption).toHaveClass('selected');
    })
    
    it('Should highlight marqueeZoom button when the tool is activated', () => {
      const { container } = render(
        <TestZoomOverlay
          zoomList={[0.1, 0.5, 1]}
          currentZoomLevel={0.5}
          isReaderMode={false}
          fitToWidth={noop}
          fitToPage={noop}
          onClickZoomLevelOption={noop}
          onClickMarqueeZoom={noop}
          isMarqueeZoomActive={true}
          isMarqueeToolButtonDisabled={false}
        />);
      const highlightedOption = container.querySelector('Button.tool-button.ZoomItem');
      expect(highlightedOption).toHaveClass('selected');
    })

  });
})
