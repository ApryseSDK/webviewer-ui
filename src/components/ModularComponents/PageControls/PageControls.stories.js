import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import PageControlsContainer from './PageControlsContainer';
import FlyoutContainer from 'components/ModularComponents/FlyoutContainer';
import actions from 'actions';
import ModularHeader from '../ModularHeader';
import { ITEM_TYPE, PLACEMENT } from 'constants/customizationVariables';
import Flyout from '../Flyout';
import { button8, button9 } from '../Helpers/mockHeaders';
import { MockDocumentContainer, oePartialState, createStore } from 'helpers/storybookHelper';
import { expect, within, userEvent } from '@storybook/test';
import PropTypes from 'prop-types';

const leftChevron = {
  onClick: () => { },
  dataElement: 'leftChevronBtn',
  title: 'action.pagePrev',
  label: 'action.pagePrev',
  headerPlacement: PLACEMENT.TOP,
  img: 'icon-chevron-left',
  type: ITEM_TYPE.BUTTON,
  disabled: false,
  ariaLabel: 'action.pagePrev',
};

const rightChevron = {
  onClick: () => { },
  dataElement: 'rightChevronBtn',
  title: 'action.pageNext',
  label: 'action.pageNext',
  headerPlacement: PLACEMENT.TOP,
  img: 'icon-chevron-right',
  type: ITEM_TYPE.BUTTON,
  disabled: false,
  ariaLabel: 'action.pageNext',
};

const initialState = {
  ...oePartialState,
  viewer: {
    modularComponents: {},
    modularHeaders: {},
    customElementOverrides: {},
    activeGroupedItems: [],
    disabledElements: [],
    openElements: {
      pageControlsFlyout: true,
    },
    customPanels: [],
    genericPanels: [],
    activeDocumentViewerKey: 1,
    currentPage: 2,
    totalPages: 9,
    activeFlyout: 'pageControlsFlyout',
    activeTabInPanel: {},
    flyoutPosition: { x: 0, y: 0 },
    fixedGroupedItems: ['grouped-item-ABC'],
    pageLabels: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    allowPageNavigation: true,
    customElementSizes: {
      PageNavigationTool: 0,
    },
    modularHeadersHeight: {
      topHeaders: 40,
      bottomHeaders: 40
    },
    canUndo: {
      1: false,
      2: false,
    },
    canRedo: {
      1: false,
      2: false,
    },
    flyoutMap: {
      'pageControlsFlyout': {
        dataElement: 'pageControlsFlyout',
        items: [
          {
            dataElement: 'pageNavigationInput',
            label: 'pageNavigationInput',
            onKeyDownHandler: () => { },
          },
          leftChevron,
          rightChevron
        ]
      }
    }
  },
  document: {
    totalPages: { 1: 9 },
  },
  featureFlags: {
    customizableUI: true,
  },
};

export default {
  title: 'ModularComponents/PageControl Container',
  component: PageControlsContainer,
};

const store = configureStore({
  reducer: () => initialState,
});

const onChange = (e) => {
  if (!initialState.viewer.pageLabels?.some((p) => p.startsWith(e.target.value))) {
    return;
  }
  props.input = e.target.value;
};

const props = {
  dataElement: 'foo',
  size: 0,
  onFlyoutToggle: () => { },
  leftChevron,
  rightChevron,
  currentPage: 1,
  totalPages: 9,
  input: '1',
  isFocused: true,
  allowPageNavigation: true,
  onChange,
};

const PageControlsStory = ({ store, storyProps }) => {
  const pageControlsTools = {
    dataElement: 'PageNavigationTool',
    type: 'pageControls',
  };
  const headerProps = {
    dataElement: 'topHeaderXX',
    placement: 'top',
    justifyContent: 'center',
    gap: 20,
    items: [pageControlsTools],
    ...storyProps,
  };
  return (
    <Provider store={store}>
      <ModularHeader {...headerProps} />
      <MockDocumentContainer width='90%' height='90%' />
    </Provider>
  );
};

PageControlsStory.propTypes = {
  store: PropTypes.object.isRequired,
  storyProps: PropTypes.object.isRequired,
};

export const Basic = (storyProps) => {
  return <PageControlsStory store={store} storyProps={storyProps} />;
};

export const PageControlsInHeader = (storyProps) => {
  const pageControlsTools = {
    dataElement: 'pageControlsTools',
    type: 'pageControls',
    className: 'page-controls-in-header',
  };

  const props = {
    dataElement: 'bottomHeader',
    placement: 'bottom',
    gap: 20,
    items: [button8, button9, pageControlsTools],
    ...storyProps,
  };

  useEffect(() => {
    store.dispatch(actions.setCustomElementSize('page-controls--container', 1));
    return () => store.dispatch(actions.setCustomElementSize('page-controls-container', 0));
  }, []);

  return (
    <Provider store={store}>
      <MockDocumentContainer width='90%' height='90%' />
      <ModularHeader {...props} />
    </Provider>
  );
};

PageControlsInHeader.play = async ({ canvasElement }) => {
  const pageControls = canvasElement.querySelector('[data-element="pageControlsTools"]');
  expect(pageControls.classList.contains('page-controls-in-header')).toBe(true);
};

export const PageControlsInFlyout = () => {
  return (
    <Provider store={store}>
      <FlyoutContainer />
      <Flyout />
    </Provider>
  );
};

const docxStore = createStore(initialState);

export const PageControlsInputDocx = (storyProps) => {
  return <PageControlsStory store={docxStore} storyProps={storyProps} />;
};

/**
 * This story demonstrates the functionality of the PageControlsInput component
 * within the context of a document viewer and Office viewer. Office Document
 * doesn't receive all the pages on load, so we simulate adding a page
 * to the viewer and document state.
 */
PageControlsInputDocx.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const input = await canvas.findByRole('textbox', { name: /page number input/i });
  expect(input).toBeInTheDocument();

  await userEvent.click(input);
  await userEvent.clear(input);
  await userEvent.type(input, '5');

  docxStore.dispatch({
    type: 'SET_PAGE_LABELS',
    payload: { pageLabels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] },
  });
  docxStore.dispatch({
    type: 'SET_TOTAL_PAGES',
    payload: { totalPages: 10, documentViewerKey: 1 },
  });

  expect(input).toHaveValue('5');
};