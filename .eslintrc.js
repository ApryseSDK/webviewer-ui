module.exports = {
  'root': true,
  'parser': '@babel/eslint-parser',
  'parserOptions': {
    'requireConfigFile': false,
    'babelOptions': {
      'presets': [
        '@babel/preset-react'
      ]
    }
  },
  'plugins': [
    'babel',
    'react',
    'react-hooks',
    'import',
    'cypress',
    'no-unsanitized',
    'custom'
  ],
  'env': {
    'browser': true,
    'node': true,
    'es6': true,
    'cypress/globals': true,
    'jest': true
  },
  'globals': {
    '_': false,
    'Annotations': false,
    'Tools': false
  },
  'extends': ['eslint:recommended', 'plugin:react/recommended', 'plugin:storybook/recommended'],
  'rules': {
    'no-unsanitized/method': 'error',
    'no-unsanitized/property': 'error',
    'react/no-unknown-property': ['error', { 'ignore': ['css'] }],
    'radix': 'off',
    'array-callback-return': 'error',
    'object-curly-spacing': [
      'error',
      'always'
    ],
    'curly': [
      'error',
      'all'
    ],
    'brace-style': [
      'error',
      '1tbs'
    ],
    'space-before-blocks': 'error',
    'space-before-function-paren': [
      'error',
      {
        'anonymous': 'never',
        'named': 'never',
        'asyncArrow': 'always'
      }
    ],
    'keyword-spacing': [
      'error',
      {
        'before': true,
        'after': true
      }
    ],
    'no-undef': 'error',
    'no-trailing-spaces': 'error',
    'semi': 'error',
    'arrow-parens': [
      'error',
      'always'
    ],
    'camelcase': 'error',
    'arrow-body-style': 'off',
    'array-bracket-spacing': 'error',
    'quotes': [
      'error',
      'single',
      {
        'avoidEscape': true
      }
    ],
    'prefer-template': 'error',
    'no-tabs': 'error',
    'import/no-duplicates': 'error',
    'no-unused-vars': 'error',
    'no-unused-expressions': 'off',
    'no-useless-rename': 'off',
    'no-await-in-loop': 'off',
    'no-lonely-if': 'off',
    'guard-for-in': 'off',
    'function-paren-newline': 'off',
    'indent': [
      'error',
      2,
      {
        'SwitchCase': 1
      }
    ],
    'no-case-declarations': 'off',
    'no-restricted-syntax': 'off',
    'no-new': 'off',
    'symbol-description': 'off',
    'comma-dangle': 'off',
    'no-empty': [
      2,
      {
        'allowEmptyCatch': true
      }
    ],
    'lines-between-class-members': 'off',
    'no-fallthrough': 'off',
    'func-names': 'off',
    'operator-linebreak': 'off',
    'no-var': 2,
    'quote-props': 'off',
    'prefer-arrow-callback': 'off', // would like to remove this rule https://eslint.org/docs/rules/prefer-arrow-callback#require-using-arrow-functions-for-callbacks-prefer-arrow-callback
    'dot-notation': 'off',
    'class-methods-use-this': 'off',
    'object-curly-newline': 'off',
    'vars-on-top': 'off',
    'prefer-destructuring': 'off',
    'eol-last': 'off',
    'max-len': 'off',
    'prefer-rest-params': 'off', // would like to remove this rule https://eslint.org/docs/rules/prefer-rest-params#suggest-using-the-rest-parameters-instead-of-arguments-prefer-rest-params
    'no-underscore-dangle': 'off',
    'object-shorthand': 'off', // would like to remove this rule https://eslint.org/docs/rules/object-shorthand#require-object-literal-shorthand-syntax-object-shorthand
    'no-console': [
      'error',
      {
        'allow': [
          'warn',
          'error'
        ]
      }
    ],
    'no-param-reassign': 'off',
    'no-plusplus': 'off',
    'consistent-return': 'off',
    'new-cap': 'off',
    'linebreak-style': 'off',
    'no-throw-literal': 'off',
    'no-script-url': 'off',
    'no-restricted-globals': 'off', // would like to remove this rule https://eslint.org/docs/rules/no-restricted-globals#disallow-specific-global-variables-no-restricted-globals
    'no-multi-assign': 'off', // would like to remove this rule https://eslint.org/docs/rules/no-multi-assign#disallow-use-of-chained-assignment-expressions-no-multi-assign
    'no-bitwise': 'off',
    'no-prototype-builtins': 'off',
    'no-nested-ternary': 'off',
    'prefer-promise-reject-errors': 'off',
    'prefer-spread': 'off', // would like to remove this rule https://eslint.org/docs/rules/prefer-spread#suggest-using-spread-syntax-instead-of-apply-prefer-spread
    'no-mixed-operators': 'off',
    'no-cond-assign': 'off',
    'no-extend-native': 'off', // would be nice to remove, not critical https://eslint.org/docs/rules/no-extend-native#disallow-extending-of-native-objects-no-extend-native
    'no-restricted-properties': 'off',
    'no-proto': 'off', // would like to remove this rule https://eslint.org/docs/rules/no-proto#disallow-use-of-__proto__-no-proto
    'no-continue': 'off',
    'default-case': 'off',
    'no-shadow': 'off', // would like to eventually remove this but its super hard right now https://eslint.org/docs/rules/no-shadow#disallow-variable-declarations-from-shadowing-variables-declared-in-the-outer-scope-no-shadow
    'no-useless-escape': 'off',
    'wrap-iife': 'off',
    'import/no-cycle': 'off',
    'import/order': 'off',
    'import/named': 'off',
    'import/no-named-as-default': 'off',
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': 'off',
    'import/no-webpack-loader-syntax': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        'js': 'never',
        'ts': 'never'
      }
    ],
    'react/prop-types': 'off',
    'react/no-danger': 'error',
    'react/forbid-dom-props': ['error', {
      'forbid': [{
        'propName': 'style',
        'message': 'Inline styles are blocked by CSP. Use className and stylesheet rules.',
      }]
    }],
    'react/forbid-component-props': ['error', {
      'forbid': [{
        'propName': 'style',
        'message': 'Do not pass style props; use className and stylesheet rules.',
      }]
    }],
    'custom/no-hex-colors': 'error',
    'custom/use-core-hook-in-components': 'error',
    'no-restricted-imports': ['error', {
      'paths': [{
        'name': 'i18next',
        'message': 'Do not directly import the i18next singleton for translations, otherwise the localization will not be context aware when multiple WV instances are presented on the same page.\n  - In React components/hooks, use `useTranslation()` or `withTranslation()` for functional or classical components. \n  - In non-component modules call `getCurrentT()` from `helpers/getCurrentT`.\nDirect `i18next` use is only allowed in the i18n bootstrap files and in dir()/language-listener helpers.'
      }]
    }]
  },
  'overrides': [
    {
      'files': '**/*.ts',
      'rules': {
        'no-useless-constructor': 'off'
      }
    },
    {
      'files': '**/*.stories.js',
      'rules': {
        'no-console': 'off',
        'react/prop-types': 'off',
        'react/forbid-dom-props': 'off',
        'react/forbid-component-props': 'off',
        'no-alert': 'off',
        'no-unused-vars': 'off',
        'no-useless-constructor': 'off'
      }
    },
    {
      'files': '**/*.spec.js',
      'rules': {
        'no-console': 'off',
        'no-undef': 'off',
        'react/forbid-dom-props': 'off',
        'react/forbid-component-props': 'off',
        'no-unused-vars': 'off',
        'no-alert': 'off',
        'no-useless-constructor': 'off'
      }
    },
    {
      'files': '**/*.test.js',
      'rules': {
        'no-console': 'off',
        'no-undef': 'off',
        'react/forbid-dom-props': 'off',
        'react/forbid-component-props': 'off',
        'no-unused-vars': 'off',
        'no-alert': 'off',
        'no-useless-constructor': 'off'
      }
    },
    {
      'files': ['**/*/languageRules.js', '*.spec.js'],
      'rules': {
        'camelcase': 'off'
      }
    },
    {
      // Tests, stories, and the test translation helper are allowed to read
      // strings directly from the i18next singleton.
      'files': ['**/*.spec.js', '**/*.test.js', '**/*.stories.js', 'src/helpers/testTranslationHelper.js'],
      'rules': {
        'no-restricted-imports': 'off'
      }
    },
    {
      // Allowlist for files that legitimately need the i18next singleton
      // (initialisation, language mirroring, dir()/event subscriptions, and
      // the getCurrentT helper itself). All other code must go through
      // useTranslation()/withTranslation() or getCurrentT().
      'files': [
        'src/helpers/setupI18n.js',
        'src/helpers/indexHelper.js',
        'src/helpers/getCurrentT.js',
        'src/helpers/rightToLeft.js',
        'src/apis/setLanguage.js',
        'src/apis/setTranslations.js',
        'src/apis/index.js',
        'src/event-listeners/onToolUpdated.js',
        'src/redux/actions/exposedActions.js'
      ],
      'rules': {
        'no-restricted-imports': 'off'
      }
    }
  ],
  'settings': {
    'react': {
      'version': 'detect'
    }
  }
};
