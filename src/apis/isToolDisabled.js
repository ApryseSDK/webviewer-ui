import core from 'core';

export default toolName => !!core.getTool(toolName).disabled;
