import { createContext } from 'react';

/**
 * Provides the current WebViewer instance's root node (its ShadowRoot in WebComponent mode, or `document` in iframe/legacy mode); components needing to resolve DOM within their own instance (e.g. portal targets) must read this instead of the module-level getRootNode() singleton, which always points to the most-recently-registered instance under the Vite/ESM build and would otherwise cause cross-instance DOM access and React reconciliation crashes. The value is the per-instance root passed into `renderInstanceApp`, guaranteed valid at render time.
 * @ignore
 */
const InstanceRootNodeContext = createContext(null);

export default InstanceRootNodeContext;
