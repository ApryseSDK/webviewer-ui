import React from 'react';
import { render } from '@testing-library/react';
import { Basic as BasicStory, Colorized as ColorizedStory, Disabled as DisabledStory } from "./Icon.stories";
import Icon from "./Icon";

describe('Icon component', () => {
  it('Basic story should not throw any errors', () => {
    expect(() => {
      render(<BasicStory />);
    }).not.toThrow();
  });

  it('Colorized story should not throw any errors', () => {
    expect(() => {
      render(<ColorizedStory />);
    }).not.toThrow();
  });

  it('Disabled story should not throw any errors', () => {
    expect(() => {
      render(<DisabledStory />);
    }).not.toThrow();
  });

  it('Should render div with the Icon class', () => {
    // eslint-disable-next-line no-unused-vars
    const { debug, container } = render(<Icon glyph={"icon-menu-checkmark"} />);

    //TODO: Add jest SVG transformation so that the debug function shows the actual svg source
    //debug();

    const icon = container.querySelector(".Icon");
    expect(icon).toBeInTheDocument();
  });

  it('Should not throw errors if no props are passed', () => {
    //TODO: get React to not log errors while running tests
    expect(() => {
      render(<Icon />);
    }).not.toThrow();
  });

  it('Should render with the color passed', () => {
    const color = "#FAB386";
    const { container } = render(<Icon glyph={"icon-menu-checkmark"} color={color}/>);

    const icon = container.querySelector(".Icon");
    expect(icon).toHaveStyle(`color: ${color}`);
  });

  it('Should render disabled icons', () => {
    const { container } = render(<Icon glyph={"icon-menu-checkmark"} disabled/>);

    const icon = container.querySelector(".Icon");
    expect(icon).toHaveClass(`disabled`);
  });

  it('Should render with inline SVG', () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>';
    const { container } = render(<Icon glyph={svg}/>);

    const icon = container.querySelector(".Icon svg");
    expect(icon).toBeInTheDocument();
  });

  it('Disabled color should override the color prop', () => {
    const color = "#FAB386";
    const { container } = render(<Icon glyph={"icon-menu-checkmark"} color={color} disabled/>);

    const icon = container.querySelector(".Icon");
    expect(icon).toHaveClass(`disabled`);
    expect(icon).not.toHaveStyle(`color: ${color}`);
  });
});
