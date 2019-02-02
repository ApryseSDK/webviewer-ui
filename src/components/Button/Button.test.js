import React from 'react';
import { shallow } from 'enzyme';

import Button from 'components/Button';

describe('Button component', () => {
  describe('Render function', () => {
    // isDisabled
    it('When isDisabled is true, expected to return null', () => {
      const wrapper = shallow(<Button onClick={jest.fn()} isDisabled={true} />);
      expect(wrapper.type()).toBeNull();
    });
    it('When isDisabled is false, expected to return not null', () => {
      const wrapper = shallow(<Button onClick={jest.fn()} isDisabled={false} />);
      expect(wrapper.type()).not.toBeNull();
    });

    // isActive
    it('When isActive is true, expected to change className to active', () => {
      const wrapper = shallow(<Button onClick={jest.fn()} isActive={true}/>);
      expect(wrapper.find('div').prop('className').split(' ')[2]).toBe('active');
    });
    it('When isActive is false, expected to change className to inactive', () => {
      const wrapper = shallow(<Button onClick={jest.fn()} isActive={false}/>);
      expect(wrapper.find('div').prop('className').split(' ')[2]).toBe('inactive');
    });

    // img
    it('When img is received, expected to render img', () => {
      const wrapper = shallow(<Button onClick={jest.fn()} img="sample.jpg" />);
      const img = wrapper.find('img');
      expect(img.length).toBeGreaterThan(0);
    });
    it('When img is not received, expected to not render img', () => {
      const wrapper = shallow(<Button onClick={jest.fn()} />);
      const img = wrapper.find('img');
      expect(img.length).toBe(0);
    });

    // label
    it('When label is received, expected to render the label', () => {
      const wrapper = shallow(<Button onClick={jest.fn()} label="test" />);
      const test = wrapper.find('p').text();
      expect(test).toEqual('test');
    });
    it('When label is not received, expected to not render <p>', () => {
      const wrapper = shallow(<Button onClick={jest.fn()} />);
      const test = wrapper.find('p');
      expect(test.length).toEqual(0);
    });

    // color
    it('When color is received, display color', () => {
      const wrapper = shallow(<Button onClick={jest.fn()} img="sample" color="sample" />);
      const iconColor = wrapper.find('Icon').prop("color");
      expect(iconColor).toBe("sample");
    });

    // dataElement
    it('When dataElement is received, pass it to prop', () => {
      const wrapper = shallow(<Button onClick={jest.fn()} dataElement="sample" />);
      const test = wrapper.find('div').prop("data-element");
      expect(test).toBe("sample");
    });

    //className
    it('When className is received, pass it to prop', () => {
      const wrapper = shallow(<Button onClick={jest.fn()} className="sample" />);
      expect(wrapper.find('div').prop('className').split(' ')[1]).toBe('sample');
    });
    it('When className is not received, className is blank', () => {
      const wrapper = shallow(<Button onClick={jest.fn()} />);
      expect(wrapper.find('div').prop('className').split(' ')[1]).toBe('');
    });

    //mediaQueryClassName
    it('When mediaQueryClassName is received, pass it to prop', () => {
      const wrapper = shallow(<Button onClick={jest.fn()} mediaQueryClassName="sample" />);
      expect(wrapper.find('div').prop('className').split(' ')[4]).toBe('sample');
    });
    it('When mediaQueryClassName is not received, mediaQueryClassName is blank', () => {
      const wrapper = shallow(<Button onClick={jest.fn()} />);
      expect(wrapper.find('div').prop('className').split(' ')[4]).toBeUndefined();
    });
    
  });

  // onClick
  describe('onClick', () => {
    it('When onClick is received, passed in function is triggered', () => {
      const mock = jest.fn();
      const wrapper = shallow(<Button onClick={mock}/>);
      wrapper.simulate('click');
      expect(mock).toBeCalled();
    });
  });
});