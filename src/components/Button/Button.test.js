import React from 'react';
import { shallow } from 'enzyme';

import Button from 'components/Button';

describe('Button', () => {
  describe('Render', () => {
    // isDisabled
    test('isDisabled is true, expected to return null', () => {
      const wrapper = shallow(<Button onClick={jest.fn()} isDisabled={true} />);
      expect(wrapper.type()).toBeNull();
    });
    test('isDisabled is false, expected to return not null', () => {
      const wrapper = shallow(<Button onClick={jest.fn()} isDisabled={false} />);
      expect(wrapper.type()).not.toBeNull();
    });

    // isActive
    test('isActive is true, expected to change className to active', () => {
      const wrapper = shallow(<Button onClick={jest.fn()} isActive={true}/>);
      expect(wrapper.find('div').prop('className').split(' ')[2]).toBe('active');
    });
    test('isActive is false, expected to change className to inactive', () => {
      const wrapper = shallow(<Button onClick={jest.fn()} isActive={false}/>);
      expect(wrapper.find('div').prop('className').split(' ')[2]).toBe('inactive');
    });

    // img
    test('img is received, expected to render img', () => {
      const wrapper = shallow(<Button onClick={jest.fn()} img="sample.jpg" />);
      const img = wrapper.find('img');
      expect(img.length).toBeGreaterThan(0);
    });
    test('img is not received, expected to not render img', () => {
      const wrapper = shallow(<Button onClick={jest.fn()} />);
      const img = wrapper.find('img');
      expect(img.length).toBe(0);
    });

    // label
    test('label is received, expected to render the label', () => {
      const wrapper = shallow(<Button onClick={jest.fn()} label="test" />);
      const test = wrapper.find('p').text();
      expect(test).toEqual('test');
    });
    test('label is not received, expected to not render <p>', () => {
      const wrapper = shallow(<Button onClick={jest.fn()} />);
      const test = wrapper.find('p');
      expect(test.length).toEqual(0);
    });

    // color
    test('color is received, display color', () => {
      const wrapper = shallow(<Button onClick={jest.fn()} img="sample" color="sample" />);
      const iconColor = wrapper.find('Icon').prop("color");
      expect(iconColor).toBe("sample");
    });

    // dataElement
    test('dataElement is received, pass it to prop', () => {
      const wrapper = shallow(<Button onClick={jest.fn()} dataElement="sample" />);
      const test = wrapper.find('div').prop("data-element");
      expect(test).toBe("sample");
    });

    //className
    test('className is received, pass it to prop', () => {
      const wrapper = shallow(<Button onClick={jest.fn()} className="sample" />);
      expect(wrapper.find('div').prop('className').split(' ')[1]).toBe('sample');
    });
    test('className is not received, className is blank', () => {
      const wrapper = shallow(<Button onClick={jest.fn()} />);
      expect(wrapper.find('div').prop('className').split(' ')[1]).toBe('');
    });

    //mediaQueryClassName
    test('mediaQueryClassName is received, pass it to prop', () => {
      const wrapper = shallow(<Button onClick={jest.fn()} mediaQueryClassName="sample" />);
      expect(wrapper.find('div').prop('className').split(' ')[4]).toBe('sample');
    });
    test('mediaQueryClassName is not received, mediaQueryClassName is blank', () => {
      const wrapper = shallow(<Button onClick={jest.fn()} />);
      expect(wrapper.find('div').prop('className').split(' ')[4]).toBeUndefined();
    });
    
  });

  // onClick
  describe('onClick', () => {
    test('onClick is received, passed in function is triggered', () => {
      const mock = jest.fn();
      const wrapper = shallow(<Button onClick={mock}/>);
      wrapper.simulate('click');
      expect(mock).toBeCalled();
    });
  });
});