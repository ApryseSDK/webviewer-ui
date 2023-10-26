import core from 'core';

export default (state) => {
  if (state.viewer.isAnnotationNumberingEnabled) {
    core.enableAnnotationNumbering();
  }
};