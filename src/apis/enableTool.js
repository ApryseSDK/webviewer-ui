import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';
import enableTools from './enableTools';

export default store => toolName => {
  warnDeprecatedAPI(
    'enableTool(toolName)',
    'enableTools([toolName])',
    '6.0',
  );
  enableTools(store)([toolName]);
};
