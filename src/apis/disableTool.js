import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';
import disableTools from './disableTools';

export default store => toolName => {
  warnDeprecatedAPI(
    'disableTool(toolName)',
    'disableTools([toolName])',
    '7.0',
  );
  disableTools(store)([toolName]);
};
