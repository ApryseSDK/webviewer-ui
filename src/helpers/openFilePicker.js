import getRootNode from 'helpers/getRootNode';

export default (e) => {
  // In multi-instance WebComponent mode the module-level getRootNode() singleton points to the most-recently-registered instance's shadow root, so clicking the hidden <input id="file-picker"> via that singleton would load the file into the WRONG instance; resolve the input from the clicking instance's own shadow root via the triggering event's native Node.getRootNode() instead, falling back to the singleton for the iframe/legacy path.
  const eventNode = e?.currentTarget ?? e?.target;
  const eventRoot = typeof eventNode?.getRootNode === 'function' ? eventNode.getRootNode() : null;
  const root = (eventRoot && typeof eventRoot.querySelector === 'function') ? eventRoot : getRootNode();
  root?.querySelector('#file-picker')?.click();
};
