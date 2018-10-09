import * as exposedActions from './exposedActions';
import * as internalActions from './internalActions';

export default { ...exposedActions, ...internalActions };