import { parse } from './cssVariablesParser';

describe('cssVariablesParser', () => {
  it('returns custom properties declared in a top-level root rule', () => {
    const variables = parse(`
      :root {
        --primary-color: blue;
        --button-background: var(--primary-color);
        color: black;
      }

      .component {
        --ignored-component-variable: red;
      }

      @media (prefers-color-scheme: dark) {
        :root {
          --ignored-nested-variable: black;
        }
      }
    `);

    expect(variables).toEqual({
      'primary-color': 'blue',
      'button-background': 'var(--primary-color)',
    });
  });

  it('removes its temporary stylesheet after parsing', () => {
    const styleCount = document.head.querySelectorAll('style').length;

    parse(':root { --primary-color: red; }');

    expect(document.head.querySelectorAll('style')).toHaveLength(styleCount);
  });
});
