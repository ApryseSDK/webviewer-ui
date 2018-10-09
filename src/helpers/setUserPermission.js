import core from 'core';

export default state => {
  core.setCurrentUser(state.user.name);
  core.setIsAdminUser(state.user.isAdmin);
  core.setReadOnly(state.viewer.isReadOnly);
};