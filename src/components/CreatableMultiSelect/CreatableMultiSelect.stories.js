import React from 'react';
import CreatableMultiSelect from './CreatableMultiSelect';
import { components } from 'react-select';

export default {
  title: 'Components/CreatableMultiSelect',
  component: CreatableMultiSelect,
};

const colourOptions = [
  { value: 'ocean', label: 'Ocean', color: '#00B8D9', isFixed: true },
  { value: 'blue', label: 'Blue', color: '#0052CC', isDisabled: true },
  { value: 'purple', label: 'Purple', color: '#5243AA' },
  { value: 'red', label: 'Red', color: '#FF5630', isFixed: true },
  { value: 'orange', label: 'Orange', color: '#FF8B00' },
  { value: 'yellow', label: 'Yellow', color: '#FFC400' },
  { value: 'green', label: 'Green', color: '#36B37E' },
  { value: 'forest', label: 'Forest', color: '#00875A' },
  { value: 'slate', label: 'Slate', color: '#253858' },
  { value: 'silver', label: 'Silver', color: '#666666' },
];

const flavourOptions = [
  { value: 'vanilla', label: 'Vanilla', rating: 'safe' },
  { value: 'chocolate', label: 'Chocolate', rating: 'good' },
  { value: 'strawberry', label: 'Strawberry', rating: 'wild' },
  { value: 'salted-caramel', label: 'Salted Caramel', rating: 'crazy' },
];

const groupedOptions = [
  {
    label: 'Colours',
    options: colourOptions,
  },
  {
    label: 'Flavours',
    options: flavourOptions,
  },
];

const handleChange = (
  newValue,
  actionMeta,
) => {
  console.group('Value Changed');
  console.log(newValue);
  console.log(`action: ${actionMeta.action}`);
  console.groupEnd();
};

export function Basic() {
  return (
    <CreatableMultiSelect
      onChange={handleChange}
      options={colourOptions}
    />);
}

export function WithCustomStyles() {
  return (
    <CreatableMultiSelect
      onChange={handleChange}
      options={colourOptions}
      styles={{
        option: (base, { data }) => ({
          ...base,
          color: data.color,
        }),
        multiValue: (base, { data }) => ({
          ...base,
          color: data.color,
          fontSize: '13px',
          borderRadius: '4px',
        }),
        multiValueLabel: (base, { data }) => ({
          ...base,
          color: data.color,
          fontSize: '13px',
          borderRadius: '4px',
        }),
      }}
    />);
}

export function WithCustomComponents() {
  const MultiValueLabel = ({ data }) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }} >
        <span style={{ paddingRight: '5px' }}>🐈‍⬛</span>
        {data.label}
      </div >
    );
  }

  const CustomOption = (props) => {
    const { data } = props;
    return (
      <components.Option {...props}>
        <span>😸</span>
        {data.label}
      </components.Option>
    );
  };

  return (
    <CreatableMultiSelect
      onChange={handleChange}
      options={groupedOptions}
      components={{ MultiValueLabel, Option: CustomOption }}
    />);
};

export function MultiSelectGroups() {
  return (
    <CreatableMultiSelect
      onChange={handleChange}
      options={groupedOptions}
      menuIsOpen
    />);
}