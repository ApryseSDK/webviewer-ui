import { getInternalTheme, searchForThemeElements, enableThemeElements, disableThemeElements } from 'helpers/setThemeHelper';
import Theme from 'constants/theme';

describe('setThemeHelper', () => {
  afterEach(() => {
    document.head.querySelectorAll('style[data-theme], link[href*="theme-"]')
      .forEach((el) => el.remove());
  });

  describe('getInternalTheme', () => {
    const testCases = [
      {
        description: 'light theme with no flags',
        activeTheme: Theme.LIGHT,
        isHighContrastMode: false,
        isCustomizableUI: false,
        expectedInternalTheme: 'light',
      },
      {
        description: 'dark theme with no flags',
        activeTheme: Theme.DARK,
        isHighContrastMode: false,
        isCustomizableUI: false,
        expectedInternalTheme: 'dark',
      },
      {
        description: 'light theme with high contrast mode enabled',
        activeTheme: Theme.LIGHT,
        isHighContrastMode: true,
        isCustomizableUI: false,
        expectedInternalTheme: 'light-high-contrast',
      },
      {
        description: 'dark theme with high contrast mode enabled',
        activeTheme: Theme.DARK,
        isHighContrastMode: true,
        isCustomizableUI: false,
        expectedInternalTheme: 'dark-high-contrast',
      },
      {
        description: 'light theme with customizable UI enabled',
        activeTheme: Theme.LIGHT,
        isHighContrastMode: false,
        isCustomizableUI: true,
        expectedInternalTheme: 'light-modular',
      },
      {
        description: 'dark theme with customizable UI enabled',
        activeTheme: Theme.DARK,
        isHighContrastMode: false,
        isCustomizableUI: true,
        expectedInternalTheme: 'dark-modular',
      },
      {
        description: 'light theme with customizable UI and high contrast mode enabled',
        activeTheme: Theme.LIGHT,
        isHighContrastMode: true,
        isCustomizableUI: true,
        expectedInternalTheme: 'light-modular',
      },
      {
        description: 'dark theme with customizable UI and high contrast mode enabled',
        activeTheme: Theme.DARK,
        isHighContrastMode: true,
        isCustomizableUI: true,
        expectedInternalTheme: 'dark-modular',
      },
    ];

    testCases.forEach(({ description, activeTheme, isHighContrastMode, isCustomizableUI, expectedInternalTheme }) => {
      it(`should return correct internal theme string for ${description}`, () => {
        expect(getInternalTheme(activeTheme, isHighContrastMode, isCustomizableUI)).toBe(expectedInternalTheme);
      });
    });

    it('should throw an error if given an invalid theme', () => {
      expect(() => {
        getInternalTheme('fake theme', false, false);
      }).toThrowError('Invalid theme: fake theme');
    });
  });

  describe('searchForThemeElements', () => {
    it('should return existing style elements with data-theme attributes matching the given theme', () => {
      const loadedThemes = {};
      const lightStyleElement = document.createElement('style');
      lightStyleElement.setAttribute('data-theme', 'light');
      document.head.appendChild(lightStyleElement);

      const darkStyleElement = document.createElement('style');
      darkStyleElement.setAttribute('data-theme', 'dark');
      document.head.appendChild(darkStyleElement);

      const lightThemes = searchForThemeElements('light', loadedThemes);
      const darkThemes = searchForThemeElements('dark', loadedThemes);

      expect(lightThemes).toContain(lightStyleElement);
      expect(lightThemes).not.toContain(darkStyleElement);
      expect(darkThemes).toContain(darkStyleElement);
      expect(darkThemes).not.toContain(lightStyleElement);
    });

    it('should return existing link elements with hrefs matching the given theme', () => {
      const loadedThemes = {};
      const lightLinkElement = document.createElement('link');
      lightLinkElement.rel = 'stylesheet';
      lightLinkElement.href = 'chunks/theme-light.chunk.css';
      document.head.appendChild(lightLinkElement);

      const darkLinkElement = document.createElement('link');
      darkLinkElement.rel = 'stylesheet';
      darkLinkElement.href = 'chunks/theme-dark.chunk.css';
      document.head.appendChild(darkLinkElement);

      const lightThemes = searchForThemeElements('light', loadedThemes);
      const darkThemes = searchForThemeElements('dark', loadedThemes);

      expect(lightThemes).toContain(lightLinkElement);
      expect(darkThemes).toContain(darkLinkElement);
    });
  });

  describe('enableThemeElements', () => {
    it('should enable the style elements corresponding to the given theme', () => {
      const lightStyleElement = document.createElement('style');
      lightStyleElement.setAttribute('data-theme', 'light');
      lightStyleElement.media = 'not all';
      document.head.appendChild(lightStyleElement);
      const loadedThemes = {
        light: [lightStyleElement],
      };

      enableThemeElements('light', loadedThemes);
      expect(lightStyleElement.media).toBe('all');
    });

    it('should enable the link elements corresponding to the given theme', () => {
      const lightLinkElement = document.createElement('link');
      lightLinkElement.rel = 'stylesheet';
      lightLinkElement.href = 'chunks/theme-light.chunk.css';
      lightLinkElement.disabled = true;
      document.head.appendChild(lightLinkElement);
      const loadedThemes = {
        light: [lightLinkElement],
      };

      enableThemeElements('light', loadedThemes);
      expect(lightLinkElement.disabled).toBe(false);
    });
  });

  describe('disableThemeElements', () => {
    it('should disable the style elements corresponding to the given theme', () => {
      const lightStyleElement = document.createElement('style');
      lightStyleElement.setAttribute('data-theme', 'light');
      lightStyleElement.media = 'all';
      document.head.appendChild(lightStyleElement);
      const loadedThemes = {
        light: [lightStyleElement],
      };

      disableThemeElements('light', loadedThemes);
      expect(lightStyleElement.media).toBe('not all');
    });

    it('should disable the link elements corresponding to the given theme', () => {
      const lightLinkElement = document.createElement('link');
      lightLinkElement.rel = 'stylesheet';
      lightLinkElement.href = 'chunks/theme-light.chunk.css';
      lightLinkElement.disabled = false;
      document.head.appendChild(lightLinkElement);
      const loadedThemes = {
        light: [lightLinkElement],
      };

      disableThemeElements('light', loadedThemes);
      expect(lightLinkElement.disabled).toBe(true);
    });
  });
});