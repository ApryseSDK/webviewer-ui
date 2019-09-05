import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';
import disableTools from './disableTools';

export default store => toolName => {
  warnDeprecatedAPI(
    'disableTool(toolName)',
    'disableTools([toolName])',
    '6.0',
  );
  disableTools(store)([toolName]);
};
