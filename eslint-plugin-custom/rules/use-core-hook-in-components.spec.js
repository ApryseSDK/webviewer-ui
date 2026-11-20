const { RuleTester } = require('eslint');
const rule = require('./use-core-hook-in-components');

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 2020, sourceType: 'module', ecmaFeatures: { jsx: true } },
});

ruleTester.run('use-core-hook-in-components', rule, {
  valid: [
    {
      code: "import core from 'core'; export const getThing = () => core.getTool('x');",
      filename: 'src/helpers/getThing.js',
    },
    {
      code: "import useCore from 'hooks/useCore'; export const useThing = () => { const core = useCore(); return core; };",
      filename: 'src/hooks/useThing.js',
    },
    {
      code: "import core from 'core'; export const useCore = () => core;",
      filename: 'src/hooks/useCore/useCore.js',
    },
    {
      code: "import core from 'core'; export const useThing = () => core;",
      filename: 'src/hooks/useThing.spec.js',
    },
    {
      code: "import core from 'core'; export const user = () => core;",
      filename: 'src/helpers/user.js',
    },
  ],
  invalid: [
    {
      code: "import core from 'core'; const Comp = () => <div>{core.x()}</div>;",
      filename: 'src/components/Comp.js',
      errors: [{ messageId: 'useCoreHook' }],
    },
    {
      code: "import core from 'core'; export const useThing = () => core.getDocument();",
      filename: 'src/hooks/useThing.js',
      errors: [{ messageId: 'useCoreHook' }],
    },
    {
      code: "import core from 'core'; export function useThing() { return core.getDocument(); }",
      filename: 'src/hooks/useThing.js',
      errors: [{ messageId: 'useCoreHook' }],
    },
    {
      code: 'export const useThing = () => window.Core.documentViewer;',
      filename: 'src/hooks/useThing.js',
      errors: [{ messageId: 'useCoreHookDocumentViewer' }],
    },
  ],
});
