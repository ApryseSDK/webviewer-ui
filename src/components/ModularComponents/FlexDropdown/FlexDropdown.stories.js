import React, { useEffect, useState } from 'react';
import { configureStore } from '@reduxjs/toolkit';
import FlexDropdown from './FlexDropdown';
import { Provider } from 'react-redux';
import core from 'core';
import initialState from 'src/redux/initialState';
import Icon from 'components/Icon';

export default {
  title: 'ModularComponents/FlexDropdown',
  component: FlexDropdown,
  parameters: {
    customizableUI: true,
  }
};

const store = configureStore({
  reducer: () => initialState
});

const items = [
  {
    'dataElement': 'Ribbon Item1',
    'label': 'View',
    'img': 'multi select',
    'toolbarGroup': 'toolbarGroup-View',
    'type': 'ribbonItem',
    'direction': 'row',
    'justifyContent': 'end'
  },
  {
    'dataElement': 'Ribbon Item2',
    'label': 'Annotate',
    'toolbarGroup': 'toolbarGroup-Annotate',
    'type': 'ribbonItem',
    'direction': 'row',
    'justifyContent': 'end'
  },
  {
    'dataElement': 'Ribbon Item3',
    'label': 'Shapes',
    'img': 'icon-tool-shape-rectangle',
    'toolbarGroup': 'toolbarGroup-Shapes',
    'type': 'ribbonItem',
    'direction': 'row',
    'justifyContent': 'end'
  },
  {
    'dataElement': 'Ribbon Item4',
    'label': 'Insert',
    'toolbarGroup': 'toolbarGroup-Insert',
    'type': 'ribbonItem',
    'direction': 'row',
    'justifyContent': 'end'
  },
  {
    'dataElement': 'Ribbon Item5',
    'title': 'Measure',
    'img': 'icon-tool-measurement-distance-line',
    'toolbarGroup': 'toolbarGroup-Measure',
    'type': 'ribbonItem',
    'direction': 'row',
    'justifyContent': 'end'
  },
  {
    'dataElement': 'Ribbon Item6',
    'label': 'Edit',
    'toolbarGroup': 'toolbarGroup-Edit',
    'type': 'ribbonItem',
    'direction': 'row',
    'justifyContent': 'end'
  },
  {
    'dataElement': 'Ribbon Item7',
    'label': 'Fill and Sign',
    'img': 'icon-tool-signature',
    'toolbarGroup': 'toolbarGroup-FillAndSign',
    'type': 'ribbonItem',
    'direction': 'row',
    'justifyContent': 'end'
  },
  {
    'dataElement': 'Ribbon Item8',
    'label': 'Forms',
    'toolbarGroup': 'toolbarGroup-Forms',
    'type': 'ribbonItem',
    'direction': 'row',
    'justifyContent': 'end'
  }
];

const FlexDropdownWrapper = ({ isBottomAligned, arrowDirection, direction, height, width }) => {
  const [currentSelectionKey, setCurrentSelectionKey] = useState(items[0].toolbarGroup);

  const onClickItem = (key) => {
    setCurrentSelectionKey(key);
  };

  useEffect(() => {
    if (isBottomAligned) {
      const copy = core.getScrollViewElement;
      core.getScrollViewElement = () => ({
        scrollTop: 0,
        addEventListener: core.noop,
        removeEventListener: core.noop,
        getBoundingClientRect: () => ({
          bottom: 200,
          height: 200,
          left: 0,
          right: 2149,
          top: 0,
          width: 2149,
          x: 0,
          y: 0,
        })
      });
      return () => {
        core.getScrollViewElement = copy;
      };
    }
  }, []);

  const renderDropdownItem = (item, getTranslatedDisplayValue) => (
    <div className={'Dropdown__item-object'}>
      {item.img &&
        <Icon glyph={item.img} className={item.className} />
      }
      {(getTranslatedDisplayValue(item.label)) &&
        <span className={'Dropdown__item-text'}>{getTranslatedDisplayValue(item.label)}</span>
      }
    </div>
  );

  return (
    <Provider store={store}>
      <div style={{ display: 'flex', height: isBottomAligned ? 726 : undefined, alignItems: 'center', justifyContent: 'space-evenly' }}>
        <FlexDropdown
          dataElement={'basicFlexDropdown'}
          items={items}
          getKey={(item) => item['toolbarGroup']}
          currentSelectionKey={currentSelectionKey}
          onClickItem={onClickItem}
          arrowDirection={arrowDirection}
          direction={direction}
          height={height}
          width={width}
          renderItem={renderDropdownItem}
          renderSelectedItem={renderDropdownItem}
        />
      </div>
    </Provider>
  );
};

const Template = (args) => <FlexDropdownWrapper {...args} />;

export const Basic = Template.bind({});

export const BottomAligned = Template.bind({});
BottomAligned.args = {
  isBottomAligned: true,
  arrowDirection: 'up',
};

export const Vertical = Template.bind({});
Vertical.args = {
  direction: 'column',
  height: 72,
  width: 68,
  arrowDirection: 'left',
};

export const VerticalBottomAligned = Template.bind({});
VerticalBottomAligned.args = {
  isBottomAligned: true,
  direction: 'column',
  height: 72,
  width: 68,
  arrowDirection: 'right',
};