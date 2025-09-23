import getRootNode from 'helpers/getRootNode';

const getAppRect = () => {
  const isStorybook = !!window.storybook;
  return getRootNode()?.getElementById(isStorybook ? 'storybook-root' : 'app')?.getBoundingClientRect();
};

export default getAppRect;