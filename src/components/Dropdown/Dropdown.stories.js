import React from 'react';
import { createStore } from 'redux';
import PropTypes from 'prop-types';
import { Provider as ReduxProvider } from 'react-redux';
import Dropdown from './Dropdown';
import { DEFAULT_POINT_SIZE, FONT_SIZE, AVAILABLE_POINT_SIZES } from 'constants/officeEditor';
import VisuallyHiddenLabel from '../VisuallyHiddenLabel';


export default {
  title: 'Components/Dropdown',
  component: Dropdown,
};

export function Basic() {
  const translationPrefix = 'option.notesOrder';
  const items = ['position', 'time', 'status', 'author', 'type'];
  const [currentSelectionKey, setCurrentSelectionKey] = React.useState(items[0]);
  function onClickItem(key) {
    setCurrentSelectionKey(key);
  }
  return (
    <ReduxProvider store={createStore((state = {}) => state)}>
      <div style={{ width: 100 }}>
        <Dropdown
          id='basic-story'
          onClickItem={onClickItem}
          items={items}
          translationPrefix={translationPrefix}
          currentSelectionKey={currentSelectionKey}
        />
      </div>
    </ReduxProvider>
  );
}

export function ImageDropdown() {
  const images = [
    { key: 'None', src: 'icon-linestyle-none' },
    { key: 'ClosedArrow', src: 'icon-linestyle-start-arrow-closed' },
    { key: 'OpenArrow', src: 'icon-linestyle-start-arrow-open' },
    { key: 'ROpenArrow', src: 'icon-linestyle-start-arrow-open-reverse' }
  ];

  const dropdownWidth = 85;
  const [currentSelectionKey, setCurrentSelectionKey] = React.useState(images[0].key);

  function onClickItem(key) {
    setCurrentSelectionKey(key);
  }

  return (
    <ReduxProvider store={createStore((state = {}) => state)}>
      <div style={{ width: dropdownWidth }}>
        <Dropdown
          id='image-dropdown-story'
          onClickItem={onClickItem}
          width={dropdownWidth}
          images={images}
          currentSelectionKey={currentSelectionKey}
        />
      </div>
    </ReduxProvider>
  );
}

export function DropdownWithInput() {
  const translationPrefix = 'option.notesOrder';
  const countries = [
    'Argentina',
    'Australia',
    'Austria',
    'Belgium',
    'Brazil',
    'Canada',
    'Chile',
    'China',
    'Colombia',
    'Denmark',
    'Egypt',
    'Finland',
    'France',
    'Germany',
    'Greece',
    'Hungary',
    'India',
    'Indonesia',
    'Iran',
    'Ireland',
    'Israel',
    'Italy',
    'Japan',
    'Kenya',
    'Malaysia',
    'Mexico',
    'Morocco',
    'Netherlands',
    'New Zealand',
    'Nigeria',
    'Norway',
    'Pakistan',
    'Peru',
    'Philippines',
    'Poland',
    'Portugal',
    'Russia',
    'Saudi Arabia',
    'Singapore',
    'South Africa',
    'South Korea',
    'Spain',
    'Sweden',
    'Switzerland',
    'Thailand',
    'Turkey',
    'Ukraine',
    'United Arab Emirates',
    'United Kingdom',
    'United States',
    'Vietnam'
  ];
  const [currentSelectionKey, setCurrentSelectionKey] = React.useState(countries[0]);
  function onClickItem(key) {
    if (countries.includes(key)) {
      setCurrentSelectionKey(key);
    }
  }
  return (
    <ReduxProvider store={createStore((state = {}) => state)}>
      <div style={{ width: 200 }}>
        <label id="countries-dropdown">Countries</label>
        <Dropdown
          id="countries-dropdown"
          onClickItem={onClickItem}
          items={countries}
          translationPrefix={translationPrefix}
          currentSelectionKey={currentSelectionKey}
          maxHeight={300}
          width={200}
          hasInput={true}
          labelledById='countries-dropdown'
        />
      </div>
    </ReduxProvider>
  );
}

export function DropdownWithInputAndNoSearch() {

  const [pointSizeSelectionKey, setPointSizeSelectionKey] = React.useState(DEFAULT_POINT_SIZE.toString());

  return (
    <ReduxProvider store={createStore((state = {}) => state)}>
      <div style={{ width: 100 }}>
        <label id="font-size">Font Size</label>
        <Dropdown
          id="font-size"
          items={AVAILABLE_POINT_SIZES}
          onClickItem={(pointSize) => {
            let fontPointSize = parseInt(pointSize, 10);

            if (isNaN(fontPointSize)) {
              fontPointSize = DEFAULT_POINT_SIZE;
            }

            if (fontPointSize > FONT_SIZE.MAX) {
              fontPointSize = FONT_SIZE.MAX;
            } else if (fontPointSize < FONT_SIZE.MIN) {
              fontPointSize = FONT_SIZE.MIN;
            }
            setPointSizeSelectionKey(fontPointSize.toString());
          }}
          currentSelectionKey={pointSizeSelectionKey}
          width={100}
          maxHeight={300}
          dataElement="office-editor-font-size"
          hasInput
          isSearchEnabled={false}
          showLabelInList={true}
          translationPrefix="officeEditor.fontSize"
        />
      </div>
    </ReduxProvider>
  );

}

export function DropdownWithCustomDisplay({ disabled = false }) {
  const translationPrefix = 'option.notesOrder';
  const items = ['Position', 'Time', 'Status', 'Author', 'Type'];
  const [currentSelectionKey, setCurrentSelectionKey] = React.useState(items[0]);
  function onClickItem(key) {
    setCurrentSelectionKey(key);
  }
  return (
    <ReduxProvider store={createStore((state = {}) => state)}>
      <div style={{ width: 100 }}>
        <VisuallyHiddenLabel id="notesSortLabel" label='Sort' />
        <Dropdown
          onClickItem={onClickItem}
          items={items}
          labelledById='notesSortLabel'
          translationPrefix={translationPrefix}
          currentSelectionKey={currentSelectionKey}
          disabled={disabled}
          displayButton={() => (
            <button disabled={disabled}>
              Test display
            </button>
          )}
        />
      </div>
    </ReduxProvider>
  );
}
DropdownWithCustomDisplay.propTypes = {
  disabled: PropTypes.bool,
};

export function DropdownWithCustomDisplayAndDisabled() {
  return <DropdownWithCustomDisplay disabled={true} />;
}

export function DropdownWithNoItems() {
  const images = [];
  const dropdownWidth = 145;
  return (
    <ReduxProvider store={createStore((state = {}) => state)}>
      <div style={{ width: dropdownWidth }}>
        <Dropdown
          width={dropdownWidth}
          images={images}
        />
      </div>
    </ReduxProvider>
  );
}
