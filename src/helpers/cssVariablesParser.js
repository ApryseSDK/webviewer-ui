// MIT License

// Copyright (c) 2017 Nikita Gusakov

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import postcss from 'postcss';

const isInsideRoot = rule => {
  return (
    rule.selectors.length !== 1 ||
    rule.selectors[0] !== ':root' ||
    rule.parent.type !== 'root'
  );
};

const isVariableDeclaration = decl => {
  return Boolean(decl.value) && decl.prop.startsWith('--');
};

const parse = (css, options) => {
  const root = postcss.parse(css, {
    from: options.from,
    parser: options.parser
  });

  const variables = {};
  root.walkRules(rule => {
    if (isInsideRoot(rule)) {
      return;
    }

    rule.each(decl => {
      if (isVariableDeclaration(decl)) {
        const name = decl.prop.slice(2);
        variables[name] = decl.value;
      }
    });
  });

  return variables;
};

export {
  parse,
};
