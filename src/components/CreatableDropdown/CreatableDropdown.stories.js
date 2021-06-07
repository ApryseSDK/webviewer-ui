import React from 'react';
import CreatableDropdown from './CreatableDropdown'


export default {
    title: 'Components/CreatableDropdown',
    component: CreatableDropdown,
};

const onChange = (newValue, actionMeta) => {
    console.group('Value Changed');
    console.log(newValue);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
};
const onInputChange = (inputValue, actionMeta) => {
    console.group('Input Changed');
    console.log(inputValue);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
};

const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
]

const onCreateOption = (option) => {
    console.log({ option })
    options.push({
        value: option,
        label: option,
    })
}

const isClearable = true;

const textPlaceholder = 'An option'

const props = {
    onChange,
    onInputChange,
    options,
    onCreateOption,
    textPlaceholder,
    isClearable,
    messageText: 'Use this to add some text for errors'
}


export function Basic() {
    return (<CreatableDropdown {...props} />);
}


