import { createContext } from 'react';

/**
 * The id scoping this instance's entries in the shared core registries (see core/documentViewers).
 * @ignore
 */
const InstanceIdContext = createContext(null);

export default InstanceIdContext;
