import getRootNode from 'helpers/getRootNode';

/**
 * @ignore
 * @param {Document|ShadowRoot} [root] Optional root override. Pass the per-instance
 * root (e.g. derived from a React element's `node.getRootNode()`) to avoid the
 * singleton-`getRootNode()` leak in multi-WebComponent setups.
 */
const getAppRect = (root) => {
  const isStorybook = !!window.storybook;
  const node = root || getRootNode();
  return node?.getElementById(isStorybook ? 'storybook-root' : 'app')?.getBoundingClientRect();
};

export default getAppRect;