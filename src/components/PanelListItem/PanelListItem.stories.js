import React from 'react';
import PropTypes from 'prop-types';
import PanelListItem from './PanelListItem';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

const TestContainer = ({ children }) => {
  return (
    <div style={{
      width: '350px',
      background: 'rgb(255, 255, 255)',
      height: '100%',
    }}
    >
      {children}
    </div>
  );
};

TestContainer.propTypes = {
  children: PropTypes.node
};

const initialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
    openElements: {
      passwordModal: true
    },
    isMultiTab: false,
    customPanels: []
  },
  document: {
    maxPasswordAttempts: 3,
    passwordAttempts: 0,
  },
  featureFlags: {
    customizableUI: false,
  },
};

const store = configureStore({
  reducer: () => initialState
});

export default {
  title: 'Components/PanelListItemComponent',
  component: PanelListItem,
  parameters: {
    legacyUI: true,
  }
};

const bookmarkProps = {
  labelHeader: '1 - Sample Label Header',
  description: '1 - Description',
  enableMoreOptionsContextMenuFlyout: true,
  contentMenuFlyoutOptions: {
    shouldHideDeleteButton: false,
    currentFlyout: {
      dataElement: 'moreOptionsDataElement',
      items: [],
    },
    flyoutSelector: 'flyoutSelector',
    type: 'bookmark',
    handleOnClick : () => {},
  },
  contextMenuMoreButtonOptions: {
    flyOutToggleElement: 'flyOutToggleElement',
    moreOptionsDataElement: 'moreOptionsDataElement',
  }
};

const bookmarkProps2 = {
  labelHeader: '2 - Another sample Label Header test',
  description: '2 - Another Description',
  enableMoreOptionsContextMenuFlyout: true,
  contentMenuFlyoutOptions: {
    shouldHideDeleteButton: false,
    currentFlyout: {
      dataElement: 'moreOptionsDataElement',
      items: [],
    },
    flyoutSelector: 'currentFlyout',
    type: 'bookmark',
    handleOnClick : () => {},
  },
  contextMenuMoreButtonOptions: {
    flyOutToggleElement: 'currentFlyout',
    moreOptionsDataElement: 'moreOptionsDataElement',
  }
};

export const BookmarksListItem = () => {
  // This inline style is for storybook demostration only.
  // The override style should be in a scss file.
  const overrideStyles = `
  .panel-list-row .Button {
    font-weight: bold;
  }`;
  return (
    <Provider store={store}>
      <TestContainer>
        {/* eslint-disable-next-line react/no-danger */}
        <style dangerouslySetInnerHTML={{ __html: overrideStyles }} />
        <PanelListItem {...bookmarkProps} />
        <PanelListItem {...bookmarkProps2} />
      </TestContainer>
    </Provider>
  );
};

const outlineBaseProps = {
  ...bookmarkProps,
  description: undefined,
};

const outlineProps = {
  ...bookmarkProps,
  description: undefined,
  children: <PanelListItem {...outlineBaseProps} >
    <PanelListItem {...outlineBaseProps} />
    <PanelListItem {...outlineBaseProps} />
  </PanelListItem>,
  contentMenuFlyoutOptions: {
    shouldHideDeleteButton: false,
    currentFlyout: {
      dataElement: 'moreOptionsDataElement',
      items: [],
    },
    flyoutSelector: 'moreOptionsDataElement',
    type: 'outline',
    handleOnClick : () => {},
  },
  contextMenuMoreButtonOptions: {
    flyOutToggleElement: 'flyOutToggleElement',
    moreOptionsDataElement: 'moreOptionsDataElement',
  }
};

export const OutlinesListItem = () => (
  <Provider store={store}>
    <TestContainer>
      <PanelListItem {...outlineProps} />
      <PanelListItem {...outlineBaseProps} />
    </TestContainer>
  </Provider>
);

const portfolioProps = {
  ...bookmarkProps,
  description: undefined,
  iconGlyph: 'icon-tool-image-line',
  contentMenuFlyoutOptions: {
    shouldHideDeleteButton: false,
    currentFlyout: {
      dataElement: 'moreOptionsDataElement',
      items: [],
    },
    flyoutSelector: 'flyoutSelector',
    type: 'portfolio',
    handleOnClick : () => {},
  },
  contextMenuMoreButtonOptions: {
    flyOutToggleElement: 'flyoutSelector',
    moreOptionsDataElement: 'moreOptionsDataElement',
  }
};

export const PDFPortfolioListItem = () => (
  <Provider store={store}>
    <TestContainer>
      <PanelListItem {...portfolioProps} >
        <PanelListItem {...portfolioProps} />
        <PanelListItem {...portfolioProps} />
      </PanelListItem>
      <PanelListItem {...portfolioProps} />
    </TestContainer>
  </Provider>
);

const formFieldListBaseProps ={
  ...bookmarkProps,
  description: undefined,
  iconGlyph: 'icon-tool-image-line',
  checkboxOptions: {
    id: 'checkbox-1',
    onChange: () => console.log('Checkbox toggled'),
    ariaLabel: 'Select item',
  }
};

const formFieldListProps = {
  ...formFieldListBaseProps,
  children: <PanelListItem {...formFieldListBaseProps} >
    <PanelListItem {...formFieldListBaseProps} />
    <PanelListItem {...formFieldListBaseProps} />
  </PanelListItem>,
};

export const FormFieldList = () => (
  <Provider store={store}>
    <TestContainer>
      <PanelListItem {...formFieldListProps} />
      <PanelListItem {...formFieldListBaseProps} />
    </TestContainer>
  </Provider>
);

const formFieldListNoCheckboxChildProps ={
  ...bookmarkProps,
  description: undefined,
  iconGlyph: 'icon-tool-image-line',
};

const formFieldListNoCheckboxProps = {
  ...formFieldListNoCheckboxChildProps,
  children:
    <PanelListItem {...formFieldListNoCheckboxChildProps} >
      <PanelListItem {...formFieldListNoCheckboxChildProps} />
      <PanelListItem {...formFieldListNoCheckboxChildProps} />
    </PanelListItem>,
};

export const FormFieldListNoCheckbox = () => (
  <Provider store={store}>
    <TestContainer>
      <PanelListItem {...formFieldListNoCheckboxProps} />
      <PanelListItem {...formFieldListNoCheckboxChildProps} />
    </TestContainer>
  </Provider>
);