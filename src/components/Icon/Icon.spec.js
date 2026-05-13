import React from 'react';
import { render } from '@testing-library/react';
import { Basic as BasicStory, Colorized as ColorizedStory, Disabled as DisabledStory } from './Icon.stories';
import Icon from './Icon';

describe('Icon component', () => {
  // Icon has props that are required and when we do no throw error with rendering without props
  // we get React prop type errors to the log. So for now that we don't have any other way of
  // disabling them, just silencing console.error for during tests
  let originalConsoleError;
  beforeAll(() => {
    originalConsoleError = console.error;
    console.error = () => {};
  });
  afterAll(() => {
    console.error = originalConsoleError;
  });

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
    const { debug, container } = render(<Icon glyph={'icon-menu-checkmark'} />);

    // TODO: Add jest SVG transformation so that the debug function shows the actual svg source
    // debug();

    const icon = container.querySelector('.Icon');
    expect(icon).toBeInTheDocument();
  });

  it('Should not throw errors if no props are passed', () => {
    // TODO: get React to not log errors while running tests
    expect(() => {
      render(<Icon />);
    }).not.toThrow();
  });

  it('Should render with the color passed', () => {
    // eslint-disable-next-line custom/no-hex-colors
    const color = '#FAB386';
    const { container } = render(<Icon glyph={'icon-menu-checkmark'} color={color}/>);

    const icon = container.querySelector('.Icon');
    expect(icon).toHaveStyle(`color: ${color}`);
  });

  it('Should render disabled icons', () => {
    const { container } = render(<Icon glyph={'icon-menu-checkmark'} disabled/>);

    const icon = container.querySelector('.Icon');
    expect(icon).toHaveClass('disabled');
  });

  it('Should render with inline SVG', () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>';
    const { container } = render(<Icon glyph={svg}/>);

    const icon = container.querySelector('.Icon svg');
    expect(icon).toBeInTheDocument();
  });

  it('Disabled color should override the color prop', () => {
    // eslint-disable-next-line custom/no-hex-colors
    const color = '#FAB386';
    const { container } = render(<Icon glyph={'icon-menu-checkmark'} color={color} disabled/>);

    const icon = container.querySelector('.Icon');
    expect(icon).toHaveClass('disabled');
    expect(icon).not.toHaveStyle(`color: ${color}`);
  });

  it('Should convert hardcoded fill colors to currentColor when color prop is set', () => {
    // eslint-disable-next-line custom/no-hex-colors
    const color = '#3366FF';
    // eslint-disable-next-line custom/no-hex-colors
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="#8c8c8c"/></svg>';
    const { container } = render(<Icon glyph={svg} color={color} />);

    const icon = container.querySelector('.Icon');
    const path = container.querySelector('.Icon svg path');
    expect(icon).toHaveStyle(`color: ${color}`);
    expect(path).toHaveAttribute('fill', 'currentColor');
  });

  it('Should preserve white fills when color prop is set', () => {
    // eslint-disable-next-line custom/no-hex-colors
    const color = '#3366FF';
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="white"/></svg>';
    const { container } = render(<Icon glyph={svg} color={color} />);

    const path = container.querySelector('.Icon svg path');
    expect(path).toHaveAttribute('fill', 'white');
  });

  it('Should convert neutral hardcoded fill colors to currentColor even without color prop', () => {
    // eslint-disable-next-line custom/no-hex-colors
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="#abb0c4"/></svg>';
    const { container } = render(<Icon glyph={svg} />);

    const path = container.querySelector('.Icon svg path');
    expect(path).toHaveAttribute('fill', 'currentColor');
  });

  it('Should replace all fill="none" targets when fillColor is provided', () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect x="1" y="1" width="10" height="10" fill="none"/><circle cx="18" cy="18" r="3" fill="none"/></svg>';
    const { container } = render(<Icon glyph={svg} fillColor="AABBCC" />);

    // eslint-disable-next-line custom/no-hex-colors
    const filledElements = container.querySelectorAll('.Icon svg [fill="#AABBCC"]');
    expect(filledElements.length).toBe(2);
  });

  it('Should preserve default-marked parts and map non-default fills to currentColor when color is provided', () => {
    // eslint-disable-next-line custom/no-hex-colors
    const color = '#3366FF';
    // eslint-disable-next-line custom/no-hex-colors
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect x="0" y="0" width="10" height="2" fill="#abb0c4"/><path d="M0 0h4v4H0z" fill="default"/></svg>';
    const { container } = render(<Icon glyph={svg} color={color} />);

    const path = container.querySelector('.Icon svg path');
    const rect = container.querySelector('.Icon svg rect');

    expect(path).toHaveAttribute('fill', 'default');
    expect(rect).toHaveAttribute('fill', 'currentColor');
  });

  it('Should convert hardcoded stroke colors to currentColor when color prop is set', () => {
    // eslint-disable-next-line custom/no-hex-colors
    const color = '#3366FF';
    // eslint-disable-next-line custom/no-hex-colors
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" stroke="#8c8c8c"/></svg>';
    const { container } = render(<Icon glyph={svg} color={color} />);

    const icon = container.querySelector('.Icon');
    const path = container.querySelector('.Icon svg path');
    expect(path).toHaveAttribute('stroke', 'currentColor');
  });

  it('Should not convert hardcoded stroke colors to currentColor when color prop is set and disabled is true', () => {
    // eslint-disable-next-line custom/no-hex-colors
    const color = '#3366FF';
    // eslint-disable-next-line custom/no-hex-colors
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" stroke="#8c8c8c"/></svg>';
    const { container } = render(<Icon glyph={svg} color={color} disabled />);

    const icon = container.querySelector('.Icon');
    const path = container.querySelector('.Icon svg path');
    expect(path).toHaveAttribute('stroke', '#8c8c8c'); // eslint-disable-line custom/no-hex-colors
    expect(path).not.toHaveAttribute('stroke', 'currentColor');
  });

  it('Should sanitize and decode ariaLabel when provided', () => {
    const maliciousAriaLabel = '"><svg/onload=alert(1)><!--onmouseover=alert(1337) data-x="';
    const sanitizedDecodedAriaLabel = '">';

    const { container } = render(<Icon glyph={'icon-menu-checkmark'} ariaLabel={maliciousAriaLabel} />);

    const icon = container.querySelector('.Icon svg');
    const ariaLabel = icon.getAttribute('aria-label');
    expect(ariaLabel).toBe(sanitizedDecodedAriaLabel);
  });

  describe('Security tests', () => {
    it.skip('Should not execute embedded scripts in SVG', () => {
      const maliciousSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="red"/>
        <script>window.svgScriptExecuted = true;</script>
      </svg>
      <img src onerror="window.svgScriptExecuted = true; alert(/XSS/)">`;

      // make sure this doesn't exist before rendering
      delete window.svgScriptExecuted;

      const { container } = render(<Icon glyph={maliciousSVG} />);

      const svgElement = container.querySelector('.Icon svg');
      expect(svgElement).toBeInTheDocument();

      expect(window.svgScriptExecuted).toBeUndefined();

      const scriptTag = container.querySelector('script');
      expect(scriptTag).not.toBeInTheDocument();
    });

    it('Should sanitize aria-label to prevent XSS attacks', () => {
      const maliciousAriaLabel = '"><svg/onload=alert(1)><!--onmouseover=alert(1337) data-x="';

      const { container } = render(<Icon glyph={'icon-menu-checkmark'} ariaLabel={maliciousAriaLabel} />);

      const icon = container.querySelector('.Icon svg');
      expect(icon).toBeInTheDocument();

      const ariaLabel = icon.getAttribute('aria-label');

      expect(ariaLabel).not.toMatch(/<script/i);
      expect(ariaLabel).not.toMatch(/\bon\w+\s*=/i);
      expect(ariaLabel).not.toMatch(/\bjavascript:/i);
      expect(ariaLabel).not.toMatch(/\bdata-[-\w]+\s*=/i);

      expect(ariaLabel).not.toBe(maliciousAriaLabel);
    });

    it('Should handle legitimate aria-labels correctly', () => {
      const legitimateAriaLabel = "Unposted Comment, *([#Jack & @Jill's Account,./$1!{?|;:}]^%-+=><)";

      const { container } = render(<Icon glyph={'icon-menu-checkmark'} ariaLabel={legitimateAriaLabel} />);

      const icon = container.querySelector('.Icon svg');
      expect(icon).toBeInTheDocument();

      const ariaLabel = icon.getAttribute('aria-label');
      expect(ariaLabel).toBe(legitimateAriaLabel);
    });
  });
});
