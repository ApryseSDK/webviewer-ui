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
  [ShareTypes.ALL]: { backgroundColor: '#EFF8ED', borderColor: '#5AB847' },
  [ShareTypes.ASSESSORS]: { backgroundColor: '#FEF9ED', borderColor: '#F5C20B' },
  [ShareTypes.PARTICIPANTS]: { backgroundColor: '#EDF5F9', borderColor: '#3A9EC3' },
  [ShareTypes.NONE]: { backgroundColor: '#E0E1E2', borderColor: '#9e9e9e' },
};

export default ShareTypes;
