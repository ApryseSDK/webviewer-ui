const postCssLoader = {
  loader: 'postcss-loader',
  options: {
    ident: 'postcss',
    plugins: (loader) => [
      require('postcss-import')({ root: loader.resourcePath }),
      require('postcss-preset-env')({
        features: {
          'logical-properties-and-values': false, // ⛔ disable polyfill!
        },
      }),
      require('cssnano')(),
    ],
  },
};

const postCssLoaderTheme = {
  loader: 'postcss-loader',
  options: {
    ident: 'postcss',
    plugins: (loader) => [
      require('postcss-import')({ root: loader.resourcePath }),
      require('postcss-preset-env')({
        features: {
          'logical-properties-and-values': false, // ⛔ disable polyfill!
        },
      }),
      // Add :host alongside :root for shadow DOM compatibility (works for both iframe and web component)
      require('postcss').plugin('postcss-add-host', () => {
        return (root) => {
          root.walkRules((rule) => {
            if (/^:root\b/.test(rule.selector)) {
              // Clone the rule and change selector to :host
              const clonedRule = rule.clone();
              clonedRule.selector = rule.selector.replace(/^:root\b/gm, ':host');
              // Insert the :host version after the :root version
              rule.parent.insertAfter(rule, clonedRule);
            }
          });
        };
      }),
      require('cssnano')(),
    ],
  },
};

const styleLoaderInsertFunction = function(styleTag) {
  function findNestedWebComponents(tagName, root = document) {
    const elements = [];

    // Check direct children
    root.querySelectorAll(tagName).forEach((el) => elements.push(el));

    // Check shadow DOMs
    root.querySelectorAll('*').forEach((el) => {
      if (el.shadowRoot) {
        elements.push(...findNestedWebComponents(tagName, el.shadowRoot));
      }
    });

    return elements;
  }
  // If its the iframe we just append to the document head
  if (!window.isApryseWebViewerWebComponent) {
    document.head.appendChild(styleTag);
    return;
  }

  let webComponents;
  // First we see if the webcomponent is at the document level
  webComponents = document.getElementsByTagName('apryse-webviewer');
  // If not, we check have to check if it is nested in another webcomponent
  if (!webComponents.length) {
    webComponents = findNestedWebComponents('apryse-webviewer');
  }
  // Now we append the style tag to each webcomponent
  const clonedStyleTags = [];
  for (let i = 0; i < webComponents.length; i++) {
    const webComponent = webComponents[i];
    if (i === 0) {
      webComponent.shadowRoot.appendChild(styleTag);
      styleTag.onload = function() {
        if (clonedStyleTags.length > 0) {
          clonedStyleTags.forEach((styleNode) => {
            // eslint-disable-next-line no-unsanitized/property
            styleNode.innerHTML = styleTag.innerHTML;
          });
        }
      };
    } else {
      const styleNode = styleTag.cloneNode(true);
      webComponent.shadowRoot.appendChild(styleNode);
      clonedStyleTags.push(styleNode);
    }
  }
};

const styleLoaderOptions = {
  insert: styleLoaderInsertFunction,
};

const createDevThemeRule = (resourceQuery, dataTheme, stylesheet, pathModule) => {
  return {
    resourceQuery: resourceQuery,
    use: [
      {
        loader: 'style-loader',
        options: {
          ...styleLoaderOptions,
          attributes: {
            'data-theme': dataTheme,
          },
        },
      },
      'css-loader',
      postCssLoaderTheme,
      {
        loader: 'sass-loader',
        options: {
          data: (loader) => {
            const fileName = pathModule.basename(loader.resourcePath);
            if (fileName === 'App.scss') {
              return `@import '../../constants/${stylesheet}';`;
            }
            return '';
          }
        },
      },
    ],
  };
};

const createProdThemeRule = (resourceQuery, stylesheet, MiniCssExtractPlugin, pathModule) => {
  return {
    resourceQuery: resourceQuery,
    use: [
      MiniCssExtractPlugin.loader,
      'css-loader',
      postCssLoaderTheme,
      {
        loader: 'sass-loader',
        options: {
          data: (loader) => {
            const fileName = pathModule.basename(loader.resourcePath);
            if (fileName === 'App.scss') {
              return `@import '../../constants/${stylesheet}';`;
            }
            return '';
          }
        },
      },
    ],
  };
};

module.exports = {
  postCssLoader,
  postCssLoaderTheme,
  styleLoaderOptions,
  createDevThemeRule,
  createProdThemeRule,
};