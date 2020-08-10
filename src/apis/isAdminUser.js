import core from 'core';

export default () => {
  return !!core.getIsAdminUser();
};