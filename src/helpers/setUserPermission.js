import core from 'core';

export default (state, documentViewerKey) => {
  core.setCurrentUser(state.user.name, documentViewerKey);
  core.setIsAdminUser(state.user.isAdmin, documentViewerKey);
};