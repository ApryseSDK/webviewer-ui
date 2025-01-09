/* eslint-disable custom/no-hex-colors */
// CUSTOM WISEFLOW sharetype types.
const ShareTypes = {
  ALL: 'ALL',
  ASSESSORS: 'ASSESSORS',
  PARTICIPANTS: 'PARTICIPANTS',
  NONE: 'NONE',
};

// CUSTOM WISEFLOW sharetype order for sorting strategy.
export const ShareTypeOrder = {
  ALL: 0,
  ASSESSORS: 1,
  PARTICIPANTS: 2,
  NONE: 3,
};

// this colors are taken from flow-ui-react secondry light colors
export const ShareTypeColors = {
  [ShareTypes.NONE]: { backgroundColor: '#BDBDBE', borderColor: '#242425' },
  [ShareTypes.PARTICIPANTS]: { backgroundColor: '#EDF5F9', borderColor: '#2D6987' },
  [ShareTypes.ASSESSORS]: { backgroundColor: '#FEF9ED', borderColor: '#AF7F0A' },
  [ShareTypes.ALL]: { backgroundColor: '#EFF8ED', borderColor: '#408132' },
};

export default ShareTypes;
